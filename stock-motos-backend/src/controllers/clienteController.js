const pool = require('../db'); // Ajusta según tu configuración de conexión

// Listar todos los clientes o buscar por nombre/documento
const obtenerClientes = async (req, res) => {
    try {
        const { busqueda } = req.query;
        let query = "SELECT * FROM clientes";
        let params = [];

        if (busqueda) {
            query += " WHERE nombre ILIKE $1 OR documento ILIKE $1 OR telefono ILIKE $1";
            params.push(`%${busqueda}%`);
        }

        query += " ORDER BY id DESC";
        const resultado = await pool.query(query, params);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};

// Registrar un nuevo cliente
const crearCliente = async (req, res) => {
    const { nombre, telefono, email, direccion, documento, limite_credito } = req.body;
    try {
        const nuevoCliente = await pool.query(
            `INSERT INTO clientes (nombre, telefono, email, direccion, documento, limite_credito) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, telefono, email, direccion, documento, limite_credito || 0]
        );
        res.status(201).json({ message: 'Cliente registrado con éxito', cliente: nuevoCliente.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el cliente' });
    }
};

// Actualizar cliente
const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, email, direccion, documento, limite_credito } = req.body;
    try {
        const clienteActualizado = await pool.query(
            `UPDATE clientes 
             SET nombre = $1, telefono = $2, email = $3, direccion = $4, documento = $5, limite_credito = $6 
             WHERE id = $7 RETURNING *`,
            [nombre, telefono, email, direccion, documento, limite_credito, id]
        );
        res.json({ message: 'Cliente actualizado correctamente', cliente: clienteActualizado.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
};

module.exports = {
    obtenerClientes,
    crearCliente,
    actualizarCliente
};