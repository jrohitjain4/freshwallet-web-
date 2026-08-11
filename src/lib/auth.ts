export type AuthUser = {
  id: string;
  email: string | null;
  phone: string;
  name: string | null;
  role: string;
  isVerified: boolean;
  merchantId?: string | null;
  onboardingStatus?: 'PENDING' | 'COMPLETED';
  kycSubmitted?: boolean;
};

const TOKEN_KEY = 'freshwallet_access_token';
const REFRESH_KEY = 'freshwallet_refresh_token';
const USER_KEY = 'freshwallet_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const getUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSession = (data: {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string };
}) => {
  localStorage.setItem(TOKEN_KEY, data.tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, data.tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

export const updateUser = (user: AuthUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n);
