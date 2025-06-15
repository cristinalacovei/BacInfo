interface Question {
  id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  answers: Answer[];
  selectedAnswer?: string; // ✅ Pentru SINGLE_CHOICE
}
