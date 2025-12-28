const supabase = require('../utils/supabase');

// Create product
exports.createProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  console.log('Creating product:', { name, price, stock });
  const { data, error } = await supabase.from('products').insert([{ name, price, stock }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Get all products
exports.getProducts = async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Get single product
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

// Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  console.log('Updating product:', { id, name, price, stock });
  const { data, error } = await supabase.from('products').update({ name, price, stock }).eq('id', id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log('Deleting product:', id);
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
};
