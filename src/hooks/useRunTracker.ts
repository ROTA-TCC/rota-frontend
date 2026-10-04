import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { calculateDistance, calculatePace, formatTime } from '../utils/runUtils';
import { Trackpoint, RunPayload } from '../types/run';

export const useRunTracker = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [trackpoints, setTrackpoints] = useState<Trackpoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  
  const startTimeRef = useRef<string | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    if (!startTimeRef.current) startTimeRef.current = new Date().toISOString();
    
    setIsRecording(true);
    setIsPaused(false);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    locationSubRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const { latitude, longitude, altitude, speed } = location.coords;
        setCurrentLocation([latitude, longitude]);

        setTrackpoints((prev) => {
          if (prev.length > 0) {
            const lastPt = prev[prev.length - 1];
            const dist = calculateDistance(lastPt.latitude, lastPt.longitude, latitude, longitude);
            if (dist > 0.2) { 
              setDistance((d) => d + dist);
            }
          }
          
          return [...prev, {
            latitude,
            longitude,
            altitude: altitude || 0,
            speedMps: speed || 0,
            recordedAt: new Date().toISOString()
          }];
        });
      }
    );
  };

  const pauseRecording = () => {
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (locationSubRef.current) locationSubRef.current.remove();
  };

  const finishRecording = (): RunPayload | null => {
    pauseRecording();
    setIsRecording(false);

    if (!startTimeRef.current) return null;

    const calories = Math.round((distance / 1000) * 60);

    return {
      startTime: startTimeRef.current,
      endTime: new Date().toISOString(),
      durationSeconds: duration,
      distanceMeters: Math.round(distance),
      calories,
      trackpoints,
    };
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationSubRef.current) locationSubRef.current.remove();
    };
  }, []);

  return {
    isRecording,
    isPaused,
    durationFormatted: formatTime(duration),
    distanceKm: (distance / 1000).toFixed(2).replace('.', ','),
    pace: calculatePace(duration, distance),
    currentLocation,
    route: trackpoints.map(pt => [pt.latitude, pt.longitude] as [number, number]),
    startRecording,
    pauseRecording,
    finishRecording
  };
};

