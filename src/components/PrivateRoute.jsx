import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // ou votre méthode d'authentification

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;