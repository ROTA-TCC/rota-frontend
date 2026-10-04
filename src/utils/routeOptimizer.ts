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

export const filterNoise = (points: Trackpoint[], minDistance: number = 2.0, minSpeed: number = 0.1): Trackpoint[] => {
  if (points.length === 0) return [];

  const filtered: Trackpoint[] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const distance = calculateDistance(
      lastPoint.latitude,
      lastPoint.longitude,
      current.latitude,
      current.longitude
    );

    if (distance >= minDistance && current.speedMps >= minSpeed) {
      filtered.push(current);
      lastPoint = current;
    }
  }

  if (filtered.length > 0 && filtered[filtered.length - 1] !== points[points.length - 1]) {
    filtered.push(points[points.length - 1]);
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

export const optimizeRoute = (points: Trackpoint[], epsilon: number = 3.0): Trackpoint[] => {
  const denoised = filterNoise(points);
  return rdp(denoised, epsilon);
};

