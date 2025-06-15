interface UserProgressDTO {
  userId: string;
  testId: string;
  lessonId?: string | null;
  score: number;
  completedAt: string;
}
