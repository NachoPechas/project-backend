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

        if (!item || item.status !== 'Disponible') {
            const error = new Error('El ejemplar del libro no esta disponible para prestamo.');
            error.status = 400;
            throw error;
        }

        const fechaHoy = new Date();
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaHoy.getDate() + 8);

        const loanData = {
            userId,
            itemId,
            loanDate: fechaHoy,
            dueDate: fechaVencimiento,
            returnDate: null,
            initialCondition: item.physicalCondition || 'Excelente',
        };

        const nuevoPrestamo = await loanRepository.create(loanData);

        await itemRepository.update(itemId, { status: 'Prestado' });

        return nuevoPrestamo;
    }
}

module.exports = new LoanService();
