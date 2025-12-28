const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Create product
router.post('/', async (req, res) => {
  const { name, price, stock } = req.body;
  const { data, error } = await supabase.from('products').insert([{ name, price, stock }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Read all products
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Read single product
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

// Update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  const { data, error } = await supabase.from('products').update({ name, price, stock }).eq('id', id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
