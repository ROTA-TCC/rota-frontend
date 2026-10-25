import React, { useEffect } from 'react';
import { Alert, Text } from 'react-native';
import {
  act,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';

import ActivityDetailsScreen from '../src/app/run/activity-details';
import {
  ActivityDraftProvider,
  useActivityDraft,
} from '../src/providers/ActivityDraftProvider';
import type { RunPayload } from '../src/types/run';

jest.setTimeout(20000);

jest.mock('expo-router', () => {
  const router = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    canGoBack: () => true,
  };

  return {
    __router: router,
    useRouter: () => router,
  };
});

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>();

  return {
    __store: store,
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

jest.mock('../src/services/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('../src/providers/ThemeProvider', () => ({
  useTheme: () => ({
    mode: 'dark',
    isDark: true,
    setMode: jest.fn(),
    toggleMode: jest.fn(),
  }),
}));

jest.mock('../src/components/activity/ActivitySummaryCard', () => ({
  ActivitySummaryCard: () => null,
}));

jest.mock('../src/components/activity/MediaPicker', () => ({
  MediaPicker: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockReplace = (
  jest.requireMock('expo-router') as {
    __router: { replace: jest.Mock };
  }
).__router.replace;

const mockSecureStore = (
  jest.requireMock('expo-secure-store') as {
    __store: Map<string, string>;
  }
).__store;

const mockPost = (
  jest.requireMock('../src/services/api/client') as {
    default: { post: jest.Mock };
  }
).default.post;

const run: RunPayload = {
  startTime: '2026-10-22T10:00:00.000Z',
  endTime: '2026-10-22T10:20:00.000Z',
  durationSeconds: 1200,
  distanceMeters: 5000,
  calories: 320,
  trackpoints: [
    {
      latitude: -23.55052,
      longitude: -46.633308,
      altitude: 760,
      speedMps: 2.5,
      recordedAt: '2026-10-22T10:00:00.000Z',
    },
    {
      latitude: -23.55152,
      longitude: -46.633308,
      altitude: 762,
      speedMps: 2.6,
      recordedAt: '2026-10-22T10:05:00.000Z',
    },
    {
      latitude: -23.55252,
      longitude: -46.633308,
      altitude: 764,
      speedMps: 2.7,
      recordedAt: '2026-10-22T10:20:00.000Z',
    },
  ],
};

const draft = {
  run,
  sourceType: 'normal',
  createdAt: '2026-10-22T10:20:00.000Z',
};

function TestScreen({ seed }: { seed: boolean }) {
  const { setDraft, draft: currentDraft, publishedActivity } = useActivityDraft();

  useEffect(() => {
    if (seed) {
      setDraft(draft);
    }
  }, [seed, setDraft]);

  return (
    <>
      <ActivityDetailsScreen />
      <Text testID="draft-state">{currentDraft ? 'draft' : 'no-draft'}</Text>
      <Text testID="published-title">{publishedActivity?.title ?? 'none'}</Text>
      <Text testID="published-record">
        {publishedActivity?.isRecord ? 'record' : 'no-record'}
      </Text>
    </>
  );
}

const renderScreen = async (seed = true) =>
  render(
    <ActivityDraftProvider>
      <TestScreen seed={seed} />
    </ActivityDraftProvider>
  );

const getAlertButtons = (alertSpy: jest.SpyInstance) =>
  alertSpy.mock.calls[0][2] as Array<{
    text: string;
    onPress?: () => void;
  }>;

describe('fluxo de salvar atividade', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.clear();
    mockPost.mockResolvedValue({ data: {} });
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  test('salva a corrida, persiste o recorde e abre o detalhe', async () => {
    const screen = await renderScreen();

    await screen.findByText('Detalhes da atividade');
    await fireEvent.changeText(
      screen.getByLabelText('Título da atividade'),
      'Corrida no parque'
    );
    await fireEvent.press(screen.getByLabelText('Salvar atividade'));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/runs', {
        start_time: run.startTime,
        end_time: run.endTime,
        duration_seconds: run.durationSeconds,
        distance_meters: run.distanceMeters,
        calories: run.calories,
        trackpoints: run.trackpoints.map((trackpoint) => ({
          latitude: trackpoint.latitude,
          longitude: trackpoint.longitude,
          altitude: trackpoint.altitude,
          speed_mps: trackpoint.speedMps,
          recorded_at: trackpoint.recordedAt,
        })),
      });
    });

    expect(mockSecureStore.get('rota.bestDistanceMeters')).toBe('5000');
    await waitFor(() => {
      expect(screen.getByTestId('published-title')).toHaveTextContent(
        'Corrida no parque'
      );
    });
    expect(screen.getByTestId('published-record')).toHaveTextContent('record');
    expect(screen.getByTestId('draft-state')).toHaveTextContent('no-draft');
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/activity/[id]',
      params: { id: expect.any(String) },
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('mantém o rascunho e avisa quando a publicação falha', async () => {
    mockPost.mockRejectedValueOnce(new Error('offline'));

    const screen = await renderScreen();

    await screen.findByText('Detalhes da atividade');
    await fireEvent.press(screen.getByLabelText('Salvar atividade'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Erro ao salvar',
        'Não foi possível publicar sua atividade. Verifique sua conexão e tente novamente.'
      );
    });

    expect(screen.getByTestId('draft-state')).toHaveTextContent('draft');
    expect(screen.getByTestId('published-title')).toHaveTextContent('none');
    expect(mockSecureStore.has('rota.bestDistanceMeters')).toBe(false);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('descarta o rascunho e volta para a gravação', async () => {
    const screen = await renderScreen();

    await screen.findByText('Detalhes da atividade');
    await fireEvent.press(screen.getByLabelText('Descartar atividade'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Descartar atividade',
      'Esta corrida será removida permanentemente e não será publicada.',
      expect.any(Array)
    );

    const discardButton = getAlertButtons(alertSpy).find(
      (button) => button.text === 'Descartar'
    );

    await act(async () => {
      discardButton?.onPress?.();
    });

    expect(screen.getByTestId('draft-state')).toHaveTextContent('no-draft');
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/record');
    expect(mockPost).not.toHaveBeenCalled();
  });

  test('mostra o estado vazio sem rascunho e permite voltar para gravar', async () => {
    const screen = await renderScreen(false);

    expect(screen.getByText('Nenhuma atividade pendente')).toBeOnTheScreen();

    await fireEvent.press(screen.getByLabelText('Voltar para gravar'));

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/record');
  });
});
