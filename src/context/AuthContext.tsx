import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api';
import type { AuthUser } from '../lib/auth';
import { clearSession, getToken, getUser, setSession, updateUser } from '../lib/auth';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (data: { user: AuthUser; tokens: { accessToken: string; refreshToken: string } }) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getUser);
  const [loading, setLoading] = useState(!!getToken());

  const refreshProfile = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await apiGet<AuthUser>('/auth/me');
      updateUser(profile);
      setUser(profile);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback((data: { user: AuthUser; tokens: { accessToken: string; refreshToken: string } }) => {
    setSession(data);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshProfile }),
    [user, loading, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
