# Backend for POS System

Production-ready backend for a Kenyan networking gadget shop POS system.

- Node.js + Express
- Supabase database
- M-Pesa Daraja API integration

## Features
- Product CRUD
- Stock decrement on sale
- Cashier open/close
- Low stock alert

## Setup
1. Install dependencies: `npm install`
2. Configure environment variables (see .env.example)
3. Run the server: `npm start`

---

## Folder Structure
- `/src` - Main source code
- `/src/routes` - Express routes
- `/src/controllers` - Business logic
- `/src/models` - Data models
- `/src/utils` - Utility functions

---

## To Do
- Connect to Supabase
- Integrate M-Pesa Daraja API
- Implement all endpoints
