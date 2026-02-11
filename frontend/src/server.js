const isProduction = process.env.NODE_ENV === 'production';

export const server = isProduction 
  ? "https://your-backend-name.vercel.app/api/v2"
  : "http://127.0.0.1:8000/api/v2";