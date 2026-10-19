import { useThemeColor } from '../src/hooks/use-theme-color';

jest.mock('@/theme', () => ({
  themed: {
    light: { text: '#000', background: '#fff' },
    dark: { text: '#fff', background: '#000' },
  },
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

import { themed } from '@/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

describe('useThemeColor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns color from props when light theme matches', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const color = useThemeColor({ light: '#123' }, 'text');
    expect(color).toBe('#123');
  });

  test('returns color from props when dark theme matches', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const color = useThemeColor({ dark: '#321' }, 'text');
    expect(color).toBe('#321');
  });

  test('returns color from theme when props are missing', () => {
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    const color = useThemeColor({}, 'text');
    expect(color).toBe(themed.dark.text);
  });

  test('returns default light theme when color scheme is null', () => {
    (useColorScheme as jest.Mock).mockReturnValue(null);
    const color = useThemeColor({}, 'background');
    expect(color).toBe(themed.light.background);
  });
});
