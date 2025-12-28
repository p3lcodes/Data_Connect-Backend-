const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
console.log('Looking for .env at:', envPath);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  console.log('.env file contents:\n', envContent);
} else {
  console.log('.env file NOT FOUND');
}
