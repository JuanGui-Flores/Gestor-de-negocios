const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerVentas, eliminarVenta } = require('../controllers/ventaController');

router.post('/', registrarVenta);
router.get('/', obtenerVentas);
router.delete('/:id', eliminarVenta);

module.exports = router;