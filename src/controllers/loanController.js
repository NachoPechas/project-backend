const loanService = require('../services/loanService');

class LoanController {
    /**
     * Rentar un libro
     * POST /api/loans/rent
     */
    async rentBook(req, res) {
        try {
            const userId = req.user.id;
            const { itemId } = req.body;

            if (!itemId) {
                return res.status(400).json({ success: false, message: 'El itemId es obligatorio.' });
            }

            const nuevoPrestamo = await loanService.rentBook(userId, itemId);

            return res.status(201).json({
                success: true,
                message: '¡Préstamo registrado exitosamente! Tienes 8 días para devolverlo.',
                data: nuevoPrestamo
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Error al procesar el préstamo.'
            });
        }
    }

    async getMyHistory(req, res) {
        try {
            const userId = req.user.id; 
            const historial = await loanService.getUserLoanHistory(userId);

            return res.status(200).json({
                success: true,
                count: historial.length,
                data: historial
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Error al recuperar el historial.'
            });
        }
    }
}

module.exports = new LoanController();