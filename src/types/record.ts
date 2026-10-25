export type SportId =
  | 'running'
  | 'cycling'
  | 'strength'
  | 'walk'
  | 'trail'
  | 'treadmill';

export interface SportActivity {
  id: SportId;
  title: string;
  subtitle: string;
  trackingType: string;
}

export interface WeeklyGoal {
  progress: number;
  remaining: number;
}
