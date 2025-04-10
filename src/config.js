const isDevelopment = process.env.NODE_ENV === 'development';
export const API_URL = isDevelopment 
  ? 'http://localhost:3002/api'
  : 'https://dating-app-backend-0gej.onrender.com/api'; 