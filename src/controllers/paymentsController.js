
const supabase = require('../utils/supabase');
// Import the Daraja payments instance
const { daraja } = require('../../payments/mpesaDaraja');

// Record a payment for a sale

exports.createPayment = async (req, res) => {
  const { saleId, amount, method } = req.body;
  console.log('Recording payment:', { saleId, amount, method });

  // If method is mpesa, trigger Daraja logic (demo: get access token)
  if (method && method.toLowerCase() === 'mpesa') {
    try {
      const accessToken = await daraja.getAccessToken();
      console.log('M-Pesa access token:', accessToken);
      // You can add more logic here to initiate payment, etc.
    } catch (err) {
      console.error('M-Pesa error:', err);
      return res.status(500).json({ error: 'M-Pesa integration error', details: err.message });
    }
  }

  const { data, error } = await supabase.from('payments').insert([{ sale_id: saleId, amount, method }]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// List all payments
exports.getAllPayments = async (req, res) => {
  const { data, error } = await supabase.from('payments').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
