import api from './client';
import { UpdateProfileDto } from '@ROTA-TCC/types/profile';

export const updateProfile = async (data: UpdateProfileDto): Promise<void> => {
  await api.patch('/profile', data);
};
