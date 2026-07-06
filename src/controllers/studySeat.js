// src/controllers/studySeat.js
const { Op } = require('sequelize');
const StudySeat = require('../models/studySeat'); // Importación directa basada en tu árbol de directorios

const buscarPuestosEstudio = async (req, res) => {
    try {
        // Capturar los parámetros dinámicos desde la Query String (?details=...&status=...)
        const { details, status, computers } = req.query;
        const condiciones = {};

        // 1. Filtro por detalles de ubicación (Búsqueda parcial en 'location_details')
        if (details) {
            condiciones.location_details = {
                [Op.iLike]: `%${details}%`
            };
        }

        // 2. Filtro por estado del puesto ('status' exacto: 'Disponible', 'Ocupado', etc.)
        if (status) {
            condiciones.status = status;
        }

        // 3. Filtro por cantidad de computadoras ('computers')
        if (computers) {
            condiciones.computers = parseInt(computers, 10);
        }

        // Ejecutar consulta mapeando únicamente las columnas reales de la tabla
        const puestos = await StudySeat.findAll({
            where: condiciones,
            order: [['id', 'ASC']] // Mantiene un orden consistente por ID
        });

        // Respuesta en formato JSON idéntica a lo esperado por Angular
        return res.status(200).json({
            success: true,
            count: puestos.length,
            data: puestos
        });

    } catch (error) {
        console.error('Error al ejecutar la búsqueda avanzada de puestos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno en el servidor al procesar la búsqueda avanzada.',
            error: error.message
        });
    }
};

module.exports = {
    buscarPuestosEstudio
};