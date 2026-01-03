/**
 * Central export for all data generators
 */

export * from './generateStudents';
export * from './generateParents';
export * from './generateTeachers';
export * from './generateActivityFeed';
export * from './generatePreschool';

// Re-export demo data
import { demoStudents } from './generateStudents';
import { generateDemoParents } from './generateParents';
import { demoTeachers } from './generateTeachers';
import { demoActivityFeed } from './generateActivityFeed';
import { demoPreschoolData } from './generatePreschool';

export const demoData = {
  students: demoStudents,
  parents: generateDemoParents(),
  teachers: demoTeachers,
  activityFeed: demoActivityFeed,
  preschool: demoPreschoolData,
};
