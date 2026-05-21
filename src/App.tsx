import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import { appRoutes } from './config/routes';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

const AuthModal = lazy(() => import('./components/AuthModal'));
const FloatingConsultation = lazy(() => import('./components/FloatingConsultation'));

const RouteLoading = () => (
  <div className="min-h-[50vh] flex items-center justify-center px-4 pt-24">
    <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
      <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
      Loading...
    </div>
  </div>
);

function AppLayout() {
  const { isAuthModalOpen, closeAuthModal, authMode } = useAuth();

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-white font-sans text-deep selection:bg-primary/20 selection:text-primary overflow-x-hidden">
        <Navbar />
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
        <Footer />
      </div>
      
      {/* Global Auth Modal */}
      {isAuthModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={closeAuthModal}
            defaultMode={authMode}
          />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <FloatingConsultation />
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppLayout />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

