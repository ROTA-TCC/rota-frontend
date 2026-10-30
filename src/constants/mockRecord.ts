import type { SportActivity, WeeklyGoal } from '@/types/record';

export const weeklyGoal: WeeklyGoal = {
  progress: 60,
  remaining: 14,
};

export const featuredSports: SportActivity[] = [
  {
    id: 'running',
    title: 'Corrida',
    subtitle: 'Última: Ontem • 5,2 km',
    trackingType: 'normal',
  },
  {
    id: 'treadmill',
    title: 'Esteira',
    subtitle: 'Última: Há 3 dias • 6,0 km',
    trackingType: 'treadmill',
  },
  {
    id: 'strength',
    title: 'Musculação',
    subtitle: 'Última: Quarta-feira • 45 min',
    trackingType: 'strength',
  },
];

