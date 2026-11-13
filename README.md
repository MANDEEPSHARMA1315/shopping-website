# Online Fashion Shopping Website 🛍️👗👠

A complete, modern, responsive full-stack Online Fashion Shopping application built with **React.js**, **Node.js**, **Express.js**, **Bootstrap 5**, and **MongoDB**.

---

## 🚀 Quick Start (Run Both Frontend & Backend Together)

From the root project directory:

```bash
# 1. Install dependencies
npm install

# 2. Run both Backend & Frontend together with one command
npm run dev
# OR
npm start
```

This will automatically launch:
- **Express Backend REST API**: `http://localhost:5000`
- **Vite React Frontend Web App**: `http://localhost:5173`

---

## 🔐 Demo Credentials

Quick-fill demo buttons are provided on the Login page for convenience:

- **Customer Account**: Email: `user@fashion.com` | Password: `user123`
- **Admin Account**: Email: `admin@fashion.com` | Password: `admin123`

---

## 📁 Project Structure

```
shopping website/
├── package.json               # Root config for concurrent execution
├── README.md
├── backend/                   # Node.js + Express API & Mongoose models
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/                  # Vite + React.js + Bootstrap UI
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    └── package.json
```
