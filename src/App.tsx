import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { useCookies } from 'react-cookie';
import Home from './pages/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

const queryClient = new QueryClient();
const App: React.FC = () => {
  const [cookies] = useCookies(['authToken']);

  const isAuthenticated = cookies.authToken ? true : false;

  return (
    <QueryClientProvider client={queryClient}>

    <Router>
      <Routes>
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        {isAuthenticated && (
          <Route element={<AuthenticatedLayout />}>
              <Route path="/home" element={<Home />} />
            </Route>
          )}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} />
      </Routes>
    </Router>
    <ToastContainer />
    </QueryClientProvider>
  );  
};

export default App;
