import { useState, useEffect, useRef, useMemo } from 'react';
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
  const lastLocationRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const totalDistanceRef = useRef<number>(0);

  const startRecording = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const initialLoc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    
    const lat = initialLoc.coords.latitude;
    const lng = initialLoc.coords.longitude;
    setCurrentLocation([lat, lng]);
    lastLocationRef.current = { latitude: lat, longitude: lng };

    if (!startTimeRef.current) startTimeRef.current = new Date().toISOString();
    
    setIsRecording(true);
    setIsPaused(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    if (locationSubRef.current) locationSubRef.current.remove();

    locationSubRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000, 
        distanceInterval: 0, 
      },
      (location) => {
        const { latitude, longitude, altitude, speed } = location.coords;
        
        setCurrentLocation([latitude, longitude]);

        if (lastLocationRef.current) {
          const dist = calculateDistance(
            lastLocationRef.current.latitude,
            lastLocationRef.current.longitude,
            latitude,
            longitude
          );

          if (dist >= 1) {
            totalDistanceRef.current += dist;
            setDistance(totalDistanceRef.current);
            lastLocationRef.current = { latitude, longitude };

            const newPoint: Trackpoint = {
              latitude,
              longitude,
              altitude: altitude || 0,
              speedMps: speed || 0,
              recordedAt: new Date().toISOString()
            };

            setTrackpoints((prev) => [...prev, newPoint]);
          }
        }
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

    const calories = Math.round((totalDistanceRef.current / 1000) * 60);

    return {
      startTime: startTimeRef.current,
      endTime: new Date().toISOString(),
      durationSeconds: duration,
      distanceMeters: Math.round(totalDistanceRef.current),
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

  const route = useMemo(() => {
    return trackpoints.map(pt => [pt.latitude, pt.longitude] as [number, number]);
  }, [trackpoints]);

  return {
    isRecording,
    isPaused,
    durationFormatted: formatTime(duration),
    distanceKm: (distance / 1000).toFixed(2).replace('.', ','),
    pace: calculatePace(duration, distance),
    currentLocation,
    route,
    startRecording,
    pauseRecording,
    finishRecording
  };
};

