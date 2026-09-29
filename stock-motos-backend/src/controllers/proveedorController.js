const pool = require('../config/db');

// Listar todos los proveedores
const obtenerProveedores = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM proveedores ORDER BY id_proveedor ASC');
        res.status(200).json({
            success: true,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Crear un proveedor
const crearProveedor = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Debes proporcionar los datos del proveedor en el cuerpo de la petición'
        });
    }

    const { nombre_empresa, contacto, telefono, email, direccion } = req.body;

    if (!nombre_empresa) {
        return res.status(400).json({
            success: false,
            error: 'El campo nombre_empresa es obligatorio'
        });
    }

    try {
        const query = `
            INSERT INTO proveedores (nombre_empresa, contacto, telefono, email, direccion)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const valores = [nombre_empresa, contacto, telefono, email, direccion];
        const resultado = await pool.query(query, valores);

        res.status(201).json({
            success: true,
            message: 'Proveedor registrado con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Actualizar un proveedor
const actualizarProveedor = async (req, res) => {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Debes proporcionar los datos a actualizar en el cuerpo de la petición'
        });
    }

    const { nombre_empresa, contacto, telefono, email, direccion } = req.body;

    if (!nombre_empresa) {
        return res.status(400).json({
            success: false,
            error: 'El campo nombre_empresa es obligatorio'
        });
    }

    try {
        const query = `
            UPDATE proveedores 
            SET nombre_empresa = $1, contacto = $2, telefono = $3, email = $4, direccion = $5
            WHERE id_proveedor = $6
            RETURNING *;
        `;
        const valores = [nombre_empresa, contacto, telefono, email, direccion, id];
        const resultado = await pool.query(query, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Proveedor no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Proveedor actualizado con éxito',
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Eliminar un proveedor
const eliminarProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM proveedores WHERE id_proveedor = $1 RETURNING *', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Proveedor no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Proveedor eliminado exitosamente',
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};



module.exports = {
    obtenerProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};