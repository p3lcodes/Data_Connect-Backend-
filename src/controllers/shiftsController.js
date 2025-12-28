const supabase = require('../utils/supabase');

// Open a cashier shift
exports.openShift = async (req, res) => {
  const { cashierId } = req.body;
  console.log('Opening shift for cashier:', cashierId);
  // Check if there's already an open shift for this cashier
  const { data: openShift, error: openError } = await supabase
    .from('shifts')
    .select('*')
    .eq('cashier_id', cashierId)
    .is('closed_at', null)
    .maybeSingle();
  if (openError) return res.status(400).json({ error: openError.message });
  if (openShift) return res.status(400).json({ error: 'Cashier already has an open shift' });
  // Open new shift
  const { data, error } = await supabase
    .from('shifts')
    .insert([{ cashier_id: cashierId, opened_at: new Date() }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// Close a cashier shift
exports.closeShift = async (req, res) => {
  const { shiftId } = req.body;
  console.log('Closing shift:', shiftId);
  // Check if shift exists and is open
  const { data: shift, error: fetchError } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', shiftId)
    .is('closed_at', null)
    .single();
  if (fetchError) return res.status(400).json({ error: fetchError.message });
  if (!shift) return res.status(404).json({ error: 'Shift not found or already closed' });
  // Close shift
  const { data, error } = await supabase
    .from('shifts')
    .update({ closed_at: new Date() })
    .eq('id', shiftId)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// List all open shifts
exports.getOpenShifts = async (req, res) => {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .is('closed_at', null);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// List all shifts
exports.getAllShifts = async (req, res) => {
  const { data, error } = await supabase
    .from('shifts')
    .select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
