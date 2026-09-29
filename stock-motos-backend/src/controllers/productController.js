const pool = require('../config/db');

// 1. Obtener todos los productos (con opción de búsqueda)
const obtenerProductos = async (req, res) => {
    try {
        const { busqueda } = req.query;
        let query = `
            SELECT p.*, c.nombre AS categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        `;
        let params = [];

        if (busqueda) {
            query += ` WHERE p.nombre ILIKE $1 OR p.sku ILIKE $1 OR p.codigo_barras ILIKE $1`;
            params.push(`%${busqueda}%`);
        }

        query += ` ORDER BY p.id_producto DESC`;

        const resultado = await pool.query(query, params);
        res.status(200).json({ success: true, data: resultado.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Crear un nuevo producto
const crearProducto = async (req, res) => {
    const { 
        sku, codigo_barras, nombre, id_categoria, 
        ubicacion, stock_actual, stock_minimo, 
        stock_maximo, costo, precio_venta 
    } = req.body;

    try {
        const query = `
            INSERT INTO productos 
            (sku, codigo_barras, nombre, id_categoria, ubicacion, stock_actual, stock_minimo, stock_maximo, costo, precio_venta) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *;
        `;
        const values = [
            sku, codigo_barras, nombre, id_categoria, 
            ubicacion, stock_actual || 0, stock_minimo || 5, 
            stock_maximo || 50, costo || 0.00, precio_venta || 0.00
        ];

        const nuevoProducto = await pool.query(query, values);
        res.status(201).json({ 
            success: true, 
            message: 'Repuesto registrado con éxito', 
            data: nuevoProducto.rows[0] 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 3. Actualizar un producto existente
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { 
        sku, codigo_barras, nombre, id_categoria, 
        ubicacion, stock_actual, stock_minimo, 
        stock_maximo, costo, precio_venta 
    } = req.body;

    try {
        const query = `
            UPDATE productos 
            SET sku = $1, codigo_barras = $2, nombre = $3, id_categoria = $4, 
                ubicacion = $5, stock_actual = $6, stock_minimo = $7, 
                stock_maximo = $8, costo = $9, precio_venta = $10, 
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id_producto = $11
            RETURNING *;
        `;
        const values = [
            sku, codigo_barras, nombre, id_categoria || null, 
            ubicacion, stock_actual, stock_minimo, 
            stock_maximo, costo, precio_venta, id
        ];

        const resultado = await pool.query(query, values);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Repuesto no encontrado para actualizar' });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Repuesto actualizado con éxito', 
            data: resultado.rows[0] 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 4. Eliminar un producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM productos WHERE id_producto = $1 RETURNING *', [id]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Repuesto no encontrado para eliminar' });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Repuesto eliminado exitosamente', 
            data: resultado.rows[0] 
        });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ success: false, error: 'No se puede eliminar el repuesto porque tiene registros históricos asociados.' });
    }
};

module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};