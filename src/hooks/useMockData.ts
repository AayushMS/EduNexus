/**
 * Hook to access mock data for EduNexus demo
 * Provides easy access to generated demo data
 */

import { useMemo } from 'react';
import { demoData } from '@/data/generators';
import type { Student, Parent, Teacher } from '@/types/user.types';
import type { ActivityFeedItem } from '@/types/activity.types';
import type { PreschoolChild, PreschoolActivity, HPRC } from '@/types/preschool.types';

export function useMockData() {
  const data = useMemo(() => demoData, []);

  return {
    // Students
    students: data.students as Student[],
    getStudentById: (id: string) => data.students.find((s: Student) => s.id === id),
    getStudentsByGrade: (grade: number) => data.students.filter((s: Student) => s.grade === grade),
    getStudentsByClass: (classId: string) => data.students.filter((s: Student) => s.classId === classId),

    // Parents
    parents: data.parents as Parent[],
    getParentById: (id: string) => data.parents.find((p: Parent) => p.id === id),
    getParentsByChild: (childId: string) => data.parents.filter((p: Parent) => p.childrenIds.includes(childId)),

    // Teachers
    teachers: data.teachers as Teacher[],
    getTeacherById: (id: string) => data.teachers.find((t: Teacher) => t.id === id),
    getTeachersBySubject: (subject: string) => data.teachers.filter((t: Teacher) => t.subjects.includes(subject)),
    getClassTeacher: (classId: string) => data.teachers.find((t: Teacher) => t.classTeacherOf === classId),

    // Activity Feed
    activityFeed: data.activityFeed as ActivityFeedItem[],
    getRecentActivities: (count: number = 10) => data.activityFeed.slice(0, count),
    getActivitiesByClass: (classId: string) =>
      data.activityFeed.filter((a: ActivityFeedItem) => a.taggedClassIds.includes(classId)),

    // Preschool
    preschoolChildren: data.preschool.children as PreschoolChild[],
    preschoolActivities: data.preschool.activities as PreschoolActivity[],
    preschoolObservations: data.preschool.observations,
    preschoolReports: data.preschool.reports as HPRC[],
    getPreschoolChildById: (id: string) =>
      data.preschool.children.find((c: PreschoolChild) => c.id === id),
    getPreschoolReportByChild: (childId: string) =>
      data.preschool.reports.find((r: HPRC) => r.childId === childId),

    // Statistics
    stats: {
      totalStudents: data.students.length,
      totalParents: data.parents.length,
      totalTeachers: data.teachers.length,
      totalActivities: data.activityFeed.length,
      totalPreschoolChildren: data.preschool.children.length,
    },
  };
}

// For server-side or static usage
export function getMockData() {
  return demoData;
}
