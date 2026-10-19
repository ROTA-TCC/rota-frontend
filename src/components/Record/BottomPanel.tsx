import { StyleSheet, View } from 'react-native';

import { RunControlsCard } from '@/components/Record/RunControlsCard';
import { RunStatsCard } from '@/components/Record/RunStatsCard';

type BottomPanelProps = {
  isPaused: boolean;
  stats: {
    time: string;
    pace: string;
    paceLabel: string;
    statusText: string;
    distance: string;
  };
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
};

export default function BottomPanel({
  isPaused,
  stats,
  onPause,
  onResume,
  onFinish,
}: BottomPanelProps) {
  return (
    <View style={styles.container}>
      <RunStatsCard isPaused={isPaused} stats={stats} />
      <RunControlsCard
        isPaused={isPaused}
        onPause={onPause}
        onResume={onResume}
        onFinish={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 20,
    elevation: 10,
  },
});
