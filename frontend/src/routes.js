import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm/AuthForm';
import Dashboard from './components/Dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const routes = [
  {
    path: '/',
    element: <PrivateRoute element={<Dashboard />} />,
  },
  {
    path: '/login',
    element: <AuthForm isLogin={true} />,
  },
  {
    path: '/register',
    element: <AuthForm isLogin={false} />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export default routes;
