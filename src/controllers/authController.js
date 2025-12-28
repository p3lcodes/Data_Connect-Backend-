const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const supabase = require('../utils/supabase');

// Register a new user (admin only)
exports.register = async (req, res) => {
  const { name, email, password, pin, role } = req.body;
  if (!name || !role || (!pin && !password)) {
    return res.status(400).json({ error: 'Name, role, and PIN or password required' });
  }
  if (!['admin', 'manager', 'cashier'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  let password_hash = null;
  if (password) password_hash = await bcrypt.hash(password, 10);
  let pinHash = null;
  if (pin) pinHash = await bcrypt.hash(pin, 10);
  const { data, error } = await supabase.from('users').insert([
    { name, email, password_hash, pin: pinHash, role }
  ]).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ id: data.id, name: data.name, email: data.email, role: data.role });
};

// Login with email/password or PIN
exports.login = async (req, res) => {
  const { email, password, pin } = req.body;
  let user = null;
  if (email && password) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, data.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    user = data;
  } else if (pin) {
    const { data, error } = await supabase.from('users').select('*').eq('pin', pin).single();
    if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });
    user = data;
  } else {
    return res.status(400).json({ error: 'Email/password or PIN required' });
  }
  // Issue JWT
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

// Middleware: require role
exports.requireRole = (roles) => (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (!roles.includes(payload.role)) return res.status(403).json({ error: 'Forbidden' });
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
