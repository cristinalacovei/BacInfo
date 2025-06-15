interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
  isSelected?: boolean; // ✅ Adăugat pentru MULTIPLE_CHOICE
}
