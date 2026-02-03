const express = require('express');
const cors = require('cors');

const cloudRoutes = require('./Routes/routesCloud');
const orderRooute = require('./Routes/routesOrders');
const clipPagoRoutes = require('./Routes/routesClip');

const app = express();

// const whitelist = [
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'https://jade-jelly-bba4f6.netlify.app',
//   'https://toy-pulsemx.store'
// ];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman o server-side

    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // Permitir cualquier dominio en producción
    if (process.env.NODE_ENV === "production") {
      return callback(null, true);
    }

    return callback(new Error('CORS no permitido por el servidor'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ FIX para Express 5+
app.options(/.*/, cors());

app.use(express.json());

app.use('/api', clipPagoRoutes);
app.use('/api', cloudRoutes);
app.use('/api', orderRooute);

module.exports = app;
