import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { SportId } from '@/types/record';
import type { RunPayload } from '@/types/run';

export interface ActivitySelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
}

export type ActivityMapType = 'standard' | 'satellite' | 'terrain';

export interface ActivityMedia {
  id: string;
  uri: string;
  type: 'image' | 'video' | 'livePhoto' | 'pairedVideo' | null;
  fileName?: string | null;
}

export interface PublishedActivity {
  id: string;
  run: RunPayload;
  sourceType: string;
  createdAt: string;
  title: string;
  description: string;
  sport: SportId;
  tag: string;
  effort: string;
  privateNotes: string;
  equipment: string[];
  visibility: string;
  hiddenDetails: string;
  muteActivity: boolean;
  media: ActivityMedia[];
  isRecord: boolean;
}
