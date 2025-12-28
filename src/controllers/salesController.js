const supabase = require('../utils/supabase');

// Create sale, decrement stock, and check low stock
exports.createSale = async (req, res) => {
  const { productId, shiftId, quantity, total } = req.body;
  console.log('Creating sale:', { productId, shiftId, quantity, total });

  // Fetch product
  const { data: product, error: fetchError } = await supabase.from('products').select('stock').eq('id', productId).single();
  if (fetchError) return res.status(400).json({ error: fetchError.message });
  if (!product || product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

  // Decrement stock
  const { error: updateError } = await supabase.from('products').update({ stock: product.stock - quantity }).eq('id', productId);
  if (updateError) return res.status(400).json({ error: updateError.message });

  // Create sale record
  const { data: sale, error: saleError } = await supabase.from('sales').insert([{ product_id: productId, shift_id: shiftId, quantity, total }]).select().single();
  if (saleError) return res.status(400).json({ error: saleError.message });

  // Check for low stock
  const LOW_STOCK_THRESHOLD = 5;
  if (product.stock - quantity < LOW_STOCK_THRESHOLD) {
    console.log(`Low stock alert for product ${productId}: ${product.stock - quantity} left`);
  }

  res.json(sale);
};
