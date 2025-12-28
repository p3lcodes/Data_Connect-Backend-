const supabase = require('../utils/supabase');

// Add supply (restock product)
exports.addSupply = async (req, res) => {
  const { productId, quantity } = req.body;
  console.log('Adding supply:', { productId, quantity });
  // Fetch product
  const { data: product, error: fetchError } = await supabase.from('products').select('stock').eq('id', productId).single();
  if (fetchError) return res.status(400).json({ error: fetchError.message });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  // Update stock
  const { data, error } = await supabase.from('products').update({ stock: product.stock + quantity }).eq('id', productId).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// List all products with stock
exports.getAllWithStock = async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
