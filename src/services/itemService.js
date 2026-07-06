const itemRepository = require('../repositories/itemRepository');

class ItemService {
  async getStatusById(id) {
    const item = await itemRepository.findById(id);

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      description: item.description,
      physical_condition: item.physical_condition,
      availability_status: item.availability_status,
      disponible: item.availability_status === 'Disponible',
      book: item.book ? { title: item.book.title, author: item.book.author } : null
    };
  }
}

module.exports = new ItemService();