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

// Fallback route
app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
