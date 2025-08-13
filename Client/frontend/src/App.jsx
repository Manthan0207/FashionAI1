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
import Profile from "./pages/Profile";
import BecomeSeller from "./pages/BecomeSeller";
import SellerDashboard from "./pages/SellerDashboard";
import ProdUpload from "./pages/ProdUpload";
import Inventory from "./pages/Inventory";
import ProductEditPage from "./pages/ProductEditPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessfulPage from "./pages/OrderConfirmation";
import AllOrderPage from "./pages/AllOrderPage";
import SellsDetails from "./pages/SellsDetails";
import Wishlist from "./pages/Wishlist";
import Settings from "./pages/Settings";
import ChangeEmailVerificationPage from "./pages/ChangeEmailVerificationPage";


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
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/become-seller' element={<BecomeSeller />}></Route>
        <Route path='/seller-dashboard' element={<SellerDashboard />}></Route>
        <Route path='/upload-product' element={<ProdUpload />}></Route>
        <Route path='/seller-inventory' element={<Inventory />}></Route>
        <Route path='/product-edit-page/:id' element={<ProductEditPage />}></Route>
        <Route path='/cart' element={<CartPage />}></Route>
        <Route path='/checkout' element={<CheckoutPage />}></Route>
        <Route path='/order-success' element={<OrderSuccessfulPage />}></Route>
        <Route path='/orders' element={<AllOrderPage />}></Route>
        <Route path='/seller-sales' element={<SellsDetails />}></Route>
        <Route path='/wishlist' element={<Wishlist />}></Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path='/change-email-verification' element={<ChangeEmailVerificationPage />}></Route>
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
