import React, { createContext, useState } from 'react';

export interface AuthContextType {
  signIn: (token: string, user: any) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  userToken: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const signIn = async (token: string, user: any) => {
    setUserToken(token);
    setIsLoading(false);
  };

  const signOut = async () => {
    setUserToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
