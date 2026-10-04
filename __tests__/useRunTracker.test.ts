import { renderHook } from '@testing-library/react-native';
import { useRunTracker } from '../src/hooks/useRunTracker';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  watchPositionAsync: jest.fn().mockResolvedValue({ remove: jest.fn() }),
  Accuracy: { BestForNavigation: 1 },
}));

describe('useRunTracker', () => {
  test('should initialize with default values', async () => {
    const { result } = await renderHook(() => useRunTracker());
    expect(result.current.isRecording).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.durationFormatted).toBe('00:00');
  });
});
