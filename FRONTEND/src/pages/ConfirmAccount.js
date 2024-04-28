

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ConfirmAccount() {
  const { userId } = useParams();

  useEffect(() => {
    async function confirmUserAccount() {
      try {
        await axios.put(`http://localhost:5000/api/users/confirm/${userId}`);

        alert('Your account has been confirmed successfully. You can now log in.');
      } catch (error) {
        console.error('Error confirming user account:', error);
        alert('There was an error confirming your account. Please try again later.');
      }
    }

    confirmUserAccount();
  }, [userId]);

  return (
    <div>
      <h2>Confirming your account...</h2>
    </div>
  );
}

export default ConfirmAccount;
