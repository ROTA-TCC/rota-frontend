export interface ActivityAuthor {
  name: string;
  avatarUrl: string;
  verified?: boolean;
}

export interface ActivityStat {
  id: string;
  label: string;
  value: string;
}

export interface ActivityChallenge {
  title: string;
  progress: string;
  badgeLabel: string;
  actionLabel: string;
}

export interface ActivityKudos {
  count: number;
  avatarUrls: string[];
}

export interface ActivityPost {
  id: string;
  author: ActivityAuthor;
  timeLabel: string;
  location?: string;
  title: string;
  stats: ActivityStat[];
  achievements?: number;
  challenge?: ActivityChallenge;
  imageUrls: string[];
  kudos: ActivityKudos;
  comments: number;
}
