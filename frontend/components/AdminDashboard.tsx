
import React, { useState, useMemo } from 'react';
import { MOCK_ADMIN_STATS } from '../constants';
import { CountryRule, HSCodeRule, User, UserRole, TradeCalculation } from '../types';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Upload,
  X,
  Globe,
  UserPlus,
  Mail,
  Building2,
  ShieldAlert,
  Eye,
  Calendar,
  BarChart3,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';

interface AdminDashboardProps {
  countries: CountryRule[];
  setCountries: React.Dispatch<React.SetStateAction<CountryRule[]>>;
  hsCodes: HSCodeRule[];
  setHsCodes: React.Dispatch<React.SetStateAction<HSCodeRule[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  calculations: TradeCalculation[];
}

type SortKey = keyof User;
type SortOrder = 'asc' | 'desc';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  countries, setCountries, 
  hsCodes, setHsCodes, 
  users, setUsers,
  calculations
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'rates'>('users');
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: 'joinedDate', order: 'desc' });

  // New Country Form State
  const [newCountry, setNewCountry] = useState<CountryRule>({
    countryCode: '',
    countryName: '',
    defaultDutyRate: 0,
    defaultTaxRate: 0,
    vatRate: 0,
    currency: 'USD',
    currencySymbol: '$'
  });

  // New User Form State
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.CUSTOMER,
    company: ''
  });

  const handleAddCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry.countryCode || !newCountry.countryName) return;
    
    setCountries(prev => [...prev, { ...newCountry, countryCode: newCountry.countryCode.toUpperCase() }]);
    setShowAddCountry(false);
    setNewCountry({
      countryCode: '',
      countryName: '',
      defaultDutyRate: 0,
      defaultTaxRate: 0,
      vatRate: 0,
      currency: 'USD',
      currencySymbol: '$'
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userToAdd: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role as UserRole,
      company: newUser.company,
      joinedDate: Date.now()
    };

    setUsers(prev => [...prev, userToAdd]);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', role: UserRole.CUSTOMER, company: '' });
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const deleteCountry = (code: string) => {
    if (window.confirm(`Are you sure you want to remove ${code}?`)) {
      setCountries(prev => prev.filter(c => c.countryCode !== code));
    }
  };

  const deleteUser = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this user?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const getUserStats = (userId: string) => {
    const userCalcs = calculations.filter(c => c.userId === userId);
    const totalSpent = userCalcs.reduce((acc, curr) => acc + curr.totalLandedCost, 0);
    return {
      count: userCalcs.length,
      totalSpent
    };
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, searchTerm, sortConfig]);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="opacity-30" />;
    return sortConfig.order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
          <p className="text-slate-500">System-wide monitoring and configuration</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            <Upload size={18} />
            Bulk Import CSV
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Calculations', value: calculations.length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Now', value: MOCK_ADMIN_STATS.activeNow, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Monthly Rev', value: `$${MOCK_ADMIN_STATS.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          <button 
            onClick={() => setActiveSubTab('users')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${activeSubTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveSubTab('rates')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${activeSubTab === 'rates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Duty Rates & Taxes
          </button>
        </div>

        <div className="p-6">
          {activeSubTab === 'users' ? (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or company..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
                    <Filter size={16} />
                    Filters
                  </button>
                  <button 
                    onClick={() => setShowAddUser(true)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <UserPlus size={18} />
                    New User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2">
                          Name <SortIndicator column="name" />
                        </div>
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('email')}>
                        <div className="flex items-center gap-2">
                          Email <SortIndicator column="email" />
                        </div>
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('role')}>
                        <div className="flex items-center gap-2">
                          Role <SortIndicator column="role" />
                        </div>
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('company')}>
                        <div className="flex items-center gap-2">
                          Company <SortIndicator column="company" />
                        </div>
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('joinedDate')}>
                        <div className="flex items-center gap-2">
                          Joined <SortIndicator column="joinedDate" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {filteredAndSortedUsers.length > 0 ? (
                      filteredAndSortedUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                {u.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              u.role === UserRole.ADMIN 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{u.company || '—'}</td>
                          <td className="px-6 py-4 text-slate-400 font-medium">
                            {new Date(u.joinedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => setSelectedUser(u)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => setEditingUser(u)}
                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                title="Edit User"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => deleteUser(u.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Countries Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Global Country Rules</h3>
                  <button 
                    onClick={() => setShowAddCountry(true)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} />
                    Add Country
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Country</th>
                        <th className="px-4 py-3">Duty %</th>
                        <th className="px-4 py-3">VAT %</th>
                        <th className="px-4 py-3">Currency</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {countries.map((c) => (
                        <tr key={c.countryCode} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-blue-600">{c.countryCode}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{c.countryName}</td>
                          <td className="px-4 py-3">{c.defaultDutyRate}%</td>
                          <td className="px-4 py-3">{c.vatRate}%</td>
                          <td className="px-4 py-3 text-slate-500">{c.currency} ({c.currencySymbol})</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                              <button 
                                onClick={() => deleteCountry(c.countryCode)}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* HS Codes Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">HS Code Multipliers</h3>
                  <button className="text-blue-600 text-xs font-bold hover:underline">+ Add HS Code</button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-4 py-3">HS Code</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Duty Multiplier</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {hsCodes.map((h) => (
                        <tr key={h.code} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-emerald-600">{h.code}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{h.category}</td>
                          <td className="px-4 py-3">{h.dutyMultiplier}x</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                              <button className="p-1 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Country Modal */}
      {showAddCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Add New Country</h3>
                  <p className="text-xs text-slate-500">Configure global trade rules</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddCountry(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCountry} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Country Name</label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g. France"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newCountry.countryName}
                    onChange={e => setNewCountry({...newCountry, countryName: e.target.value})}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ISO Code (3 letters)</label>
                  <input 
                    required
                    maxLength={3}
                    type="text"
                    placeholder="e.g. FRA"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    value={newCountry.countryCode}
                    onChange={e => setNewCountry({...newCountry, countryCode: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Duty %</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newCountry.defaultDutyRate}
                    onChange={e => setNewCountry({...newCountry, defaultDutyRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tax %</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newCountry.defaultTaxRate}
                    onChange={e => setNewCountry({...newCountry, defaultTaxRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">VAT %</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newCountry.vatRate}
                    onChange={e => setNewCountry({...newCountry, vatRate: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Currency Code</label>
                  <input 
                    type="text"
                    placeholder="USD"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newCountry.currency}
                    onChange={e => setNewCountry({...newCountry, currency: e.target.value.toUpperCase()})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Symbol</label>
                  <input 
                    type="text"
                    placeholder="$"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newCountry.currencySymbol}
                    onChange={e => setNewCountry({...newCountry, currencySymbol: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddCountry(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  Create Country
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Add New User</h3>
                  <p className="text-xs text-slate-500">Provision platform access</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddUser(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="text"
                      placeholder="Jane Smith"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      value={newUser.name}
                      onChange={e => setNewUser({...newUser, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="email"
                      placeholder="jane@company.com"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      value={newUser.email}
                      onChange={e => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Access Role</label>
                    <div className="relative">
                      <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none bg-white"
                        value={newUser.role}
                        onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                      >
                        <option value={UserRole.CUSTOMER}>Customer</option>
                        <option value={UserRole.ADMIN}>Administrator</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company (Optional)</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Acme Inc"
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        value={newUser.company}
                        onChange={e => setNewUser({...newUser, company: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <Edit2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Edit User Details</h3>
                  <p className="text-xs text-slate-500">Update platform member configuration</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditUser} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                  <input 
                    required
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    value={editingUser.name}
                    onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                  <input 
                    required
                    type="email"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    value={editingUser.email}
                    onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Access Role</label>
                    <select 
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-white"
                      value={editingUser.role}
                      onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                    >
                      <option value={UserRole.CUSTOMER}>Customer</option>
                      <option value={UserRole.ADMIN}>Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company</label>
                    <input 
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      value={editingUser.company || ''}
                      onChange={e => setEditingUser({...editingUser, company: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Account Details</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldAlert size={14} className="text-slate-400" />
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        selectedUser.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 size={14} className="text-slate-400" />
                      <span>{selectedUser.company || 'Private Account'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      <span>Joined: {new Date(selectedUser.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4">Platform Usage Stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                          <BarChart3 size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Total Reports</span>
                      </div>
                      <p className="text-2xl font-black text-slate-900">{getUserStats(selectedUser.id).count}</p>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                          <DollarSign size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Landed Value</span>
                      </div>
                      <p className="text-2xl font-black text-slate-900">${getUserStats(selectedUser.id).totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <TrendingUp size={48} />
                  </div>
                  <h4 className="font-bold text-sm mb-1">Growth Engagement</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">This user has an active trade profile and regular interaction with the AI Assistant.</p>
                  <button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                    Generate Compliance Audit
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedUser(null)}
                className="bg-white border border-slate-200 px-6 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
