import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, X, ShoppingCart, Minus, Plus, Trash2, Printer, ChevronDown, UserCircle } from 'lucide-react';
import Receipt from '../components/Receipt';

const api = axios.create({ baseURL: '/api' });

const CATEGORIES = [
  { key: 'all', label: 'All Items' },
  { key: 'laptop', label: 'Laptops' },
  { key: 'desktop', label: 'Desktops' },
  { key: 'monitor', label: 'Monitors' },
  { key: 'accessory', label: 'Accessories' },
];

export default function POS() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [processing, setProcessing] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({ clientName: '', clientPhone: '', clientLocation: '' });
  const receiptRef = useRef();

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchItems();
  }, [token]);

  useEffect(() => {
    fetchItems();
  }, [search, category]);

  const fetchItems = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      const { data } = await api.get('/items', { params });
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    if (item.stockQuantity <= 0) {
      toast.error('Item out of stock');
      return;
    }
    const existing = cart.find((c) => c.itemId === item._id);
    if (existing) {
      if (existing.qty >= item.stockQuantity) {
        toast.error('No more stock available');
        return;
      }
      setCart(cart.map((c) => (c.itemId === item._id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([
        ...cart,
        {
          itemId: item._id,
          title: item.title,
          serialNumber: item.serialNumbers?.[0] || '',
          qty: 1,
          sellingPriceRWF: item.sellingPriceRWF,
          stockQuantity: item.stockQuantity,
          serialNumbers: item.serialNumbers || [],
        },
      ]);
    }
  };

  const updateCartQty = (itemId, delta) => {
    setCart(
      cart.map((c) => {
        if (c.itemId !== itemId) return c;
        const newQty = c.qty + delta;
        if (newQty <= 0) return c;
        if (newQty > c.stockQuantity) {
          toast.error('Max stock reached');
          return c;
        }
        return { ...c, qty: newQty };
      })
    );
  };

  const updateCartSerial = (itemId, serial) => {
    setCart(cart.map((c) => (c.itemId === itemId ? { ...c, serialNumber: serial } : c)));
  };

  const updateCartPrice = (itemId, price) => {
    setCart(cart.map((c) => (c.itemId === itemId ? { ...c, sellingPriceRWF: Number(price) } : c)));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((c) => c.itemId !== itemId));
  };

  const totalAmount = cart.reduce((sum, c) => sum + c.sellingPriceRWF * c.qty, 0);

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    for (const item of cart) {
      if (!item.serialNumber) {
        toast.error(`Select serial number for ${item.title}`);
        return;
      }
    }
    setShowClientModal(true);
  };

  const handleConfirmSale = async () => {
    if (!clientForm.clientName.trim()) {
      toast.error('Client name is required');
      return;
    }
    if (!clientForm.clientPhone.trim()) {
      toast.error('Client phone is required');
      return;
    }
    if (!clientForm.clientLocation.trim()) {
      toast.error('Client location is required');
      return;
    }
    setShowClientModal(false);
    setProcessing(true);
    try {
      const payload = {
        itemsSold: cart.map((c) => ({
          itemId: c.itemId,
          title: c.title,
          serialNumber: c.serialNumber,
          qty: c.qty,
          sellingPriceRWF: c.sellingPriceRWF,
        })),
        totalAmountRWF: totalAmount,
        paymentMethod,
        clientName: clientForm.clientName.trim(),
        clientPhone: clientForm.clientPhone.trim(),
        clientLocation: clientForm.clientLocation.trim(),
      };
      const { data } = await api.post('/sales', payload);
      setLastSale(data);
      setShowReceipt(true);
      setCart([]);
      setClientForm({ clientName: '', clientPhone: '', clientLocation: '' });
      toast.success('Sale completed successfully!');
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sale failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-100px)] relative pb-16 xl:pb-0">
      {/* Left: Products List */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title or category..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                category === cat.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 content-start">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => addToCart(item)}
              className="bg-white rounded-2xl border border-slate-100 p-3 text-left hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-24 sm:h-28 object-cover rounded-xl mb-2.5"
                  />
                ) : (
                  <div className="w-full h-24 sm:h-28 bg-slate-50 border border-slate-100 rounded-xl mb-2.5 flex items-center justify-center text-slate-400 text-xs font-semibold">
                    No Image
                  </div>
                )}
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 capitalize mt-0.5">{item.category}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                <span className="text-xs sm:text-sm font-extrabold text-indigo-600">
                  {item.sellingPriceRWF.toLocaleString()} <span className="text-[10px]">RWF</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.stockQuantity <= item.lowStockThreshold
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {item.stockQuantity} in stock
                </span>
              </div>
            </button>
          ))}

          {items.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-400 font-medium text-sm">No items found matching criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button for Mobile Screens */}
      <div className="xl:hidden fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setShowMobileCart(!showMobileCart)}
          className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-sm"
        >
          <ShoppingCart size={20} />
          <span>Cart ({cart.length})</span>
          {cart.length > 0 && (
            <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs">
              {totalAmount.toLocaleString()} RWF
            </span>
          )}
        </button>
      </div>

      {/* Right: Cart Container */}
      <div
        className={`w-full xl:w-[380px] bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden transition-all duration-300 ${
          showMobileCart ? 'fixed inset-x-0 bottom-0 top-16 z-40 rounded-b-none' : 'hidden xl:flex'
        }`}
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingCart size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Current Order ({cart.length})</h3>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setShowMobileCart(false)}
            className="xl:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Itemized List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[50vh] xl:max-h-none">
          {cart.map((item) => (
            <div key={item.itemId} className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 space-y-2.5">
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-slate-800 truncate pr-2">{item.title}</h4>
                <button
                  onClick={() => removeFromCart(item.itemId)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Serial Number Picker */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Serial Number *
                </label>
                <div className="relative">
                  <select
                    value={item.serialNumber}
                    onChange={(e) => updateCartSerial(item.itemId, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select Serial Number</option>
                    {item.serialNumbers.map((sn, i) => (
                      <option key={i} value={sn}>
                        {sn}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Editable Price */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Price:</label>
                <input
                  type="number"
                  value={item.sellingPriceRWF}
                  onChange={(e) => updateCartPrice(item.itemId, e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Quantity controls & Subtotal */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                  <button
                    onClick={() => updateCartQty(item.itemId, -1)}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-5 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateCartQty(item.itemId, 1)}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="text-xs font-extrabold text-slate-900">
                  {(item.sellingPriceRWF * item.qty).toLocaleString()} RWF
                </span>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs font-medium">Cart is empty</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Select products to begin sale</p>
            </div>
          )}
        </div>

        {/* Footer Payment Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Cash', 'MoMo Pay', 'Bank'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    paymentMethod === method
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-500">Total Payable</span>
            <span className="text-lg font-black text-slate-900">{totalAmount.toLocaleString()} RWF</span>
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={processing || cart.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
          >
            {processing ? (
              'Processing Sale...'
            ) : (
              <>
                Complete & Print
                <Printer size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Client Info Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <UserCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Client Information</h3>
                <p className="text-[11px] text-slate-400">Record customer credentials for warranty</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Client Name *</label>
                <input
                  type="text"
                  value={clientForm.clientName}
                  onChange={(e) => setClientForm({ ...clientForm, clientName: e.target.value })}
                  placeholder="Full name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Client Phone *</label>
                <input
                  type="tel"
                  value={clientForm.clientPhone}
                  onChange={(e) => setClientForm({ ...clientForm, clientPhone: e.target.value })}
                  placeholder="+250 7XX XXX XXX"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Client Location *</label>
                <input
                  type="text"
                  value={clientForm.clientLocation}
                  onChange={(e) => setClientForm({ ...clientForm, clientLocation: e.target.value })}
                  placeholder="District / Sector / Cell"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowClientModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSale}
                disabled={processing}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm & Print'}
                {!processing && <Printer size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal Overlay */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Sale Receipt Generated</h3>
              <button
                onClick={() => {
                  setShowReceipt(false);
                  setLastSale(null);
                }}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div ref={receiptRef}>
              <Receipt sale={lastSale} />
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                onClick={() => {
                  setShowReceipt(false);
                  setLastSale(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}