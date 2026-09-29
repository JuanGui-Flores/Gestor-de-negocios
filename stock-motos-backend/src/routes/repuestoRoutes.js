const express = require('express');
const router = express.Router();
const {
    obtenerRepuestos,
    obtenerAlertasStock,
    buscarRepuesto,
    crearRepuesto,
    actualizarRepuesto,
    eliminarRepuesto
} = require('../controllers/repuestoController');

// Rutas de alertas y búsqueda (deben ir arriba de las rutas con :id para evitar conflictos)
router.get('/alertas/stock-bajo', obtenerAlertasStock);
router.get('/buscar/:termino', buscarRepuesto);

// Rutas base CRUD
router.get('/', obtenerRepuestos);
router.post('/', crearRepuesto);
router.put('/:id', actualizarRepuesto);
router.delete('/:id', eliminarRepuesto);

module.exports = router;