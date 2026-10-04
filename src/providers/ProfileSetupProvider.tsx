import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UpdateProfileDto } from '@ROTA-TCC/types/profile';

interface ProfileSetupContextType {
  profileData: Partial<UpdateProfileDto>;
  updateProfileData: (data: Partial<UpdateProfileDto>) => void;
  resetProfileData: () => void;
}

const ProfileSetupContext = createContext<ProfileSetupContextType | undefined>(undefined);

export const ProfileSetupProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<Partial<UpdateProfileDto>>({});

  const updateProfileData = (data: Partial<UpdateProfileDto>) => {
    setProfileData((prev) => ({ ...prev, ...data }));
  };

  const resetProfileData = () => {
    setProfileData({});
  };

  return (
    <ProfileSetupContext.Provider value={{ profileData, updateProfileData, resetProfileData }}>
      {children}
    </ProfileSetupContext.Provider>
  );
};

export const useProfileSetup = () => {
  const context = useContext(ProfileSetupContext);
  if (!context) {
    throw new Error('useProfileSetup deve ser usado dentro de um ProfileSetupProvider');
  }
  return context;
};
