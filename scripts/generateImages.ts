/**
 * Image Generation Script using Pollinations.ai
 * Generates realistic photo-style images for the activity feed
 *
 * Usage: npx tsx scripts/generateImages.ts
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

interface ImageConfig {
  filename: string;
  prompt: string;
}

const IMAGES: ImageConfig[] = [
  // Science Lab
  {
    filename: 'science-lab-1.jpg',
    prompt:
      'Realistic photo of school children doing science experiment in laboratory, test tubes, microscopes, bright modern classroom, educational, high quality photography',
  },
  {
    filename: 'science-lab-2.jpg',
    prompt:
      'Realistic photo of students conducting chemistry experiment in school science lab, beakers, safety goggles, engaged learning, professional photography',
  },

  // Art Class
  {
    filename: 'art-class-1.jpg',
    prompt:
      'Realistic photo of children painting and drawing in art class, colorful artwork, easels, creative school activity, natural lighting',
  },
  {
    filename: 'art-class-2.jpg',
    prompt:
      'Realistic photo of students creating art projects in classroom, paintbrushes, canvases, artistic expression, bright school environment',
  },

  // Sports
  {
    filename: 'football-1.jpg',
    prompt:
      'Realistic photo of children playing football on school field, soccer game, active kids, outdoor sports, sunny day, action shot',
  },
  {
    filename: 'sports-day-1.jpg',
    prompt:
      'Realistic photo of school sports day event, children running race, athletic competition, outdoor field, cheering crowd',
  },
  {
    filename: 'morning-exercise-1.jpg',
    prompt:
      'Realistic photo of children doing morning exercise in school yard, stretching, physical education, group activity, healthy lifestyle',
  },

  // Cultural
  {
    filename: 'traditional-dance-1.jpg',
    prompt:
      'Realistic photo of South Asian children performing traditional dance, cultural celebration, colorful costumes, school stage performance',
  },
  {
    filename: 'festival-1.jpg',
    prompt:
      'Realistic photo of school cultural festival celebration, children in traditional attire, festive decorations, joyful atmosphere',
  },

  // Music
  {
    filename: 'music-class-1.jpg',
    prompt:
      'Realistic photo of children playing musical instruments in music class, school band practice, piano, guitars, drums, educational setting',
  },

  // Library
  {
    filename: 'reading-time-1.jpg',
    prompt:
      'Realistic photo of children reading books in school library, quiet study area, bookshelves, educational atmosphere, focused students',
  },

  // Assembly
  {
    filename: 'assembly-1.jpg',
    prompt:
      'Realistic photo of school assembly with children in uniform, morning gathering in auditorium, orderly rows, principal speaking',
  },

  // General Classroom
  {
    filename: 'math-class-1.jpg',
    prompt:
      'Realistic photo of children learning mathematics in classroom, teacher at whiteboard with equations, engaged students, modern school',
  },
  {
    filename: 'computer-class-1.jpg',
    prompt:
      'Realistic photo of children in computer lab, students using desktop computers, coding class, technology education, modern classroom',
  },
  {
    filename: 'classroom-1.jpg',
    prompt:
      'Realistic photo of typical school classroom with children at desks, teacher teaching, educational posters, bright learning environment',
  },

  // Field Trip
  {
    filename: 'field-trip-1.jpg',
    prompt:
      'Realistic photo of school children on educational field trip, outdoor learning excursion, group activity, backpacks, museum or park visit',
  },

  // Celebration
  {
    filename: 'celebration-1.jpg',
    prompt:
      'Realistic photo of school celebration with children, festive decorations, balloons, happy students, party atmosphere, achievement ceremony',
  },

  // Preschool
  {
    filename: 'preschool-play-1.jpg',
    prompt:
      'Realistic photo of preschool children playing with toys, early childhood education, colorful classroom, toddlers learning through play',
  },
  {
    filename: 'preschool-outdoor-1.jpg',
    prompt:
      'Realistic photo of preschool children playing outside on playground, swings, slides, outdoor activities, sunny day, supervised play',
  },
  {
    filename: 'preschool-story-1.jpg',
    prompt:
      'Realistic photo of preschool teacher reading story to young children, story time, kids sitting in circle, engaging storytelling',
  },
  {
    filename: 'preschool-abc-1.jpg',
    prompt:
      'Realistic photo of preschool children learning alphabet, ABC letters on wall, early literacy, colorful learning materials, kindergarten',
  },

  // Placeholders
  {
    filename: 'placeholder-1.jpg',
    prompt:
      'Realistic photo of generic school activity, children learning together in classroom, educational setting, diverse students',
  },
  {
    filename: 'placeholder-2.jpg',
    prompt:
      'Realistic photo of school children engaged in group activity, collaborative learning, modern classroom environment',
  },
  {
    filename: 'placeholder-3.jpg',
    prompt:
      'Realistic photo of students in school hallway, children walking to class, school interior, bright educational facility',
  },
];

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'moments');

function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            file.close();
            fs.unlinkSync(filepath);
            downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(filepath);
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(err);
      });
  });
}

async function generateImage(config: ImageConfig, index: number): Promise<void> {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(config.prompt)}?width=800&height=600&nologo=true`;
  const filepath = path.join(OUTPUT_DIR, config.filename);

  console.log(`[${index + 1}/${IMAGES.length}] Generating: ${config.filename}`);

  try {
    await downloadImage(url, filepath);
    console.log(`  ✓ Saved: ${config.filename}`);
  } catch (error) {
    console.error(`  ✗ Failed: ${config.filename}`, error);
  }
}

async function main(): Promise<void> {
  console.log('========================================');
  console.log('Pollinations.ai Image Generator');
  console.log('========================================\n');

  // Ensure output directory exists
  ensureDirectoryExists(OUTPUT_DIR);

  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Total images to generate: ${IMAGES.length}\n`);

  // Generate images with delay between requests
  for (let i = 0; i < IMAGES.length; i++) {
    await generateImage(IMAGES[i], i);

    // Add delay between requests (except for last one)
    if (i < IMAGES.length - 1) {
      console.log('  Waiting 2 seconds...\n');
      await delay(2000);
    }
  }

  console.log('\n========================================');
  console.log('Image generation complete!');
  console.log(`Images saved to: ${OUTPUT_DIR}`);
  console.log('========================================');
}

main().catch(console.error);
