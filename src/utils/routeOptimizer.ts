import { Trackpoint } from '../types/run';
import { calculateDistance } from './runUtils';

const getPerpendicularDistance = (pt: Trackpoint, lineStart: Trackpoint, lineEnd: Trackpoint): number => {
  let lat = lineStart.latitude;
  let lon = lineStart.longitude;
  const dLat = lineEnd.latitude - lat;
  const dLon = lineEnd.longitude - lon;

  if (dLat !== 0 || dLon !== 0) {
    const t = ((pt.latitude - lat) * dLat + (pt.longitude - lon) * dLon) / (dLat * dLat + dLon * dLon);
    if (t > 1) {
      lat = lineEnd.latitude;
      lon = lineEnd.longitude;
    } else if (t > 0) {
      lat += dLat * t;
      lon += dLon * t;
    }
  }

  return calculateDistance(pt.latitude, pt.longitude, lat, lon);
};

export const filterNoise = (points: Trackpoint[], minDistance: number = 2.0, minSpeed: number = 0.05): Trackpoint[] => {
  if (points.length === 0) return [];

  const filtered: Trackpoint[] = [];
  let lastValidPoint: Trackpoint | null = null;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];

    if (current.speedMs < minSpeed && filtered.length === 0) {
      continue;
    }

    if (!lastValidPoint) {
      filtered.push(current);
      lastValidPoint = current;
    } else {
      const distance = calculateDistance(
        lastValidPoint.latitude,
        lastValidPoint.longitude,
        current.latitude,
        current.longitude
      );

      if (distance >= minDistance || i === points.length - 1) {
        filtered.push(current);
        lastValidPoint = current;
      }
    }
  }

  return filtered;
};

export const rdp = (points: Trackpoint[], epsilon: number): Trackpoint[] => {
  if (points.length <= 2) return points;

  const stack: [number, number][] = [[0, points.length - 1]];
  const keep = new Uint8Array(points.length);
  
  keep[0] = 1;
  keep[points.length - 1] = 1;

  while (stack.length > 0) {
    const [startIndex, endIndex] = stack.pop()!;
    let dmax = 0;
    let index = startIndex;

    for (let i = startIndex + 1; i < endIndex; i++) {
      const d = getPerpendicularDistance(points[i], points[startIndex], points[endIndex]);
      if (d > dmax) {
        index = i;
        dmax = d;
      }
    }

    if (dmax > epsilon) {
      keep[index] = 1;
      stack.push([startIndex, index]);
      stack.push([index, endIndex]);
    }
  }

  return points.filter((_, i) => keep[i] === 1);
};

export const optimizeRoute = (points: Trackpoint[], epsilon: number = 2.0): Trackpoint[] => {
  const denoised = filterNoise(points, 2.0, 0.05);
  return rdp(denoised, epsilon);
};

