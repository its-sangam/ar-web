import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserContext } from '@/contexts/UserContext';

const Register = React.lazy(() => import('@/pages/Auth/Register'));
const Login = React.lazy(() => import('@/pages/Auth/Login'));
const AuthenticatedLayout = React.lazy(() => import('@/layouts/AuthenticatedLayout'));
const Skeleton = React.lazy(() => import('@/components/SkeletonLoader'));
const Loading = React.lazy(() => import('@/components/Loading'));

import { routes } from '@/utils/routes';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isAuthenticated, user, loading } = useUserContext();
  console.log(isAuthenticated);

  if (loading) {
    return (
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    );
  }

  const PrivateRoute = ({ Component, roles }: { Component: React.FC; roles: string[] }) => {
    if (!isAuthenticated || !user) {
      return <Navigate to="/login" />;
    }

    if (!roles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };

  const SuspenseFallback = () => {
    if (isAuthenticated) {
      return (
        <AuthenticatedLayout>
          <Skeleton />
        </AuthenticatedLayout>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      );
    }
  };


  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  isAuthenticated ? (
                    <AuthenticatedLayout>
                      <PrivateRoute Component={route.component} roles={route.roles} />
                    </AuthenticatedLayout>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            ))}
            <Route
              path="/register"
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/"
              element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/dashboard" />}
            />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default App;
