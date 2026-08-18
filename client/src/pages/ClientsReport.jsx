import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Search, Users, Download } from 'lucide-react';

const api = axios.create({ baseURL: '/api' });

export default function ClientsReport() {
  const { token } = useAuth();
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchSales();
  }, [token, date]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = {};
      if (date) params.date = date;
      const { data } = await api.get('/sales', { params });
      setSales(data.sales || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = sales.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.clientName?.toLowerCase().includes(q) ||
      s.clientPhone?.includes(q) ||
      s.clientLocation?.toLowerCase().includes(q) ||
      s.receiptNumber?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ['Receipt', 'Client Name', 'Phone', 'Location', 'Total (RWF)', 'Payment', 'Date', 'Sold By'];
    const rows = filtered.map((s) => [
      s.receiptNumber,
      s.clientName,
      s.clientPhone,
      s.clientLocation,
      s.totalAmountRWF,
      s.paymentMethod,
      new Date(s.createdAt).toLocaleString('en-GB'),
      s.soldBy?.name || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-report-${date || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users size={24} className="text-indigo-600" />
            Clients Report
          </h1>
          <p className="text-sm text-slate-500 mt-1">Warranty certificate client credentials & sales history</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or location..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
        />
        {date && (
          <button
            onClick={() => setDate('')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            Clear Date
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Client Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Total (RWF)</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Sold By</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale) => (
                <tr key={sale._id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-indigo-600">{sale.receiptNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">{sale.clientName}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{sale.clientPhone}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{sale.clientLocation}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{sale.totalAmountRWF?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{sale.soldBy?.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(sale.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-400 text-sm">
                    No client records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
