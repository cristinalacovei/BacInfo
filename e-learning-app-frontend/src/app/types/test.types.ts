import { Lesson } from './lesson.types';

export interface TestEntity {
  id: string;
  classLevel: number;
  questions: any[];
  lesson: Lesson;
}

export interface NewTestPayload {
  classLevel: number;
  lesson: { id: string };
  questions: any[];
}
