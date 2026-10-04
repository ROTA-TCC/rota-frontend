import api from './client';
import { UpdateProfileDto } from '@ROTA-TCC/types/profile';

export const updateProfile = async (data: UpdateProfileDto): Promise<void> => {
  const payload = {
    peso: data.peso,
    altura: data.altura,
    idade: data.idade,
    nivel_dificuldade: data.nivelDificuldade,
    mapa_ocultacao: data.mapaOcultacao ? {
      latitude: data.mapaOcultacao.latitude,
      longitude: data.mapaOcultacao.longitude,
      raio_metros: data.mapaOcultacao.radiusMetres,
    } : undefined,
  };
  await api.patch('/profile', payload);
};
