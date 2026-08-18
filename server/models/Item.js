const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['laptop', 'desktop', 'monitor', 'accessory'],
      required: [true, 'Category is required'],
    },
    serialNumbers: {
      type: [String],
      default: [],
    },
    importCostRWF: {
      type: Number,
      required: [true, 'Import cost is required'],
      min: 0,
    },
    sellingPriceRWF: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    lowStockThreshold: {
      type: Number,
      default: 2,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
