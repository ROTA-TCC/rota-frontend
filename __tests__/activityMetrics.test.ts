import type { RunPayload } from '../src/types/run';
import { buildCaloriesChart } from '../src/utils/activityMetrics';

const START_TIME = Date.parse('2026-10-22T10:00:00.000Z');
const END_TIME = Date.parse('2026-10-22T10:19:00.000Z');

const buildRun = (overrides: Partial<RunPayload> = {}): RunPayload => ({
  startTime: new Date(START_TIME).toISOString(),
  endTime: new Date(END_TIME).toISOString(),
  durationSeconds: 1140,
  distanceMeters: 2000,
  calories: 120,
  trackpoints: [],
  ...overrides,
});

const buildTrackpoints = (jumpIndex?: number) =>
  Array.from({ length: 20 }, (_, index) => ({
    latitude: 0,
    longitude:
      jumpIndex != null && index >= jumpIndex
        ? 0.01 + index * 0.00001
        : index * 0.00001,
    recordedAt: new Date(START_TIME + index * 60_000).toISOString(),
  }));

describe('buildCaloriesChart', () => {
  test('distributes calories into the expected number of buckets', () => {
    const result = buildCaloriesChart(buildRun({ trackpoints: buildTrackpoints() }));

    expect(result.bars).toHaveLength(19);
    expect(result.bars.reduce((sum, value) => sum + value, 0)).toBeCloseTo(
      120,
      5
    );
    expect(result.average).toBe(Math.round(120 / 19));
    expect(result.total).toBe(120);
    expect(result.highlightIndex).toBeGreaterThanOrEqual(0);
    expect(result.highlightIndex).toBeLessThan(19);
  });

  test('highlights the bucket with the largest distance', () => {
    const result = buildCaloriesChart(
      buildRun({ trackpoints: buildTrackpoints(10) })
    );

    expect(result.highlightIndex).toBe(10);
    expect(result.max).toBeGreaterThan(result.min);
  });

  test('falls back to an even distribution when there is no route data', () => {
    const result = buildCaloriesChart(buildRun());

    result.bars.forEach((value) => {
      expect(value).toBeCloseTo(120 / 19, 5);
    });
  });

  test('estimates calories from distance when calories are missing', () => {
    const result = buildCaloriesChart(
      buildRun({ calories: undefined, distanceMeters: 3000 })
    );

    expect(result.total).toBe(180);
    expect(result.average).toBe(Math.round(180 / 19));
  });

  test('returns an empty chart for a run without calories', () => {
    const result = buildCaloriesChart(
      buildRun({ calories: 0, distanceMeters: 0 })
    );

    expect(result.total).toBe(0);
    expect(result.bars.every((value) => value === 0)).toBe(true);
    expect(result.highlightIndex).toBe(0);
  });
});
