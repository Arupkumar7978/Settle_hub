import app from './app';
import dotenv from 'dotenv';

// Load .env properties
dotenv.config();

const PORT = process.env.DEVELOPMENT_PORT || 3000;
const ENV = (
  (process.env.NODE_ENV || 'development') as String
).toUpperCase();

app.listen(PORT, () => {
  console.log(`[${ENV} - Server] : started on port ${PORT}`);
});
