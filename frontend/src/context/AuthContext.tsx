import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kalpanaaa_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('kalpanaaa_auth_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('kalpanaaa_auth_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('kalpanaaa_user', JSON.stringify(res.data.data));
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('kalpanaaa_auth_token', newToken);
    localStorage.setItem('kalpanaaa_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kalpanaaa_auth_token');
    localStorage.removeItem('kalpanaaa_user');
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
