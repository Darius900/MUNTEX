import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

export const getAllOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response);
    throw error;
  }
};
