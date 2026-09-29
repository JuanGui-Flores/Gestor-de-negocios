const pool = require('../config/db');

// Listar todos los repuestos (incluyendo el nombre del proveedor)
const obtenerRepuestos = async (req, res) => {
    try {
        const query = `
            SELECT r.*, p.nombre_empresa AS proveedor_nombre 
            FROM repuestos r
            LEFT JOIN proveedores p ON r.id_proveedor = p.id_proveedor
            ORDER BY r.id_repuesto ASC;
        `;
        const resultado = await pool.query(query);
        res.status(200).json({
            success: true,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Error al obtener repuestos:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Obtener repuestos con stock bajo (Alertas)
const obtenerAlertasStock = async (req, res) => {
    try {
        const query = `
            SELECT r.*, p.nombre_empresa AS proveedor_nombre 
            FROM repuestos r
            LEFT JOIN proveedores p ON r.id_proveedor = p.id_proveedor
            WHERE r.stock_actual <= r.stock_minimo
            ORDER BY r.stock_actual ASC;
        `;
        const resultado = await pool.query(query);
        res.status(200).json({
            success: true,
            total_alertas: resultado.rows.length,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Error al obtener alertas de stock:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Buscar repuesto por código de barras o nombre usando parámetros de ruta
const buscarRepuesto = async (req, res) => {
    // Cambiamos req.query.q por req.params.termino (o el nombre que definas en la ruta)
    const { termino } = req.params;

    if (!termino) {
        return res.status(400).json({
            success: false,
            error: 'Debes proporcionar un término de búsqueda'
        });
    }

    try {
        const query = `
            SELECT r.*, p.nombre_empresa AS proveedor_nombre 
            FROM repuestos r
            LEFT JOIN proveedores p ON r.id_proveedor = p.id_proveedor
            WHERE r.codigo_barras = $1 OR r.nombre ILIKE $2
            ORDER BY r.id_repuesto ASC;
        `;
        // Usamos el término tanto para el código de barras exacto como con comodines para ILIKE
        const resultado = await pool.query(query, [termino, `%${termino}%`]);
        res.status(200).json({
            success: true,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Error al buscar repuesto:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const validarDatosRepuesto = (req) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return {
            ok: false,
            error: 'Debes proporcionar los datos del repuesto'
        };
    }

    if (!req.body.nombre) {
        return {
            ok: false,
            error: 'El campo nombre es obligatorio'
        };
    }

    return { ok: true };
};

const obtenerNumero = (valor, valorPorDefecto = 0) => {
    if (valor === undefined || valor === '') {
        return valorPorDefecto;
    }

    const numero = Number.parseFloat(valor);
    return Number.isNaN(numero) ? valorPorDefecto : numero;
};

const obtenerEntero = (valor, valorPorDefecto = 0) => {
    if (valor === undefined || valor === '') {
        return valorPorDefecto;
    }

    const numero = Number.parseInt(valor, 10);
    return Number.isNaN(numero) ? valorPorDefecto : numero;
};

const obtenerIdProveedor = (id_proveedor) => {
    if (!id_proveedor || id_proveedor === '') {
        return null;
    }

    const numero = Number.parseInt(id_proveedor, 10);
    return Number.isNaN(numero) ? null : numero;
};

// Crear un repuesto
const crearRepuesto = async (req, res) => {
    const validacion = validarDatosRepuesto(req);

    if (!validacion.ok) {
        return res.status(400).json({
            success: false,
            error: validacion.error
        });
    }

    const {
        codigo_barras,
        codigo_barra,
        nombre,
        descripcion,
        precio_compra,
        precio_costo,
        precio_venta,
        stock,
        stock_actual,
        stock_minimo,
        id_proveedor
    } = req.body;

    const codBarras = codigo_barras || codigo_barra || null;
    const pCompra = obtenerNumero(precio_compra, obtenerNumero(precio_costo, 0));
    const pVenta = obtenerNumero(precio_venta, 0);
    const cantStock = obtenerEntero(stock_actual, obtenerEntero(stock, 0));
    const cantMinima = obtenerEntero(stock_minimo, 5);
    const provId = obtenerIdProveedor(id_proveedor);

    try {
        const query = `
            INSERT INTO repuestos (codigo_barras, nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, id_proveedor)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const valores = [
            codBarras,
            nombre,
            descripcion || null,
            pCompra,
            pVenta,
            cantStock,
            cantMinima,
            provId
        ];

        const resultado = await pool.query(query, valores);

        res.status(201).json({
            success: true,
            message: 'Repuesto registrado con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al crear repuesto:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const resolveFirstDefinedValue = (...values) => {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }

    return null;
};

const parseFloatOrDefault = (value, fallback = 0) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
};

const parseIntOrDefault = (value, fallback = 0) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

// Actualizar un repuesto
const actualizarRepuesto = async (req, res) => {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Debes proporcionar los datos a actualizar'
        });
    }

    const {
        codigo_barras,
        codigo_barra,
        nombre,
        descripcion,
        precio_compra,
        precio_costo,
        precio_venta,
        stock,
        stock_actual,
        stock_minimo,
        id_proveedor
    } = req.body;

    const codBarras = resolveFirstDefinedValue(codigo_barras, codigo_barra);
    const pCompra = parseFloatOrDefault(resolveFirstDefinedValue(precio_compra, precio_costo), 0);
    const pVenta = parseFloatOrDefault(precio_venta, 0);
    const cantStock = parseIntOrDefault(resolveFirstDefinedValue(stock_actual, stock), 0);
    const cantMinima = parseIntOrDefault(stock_minimo, 5);
    const provId = resolveFirstDefinedValue(id_proveedor);

    try {
        const query = `
            UPDATE repuestos 
            SET codigo_barras = $1, nombre = $2, descripcion = $3, precio_compra = $4, 
                precio_venta = $5, stock_actual = $6, stock_minimo = $7, id_proveedor = $8
            WHERE id_repuesto = $9
            RETURNING *;
        `;
        const valores = [
            codBarras,
            nombre,
            descripcion || null,
            pCompra,
            pVenta,
            cantStock,
            cantMinima,
            provId,
            id
        ];

        const resultado = await pool.query(query, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Repuesto no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Repuesto actualizado con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar repuesto:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Eliminar un repuesto
const eliminarRepuesto = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM repuestos WHERE id_repuesto = $1 RETURNING *', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Repuesto no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Repuesto eliminado exitosamente',
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar repuesto:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    obtenerRepuestos,
    obtenerAlertasStock,
    buscarRepuesto,
    crearRepuesto,
    actualizarRepuesto,
    eliminarRepuesto
};