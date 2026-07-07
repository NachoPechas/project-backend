const penaltyRepository = require('../repositories/penaltyRepository');

class PenaltyController {
    async getAllPenalties(req, res) {
        try {
            const penalizaciones = await penaltyRepository.findAllPenalties();

            return res.status(200).json({
                success: true,
                count: penalizaciones.length,
                data: penalizaciones
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || 'Error al recuperar las penalizaciones.'
            });
        }
    }
}

module.exports = new PenaltyController();