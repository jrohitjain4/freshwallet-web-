import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import {
  PublicRoute,
  ProtectedRoute,
  OnboardingRoute,
} from './components/auth/RouteGuards';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import RegisterWelcomePage from './pages/RegisterWelcomePage';
import RegisterAuthPage from './pages/RegisterAuthPage';
import BusinessOnboardingPage from './pages/BusinessOnboardingPage';
import KycPage from './pages/KycPage';
import DashboardPage from './pages/DashboardPage';
import ReceivePage from './pages/ReceivePage';
import SendPage from './pages/SendPage';
import LedgerPage from './pages/LedgerPage';
import MorePage from './pages/MorePage';
import './i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          <Route element={<PublicRoute />}>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/register/welcome" element={<RegisterWelcomePage />} />
            <Route path="/register/auth" element={<RegisterAuthPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding/business" element={<BusinessOnboardingPage />} />
            <Route path="/onboarding/kyc" element={<KycPage />} />

            <Route element={<OnboardingRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/receive" element={<ReceivePage />} />
              <Route path="/send" element={<SendPage />} />
              <Route path="/ledger" element={<LedgerPage />} />
              <Route path="/more" element={<MorePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
