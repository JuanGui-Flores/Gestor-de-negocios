const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./src/routes/productRoutes');
const proveedorRoutes = require('./src/routes/proveedorRoutes');
const repuestoRoutes = require('./src/routes/repuestoRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');
const reporteRoutes = require('./src/routes/reporteRoutes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas de la API (usando las variables importadas correctamente)
app.use('/api/productos', productRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/repuestos', repuestoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API del Sistema de Control de Stock de Repuestos de Motos funcionando 🚀' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});