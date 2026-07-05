export interface ChatRequest {
  message: string;
  type: 'manipulation' | 'chess' | 'martial_arts' | 'psychology';
}

export interface ExerciseRequest {
  type: string;
  userId: number;
}

export interface UserProgress {
  userId: number;
  level: number;
  xp: number;
  streak: number;
}
