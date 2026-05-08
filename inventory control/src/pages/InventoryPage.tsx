import { useMemo, useState, type FormEvent } from 'react';
import type { InventoryItem } from '../App';

type InventoryPageProps = {
  inventory: InventoryItem[];
  categories: string[];
  suppliers: string[];
  onAddItem: (item: Omit<InventoryItem, 'id' | 'status'>) => Promise<void>;
  onUpdateItem: (item: InventoryItem) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
};

const statusClass = (s: InventoryItem['status']) =>
  s === 'In Stock' ? 'badge in-stock' : s === 'Low Stock' ? 'badge low-stock' : 'badge out-stock';

export function InventoryPage({
  inventory, categories, suppliers, onAddItem, onUpdateItem, onRemoveItem,
}: InventoryPageProps) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [supFilter, setSupFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      const matchCat = catFilter === 'All' || item.category === catFilter;
      const matchSup = supFilter === 'All' || item.supplier === supFilter;
      return matchSearch && matchCat && matchSup;
    });
  }, [inventory, search, catFilter, supFilter]);

  const blank = { name: '', category: categories[0] ?? '', supplier: suppliers[0] ?? '', sku: '', quantity: 1, price: 0 };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setEditItem(null); setForm(blank); setShowModal(true); };
  const openEdit = (item: InventoryItem) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, supplier: item.supplier, sku: item.sku, quantity: item.quantity, price: item.price });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await onUpdateItem({ ...editItem, ...form, quantity: Number(form.quantity), price: Number(form.price) });
      } else {
        await onAddItem({ ...form, quantity: Number(form.quantity), price: Number(form.price) });
      }
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Inventory Management</h1>
        <p>View, search, and manage all your stock items in one place.</p>
      </div>

      <div className="section-card">
        <div className="toolbar">
          <input
            className="field-input"
            type="search"
            placeholder="🔍  Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="field-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="field-select" value={supFilter} onChange={(e) => setSupFilter(e.target.value)}>
            <option value="All">All Suppliers</option>
            {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="toolbar-spacer" />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Item</button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No items found</h3>
            <p>Try adjusting your search or filters, or add a new item.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name">{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.supplier}</td>
                    <td>{item.sku}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td><span className={statusClass(item.status)}>{item.status}</span></td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => onRemoveItem(item.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-card">
            <h2>{editItem ? '✏️ Edit Item' : '📦 Add New Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field-group">
                  <label className="field-label">Item Name</label>
                  <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Barcode Scanner" required />
                </div>
                <div className="field-group">
                  <label className="field-label">SKU</label>
                  <input className="field-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g. ELE-007" required />
                </div>
                <div className="field-group">
                  <label className="field-label">Category</label>
                  <select className="field-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label">Supplier</label>
                  <select className="field-select" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                    {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label">Quantity</label>
                  <input className="field-input" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
                </div>
                <div className="field-group">
                  <label className="field-label">Unit Price ($)</label>
                  <input className="field-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
