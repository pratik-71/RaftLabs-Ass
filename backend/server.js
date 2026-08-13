const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from backend directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// API Root endpoint
app.get('/api', (req, res) => {
  res.send('API is running...');
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder to the compiled React app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Any route that is not an API route will hit this catch-all
  // and send back the React index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  // Simple fallback for development
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
