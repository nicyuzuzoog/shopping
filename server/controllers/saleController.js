const Sale = require('../models/Sale');
const Item = require('../models/Item');

const createSale = async (req, res) => {
  try {
    const { itemsSold, totalAmountRWF, paymentMethod } = req.body;
    if (!itemsSold || itemsSold.length === 0) {
      return res.status(400).json({ message: 'No items in the sale' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    for (const item of itemsSold) {
      const dbItem = await Item.findById(item.itemId);
      if (!dbItem) {
        return res.status(404).json({ message: `Item not found: ${item.title}` });
      }
      if (dbItem.stockQuantity < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for ${dbItem.title}. Available: ${dbItem.stockQuantity}` });
      }
    }

    for (const item of itemsSold) {
      await Item.findByIdAndUpdate(item.itemId, {
        $inc: { stockQuantity: -item.qty },
      });
    }

    const sale = await Sale.create({
      itemsSold,
      totalAmountRWF,
      paymentMethod,
      soldBy: req.user._id,
    });

    const populatedSale = await Sale.findById(sale._id)
      .populate('soldBy', 'name phone')
      .populate('itemsSold.itemId', 'title serialNumbers');

    return res.status(201).json(populatedSale);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSales = async (req, res) => {
  try {
    const { date, page = 1, limit = 50 } = req.query;
    let query = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.createdAt = { $gte: start, $lt: end };
    }
    const sales = await Sale.find(query)
      .populate('soldBy', 'name phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Sale.countDocuments(query);
    return res.json({ sales, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const { date } = req.query;
    let dateFilter = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      dateFilter = { createdAt: { $gte: start, $lt: end } };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateFilter = { createdAt: { $gte: today, $lt: tomorrow } };
    }

    const sales = await Sale.find(dateFilter).populate('soldBy', 'name');
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmountRWF, 0);

    let totalProfit = 0;
    for (const sale of sales) {
      for (const item of sale.itemsSold) {
        const dbItem = await Item.findById(item.itemId);
        if (dbItem) {
          totalProfit += (item.sellingPriceRWF - dbItem.importCostRWF) * item.qty;
        }
      }
    }

    const totalTransactions = sales.length;
    const totalItemsSold = sales.reduce(
      (sum, sale) => sum + sale.itemsSold.reduce((s, i) => s + i.qty, 0),
      0
    );

    return res.json({
      totalRevenue,
      totalProfit,
      totalTransactions,
      totalItemsSold,
      sales,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createSale, getSales, getDashboardSummary };
