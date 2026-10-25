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
    id: 'cycling',
    title: 'Pedalada',
    subtitle: 'Última: Há 3 dias • 18,0 km',
    trackingType: 'bike',
  },
  {
    id: 'strength',
    title: 'Musculação',
    subtitle: 'Última: Quarta-feira • 45 min',
    trackingType: 'strength',
  },
];

export const additionalSports: SportActivity[] = [
  {
    id: 'walk',
    title: 'Caminhada',
    subtitle: 'Registre uma caminhada leve',
    trackingType: 'walk',
  },
  {
    id: 'trail',
    title: 'Trilha',
    subtitle: 'Corrida em terreno natural',
    trackingType: 'trail',
  },
  {
    id: 'treadmill',
    title: 'Esteira',
    subtitle: 'Treino indoor',
    trackingType: 'treadmill',
  },
];
