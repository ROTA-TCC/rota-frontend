export type ClubTerrain = 'Asfalto' | 'Trail';

export type ClubFilter = 'Todos' | 'Asfalto' | 'Trail / Montanha' | 'São Paulo' | '+500 Membros';

export interface Club {
  id: string;
  name: string;
  image: string;
  tags: string[];
  locationLabel: string;
  city: string;
  members: number;
  verified: boolean;
  terrain: ClubTerrain;
  description: string;
  featured?: boolean;
  popular?: boolean;
  recommended?: boolean;
}

export const MOCK_CLUBS: Club[] = [
  {
    id: 'running-rebels',
    name: 'Running Rebels',
    image:
      'https://images.unsplash.com/photo-1517649763962-0c6232662000?w=200&auto=format&fit=crop&q=80',
    tags: ['Asfalto', 'Avançado'],
    locationLabel: 'São Paulo, BR',
    city: 'São Paulo',
    members: 1223,
    verified: true,
    terrain: 'Asfalto',
    description: 'Treinos de asfalto para corredores avançados que buscam performance.',
    featured: true,
  },
  {
    id: 'sp-trail-hunters',
    name: 'SP Trail Hunters',
    image:
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=200&auto=format&fit=crop&q=80',
    tags: ['Trail', 'Todos os níveis'],
    locationLabel: 'Campos do Jordão',
    city: 'Campos do Jordão',
    members: 415,
    verified: false,
    terrain: 'Trail',
    description: 'Trilhas e montanhas para todos os níveis, com saídas guiadas.',
    featured: true,
  },
  {
    id: 'ibirapuera-night-run',
    name: 'Ibirapuera Night Run',
    image:
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&auto=format&fit=crop&q=80',
    tags: ['Asfalto', 'Noturno'],
    locationLabel: 'Vila Mariana',
    city: 'São Paulo',
    members: 2890,
    verified: false,
    terrain: 'Asfalto',
    description: 'Corridas noturnas no Ibirapuera, com percursos de 5 a 15 km.',
    popular: true,
  },
  {
    id: 'paulista-striders',
    name: 'Paulista Striders',
    image:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&auto=format&fit=crop&q=80',
    tags: ['Asfalto', 'Iniciantes'],
    locationLabel: 'Bela Vista',
    city: 'São Paulo',
    members: 830,
    verified: false,
    terrain: 'Asfalto',
    description: 'Treinos leves e acolhedores para quem está começando a correr.',
    popular: true,
  },
  {
    id: 'sub-20-5k-elite',
    name: 'Sub-20 5K Elite',
    image:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200&auto=format&fit=crop&q=80',
    tags: ["Pace < 4'45\"", 'Tiros'],
    locationLabel: 'Pinheiros',
    city: 'São Paulo',
    members: 312,
    verified: false,
    terrain: 'Asfalto',
    description: "Sessões de tiros e pace forte para baixar seu tempo nos 5 km.",
    recommended: true,
  },
];
