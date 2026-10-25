import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PublishedActivity } from '@/types/activity';
import type { RunPayload } from '@/types/run';

export interface ActivityDraft {
  run: RunPayload;
  sourceType: string;
  createdAt: string;
}

interface ActivityDraftContextValue {
  draft: ActivityDraft | null;
  setDraft: (draft: ActivityDraft) => void;
  clearDraft: () => void;
  publishedActivity: PublishedActivity | null;
  setPublishedActivity: (activity: PublishedActivity) => void;
  clearPublishedActivity: () => void;
}

const ActivityDraftContext = createContext<ActivityDraftContextValue | undefined>(undefined);

export function ActivityDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<ActivityDraft | null>(null);
  const [publishedActivity, setPublishedActivityState] =
    useState<PublishedActivity | null>(null);

  const setDraft = useCallback((nextDraft: ActivityDraft) => {
    setDraftState(nextDraft);
  }, []);

  const clearDraft = useCallback(() => {
    setDraftState(null);
  }, []);

  const setPublishedActivity = useCallback((activity: PublishedActivity) => {
    setPublishedActivityState(activity);
  }, []);

  const clearPublishedActivity = useCallback(() => {
    setPublishedActivityState(null);
  }, []);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      clearDraft,
      publishedActivity,
      setPublishedActivity,
      clearPublishedActivity,
    }),
    [
      draft,
      setDraft,
      clearDraft,
      publishedActivity,
      setPublishedActivity,
      clearPublishedActivity,
    ]
  );

  return (
    <ActivityDraftContext.Provider value={value}>
      {children}
    </ActivityDraftContext.Provider>
  );
}

export function useActivityDraft() {
  const context = useContext(ActivityDraftContext);

  if (!context) {
    throw new Error('useActivityDraft deve ser usado dentro de um ActivityDraftProvider');
  }

  return context;
}
