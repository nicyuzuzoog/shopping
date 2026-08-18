const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Item = require('./models/Item');

const MONGODB_URI = process.env.MONGODB_URI;

const users = [
  { name: 'Admin KNAX', phone: '0780000001', password: 'admin123', role: 'admin' },
  { name: 'Jean Niyonzima', phone: '0782562906', password: 'sales123', role: 'sales' },
  { name: 'Claude Mugisha', phone: '0783111222', password: 'sales123', role: 'sales' },
  { name: 'Alice Uwimana', phone: '0784333444', password: 'sales123', role: 'sales' },
];

const items = [
  {
    title: 'Dell Latitude 5520',
    category: 'laptop',
    serialNumbers: ['DLT5520-001', 'DLT5520-002', 'DLT5520-003'],
    importCostRWF: 450000,
    sellingPriceRWF: 650000,
    stockQuantity: 3,
    lowStockThreshold: 2,
  },
  {
    title: 'HP ProBook 450 G9',
    category: 'laptop',
    serialNumbers: ['HP450G9-001', 'HP450G9-002'],
    importCostRWF: 380000,
    sellingPriceRWF: 550000,
    stockQuantity: 2,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo ThinkPad E14 Gen 5',
    category: 'laptop',
    serialNumbers: ['LNE14-001', 'LNE14-002', 'LNE14-003', 'LNE14-004'],
    importCostRWF: 420000,
    sellingPriceRWF: 600000,
    stockQuantity: 4,
    lowStockThreshold: 2,
  },
  {
    title: 'ASUS VivoBook 15',
    category: 'laptop',
    serialNumbers: ['ASUVB15-001'],
    importCostRWF: 300000,
    sellingPriceRWF: 430000,
    stockQuantity: 1,
    lowStockThreshold: 2,
  },
  {
    title: 'Dell OptiPlex 7010 SFF',
    category: 'desktop',
    serialNumbers: ['DOP7010-001', 'DOP7010-002'],
    importCostRWF: 350000,
    sellingPriceRWF: 500000,
    stockQuantity: 2,
    lowStockThreshold: 2,
  },
  {
    title: 'HP ProDesk 400 G7',
    category: 'desktop',
    serialNumbers: ['HP400G7-001', 'HP400G7-002', 'HP400G7-003'],
    importCostRWF: 280000,
    sellingPriceRWF: 400000,
    stockQuantity: 3,
    lowStockThreshold: 2,
  },
  {
    title: 'Dell P2422H 24" Monitor',
    category: 'monitor',
    serialNumbers: ['DELL24H-001', 'DELL24H-002'],
    importCostRWF: 180000,
    sellingPriceRWF: 260000,
    stockQuantity: 2,
    lowStockThreshold: 2,
  },
  {
    title: 'HP E243m 24" Monitor',
    category: 'monitor',
    serialNumbers: ['HPE243-001', 'HPE243-002', 'HPE243-003'],
    importCostRWF: 150000,
    sellingPriceRWF: 220000,
    stockQuantity: 3,
    lowStockThreshold: 2,
  },
  {
    title: 'Samsung 27" Curved Monitor',
    category: 'monitor',
    serialNumbers: ['SAM27C-001'],
    importCostRWF: 200000,
    sellingPriceRWF: 290000,
    stockQuantity: 1,
    lowStockThreshold: 2,
  },
  {
    title: 'Logitech MK270 Keyboard & Mouse',
    category: 'accessory',
    serialNumbers: ['LOGMK270-001', 'LOGMK270-002', 'LOGMK270-003', 'LOGMK270-004', 'LOGMK270-005'],
    importCostRWF: 15000,
    sellingPriceRWF: 25000,
    stockQuantity: 5,
    lowStockThreshold: 3,
  },
  {
    title: 'Kingston 256GB SSD',
    category: 'accessory',
    serialNumbers: ['KNG256-001', 'KNG256-002', 'KNG256-003'],
    importCostRWF: 30000,
    sellingPriceRWF: 45000,
    stockQuantity: 3,
    lowStockThreshold: 2,
  },
  {
    title: 'Toshiba 1TB External HDD',
    category: 'accessory',
    serialNumbers: ['TOSH1TB-001', 'TOSH1TB-002'],
    importCostRWF: 35000,
    sellingPriceRWF: 55000,
    stockQuantity: 2,
    lowStockThreshold: 2,
  },
  {
    title: 'USB-C Hub 7-in-1',
    category: 'accessory',
    serialNumbers: ['USB7IN1-001', 'USB7IN1-002', 'USB7IN1-003'],
    importCostRWF: 12000,
    sellingPriceRWF: 20000,
    stockQuantity: 3,
    lowStockThreshold: 2,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    try {
      await mongoose.connection.db.collection('users').dropIndex('email_1');
      console.log('Dropped old email_1 index');
    } catch (e) {
      // index may not exist, ignore
    }

    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');

    for (const u of users) {
      u.password = await bcrypt.hash(u.password, 10);
    }
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    const createdItems = await Item.insertMany(items);
    console.log(`Created ${createdItems.length} items`);

    console.log('\n========================================');
    console.log('  KNAX-POS SEED COMPLETE');
    console.log('========================================\n');
    console.log('LOGIN CREDENTIALS:');
    console.log('----------------------------------------');
    console.log('| Phone       | Password  | Role      |');
    console.log('|-------------|-----------|-----------|');
    console.log('| 0780000001  | admin123  | admin     |');
    console.log('| 0782562906  | sales123  | sales     |');
    console.log('| 0783111222  | sales123  | sales     |');
    console.log('| 0784333444  | sales123  | sales     |');
    console.log('----------------------------------------\n');
    console.log('2-STEP LOGIN FLOW:');
    console.log('  Step 1 -> Enter phone number');
    console.log('  Step 2 -> Enter password\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
