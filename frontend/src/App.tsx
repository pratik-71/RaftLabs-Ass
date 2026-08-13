import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { supabase } from './Config/supabase';
import { useAuthStore } from './Store/authStore';
import { Toaster } from 'react-hot-toast';
import Layout from './Components/Layout';

// Lazy loaded pages
const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const Signup = lazy(() => import('./Pages/Signup'));
const Products = lazy(() => import('./Pages/Products'));
const Admin = lazy(() => import('./Pages/Admin'));
const Cart = lazy(() => import('./Pages/Cart'));
const Checkout = lazy(() => import('./Pages/Checkout'));
const Orders = lazy(() => import('./Pages/Orders'));
const ProductDetail = lazy(() => import('./Pages/ProductDetail'));
const Profile = lazy(() => import('./Pages/Profile'));
const NotFound = lazy(() => import('./Pages/NotFound'));

const FallbackLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'font-heading font-medium text-textMain bg-surface border border-border shadow-md rounded-xl',
          duration: 4000,
          success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
          error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
        }} 
      />
      <Router>
        <ScrollToTop />
        <Suspense fallback={<FallbackLoader />}>
          <Routes>
            {/* Routes with Navbar and Footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin_pratik" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Authentication Routes (No Navbar/Footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
