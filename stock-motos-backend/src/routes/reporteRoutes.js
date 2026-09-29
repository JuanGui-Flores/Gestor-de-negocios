const express = require('express');
const router = express.Router();
const { 
    obtenerDashboard, 
    obtenerVentasReporte, 
    obtenerTopRepuestos 
} = require('../controllers/reporteController');

router.get('/dashboard', obtenerDashboard);
router.get('/ventas', obtenerVentasReporte);
router.get('/top-repuestos', obtenerTopRepuestos);

module.exports = router;