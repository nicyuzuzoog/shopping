const Item = require('../models/Item');

const getItems = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    const items = await Item.find(query).sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const { title, category, serialNumbers, importCostRWF, sellingPriceRWF, stockQuantity, imageUrl, lowStockThreshold } = req.body;
    if (!title || !category || importCostRWF == null || sellingPriceRWF == null) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    const item = await Item.create({
      title,
      category,
      serialNumbers: serialNumbers || [],
      importCostRWF,
      sellingPriceRWF,
      stockQuantity: stockQuantity || 0,
      imageUrl: imageUrl || '',
      lowStockThreshold: lowStockThreshold || 2,
    });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await Item.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Item deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
