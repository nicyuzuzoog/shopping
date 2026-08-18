import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { TrendingUp, ShoppingCart, Package, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const api = axios.create({ baseURL: '/api' });

export default function Dashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchSummary();
  }, [date, token]);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get(`/dashboard/summary?date=${date}`);
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      label: 'Total Revenue',
      value: summary?.totalRevenue?.toLocaleString() || '0',
      suffix: 'RWF',
      icon: DollarSign,
      trend: '+15% Increased Recently',
      isPositive: true,
    },
    {
      label: 'Net Profit',
      value: summary?.totalProfit?.toLocaleString() || '0',
      suffix: 'RWF',
      icon: TrendingUp,
      trend: '+18% Increased Recently',
      isPositive: true,
    },
    {
      label: 'Transactions',
      value: summary?.totalTransactions || 0,
      suffix: 'sales',
      icon: ShoppingCart,
      trend: '-5% Decreased Recently',
      isPositive: false,
    },
    {
      label: 'Items Sold',
      value: summary?.totalItemsSold || 0,
      suffix: 'units',
      icon: Package,
      trend: '+7% Increased Recently',
      isPositive: true,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time performance and metrics</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</span>
              <div className="p-2 bg-slate-50 rounded-xl text-slate-600">
                <card.icon size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {card.value} <span className="text-xs font-medium text-slate-400">{card.suffix}</span>
              </h2>

              <div className="flex items-center justify-between pt-1">
                <span className={`text-[11px] font-semibold ${card.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {card.trend}
                </span>
                <span className={`p-1 rounded-md ${card.isPositive ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {card.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base">Recent Transactions</h3>
          <span className="text-xs text-slate-400 font-medium">Updated live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-3.5">Receipt</th>
                <th className="px-6 py-3.5">Amount (RWF)</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Sold By</th>
                <th className="px-6 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {summary?.sales?.map((sale) => (
                <tr key={sale._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-blue-600">{sale.receiptNumber}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{sale.totalAmountRWF.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-600 border border-blue-100 font-semibold px-2.5 py-1 rounded-full text-xs inline-block">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{sale.soldBy?.name || '-'}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(sale.createdAt).toLocaleString('en-GB')}
                  </td>
                </tr>
              ))}
              {(!summary?.sales || summary.sales.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 text-sm">
                    No transactions found for this date
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