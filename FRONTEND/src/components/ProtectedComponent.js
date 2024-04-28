import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Protected Component</h1>
      <p>This is a protected component. You should only see this if you are authenticated.</p>
    </div>
  );
};

export default ProtectedComponent;
