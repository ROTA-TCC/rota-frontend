import { calculateDistance, formatTime, calculatePace } from '../src/utils/runUtils';

describe('runUtils', () => {
  test('calculateDistance should calculate correctly', () => {
    expect(calculateDistance(0, 0, 0, 1)).toBeGreaterThan(111000);
    expect(calculateDistance(0, 0, 0, 0)).toBe(0);
    expect(calculateDistance(-10, -10, -10, -10)).toBe(0);
  });

  test('formatTime should format seconds correctly', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(10)).toBe('00:10');
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(3599)).toBe('59:59');
    expect(formatTime(3600)).toBe('1:00:00');
    expect(formatTime(3665)).toBe('1:01:05');
  });

  test('calculatePace should calculate pace correctly', () => {
    expect(calculatePace(600, 2000)).toBe('5:00');
    expect(calculatePace(0, 0)).toBe('0:00');
    expect(calculatePace(300, 1000)).toBe('5:00');
    expect(calculatePace(600, 1000)).toBe('10:00');
  });
});
