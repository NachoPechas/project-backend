const { Op } = require('sequelize');
const { Loan, Item, Book, Penalty, SeatReservation, StudySeat } = require('../models');

function buildDateFilter(from, to) {
    const filter = {};

    if (from || to) {
        filter[Op.and] = [];

        if (from) {
            filter[Op.and].push({
                [Op.or]: [
                    { loanDate: { [Op.gte]: from } },
                    { reservationDate: { [Op.gte]: from } },
                ],
            });
        }

        if (to) {
            filter[Op.and].push({
                [Op.or]: [
                    { loanDate: { [Op.lte]: to } },
                    { reservationDate: { [Op.lte]: to } },
                ],
            });
        }
    }

    return filter;
}

class LoanRepository {
    async create(loanData) {
        return Loan.create(loanData);
    }

    async findLoansByUserId(userId, filters = {}) {
        const where = { userId };

        if (filters.from || filters.to) {
            where.loanDate = {};
            if (filters.from) where.loanDate[Op.gte] = filters.from;
            if (filters.to) where.loanDate[Op.lte] = filters.to;
        }

        return Loan.findAll({
            where,
            order: [['loanDate', 'DESC'], ['id', 'DESC']],
            include: [
                {
                    model: Item,
                    as: 'item',
                    attributes: ['id', 'description', 'status', 'physicalCondition'],
                    include: [
                        {
                            model: Book,
                            as: 'book',
                            attributes: ['id', 'title', 'author', 'category'],
                        },
                    ],
                },
                {
                    model: Penalty,
                    as: 'penalties',
                    attributes: ['id', 'amount', 'reason', 'status', 'createdDate'],
                },
            ],
        });
    }

    async findReservationsByUserId(userId, filters = {}) {
        const where = { userId };

        if (filters.from || filters.to) {
            where.reservationDate = {};
            if (filters.from) where.reservationDate[Op.gte] = filters.from;
            if (filters.to) where.reservationDate[Op.lte] = filters.to;
        }

        return SeatReservation.findAll({
            where,
            order: [['reservationDate', 'DESC'], ['id', 'DESC']],
            include: [
                {
                    model: StudySeat,
                    as: 'seat',
                    attributes: ['id', 'status', 'location_details', 'computers'],
                },
            ],
        });
    }
}

module.exports = new LoanRepository();
