const express = require('express');
const router = express.Router();

const { 
    obtenerProductos, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto 
} = require('../controllers/productController');

// GET /api/productos - Listar / Buscar productos
router.get('/', obtenerProductos);

// POST /api/productos - Crear un producto
router.post('/', crearProducto);

// PUT /api/productos/:id - Actualizar un producto existente
router.put('/:id', actualizarProducto);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', eliminarProducto);

module.exports = router;