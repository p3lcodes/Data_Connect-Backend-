require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('POS Backend API Running');
});

// Product CRUD routes
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Stock routes
const stockRoutes = require('./routes/stock');
app.use('/api/stock', stockRoutes);

// Cashier session routes
const cashierRoutes = require('./routes/cashier');
app.use('/api/cashier', cashierRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
