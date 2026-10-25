import type { ActivityMapType, ActivitySelectOption } from '@/types/activity';
import type { SportId } from '@/types/record';

export const MAX_ACTIVITY_MEDIA = 6;

export const SPORT_OPTIONS: ActivitySelectOption[] = [
  { value: 'running', label: 'Corrida', icon: 'footsteps-outline' },
  { value: 'cycling', label: 'Pedalada', icon: 'bicycle-outline' },
  { value: 'walk', label: 'Caminhada', icon: 'walk-outline' },
  { value: 'trail', label: 'Trilha', icon: 'trail-sign-outline' },
  { value: 'treadmill', label: 'Esteira', icon: 'timer-outline' },
  { value: 'strength', label: 'Musculação', icon: 'barbell-outline' },
];

export const SPORT_LABELS: Record<SportId, string> = {
  running: 'Corrida',
  cycling: 'Pedalada',
  walk: 'Caminhada',
  trail: 'Trilha',
  treadmill: 'Corrida na esteira',
  strength: 'Musculação',
};

export const TAG_OPTIONS: ActivitySelectOption[] = [
  { value: 'Treino', label: 'Treino' },
  { value: 'Longão', label: 'Longão' },
  { value: 'Intervalado', label: 'Intervalado' },
  { value: 'Prova', label: 'Prova' },
  { value: 'Recuperação', label: 'Recuperação' },
  { value: 'Lazer', label: 'Lazer' },
];

export const EFFORT_OPTIONS: ActivitySelectOption[] = [
  { value: 'Leve', label: 'Leve', description: 'Esforço confortável', icon: 'leaf-outline' },
  {
    value: 'Moderado',
    label: 'Moderado',
    description: 'Ritmo constante e controlado',
    icon: 'speedometer-outline',
  },
  {
    value: 'Forte',
    label: 'Forte',
    description: 'Treino intenso',
    icon: 'flame-outline',
  },
  {
    value: 'Máximo',
    label: 'Máximo',
    description: 'Tudo o que você tinha hoje',
    icon: 'flash-outline',
  },
];

export const VISIBILITY_OPTIONS: ActivitySelectOption[] = [
  { value: 'Público', label: 'Público', description: 'Visível para todos', icon: 'globe-outline' },
  {
    value: 'Seguidores',
    label: 'Seguidores',
    description: 'Somente quem te segue',
    icon: 'people-outline',
  },
  {
    value: 'Somente eu',
    label: 'Somente eu',
    description: 'Atividade privada',
    icon: 'lock-closed-outline',
  },
];

export const HIDDEN_DETAILS_OPTIONS: ActivitySelectOption[] = [
  { value: 'none', label: 'Nenhum' },
  { value: 'hide-map', label: 'Ocultar mapa' },
  { value: 'hide-pace', label: 'Ocultar ritmo' },
  { value: 'hide-calories', label: 'Ocultar calorias' },
  { value: 'hide-heart-rate', label: 'Ocultar frequência cardíaca' },
];

export const MAP_TYPE_OPTIONS: (ActivitySelectOption & { value: ActivityMapType })[] = [
  {
    value: 'standard',
    label: 'Padrão',
    description: 'Mapa padrão do Rota',
    icon: 'map-outline',
  },
  {
    value: 'satellite',
    label: 'Satélite',
    description: 'Imagens aéreas do percurso',
    icon: 'earth-outline',
  },
  {
    value: 'terrain',
    label: 'Relevo',
    description: 'Curvas de nível e terreno',
    icon: 'trail-sign-outline',
  },
];

const TRACKING_TYPE_TO_SPORT: Record<string, SportId> = {
  normal: 'running',
  running: 'running',
  bike: 'cycling',
  cycling: 'cycling',
  strength: 'strength',
  walk: 'walk',
  trail: 'trail',
  treadmill: 'treadmill',
};

export const getSportFromTrackingType = (trackingType: string): SportId =>
  TRACKING_TYPE_TO_SPORT[trackingType] ?? 'running';
