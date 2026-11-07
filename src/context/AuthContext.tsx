/**
 * The Spot - Authentication & Onboarding Context
 */

import React, { createContext, useContext, useState } from 'react';
import { User } from '../types/user';
import { currentUser as initialUser } from '../data/mockUsers';

interface AuthContextType {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: User;
  selectedCity: string;
  selectedNeighborhood: string;
  userInterests: string[];
  userGamingPreferences: string[];
  login: (email?: string) => void;
  signUp: (email: string, name: string) => void;
  logout: () => void;
  completeOnboarding: (interests: string[], games: string[], neighborhood: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  setSelectedNeighborhood: (area: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // start logged in for seamless dev/test experience
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [user, setUser] = useState<User>(initialUser);
  const [selectedCity, setSelectedCity] = useState<string>('Pune');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Koregaon Park');
  const [userInterests, setUserInterests] = useState<string[]>(initialUser.interests);
  const [userGamingPreferences, setUserGamingPreferences] = useState<string[]>(initialUser.favoriteGames);

  const login = (_email?: string) => {
    setIsAuthenticated(true);
    setIsOnboarded(true);
  };

  const signUp = (email: string, name: string) => {
    setUser(prev => ({
      ...prev,
      email,
      name: name || prev.name,
      username: (name || 'user').toLowerCase().replace(/\s+/g, '_'),
    }));
    setIsAuthenticated(true);
    setIsOnboarded(false); // send new signups through onboarding
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const completeOnboarding = (interests: string[], games: string[], neighborhood: string) => {
    setUserInterests(interests);
    setUserGamingPreferences(games);
    setSelectedNeighborhood(neighborhood);
    setUser(prev => ({
      ...prev,
      locationArea: `${neighborhood}, Pune`,
      interests,
      favoriteGames: games,
    }));
    setIsOnboarded(true);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        user,
        selectedCity,
        selectedNeighborhood,
        userInterests,
        userGamingPreferences,
        login,
        signUp,
        logout,
        completeOnboarding,
        updateUserProfile,
        setSelectedNeighborhood,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
