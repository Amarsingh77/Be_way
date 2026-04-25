import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Gift, DollarSign, TrendingUp, Shield, UserX, UserCheck, Trash2, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import api from '../utils/api';

import { Edit2, Save } from 'lucide-react';

const TABS = ['📊 Overview', '👥 Users', '📋 Listings', '🚚 Orders', '🎁 Donations'];

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  // Edit Modals State
  const [editUser, setEditUser] = useState(null);
  const [editListing, setEditListing] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/listings'),
      api.get('/admin/donations'),
      api.get('/admin/orders'),
    ]).then(([s, u, l, d, o]) => {
      setStats(s.data);
      setUsers(u.data.users);
      setListings(l.data.listings);
      setDonations(d.data);
      setOrders(o.data);
    }).catch(() => toast.error('Failed to load admin data')).finally(() => setLoading(false));
  }, []);

  const toggleBan = async (userId, isBanned) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, { isBanned: !isBanned });
      setUsers(u => u.map(x => x._id === userId ? data : x));
      toast.success(isBanned ? 'User unbanned' : 'User banned');
    } catch { toast.error('Failed'); }
  };

  const promoteAdmin = async (userId, role) => {
    try {
      const newRole = role === 'admin' ? 'user' : 'admin';
      const { data } = await api.put(`/admin/users/${userId}`, { role: newRole });
      setUsers(u => u.map(x => x._id === userId ? data : x));
      toast.success(`User role changed to ${newRole}`);
    } catch { toast.error('Failed'); }
  };

  const moderateListing = async (listingId, status) => {
    try {
      const { data } = await api.put(`/admin/listings/${listingId}/status`, { status });
      setListings(l => l.map(x => x._id === listingId ? data : x));
      toast.success(`Listing ${status}`);
    } catch { toast.error('Failed'); }
  };

  const deleteListing = async (listingId) => {
    if (!confirm('Permanently delete this listing?')) return;
    try {
      await api.delete(`/admin/listings/${listingId}`);
      setListings(l => l.filter(x => x._id !== listingId));
      toast.success('Listing deleted');
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(u => u.filter(x => x._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  const saveUserEdit = async () => {
    try {
      const { data } = await api.put(`/admin/users/${editUser._id}`, editUser);
      setUsers(u => u.map(x => x._id === editUser._id ? data : x));
      setEditUser(null);
      toast.success('User updated');
    } catch { toast.error('Failed'); }
  };

  const saveListingEdit = async () => {
    try {
      const { data } = await api.put(`/admin/listings/${editListing._id}`, editListing);
      setListings(l => l.map(x => x._id === editListing._id ? data : x));
      setEditListing(null);
      toast.success('Listing updated');
    } catch { toast.error('Failed'); }
  };

  const updateOrderStatus = async (orderId, shippingStatus, paymentStatus) => {
    try {
      const payload = {};
      if (shippingStatus) payload.shippingStatus = shippingStatus;
      if (paymentStatus) payload.paymentStatus = paymentStatus;
      const { data } = await api.put(`/admin/orders/${orderId}/status`, payload);
      setOrders(o => o.map(x => x._id === orderId ? data : x));
      toast.success('Order status updated');
    } catch { toast.error('Failed'); }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Permanently delete this order?')) return;
    try {
      await api.delete(`/admin/orders/${orderId}`);
      setOrders(o => o.filter(x => x._id !== orderId));
      toast.success('Order deleted');
    } catch { toast.error('Failed'); }
  };

  const updateDonationStatus = async (donationId, status) => {
    try {
      const { data } = await api.put(`/admin/donations/${donationId}/status`, { status });
      setDonations(d => d.map(x => x._id === donationId ? data : x));
      toast.success('Donation status updated');
    } catch { toast.error('Failed'); }
  };

  const deleteDonation = async (donationId) => {
    if (!confirm('Permanently delete this donation?')) return;
    try {
      await api.delete(`/admin/donations/${donationId}`);
      setDonations(d => d.filter(x => x._id !== donationId));
      toast.success('Donation deleted');
    } catch { toast.error('Failed'); }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        <p className="font-display text-2xl font-bold text-white">{value?.toLocaleString()}</p>
      </div>
    </div>
  );

  const PIE_COLORS = ['#22c55e', '#3b82f6', '#d946ef'];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading admin data...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm">BeWay Platform Management</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1 mb-8 w-fit flex-wrap">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === i ? 'bg-accent-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 0 && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={stats?.total?.users} color="bg-blue-600" />
            <StatCard icon={Package} label="Total Listings" value={stats?.total?.listings} color="bg-primary-600" />
            <StatCard icon={Gift} label="Donations" value={stats?.total?.donations} color="bg-accent-600" />
            <StatCard icon={DollarSign} label="Revenue (₹)" value={stats?.revenue || 0} color="bg-green-600" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 glass-card">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-primary-400" /> Listings Over Time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats?.monthlyListings?.map(m => ({ month: `Month ${m._id}`, count: m.count })) || []}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Area type="monotone" dataKey="count" stroke="#22c55e" fill="url(#grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card">
              <h3 className="font-semibold text-white mb-4">Listing Types</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={[{ name: 'Active', value: stats?.active || 1 }, { name: 'Pending', value: stats?.pending || 1 }, { name: 'Sold/Done', value: (stats?.total?.listings || 2) - (stats?.active || 1) - (stats?.pending || 1) + 1 }]}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {[0, 1, 2].map(i => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {['Active', 'Pending', 'Sold'].map((l, i) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-gray-400 text-xs">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === 1 && (
        <div>
          <input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="input-field max-w-sm mb-6" />
          <div className="glass-card overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-gray-500 text-xs font-semibold uppercase border-b border-white/10">
                  <th className="text-left pb-3">User</th>
                  <th className="text-left pb-3">Email</th>
                  <th className="text-left pb-3">Role</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-right pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                  <tr key={u._id} className="text-sm">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">{u.email}</td>
                    <td className="py-3">
                      <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span>
                    </td>
                    <td className="py-3">
                      <span className={`badge ${u.isBanned ? 'badge-red' : 'badge-green'}`}>{u.isBanned ? 'Banned' : 'Active'}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditUser(u)} title="Edit"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-blue-400 transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => promoteAdmin(u._id, u.role)} title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-accent-400 transition">
                          <Shield className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleBan(u._id, u.isBanned)} title={u.isBanned ? 'Unban' : 'Ban'}
                          className={`p-1.5 rounded-lg hover:bg-white/10 transition ${u.isBanned ? 'text-green-400' : 'text-orange-400'}`}>
                          {u.isBanned ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                        <button onClick={() => deleteUser(u._id)} title="Delete Permanently"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Listings Tab */}
      {tab === 2 && (
        <div className="glass-card overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-gray-500 text-xs font-semibold uppercase border-b border-white/10">
                <th className="text-left pb-3">Listing</th>
                <th className="text-left pb-3">Seller</th>
                <th className="text-left pb-3">Type</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-right pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listings.map(l => (
                <tr key={l._id} className="text-sm">
                  <td className="py-3">
                    <p className="text-white font-medium line-clamp-1">{l.title}</p>
                    <p className="text-gray-500 text-xs">{l.category} · {l.condition}</p>
                  </td>
                  <td className="py-3 text-gray-400">{l.seller?.name}</td>
                  <td className="py-3"><span className={`badge ${l.type === 'donate' ? 'badge-green' : l.type === 'charity' ? 'badge-purple' : 'badge-blue'}`}>{l.type}</span></td>
                  <td className="py-3"><span className={`badge ${l.status === 'active' ? 'badge-green' : l.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>{l.status}</span></td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditListing(l)} title="Edit"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-blue-400 transition">
                          <Edit2 className="w-4 h-4" />
                      </button>
                      {l.status !== 'active' && (
                        <button onClick={() => moderateListing(l._id, 'active')} title="Approve" className="p-1.5 rounded-lg hover:bg-white/10 text-green-400 transition">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {l.status !== 'rejected' && (
                        <button onClick={() => moderateListing(l._id, 'rejected')} title="Reject" className="p-1.5 rounded-lg hover:bg-white/10 text-yellow-400 transition">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => deleteListing(l._id)} title="Delete" className="p-1.5 rounded-lg hover:bg-white/10 text-red-400 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 3 && (
        <div className="glass-card overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-gray-500 text-xs font-semibold uppercase border-b border-white/10">
                <th className="text-left pb-3">Order ID</th>
                <th className="text-left pb-3">Buyer</th>
                <th className="text-left pb-3">Amount</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-right pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map(o => (
                <tr key={o._id} className="text-sm">
                  <td className="py-3 text-gray-300 font-mono text-xs">{o._id.substring(18)}</td>
                  <td className="py-3 text-gray-400">{o.buyer?.name}</td>
                  <td className="py-3 font-semibold text-white">₹{o.amount}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <select value={o.paymentStatus} onChange={e => updateOrderStatus(o._id, null, e.target.value)}
                        className={`bg-dark-800 text-xs border border-white/10 rounded px-2 py-1 focus:outline-none ${o.paymentStatus === 'paid' ? 'text-green-400' : 'text-red-400'}`}>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <span className={`badge ${o.shippingStatus === 'delivered' ? 'badge-blue' : o.shippingStatus === 'shipped' ? 'badge-purple' : 'badge-yellow'}`}>{o.shippingStatus}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select value={o.shippingStatus} onChange={e => updateOrderStatus(o._id, e.target.value, null)}
                        className="bg-dark-800 text-xs border border-white/10 rounded px-2 py-1 text-white focus:outline-none">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button onClick={() => deleteOrder(o._id)} title="Delete Order" className="p-1.5 rounded-lg hover:bg-white/10 text-red-500 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="5" className="text-center text-gray-400 py-6">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Donations Tab */}
      {tab === 4 && (
        <div className="space-y-3">
          {donations.map(d => (
            <div key={d._id} className="glass-card flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{d.listing?.title}</p>
                <p className="text-gray-500 text-xs">Donor: {d.donor?.name} → Recipient: {d.recipient?.name || 'Unclaimed'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${d.status === 'delivered' ? 'badge-green' : d.status === 'claimed' ? 'badge-blue' : 'badge-yellow'}`}>{d.status}</span>
                <select value={d.status} onChange={e => updateDonationStatus(d._id, e.target.value)}
                  className="bg-dark-800 text-xs border border-white/10 rounded px-2 py-1 text-white focus:outline-none">
                  <option value="pending">Pending</option>
                  <option value="claimed">Claimed</option>
                  <option value="delivered">Delivered</option>
                </select>
                <button onClick={() => deleteDonation(d._id)} title="Delete Donation" className="p-1.5 rounded-lg hover:bg-white/10 text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {donations.length === 0 && <p className="text-center text-gray-400 py-12">No donations yet.</p>}
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Name</label>
                <input value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} className="input-field w-full" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                <input value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} className="input-field w-full" />
              </div>
              <button onClick={saveUserEdit} className="btn-primary w-full mt-4 py-2">Save Changes</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit Listing</h3>
              <button onClick={() => setEditListing(null)} className="text-gray-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Title</label>
                <input value={editListing.title} onChange={e => setEditListing({...editListing, title: e.target.value})} className="input-field w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Price</label>
                  <input type="number" value={editListing.price} onChange={e => setEditListing({...editListing, price: e.target.value})} className="input-field w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Type</label>
                  <select value={editListing.type} onChange={e => setEditListing({...editListing, type: e.target.value})} className="input-field w-full bg-dark-800">
                    <option value="sell">Sell</option>
                    <option value="donate">Donate</option>
                    <option value="charity">Charity</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                <textarea value={editListing.description} onChange={e => setEditListing({...editListing, description: e.target.value})} className="input-field w-full resize-none" rows={3}></textarea>
              </div>
              <button onClick={saveListingEdit} className="btn-primary w-full mt-4 py-2">Save Changes</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
