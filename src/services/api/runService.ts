import api from './client';
import { CreateRunDto } from '@ROTA-TCC/types/runs';

export const createRun = async (data: CreateRunDto): Promise<void> => {
  const payload = {
    start_time: data.startTime,
    end_time: data.endTime,
    duration_seconds: data.durationSeconds,
    distance_meters: data.distanceMeters,
    calories: data.calories,
    trackpoints: data.trackpoints.map((tp) => ({
      latitude: tp.latitude,
      longitude: tp.longitude,
      altitude: tp.altitude,
      speed_mps: tp.speedMps,
      recorded_at: tp.recordedAt,
    })),
  };
  await api.post('/runs', payload);
};
