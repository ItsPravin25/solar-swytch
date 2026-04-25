import React, { useState } from 'react';
import { SolarOnboarding } from './SolarOnboarding';
import { SolarDashboard } from './SolarDashboard';
type AppState = 'onboarding' | 'dashboard';
export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  businessType: string;
  role: string;
  companyName: string;
  gstNumber: string;
  logoPreview: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  primaryContact: string;
  alternateContact: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}
const defaultProfile: UserProfile = {
  fullName: 'Solar Owner',
  email: 'admin@solarswytch.in',
  phone: '',
  businessType: '',
  role: '',
  companyName: 'Solar Swytch Pvt. Ltd.',
  gstNumber: '',
  logoPreview: '',
  address: '',
  state: '',
  city: '',
  pincode: '',
  primaryContact: '',
  alternateContact: '',
  bankName: '',
  accountNumber: '',
  ifscCode: ''
};
export const SolarSwytch: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  if (appState === 'onboarding') {
    return <SolarOnboarding onAuthenticated={profile => {
      if (profile) setUserProfile(profile);
      setAppState('dashboard');
    }} />;
  }
  return <SolarDashboard onLogout={() => setAppState('onboarding')} userProfile={userProfile} onProfileUpdate={p => setUserProfile(p)} />;
};