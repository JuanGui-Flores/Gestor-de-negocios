const pool = require('../config/db');

// 1. Registrar una nueva venta y descontar stock automáticamente
const registrarVenta = async (req, res) => {
    const { metodo_pago, detalles } = req.body; 

    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Debes incluir al menos un repuesto en la venta'
        });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let totalVenta = 0;
        const itemsAInsertar = [];

        // Validar existencia y stock de cada repuesto
        for (const item of detalles) {
            const { id_repuesto, cantidad } = item;

            if (!id_repuesto || !cantidad || cantidad <= 0) {
                throw new Error('Cada ítem debe tener id_repuesto y una cantidad mayor a 0');
            }

            const repuestoQuery = await client.query(
                'SELECT id_repuesto, nombre, precio_venta, stock_actual FROM repuestos WHERE id_repuesto = $1',
                [id_repuesto]
            );

            if (repuestoQuery.rows.length === 0) {
                throw new Error(`El repuesto con ID ${id_repuesto} no existe`);
            }

            const repuesto = repuestoQuery.rows[0];

            if (repuesto.stock_actual < cantidad) {
                throw new Error(`Stock insuficiente para "${repuesto.nombre}". Disponible: ${repuesto.stock_actual}, Solicitado: ${cantidad}`);
            }

            const subtotal = Number(repuesto.precio_venta) * cantidad;
            totalVenta += subtotal;

            itemsAInsertar.push({
                id_repuesto: repuesto.id_repuesto,
                cantidad,
                precio_unitario: repuesto.precio_venta,
                subtotal
            });
        }

        // Insertar registro en 'ventas'
        const ventaResult = await client.query(
            'INSERT INTO ventas (total, metodo_pago) VALUES ($1, $2) RETURNING *',
            [totalVenta, metodo_pago || 'efectivo']
        );
        const idVenta = ventaResult.rows[0].id_venta;

        // Insertar detalles y descontar del 'stock_actual'
        for (const item of itemsAInsertar) {
            await client.query(
                'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                [idVenta, item.id_repuesto, item.cantidad, item.precio_unitario, item.subtotal]
            );

            await client.query(
                'UPDATE repuestos SET stock_actual = stock_actual - $1 WHERE id_repuesto = $2',
                [item.cantidad, item.id_repuesto]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'Venta registrada con éxito y stock actualizado',
            data: {
                id_venta: idVenta,
                total: totalVenta,
                metodo_pago: metodo_pago || 'efectivo',
                detalles: itemsAInsertar
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al registrar venta:', error.message);
        res.status(400).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
};

// 2. Listar todas las ventas con sus detalles
const obtenerVentas = async (req, res) => {
    try {
        const query = `
            SELECT v.*, 
                   JSON_AGG(
                       JSON_BUILD_OBJECT(
                           'id_detalle', dv.id_detalle_venta,
                           'id_repuesto', dv.id_producto,
                           'nombre', r.nombre,
                           'cantidad', dv.cantidad,
                           'precio_unitario', dv.precio_unitario,
                           'subtotal', dv.subtotal
                       )
                   ) AS detalles
            FROM ventas v
            LEFT JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
            LEFT JOIN repuestos r ON dv.id_producto = r.id_repuesto
            GROUP BY v.id_venta
            ORDER BY v.fecha_venta DESC;
        `;
        const resultado = await pool.query(query);
        res.status(200).json({ success: true, data: resultado.rows });
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Anular/Eliminar venta y reponer stock
const eliminarVenta = async (req, res) => {
    const { id } = req.params;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Verificar si la venta existe
        const ventaQuery = await client.query('SELECT * FROM ventas WHERE id_venta = $1', [id]);
        if (ventaQuery.rows.length === 0) {
            throw new Error(`La venta con ID ${id} no existe`);
        }

        // Obtener ítems vendidos para devolver al inventario
        const detallesQuery = await client.query(
            'SELECT id_producto, cantidad FROM detalle_ventas WHERE id_venta = $1',
            [id]
        );
        const detalles = detallesQuery.rows;

        // Devolver stock y auditoría en historial_stock
        for (const item of detalles) {
            const repuestoQuery = await client.query(
                'SELECT stock_actual FROM repuestos WHERE id_repuesto = $1',
                [item.id_producto]
            );

            if (repuestoQuery.rows.length > 0) {
                const stockAnterior = repuestoQuery.rows[0].stock_actual;
                const stockNuevo = stockAnterior + item.cantidad;

                // Reincorporar unidades al repuesto
                await client.query(
                    'UPDATE repuestos SET stock_actual = $1 WHERE id_repuesto = $2',
                    [stockNuevo, item.id_producto]
                );

                // Auditoría Kardex
                await client.query(
                    `INSERT INTO historial_stock (id_repuesto, tipo_movimiento, cantidad, stock_anterior, stock_nuevo, motivo)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        item.id_producto,
                        'ENTRADA',
                        item.cantidad,
                        stockAnterior,
                        stockNuevo,
                        `Devolución por anulación de venta #${id}`
                    ]
                );
            }
        }

        // Eliminar referencias y cabecera de la venta
        await client.query('DELETE FROM detalle_ventas WHERE id_venta = $1', [id]);
        await client.query('DELETE FROM ventas WHERE id_venta = $1', [id]);

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: `Venta #${id} anulada con éxito y stock repuesto correctamente.`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al anular venta:', error.message);
        res.status(400).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    registrarVenta,
    obtenerVentas,
    eliminarVenta
};