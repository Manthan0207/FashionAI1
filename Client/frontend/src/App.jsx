import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from "./store/authStore";
import { Children, useEffect } from "react";
import LoadingSpinner from './components/LoadingSpinner'
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LandingPage from "./pages/LandingPage";
import OnBoarding from "./pages/OnBoarding";
import ProductDetailPage from "./pages/ProductDetailPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/landing-page' replace />
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />
  }

  return children
}



//redirect authenticated user to home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />  //replace means replace with the current page
  }

  return children //current page
}

function App() {

  const { isCheckingAuth, checkingAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkingAuth()
  },
    [checkingAuth])

  console.log();

  if (isCheckingAuth) return <LoadingSpinner />

  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={
          <RedirectAuthenticatedUser >
            <SignUpPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/login" element={
          <RedirectAuthenticatedUser >
            <LoginPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/verify-email" element={<EmailVerificationPage />} />

        <Route path="/forgot-password" element={
          <RedirectAuthenticatedUser >
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>
        } />


        <Route
          path='/reset-password/:token'
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route path='/landing-page' element={<LandingPage />} />
        <Route path='/onboard' element={<OnBoarding />} />
        <Route path='/product/:id' element={<ProductDetailPage />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
