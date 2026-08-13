export const BACKEND_URL = import.meta.env.PROD 
  ? '' // Empty string so requests are relative to the Express server in production
  : 'http://localhost:5000';
