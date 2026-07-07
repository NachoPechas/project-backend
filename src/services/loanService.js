const loanRepository = require('../repositories/loanRepository');
const itemRepository = require('../repositories/itemRepository');

class LoanService {
    /**
     * Registra el prestamo de un ejemplar a un usuario.
     * @param {number} userId
     * @param {number} itemId
     */
    async rentBook(userId, itemId) {
        const item = await itemRepository.findById(itemId);

        if (!item || item.availability_status !== 'Disponible') {
            const error = new Error('El ejemplar del libro no esta disponible para prestamo.');
            error.status = 400;
            throw error;
        }

        const fechaHoy = new Date();
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaHoy.getDate() + 8);

        const loanData = {
            user_id: userId,
            item_id: itemId,
            loan_date: fechaHoy,
            due_date: fechaVencimiento,
            return_date: null,
            initial_condition: item.physical_condition || 'Excelente',
        };

        const nuevoPrestamo = await loanRepository.create(loanData);

        await itemRepository.update(itemId, { availability_status: 'Prestado' });

        return nuevoPrestamo;
    }

    async getUserLoanHistory(userId) {
        if (!userId) {
            const error = new Error('El ID de usuario es obligatorio.');
            error.status = 400;
            throw error;
        }
        return await loanRepository.findByUserId(userId);
    }
}

module.exports = new LoanService();