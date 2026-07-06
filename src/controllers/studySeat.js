const { Op } = require('sequelize');
const StudySeat = require('../models/studySeat'); 
const buscarPuestosEstudio = async (req, res) => {
    try {
        
        const { details, status, computers } = req.query;
        const condiciones = {};

      
        if (details) {
            condiciones.location_details = {
                [Op.iLike]: `%${details}%`
            };
        }

       
        if (status) {
            condiciones.status = status;
        }

      
        if (computers) {
            condiciones.computers = parseInt(computers, 10);
        }

       
        const puestos = await StudySeat.findAll({
            where: condiciones,
            order: [['id', 'ASC']]
        });

        
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