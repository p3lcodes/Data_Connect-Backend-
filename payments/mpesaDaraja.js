// CommonJS wrapper for TypeScript M-Pesa Daraja module
const path = require('path');
require('dotenv').config();

// Import the compiled TypeScript module (assume transpiled to js if needed)
let MpesaDaraja, DarajaConfig;
try {
  // Try to import the TypeScript directly (if using ts-node or similar)
  ({ MpesaDaraja, DarajaConfig } = require('./mpesaDaraja'));
} catch (e) {
  // Fallback: try importing compiled JS (if built to dist/)
  ({ MpesaDaraja, DarajaConfig } = require('./mpesaDaraja.js'));
}

// Load credentials from environment variables
const darajaConfig = {
  consumerKey: process.env.DARAJA_CONSUMER_KEY,
  consumerSecret: process.env.DARAJA_CONSUMER_SECRET,
  shortCode: process.env.DARAJA_SHORTCODE || '',
  passkey: process.env.DARAJA_PASSKEY || '',
  initiatorPassword: process.env.DARAJA_INITIATOR_PASSWORD || '',
  certificatePath: process.env.DARAJA_CERT_PATH || path.join(__dirname, 'sandbox-cert.cer'),
  environment: process.env.DARAJA_ENV === 'production' ? 'production' : 'sandbox',
};

// Export a ready-to-use instance
const daraja = new MpesaDaraja(darajaConfig);
module.exports = { daraja, MpesaDaraja, DarajaConfig, darajaConfig };