import type { ChartPoint, NearbyPerson } from '@/types/explore';

export const nearbyPeople: NearbyPerson[] = [
  {
    id: 'joshua',
    name: 'Joshua',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'jessica',
    name: 'Jessica',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'jonathan',
    name: 'Jonathan',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'sisy',
    name: 'Sisy',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  },
];

export const stepsByHour: ChartPoint[] = [
  { label: '00h', value: 400 },
  { label: '01h', value: 300 },
  { label: '02h', value: 150 },
  { label: '03h', value: 180 },
  { label: '04h', value: 250 },
  { label: '05h', value: 800 },
  { label: '06h', value: 500 },
  { label: '07h', value: 1100 },
  { label: '08h', value: 700 },
  { label: '09h', value: 1500 },
  { label: '10h', value: 400 },
  { label: '11h', value: 300 },
  { label: '12h', value: 163 },
];

export const dailySteps = stepsByHour.reduce((total, point) => total + point.value, 0);

export const stepsHighlightIndex = stepsByHour.findIndex((point) => point.label === '09h');

export const exploreMetrics = {
  heartRate: 112,
  heartRateAverage: '72 BPM',
  calories: 161,
  caloriesAverage: '41 CAL',
};
