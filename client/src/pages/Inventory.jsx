import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';

const api = axios.create({ baseURL: '/api' });

const EMPTY_ITEM = {
  title: '',
  category: 'laptop',
  serialNumbers: '',
  importCostRWF: '',
  sellingPriceRWF: '',
  stockQuantity: '',
  imageUrl: '',
  lowStockThreshold: 2,
};

export default function Inventory() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  // Set auth header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Fetch items when search or category changes (and on initial load)
  useEffect(() => {
    fetchItems();
  }, [search, category, token]);

  const fetchItems = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const { data } = await api.get('/items', { params });

      // FIX: Ensure data is an array regardless of backend payload wrapper
      if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data?.items)) {
        setItems(data.items);
      } else if (Array.isArray(data?.data)) {
        setItems(data.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch inventory');
      setItems([]); // Fallback to empty array on network error
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_ITEM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'laptop',
      serialNumbers: item.serialNumbers?.join(', ') || '',
      importCostRWF: item.importCostRWF ?? '',
      sellingPriceRWF: item.sellingPriceRWF ?? '',
      stockQuantity: item.stockQuantity ?? '',
      imageUrl: item.imageUrl || '',
      lowStockThreshold: item.lowStockThreshold || 2,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        serialNumbers: form.serialNumbers
          ? form.serialNumbers.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        importCostRWF: Number(form.importCostRWF),
        sellingPriceRWF: Number(form.sellingPriceRWF),
        stockQuantity: Number(form.stockQuantity) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 2,
      };

      if (editingItem) {
        await api.put(`/items/${editingItem._id}`, payload);
        toast.success('Item updated');
      } else {
        await api.post('/items', payload);
        toast.success('Item created');
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted');
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  // Defensive array check before mapping
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory..."
            className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="laptop">Laptops</option>
          <option value="desktop">Desktops</option>
          <option value="monitor">Monitors</option>
          <option value="accessory">Accessories</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Serial Numbers</th>
                <th className="px-4 py-3">Import Cost</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeItems.map((item) => (
                <tr key={item._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 capitalize">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[200px] truncate">
                    {item.serialNumbers?.join(', ') || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {(item.importCostRWF ?? 0).toLocaleString()} RWF
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {(item.sellingPriceRWF ?? 0).toLocaleString()} RWF
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        (item.stockQuantity ?? 0) <= (item.lowStockThreshold ?? 2)
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.stockQuantity ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {safeItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-400">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop</option>
                    <option value="monitor">Monitor</option>
                    <option value="accessory">Accessory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={form.lowStockThreshold}
                    onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Serial Numbers (comma separated)
                </label>
                <textarea
                  value={form.serialNumbers}
                  onChange={(e) => setForm({ ...form, serialNumbers: e.target.value })}
                  rows={2}
                  placeholder="SN001, SN002, SN003"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Import Cost (RWF) *</label>
                  <input
                    type="number"
                    value={form.importCostRWF}
                    onChange={(e) => setForm({ ...form, importCostRWF: e.target.value })}
                    required
                    min="0"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (RWF) *</label>
                  <input
                    type="number"
                    value={form.sellingPriceRWF}
                    onChange={(e) => setForm({ ...form, sellingPriceRWF: e.target.value })}
                    required
                    min="0"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={form.stockQuantity}
                  onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                  min="0"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Cloudinary)</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}