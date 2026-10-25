import type { ActivityPost } from '@/types/social';
import { mockProfile } from './mockProfile';

export const communityActivityPost: ActivityPost = {
  id: 'community-maria-paula-pace-run',
  author: {
    name: 'Maria Paula Freire',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    verified: true,
  },
  timeLabel: 'Hoje',
  location: 'São Paulo',
  title: 'Fofoca pace run 🤎',
  stats: [
    { id: 'distance', label: 'Distância', value: '6,55 km' },
    { id: 'pace', label: 'Ritmo', value: '5:59 /km' },
  ],
  achievements: 2,
  challenge: {
    title: 'Maria Paula concluiu o desafio "AUDI CHALLENGE RUN"!',
    progress: '118 km',
    badgeLabel: 'AUDI',
    actionLabel: 'Entrar',
  },
  imageUrls: [
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
  ],
  kudos: {
    count: 49,
    avatarUrls: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    ],
  },
  comments: 8,
};

export const profileActivityPost: ActivityPost = {
  id: 'profile-ibirapuera-run',
  author: {
    name: mockProfile.name,
    avatarUrl: mockProfile.avatarUrl,
    verified: true,
  },
  timeLabel: 'Hoje',
  location: 'São Paulo',
  title: 'Rodada no Ibirapuera 🌳',
  stats: [
    { id: 'distance', label: 'Distância', value: '8,20 km' },
    { id: 'pace', label: 'Ritmo', value: '5:42 /km' },
  ],
  achievements: 3,
  challenge: {
    title: 'Você está no desafio "ROTA URBAN RUN"',
    progress: '62 de 100 km',
    badgeLabel: 'ROTA',
    actionLabel: 'Continuar',
  },
  imageUrls: [
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
  ],
  kudos: {
    count: 128,
    avatarUrls: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    ],
  },
  comments: 24,
};
