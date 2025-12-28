const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// Open cashier session
router.post('/open', async (req, res) => {
  const { cashierId } = req.body;
  const { data, error } = await supabase.from('cashier_sessions').insert([{ cashier_id: cashierId, opened_at: new Date(), closed_at: null }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// Close cashier session
router.post('/close', async (req, res) => {
  const { sessionId } = req.body;
  const { data, error } = await supabase.from('cashier_sessions').update({ closed_at: new Date() }).eq('id', sessionId).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// List open sessions
router.get('/open', async (req, res) => {
  const { data, error } = await supabase.from('cashier_sessions').select('*').is('closed_at', null);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
