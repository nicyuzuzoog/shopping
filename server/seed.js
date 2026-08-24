const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Item = require('./models/Item');

const MONGODB_URI = process.env.MONGODB_URI;

const sn = (prefix, qty) =>
  Array.from({ length: qty }, (_, i) => `${prefix}-${String(i + 1).padStart(3, '0')}`);

const users = [
  { name: 'KNAX CEO', phone: '0782562906', password: 'knax250boss', role: 'admin' },
  { name: 'Mimi KNAX', phone: '0788259863', password: 'mimiknax250', role: 'sales' },
  { name: 'Mat Teta', phone: '0790047838', password: 'matteta', role: 'sales' },
  { name: 'Jado Max KNAX', phone: '0786436369', password: 'jadomaxknax', role: 'sales' },
];

// ---------- LAPTOPS ----------
const IMG_HP_LAPTOP = '/images/laptop-hp.jpg';
const IMG_LENOVO_LAPTOP = '/images/laptop-lenovo.jpg';
const IMG_DELL_LAPTOP = '/images/laptop-dell.jpg';
const IMG_GENERIC_LAPTOP = '/images/laptop-generic.jpg';
// ---------- DESKTOPS ----------
const IMG_HP_DESKTOP = '/images/desktop-hp.jpg';
const IMG_LENOVO_DESKTOP = '/images/desktop-lenovo.jpg';
const IMG_AIO = '/images/allinone-hp.jpg';
// ---------- MONITORS ----------
const IMG_MON_19 = '/images/monitor-19.jpg';
const IMG_MON_22 = '/images/monitor-22.jpg';
const IMG_MON_24 = '/images/monitor-24.jpg';

const items = [
  // ================= LAPTOPS =================
  {
    title: 'HP Envy x360 | i7 11th Gen | Touchscreen',
    category: 'laptop',
    description: 'Core i7 11th Gen | 512GB SSD | 8GB RAM | Touchscreen | x360 rotation | Lighting keyboard | Intel Iris Xe Graphics',
    serialNumbers: sn('KX-HPX360', 3),
    importCostRWF: 520000,
    sellingPriceRWF: 650000,
    stockQuantity: 3,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo V14 G5 IRL | i7 14th Gen',
    category: 'laptop',
    description: 'Intel Core i7 14th Gen | 512GB SSD | 8GB DDR5 RAM | 16 Logical Processors',
    serialNumbers: sn('KX-LNV14I7', 1),
    importCostRWF: 320000,
    sellingPriceRWF: 400000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP EliteBook 840 G4 | i7 8th Gen',
    category: 'laptop',
    description: 'Core i7 8th Gen | 256GB SSD + 500GB HDD | 16GB RAM | Lightning keyboard',
    serialNumbers: sn('KX-840G4A', 1),
    importCostRWF: 288000,
    sellingPriceRWF: 360000,
    stockQuantity: 1,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP EliteBook 840 G4 | i7 7th Gen | Touchscreen',
    category: 'laptop',
    description: 'Core i7 7th Gen | Touchscreen | 256GB SSD | 8GB RAM | Lightning keyboard',
    serialNumbers: sn('KX-840G4B', 1),
    importCostRWF: 280000,
    sellingPriceRWF: 350000,
    stockQuantity: 1,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP EliteBook 840 G3 | i7 7th Gen',
    category: 'laptop',
    description: 'Core i7 7th Gen | 256GB SSD | 8GB RAM | Lightning keyboard',
    serialNumbers: sn('KX-840G3I7', 4),
    importCostRWF: 272000,
    sellingPriceRWF: 340000,
    stockQuantity: 4,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo V14 G5 IRL | i5 14th Gen',
    category: 'laptop',
    description: 'Intel Core i5 14th Gen | 512GB SSD | 8GB DDR5 RAM',
    serialNumbers: sn('KX-LNV14I5', 3),
    importCostRWF: 280000,
    sellingPriceRWF: 350000,
    stockQuantity: 3,
    imageUrl: IMG_LENOVO_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP EliteBook 840 G6 | i5 8th Gen',
    category: 'laptop',
    description: 'Intel Core i5 8th Gen | Lighting keyboard | 256GB SSD | 8GB RAM',
    serialNumbers: sn('KX-840G6', 1),
    importCostRWF: 280000,
    sellingPriceRWF: 350000,
    stockQuantity: 1,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Dell Latitude 7480 | i5 6th Gen | Touchscreen',
    category: 'laptop',
    description: 'Intel Core i5 6th Gen | Touchscreen | Lighting keyboard | 256GB SSD | 8GB RAM',
    serialNumbers: sn('KX-D7480', 2),
    importCostRWF: 280000,
    sellingPriceRWF: 350000,
    stockQuantity: 2,
    imageUrl: IMG_DELL_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP EliteBook 840 G4 | i5 7th Gen | Touchscreen',
    category: 'laptop',
    description: 'Intel Core i5 7th Gen | Touch screen | Lighting keyboard | 256GB SSD | 8GB RAM',
    serialNumbers: sn('KX-840G4C', 1),
    importCostRWF: 264000,
    sellingPriceRWF: 330000,
    stockQuantity: 1,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP EliteBook 840 G3 | i5 6th Gen',
    category: 'laptop',
    description: 'Core i5 6th Gen | 256GB SSD | 8GB RAM | Lighting keyboard',
    serialNumbers: sn('KX-840G3I5', 2),
    importCostRWF: 256000,
    sellingPriceRWF: 320000,
    stockQuantity: 2,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo V14 G5 IRL | i3 12th Gen',
    category: 'laptop',
    description: 'Intel Core i3 12th Gen | 512GB SSD | 4GB RAM',
    serialNumbers: sn('KX-LNV14I3', 1),
    importCostRWF: 240000,
    sellingPriceRWF: 300000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Dell Latitude 3190 2-in-1 | Pentium',
    category: 'laptop',
    description: 'Pentium | 128GB SSD | 8GB RAM | 2-in-1 convertible',
    serialNumbers: sn('KX-D3190', 1),
    importCostRWF: 176000,
    sellingPriceRWF: 220000,
    stockQuantity: 1,
    imageUrl: IMG_DELL_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP ProBook 360 11 G7 | Celeron',
    category: 'laptop',
    description: 'Celeron | 128GB SSD | 4GB RAM | x360 convertible',
    serialNumbers: sn('KX-PB360', 1),
    importCostRWF: 176000,
    sellingPriceRWF: 220000,
    stockQuantity: 1,
    imageUrl: IMG_HP_LAPTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo Laptop | Celeron',
    category: 'laptop',
    description: 'Celeron | 128GB SSD | 4GB RAM',
    serialNumbers: sn('KX-LNCEL', 1),
    importCostRWF: 160000,
    sellingPriceRWF: 200000,
    stockQuantity: 1,
    imageUrl: IMG_GENERIC_LAPTOP,
    lowStockThreshold: 2,
  },

  // ================= DESKTOPS =================
  {
    title: 'Lenovo ThinkCentre | i7 12th Gen | SSD 1TB / 16GB',
    category: 'desktop',
    description: 'Core i7 12th Gen | 1TB SSD | 16GB RAM',
    serialNumbers: sn('KX-LTCI712', 1),
    importCostRWF: 480000,
    sellingPriceRWF: 600000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Pro Desktop | i7 9th Gen | SSD 1TB / 8GB',
    category: 'desktop',
    description: 'Core i7 9th Gen | 1TB SSD | 8GB RAM',
    serialNumbers: sn('KX-HPI79SSD', 1),
    importCostRWF: 400000,
    sellingPriceRWF: 500000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo Desktop | i7 9th Gen | HDD 1TB / 8GB',
    category: 'desktop',
    description: 'Core i7 9th Gen | 1TB HDD | 8GB RAM',
    serialNumbers: sn('KX-LNI79HDD', 1),
    importCostRWF: 320000,
    sellingPriceRWF: 400000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP ProDesk | i7 7th Gen | HDD 1TB / 8GB',
    category: 'desktop',
    description: 'Core i7 7th Gen | 1TB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI77HDD', 1),
    importCostRWF: 280000,
    sellingPriceRWF: 350000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Desktop | i7 6th Gen | HDD 1TB / 8GB',
    category: 'desktop',
    description: 'Core i7 6th Gen | 1TB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI76', 1),
    importCostRWF: 200000,
    sellingPriceRWF: 250000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Acer Desktop | i7 6th Gen | HDD 1TB / 8GB',
    category: 'desktop',
    description: 'Core i7 6th Gen | 1TB HDD | 8GB RAM',
    serialNumbers: sn('KX-ACI76', 1),
    importCostRWF: 184000,
    sellingPriceRWF: 230000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP ProDesk | i7 4th Gen | HDD 500GB / 8GB',
    category: 'desktop',
    description: 'Core i7 4th Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI74', 1),
    importCostRWF: 184000,
    sellingPriceRWF: 230000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Desktop | i7 3rd Gen | HDD 500GB / 8GB',
    category: 'desktop',
    description: 'Core i7 3rd Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI73A', 1),
    importCostRWF: 176000,
    sellingPriceRWF: 220000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Desktop | i7 3rd Gen | HDD 500GB / 8GB (Unit B)',
    category: 'desktop',
    description: 'Core i7 3rd Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI73B', 1),
    importCostRWF: 168000,
    sellingPriceRWF: 210000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Pro Desktop | i7 2nd Gen | HDD 500GB / 8GB',
    category: 'desktop',
    description: 'Core i7 2nd Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI72', 1),
    importCostRWF: 160000,
    sellingPriceRWF: 200000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo Mini | i5 13th Gen | SSD 512GB / 16GB',
    category: 'desktop',
    description: 'Core i5 13th Gen | 512GB SSD | 16GB RAM | Mini PC',
    serialNumbers: sn('KX-LNI513', 1),
    importCostRWF: 400000,
    sellingPriceRWF: 500000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo ThinkCentre | i5 12th Gen | SSD 1TB / 8GB',
    category: 'desktop',
    description: 'Core i5 12th Gen | 1TB SSD | 8GB RAM',
    serialNumbers: sn('KX-LTI512A', 1),
    importCostRWF: 400000,
    sellingPriceRWF: 500000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo ThinkCentre | i5 12th Gen | SSD 256GB / 8GB',
    category: 'desktop',
    description: 'Core i5 12th Gen | 256GB SSD | 8GB RAM',
    serialNumbers: sn('KX-LTI512B', 1),
    importCostRWF: 384000,
    sellingPriceRWF: 480000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Dell Desktop | i5 10th Gen | HDD 1TB / 8GB',
    category: 'desktop',
    description: 'Core i5 10th Gen | 1TB HDD | 8GB RAM',
    serialNumbers: sn('KX-DLI510', 1),
    importCostRWF: 280000,
    sellingPriceRWF: 350000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP All-in-One 24" FHD | i5 8th Gen | SSD 1TB / 16GB',
    category: 'desktop',
    description: 'Core i5 8th Gen | 1TB SSD | 16GB RAM | 24-inch FHD All-in-One',
    serialNumbers: sn('KX-AIOI58', 1),
    importCostRWF: 440000,
    sellingPriceRWF: 550000,
    stockQuantity: 1,
    imageUrl: IMG_AIO,
    lowStockThreshold: 2,
  },
  {
    title: 'HP ProDesk | i5 8th Gen | 1TB / 8GB',
    category: 'desktop',
    description: 'Core i5 8th Gen | 1TB Storage | 8GB RAM',
    serialNumbers: sn('KX-HPI58', 1),
    importCostRWF: 240000,
    sellingPriceRWF: 300000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Desktop | i5 7th Gen | SSD 256GB / 8GB',
    category: 'desktop',
    description: 'Core i5 7th Gen | 256GB SSD | 8GB RAM',
    serialNumbers: sn('KX-HPI57A', 1),
    importCostRWF: 240000,
    sellingPriceRWF: 300000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Acer Desktop | i5 7th Gen | SSD 256GB / 8GB',
    category: 'desktop',
    description: 'Core i5 7th Gen | 256GB SSD | 8GB RAM',
    serialNumbers: sn('KX-ACI57', 1),
    importCostRWF: 200000,
    sellingPriceRWF: 250000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP ProDesk | i5 6th Gen | HDD 500GB / 8GB',
    category: 'desktop',
    description: 'Core i5 6th Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI56', 1),
    importCostRWF: 184000,
    sellingPriceRWF: 230000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Mini CPU | i5 4th Gen | SSD 256GB / 16GB',
    category: 'desktop',
    description: 'Core i5 4th Gen | 256GB SSD | 16GB RAM | Mini PC',
    serialNumbers: sn('KX-MINI54', 1),
    importCostRWF: 240000,
    sellingPriceRWF: 300000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Pro Desktop | i5 4th Gen | HDD 500GB / 8GB',
    category: 'desktop',
    description: 'Core i5 4th Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI54H', 1),
    importCostRWF: 160000,
    sellingPriceRWF: 200000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Pro Desktop | AMD | 500GB / 8GB DDR4',
    category: 'desktop',
    description: 'AMD Processor | 500GB Storage | 8GB DDR4 RAM',
    serialNumbers: sn('KX-AMDHP', 1),
    importCostRWF: 144000,
    sellingPriceRWF: 180000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Pro | i5 3rd Gen | HDD 500GB / 8GB',
    category: 'desktop',
    description: 'Core i5 3rd Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI53', 1),
    importCostRWF: 144000,
    sellingPriceRWF: 180000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Pro | i5 2nd Gen | HDD 500GB / 8GB',
    category: 'desktop',
    description: 'Core i5 2nd Gen | 500GB HDD | 8GB RAM',
    serialNumbers: sn('KX-HPI52', 1),
    importCostRWF: 128000,
    sellingPriceRWF: 160000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Acer Desktop | i3 7th Gen | 500GB / 8GB',
    category: 'desktop',
    description: 'Core i3 7th Gen | 500GB Storage | 8GB RAM',
    serialNumbers: sn('KX-ACI37', 1),
    importCostRWF: 160000,
    sellingPriceRWF: 200000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'HP Desktop | i3 6th Gen | 500GB / 4GB',
    category: 'desktop',
    description: 'Core i3 6th Gen | 500GB Storage | 4GB RAM',
    serialNumbers: sn('KX-HPI36A', 1),
    importCostRWF: 160000,
    sellingPriceRWF: 200000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Acer Desktop | i3 6th Gen | 500GB / 4GB',
    category: 'desktop',
    description: 'Core i3 6th Gen | 500GB Storage | 4GB RAM',
    serialNumbers: sn('KX-ACI36', 1),
    importCostRWF: 144000,
    sellingPriceRWF: 180000,
    stockQuantity: 1,
    imageUrl: IMG_LENOVO_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Desktop | i3 4th Gen | 500GB / 4GB',
    category: 'desktop',
    description: 'Core i3 4th Gen | 500GB Storage | 4GB RAM',
    serialNumbers: sn('KX-I34', 1),
    importCostRWF: 144000,
    sellingPriceRWF: 180000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },
  {
    title: 'Desktop | i3 3rd Gen | 500GB / 8GB',
    category: 'desktop',
    description: 'Core i3 3rd Gen | 500GB Storage | 8GB RAM',
    serialNumbers: sn('KX-I33', 100),
    importCostRWF: 128000,
    sellingPriceRWF: 160000,
    stockQuantity: 100,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 10,
  },
  {
    title: 'HP ProDesk | Pentium | HDD 500GB / 4GB',
    category: 'desktop',
    description: 'Pentium | 500GB HDD | 4GB RAM',
    serialNumbers: sn('KX-PENHP', 1),
    importCostRWF: 112000,
    sellingPriceRWF: 140000,
    stockQuantity: 1,
    imageUrl: IMG_HP_DESKTOP,
    lowStockThreshold: 2,
  },

  // ================= MONITORS =================
  {
    title: 'Monitor 19"',
    category: 'monitor',
    description: '19-inch monitor',
    serialNumbers: sn('KX-MON19A', 1),
    importCostRWF: 56000,
    sellingPriceRWF: 70000,
    stockQuantity: 1,
    imageUrl: IMG_MON_19,
    lowStockThreshold: 2,
  },
  {
    title: 'Monitor 19" (Unit B)',
    category: 'monitor',
    description: '19-inch monitor',
    serialNumbers: sn('KX-MON19B', 1),
    importCostRWF: 64000,
    sellingPriceRWF: 80000,
    stockQuantity: 1,
    imageUrl: IMG_MON_19,
    lowStockThreshold: 2,
  },
  {
    title: 'Monitor 20"',
    category: 'monitor',
    description: '20-inch monitor',
    serialNumbers: sn('KX-MON20', 1),
    importCostRWF: 64000,
    sellingPriceRWF: 80000,
    stockQuantity: 1,
    imageUrl: IMG_MON_19,
    lowStockThreshold: 2,
  },
  {
    title: 'Monitor 19" HDMI',
    category: 'monitor',
    description: '19-inch monitor with HDMI',
    serialNumbers: sn('KX-MON19C', 1),
    importCostRWF: 72000,
    sellingPriceRWF: 90000,
    stockQuantity: 1,
    imageUrl: IMG_MON_19,
    lowStockThreshold: 2,
  },
  {
    title: 'Lenovo 22" HD Monitor',
    category: 'monitor',
    description: '22-inch HD monitor',
    serialNumbers: sn('KX-LM22HD', 1),
    importCostRWF: 120000,
    sellingPriceRWF: 150000,
    stockQuantity: 1,
    imageUrl: IMG_MON_22,
    lowStockThreshold: 2,
  },
  {
    title: 'HP 22" HD Monitor',
    category: 'monitor',
    description: '22-inch HD monitor',
    serialNumbers: sn('KX-HP22HD', 1),
    importCostRWF: 128000,
    sellingPriceRWF: 160000,
    stockQuantity: 1,
    imageUrl: IMG_MON_22,
    lowStockThreshold: 2,
  },
  {
    title: 'HP 22" FHD Monitor',
    category: 'monitor',
    description: '22-inch Full HD monitor',
    serialNumbers: sn('KX-HP22FA', 1),
    importCostRWF: 144000,
    sellingPriceRWF: 180000,
    stockQuantity: 1,
    imageUrl: IMG_MON_22,
    lowStockThreshold: 2,
  },
  {
    title: 'HP 22" FHD Monitor (Unit B)',
    category: 'monitor',
    description: '22-inch Full HD monitor',
    serialNumbers: sn('KX-HP22FB', 1),
    importCostRWF: 160000,
    sellingPriceRWF: 200000,
    stockQuantity: 1,
    imageUrl: IMG_MON_22,
    lowStockThreshold: 2,
  },
  {
    title: 'MSI 24" FHD Monitor',
    category: 'monitor',
    description: 'MSI 24-inch Full HD monitor',
    serialNumbers: sn('KX-MSI24', 1),
    importCostRWF: 184000,
    sellingPriceRWF: 230000,
    stockQuantity: 1,
    imageUrl: IMG_MON_24,
    lowStockThreshold: 2,
  },
  {
    title: 'HP 24" FHD Monitor',
    category: 'monitor',
    description: 'HP 24-inch Full HD monitor',
    serialNumbers: sn('KX-HP24FHD', 1),
    importCostRWF: 184000,
    sellingPriceRWF: 230000,
    stockQuantity: 1,
    imageUrl: IMG_MON_24,
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
    const totalUnits = createdItems.reduce((sum, it) => sum + it.stockQuantity, 0);
    console.log(`Created ${createdItems.length} items (${totalUnits} total units)`);

    console.log('\n========================================');
    console.log('  KNAX-POS SEED COMPLETE');
    console.log('========================================\n');
    console.log('LOGIN CREDENTIALS:');
    console.log('--------------------------------------------');
    console.log('| Phone       | Password     | Role        |');
    console.log('|-------------|--------------|-------------|');
    console.log('| 0782562906  | knax250boss  | admin (CEO) |');
    console.log('| 0788259863  | mimiknax250  | sales       |');
    console.log('| 0790047838  | matteta      | sales       |');
    console.log('| 0786436369  | jadomaxknax  | sales       |');
    console.log('--------------------------------------------\n');
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
