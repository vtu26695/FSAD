import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'inventory.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [], inventory: [], activity: [] });

await db.read();

// Seed data if empty
if (!db.data.inventory || db.data.inventory.length === 0) {
  db.data.inventory = [
    { id: 'item-1', name: 'Barcode Scanner', category: 'Electronics', supplier: 'Atlas Supply', sku: 'ELE-007', quantity: 17, price: 129.99, status: 'In Stock' },
    { id: 'item-2', name: 'Shipping Tape', category: 'Packaging', supplier: 'Prime Warehousing', sku: 'PKG-101', quantity: 48, price: 4.50, status: 'In Stock' },
    { id: 'item-3', name: 'Label Printer', category: 'Office', supplier: 'Nova Traders', sku: 'OFF-314', quantity: 2, price: 219.00, status: 'Low Stock' },
    { id: 'item-4', name: 'Pallet Jack', category: 'Parts', supplier: 'GreenLine Logistics', sku: 'PRT-050', quantity: 5, price: 349.99, status: 'In Stock' },
    { id: 'item-5', name: 'Safety Goggles', category: 'Parts', supplier: 'Atlas Supply', sku: 'PRT-088', quantity: 120, price: 12.99, status: 'In Stock' },
    { id: 'item-6', name: 'Bubble Wrap Roll', category: 'Packaging', supplier: 'Prime Warehousing', sku: 'PKG-205', quantity: 30, price: 18.50, status: 'In Stock' },
    { id: 'item-7', name: 'Wireless Mouse', category: 'Electronics', supplier: 'Nova Traders', sku: 'ELE-112', quantity: 0, price: 29.99, status: 'Out of Stock' },
    { id: 'item-8', name: 'A4 Copy Paper (Ream)', category: 'Office', supplier: 'GreenLine Logistics', sku: 'OFF-401', quantity: 200, price: 5.99, status: 'In Stock' },
    { id: 'item-9', name: 'Stretch Film', category: 'Packaging', supplier: 'Prime Warehousing', sku: 'PKG-330', quantity: 3, price: 22.00, status: 'Low Stock' },
    { id: 'item-10', name: 'USB-C Hub', category: 'Electronics', supplier: 'Atlas Supply', sku: 'ELE-256', quantity: 14, price: 45.99, status: 'In Stock' },
    { id: 'item-11', name: 'Desk Organizer', category: 'Office', supplier: 'Nova Traders', sku: 'OFF-512', quantity: 25, price: 34.99, status: 'In Stock' },
    { id: 'item-12', name: 'Forklift Battery', category: 'Parts', supplier: 'GreenLine Logistics', sku: 'PRT-777', quantity: 1, price: 899.00, status: 'Low Stock' },
  ];
  if (!db.data.activity) db.data.activity = [];
  db.data.activity.push(
    { id: 'act-1', action: 'added', itemName: 'Barcode Scanner', details: 'Added 17 units at $129.99 each', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'act-2', action: 'added', itemName: 'Shipping Tape', details: 'Added 48 units at $4.50 each', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'act-3', action: 'updated', itemName: 'Label Printer', details: 'Quantity changed from 10 to 2', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'act-4', action: 'added', itemName: 'Pallet Jack', details: 'Added 5 units at $349.99 each', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
    { id: 'act-5', action: 'added', itemName: 'Safety Goggles', details: 'Added 120 units at $12.99 each', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
  );
  await db.write();
}

// Ensure activity array exists
if (!db.data.activity) {
  db.data.activity = [];
  await db.write();
}

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

function normalizeStatus(quantity) {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity < 5) return 'Low Stock';
  return 'In Stock';
}

function logActivity(action, itemName, details) {
  db.data.activity.push({
    id: `act-${Date.now()}`,
    action,
    itemName,
    details,
    timestamp: new Date().toISOString(),
  });
}

// ─── Auth ────────────────────────────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  await db.read();
  const user = db.data?.users.find((e) => e.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid email or password.' });

  const { password: _pw, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });

  await db.read();
  if (db.data?.users.find((e) => e.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: 'An account already exists with this email.' });
  }

  const newUser = { id: `user-${Date.now()}`, name, email, password };
  db.data?.users.push(newUser);
  await db.write();
  const { password: _pw, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser });
});

// ─── Inventory CRUD ─────────────────────────────────────────────────────────

app.get('/api/inventory', async (req, res) => {
  await db.read();
  res.json((db.data?.inventory ?? []).slice().reverse());
});

app.post('/api/inventory', async (req, res) => {
  const { name, category, supplier, sku, quantity, price } = req.body;
  if (!name || !category || !supplier || !sku || quantity == null || price == null) {
    return res.status(400).json({ message: 'All inventory fields are required.' });
  }

  const newItem = {
    id: `item-${Date.now()}`,
    name,
    category,
    supplier,
    sku,
    quantity: Number(quantity),
    price: Number(price),
    status: normalizeStatus(Number(quantity)),
  };

  await db.read();
  db.data?.inventory.push(newItem);
  logActivity('added', name, `Added ${quantity} units at $${Number(price).toFixed(2)} each`);
  await db.write();
  res.status(201).json(newItem);
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, supplier, sku, quantity, price } = req.body;
  if (!name || !category || !supplier || !sku || quantity == null || price == null) {
    return res.status(400).json({ message: 'All inventory fields are required.' });
  }

  await db.read();
  const item = db.data?.inventory.find((e) => e.id === id);
  if (!item) return res.status(404).json({ message: 'Item not found.' });

  const changes = [];
  if (item.quantity !== Number(quantity)) changes.push(`Qty ${item.quantity} → ${quantity}`);
  if (item.price !== Number(price)) changes.push(`Price $${item.price.toFixed(2)} → $${Number(price).toFixed(2)}`);
  if (item.name !== name) changes.push(`Renamed to "${name}"`);
  if (item.category !== category) changes.push(`Category → ${category}`);
  if (item.supplier !== supplier) changes.push(`Supplier → ${supplier}`);

  item.name = name;
  item.category = category;
  item.supplier = supplier;
  item.sku = sku;
  item.quantity = Number(quantity);
  item.price = Number(price);
  item.status = normalizeStatus(item.quantity);

  logActivity('updated', name, changes.length > 0 ? changes.join(', ') : 'No visible changes');
  await db.write();
  res.json(item);
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  await db.read();
  const items = db.data?.inventory ?? [];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Item not found.' });

  const removed = items[index];
  items.splice(index, 1);
  logActivity('deleted', removed.name, `Removed from inventory (was ${removed.quantity} units)`);
  await db.write();
  res.status(204).end();
});

// ─── Stats & Activity ────────────────────────────────────────────────────────

app.get('/api/stats', async (req, res) => {
  await db.read();
  const items = db.data?.inventory ?? [];
  const totalItems = items.length;
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalValue = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const lowStockCount = items.filter((i) => i.status === 'Low Stock').length;
  const outOfStockCount = items.filter((i) => i.status === 'Out of Stock').length;
  const inStockCount = items.filter((i) => i.status === 'In Stock').length;

  // Category breakdown
  const categoryMap = {};
  items.forEach((i) => {
    if (!categoryMap[i.category]) categoryMap[i.category] = { count: 0, value: 0 };
    categoryMap[i.category].count += i.quantity;
    categoryMap[i.category].value += i.quantity * i.price;
  });
  const categories = Object.entries(categoryMap).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
  }));

  // Supplier breakdown
  const supplierMap = {};
  items.forEach((i) => {
    if (!supplierMap[i.supplier]) supplierMap[i.supplier] = { count: 0, items: 0 };
    supplierMap[i.supplier].count += i.quantity;
    supplierMap[i.supplier].items += 1;
  });
  const suppliers = Object.entries(supplierMap).map(([name, data]) => ({
    name,
    count: data.count,
    items: data.items,
  }));

  // Top items by value
  const topItems = items
    .map((i) => ({ name: i.name, value: i.quantity * i.price, quantity: i.quantity, price: i.price }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  res.json({
    totalItems,
    totalQuantity,
    totalValue,
    lowStockCount,
    outOfStockCount,
    inStockCount,
    categories,
    suppliers,
    topItems,
  });
});

app.get('/api/activity', async (req, res) => {
  await db.read();
  const activity = (db.data?.activity ?? []).slice().reverse().slice(0, 50);
  res.json(activity);
});

app.listen(4000, () => {
  console.log('Inventory backend listening on http://localhost:4000');
});
