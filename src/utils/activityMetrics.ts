import type { RunPayload } from '@/types/run';
import { calculateDistance } from './runUtils';

const CHART_BUCKETS = 19;

export interface CaloriesChartData {
  bars: number[];
  average: number;
  min: number;
  max: number;
  highlightIndex: number;
  total: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseTime = (value: string) => {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
};

const getTotalCalories = (run: RunPayload) => {
  if (run.calories != null && run.calories > 0) {
    return run.calories;
  }

  return Math.round((run.distanceMeters / 1000) * 60);
};

export const buildCaloriesChart = (
  run: RunPayload,
  bucketCount = CHART_BUCKETS
): CaloriesChartData => {
  const total = getTotalCalories(run);
  const bars = Array.from({ length: bucketCount }, () => 0);

  if (total <= 0) {
    return {
      bars,
      average: 0,
      min: 0,
      max: 0,
      highlightIndex: 0,
      total,
    };
  }

  const startTime = parseTime(run.startTime);
  const endTime = parseTime(run.endTime);
  const hasTimeRange =
    startTime != null && endTime != null && endTime > startTime;
  const segments: { bucket: number; distance: number }[] = [];
  let totalDistance = 0;

  for (let index = 1; index < run.trackpoints.length; index += 1) {
    const previous = run.trackpoints[index - 1];
    const current = run.trackpoints[index];
    const distance = calculateDistance(
      previous.latitude,
      previous.longitude,
      current.latitude,
      current.longitude
    );

    if (distance <= 0) {
      continue;
    }

    const currentTime =
      parseTime(current.recordedAt) ?? parseTime(previous.recordedAt);
    const progress =
      hasTimeRange &&
      currentTime != null &&
      startTime != null &&
      endTime != null
        ? clamp((currentTime - startTime) / (endTime - startTime), 0, 0.9999)
        : (index / Math.max(run.trackpoints.length - 1, 1)) * 0.9999;

    segments.push({
      bucket: Math.min(bucketCount - 1, Math.floor(progress * bucketCount)),
      distance,
    });
    totalDistance += distance;
  }

  if (totalDistance <= 0) {
    const perBucket = total / bucketCount;

    for (let index = 0; index < bucketCount; index += 1) {
      bars[index] = perBucket;
    }
  } else {
    segments.forEach((segment) => {
      bars[segment.bucket] += (segment.distance / totalDistance) * total;
    });
  }

  const nonEmptyBars = bars.filter((value) => value > 0);
  const average = Math.round(total / bucketCount);
  const min = nonEmptyBars.length ? Math.round(Math.min(...nonEmptyBars)) : 0;
  const max = nonEmptyBars.length ? Math.round(Math.max(...nonEmptyBars)) : 0;
  const highlightIndex = bars.reduce(
    (bestIndex, value, index) =>
      value > bars[bestIndex] ? index : bestIndex,
    0
  );

  return {
    bars,
    average,
    min,
    max,
    highlightIndex,
    total,
  };
};
