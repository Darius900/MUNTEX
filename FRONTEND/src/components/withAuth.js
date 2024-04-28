import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent, isAdmin = false) => {
  return (props) => {
    const token = localStorage.getItem('jwtToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const [shouldNavigate, setShouldNavigate] = useState(false);

    useEffect(() => {
      if (!token || (isAdmin && user && !user.isAdmin)) {
        setShouldNavigate(true);
      }
    }, [token, user, isAdmin]);
    

    if (shouldNavigate) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
