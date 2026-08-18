const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  title: { type: String, required: true },
  serialNumber: { type: String, default: '' },
  qty: { type: Number, required: true, min: 1 },
  sellingPriceRWF: { type: Number, required: true },
});

const saleSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      unique: true,
    },
    itemsSold: [saleItemSchema],
    totalAmountRWF: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['MoMo Pay', 'Cash', 'Bank Transfer'],
      required: [true, 'Payment method is required'],
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

saleSchema.pre('save', async function (next) {
  if (this.isNew && !this.receiptNumber) {
    const Sale = mongoose.model('Sale');
    const count = await Sale.countDocuments();
    this.receiptNumber = `#KNAX-${1001 + count}`;
  }
  next();
});

module.exports = mongoose.model('Sale', saleSchema);
