const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Decrement stock on sale
router.post('/sale', async (req, res) => {
  const { productId, quantity } = req.body;
  // Fetch current stock
  const { data: product, error: fetchError } = await supabase.from('products').select('stock').eq('id', productId).single();
  if (fetchError) return res.status(400).json({ error: fetchError.message });
  if (!product || product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });
  // Decrement stock
  const { data, error } = await supabase.from('products').update({ stock: product.stock - quantity }).eq('id', productId).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Low stock alert (list products below threshold)
router.get('/low-stock/:threshold', async (req, res) => {
  const threshold = parseInt(req.params.threshold, 10) || 5;
  const { data, error } = await supabase.from('products').select('*').lt('stock', threshold);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
