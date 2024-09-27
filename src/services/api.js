import axios from 'axios';

export const predictFlightPrice = async (formData) => {
  try {
    const response = await axios.post('http://localhost:5000/predict', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};
