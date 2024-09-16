import React, { createContext, useContext, ReactNode } from 'react';

interface AuthenticatedContextType {
  user: any;
  setUser: (user: any) => void;
  isAuthenticated: boolean;
}

const AuthenticatedContext = createContext<AuthenticatedContextType | undefined>(undefined);

export const AuthenticatedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null);

  const isAuthenticated = !!user;

  // Context value
  const value = { user, setUser, isAuthenticated };

  return (
    <AuthenticatedContext.Provider value={value}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

export const useAuthenticated = () => {
  const context = useContext(AuthenticatedContext);
  if (context === undefined) {
    throw new Error('useAuthenticated must be used within an AuthenticatedProvider');
  }
  return context;
};
