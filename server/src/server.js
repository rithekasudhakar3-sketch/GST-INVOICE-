import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`  Server running in ${ENV} mode  `);
  console.log(`  Listening on http://localhost:${PORT} `);
  console.log(`=================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
