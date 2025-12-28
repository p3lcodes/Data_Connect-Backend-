// Swagger UI for API docs
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('dotenv').config();
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '[set]' : '[not set]');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const supabase = require('./utils/supabase');

// List all entities endpoints
app.get('/api/all/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
app.get('/api/all/cashiers', async (req, res) => {
  const { data, error } = await supabase.from('cashiers').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
app.get('/api/all/shifts', async (req, res) => {
  const { data, error } = await supabase.from('shifts').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
app.get('/api/all/sales', async (req, res) => {
  const { data, error } = await supabase.from('sales').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
app.get('/api/all/payments', async (req, res) => {
  const { data, error } = await supabase.from('payments').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Auth middleware
const { requireRole } = require('./controllers/authController');

// Product CRUD routes (admin, manager)
const productRoutes = require('./routes/products');
app.use('/api/products', requireRole(['admin', 'manager']), productRoutes);

// Stock routes (admin, manager)
const stockRoutes = require('./routes/stock');
app.use('/api/stock', requireRole(['admin', 'manager']), stockRoutes);

// Cashier session routes (admin, manager, cashier)
const cashierRoutes = require('./routes/cashier');
app.use('/api/cashier', requireRole(['admin', 'manager', 'cashier']), cashierRoutes);

// Supply routes (admin, manager)
const supplyRoutes = require('./routes/supply');
app.use('/api/supply', requireRole(['admin', 'manager']), supplyRoutes);

// Payments routes (admin, manager, cashier)
const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', requireRole(['admin', 'manager', 'cashier']), paymentsRoutes);

// Shifts routes (admin, manager, cashier)
const shiftsRoutes = require('./routes/shifts');
app.use('/api/shifts', requireRole(['admin', 'manager', 'cashier']), shiftsRoutes);

// Sales routes (admin, manager, cashier)
const salesRoutes = require('./routes/sales');
app.use('/api/sales', requireRole(['admin', 'manager', 'cashier']), salesRoutes);

// Payments routes
const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', paymentsRoutes);

// Shifts routes
const shiftsRoutes = require('./routes/shifts');
app.use('/api/shifts', shiftsRoutes);

// Sales routes
const salesRoutes = require('./routes/sales');
app.use('/api/sales', salesRoutes);


const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
