const loanRepository = require('../repositories/loanRepository');
const itemRepository = require('../repositories/itemRepository');

class LoanService {
    isAvailableStatus(status) {
        const normalizedStatus = String(status || '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        return normalizedStatus.includes('disponible') || normalizedStatus.includes('available');
    }

    




    async rentBook(userId, itemId) {
        const item = await itemRepository.findById(itemId);

        if (!item || !this.isAvailableStatus(item.status)) {
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

    async getUserLoanHistory(userId, filters = {}) {
        if (!userId) {
            const error = new Error('El ID de usuario es obligatorio.');
            error.status = 400;
            throw error;
        }

        const type = filters.type || 'all';
        const history = [];

        if (type === 'all' || type === 'loans') {
            const loans = await loanRepository.findLoansByUserId(userId, filters);
            history.push(...loans.map((loan) => ({
                type: 'loan',
                date: loan.loanDate,
                data: loan,
            })));
        }

        if (type === 'all' || type === 'reservations') {
            const reservations = await loanRepository.findReservationsByUserId(userId, filters);
            history.push(...reservations.map((reservation) => ({
                type: 'reservation',
                date: reservation.reservationDate,
                data: reservation,
            })));
        }

        return history.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }
}

module.exports = new LoanService();
