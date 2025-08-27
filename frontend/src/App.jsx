import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './components/loader/loader';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/home'));
const AllBooks = lazy(() => import('./pages/AllBooks'));
const BookDetails = lazy(() => import('./components/ViewBookDetails/ViewBookDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/LogIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Market = lazy(() => import('./pages/Market'));
const Blog = lazy(() => import('./pages/Blog'));
const Social = lazy(() => import('./pages/Social'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader />
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-zinc-900 dark:to-black">
      <Navbar />
      
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<AllBooks />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/market" 
              element={
                <ProtectedRoute>
                  <Market />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog" 
              element={
                <ProtectedRoute>
                  <Blog />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/social" 
              element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
