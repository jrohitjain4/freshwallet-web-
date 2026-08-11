import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { AuthUser } from '../../lib/auth';

export function resolveHome(user: AuthUser) {
  if (user.onboardingStatus !== 'COMPLETED') return '/onboarding/business';
  if (!user.kycSubmitted) return '/onboarding/kyc';
  return '/dashboard';
}

export function PublicRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user && !['/welcome', '/login', '/verify-otp'].includes(location.pathname)) {
    return <Navigate to={resolveHome(user)} replace />;
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export function OnboardingRoute() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  if (user.onboardingStatus !== 'COMPLETED') {
    return <Navigate to="/onboarding/business" replace />;
  }

  if (!user.kycSubmitted) {
    return <Navigate to="/onboarding/kyc" replace />;
  }

  return <Outlet />;
}

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={resolveHome(user)} replace />;
  return <>{children}</>;
}
