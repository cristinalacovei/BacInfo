import { Answer } from './answer.types';

export interface Question {
  id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  answers: Answer[];
  selectedAnswer?: string;
}
