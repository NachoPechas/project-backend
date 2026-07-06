const bookService = require('../services/bookService');

class BookController {
    async getBooks(req, res) {
        try {
            const { title, author, category } = req.query;
            const books = await bookService.searchCatalog({ title, author, category });

            return res.status(200).json({
                success: true,
                count: books.length,
                data: books
            });
        } catch (error) {
            console.error(`[BookController][getBooks] Error: ${error.message}`, error);
            
            return res.status(500).json({
                success: false,
                message: 'No se pudo procesar la solicitud en este momento.'
            });
        }
    }
}

module.exports = new BookController();