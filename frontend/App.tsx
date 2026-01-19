
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TradeCalculator from './components/TradeCalculator';
import AdminDashboard from './components/AdminDashboard';
import TradeAssistant from './components/TradeAssistant';
import { User, UserRole, TradeCalculation, CountryRule, HSCodeRule } from './types';
import { INITIAL_COUNTRY_RULES, INITIAL_HS_CODES } from './constants';
import { Shield, LayoutDashboard, Calculator, History, MessageSquare, Globe, LogIn } from 'lucide-react';
import { saveCalculation } from './services/tradeService';
import { login, logout} from './services/authService';
import AuthForm from './components/AuthForm';






const INITIAL_USERS: User[] = [
  { id: 'admin_1', name: 'System Administrator', email: 'admin@tradeflow.com', role: UserRole.ADMIN, joinedDate: 1704067200000 },
  { id: 'user_1', name: 'John Doe', email: 'john.doe@logistics.co', role: UserRole.CUSTOMER, company: 'Logistics Co.', joinedDate: 1706745600000 },
  { id: 'user_2', name: 'Sarah Smith', email: 's.smith@globaltrade.io', role: UserRole.CUSTOMER, company: 'Global Trade Inc.', joinedDate: 1712188800000 },
];

const App: React.FC = () => {
  // Auth Simulation
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // App Data State
  const [calculations, setCalculations] = useState<TradeCalculation[]>([]);
  const [countries, setCountries] = useState<CountryRule[]>(INITIAL_COUNTRY_RULES);
  const [hsCodes, setHsCodes] = useState<HSCodeRule[]>(INITIAL_HS_CODES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // Load state from local storage for demo persistency
  useEffect(() => {
    const savedCalcs = localStorage.getItem('trade_flow_calcs');
    if (savedCalcs) setCalculations(JSON.parse(savedCalcs));

    const savedUsers = localStorage.getItem('trade_flow_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
  }, []);

  useEffect(() => {
    localStorage.setItem('trade_flow_calcs', JSON.stringify(calculations));
  }, [calculations]);

  useEffect(() => {
    localStorage.setItem('trade_flow_users', JSON.stringify(users));
  }, [users]);


const handleLogin = async (email: string, password: string) => {
  setIsLoggingIn(true);
  try {
    const userData = await login(email, password);
    setUser(userData);
    setActiveTab(userData.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard');
  } catch (err) {
    console.error(err);
    alert('Login failed');
  } finally {
    setIsLoggingIn(false);
  }
};
const handleLogout = async () => {
  try {
    await logout();
    setUser(null);
    setActiveTab('dashboard');
  } catch (err) {
    console.error(err);
    alert('Logout failed');
  }
};


const handleSaveCalculation = async (calc: TradeCalculation) => {
  try {
    await saveCalculation(calc);
    setCalculations([calc, ...calculations]);
    setActiveTab('dashboard');
  } catch (error) {
    console.error('Failed to save calculation', error);
  }
};


  // Auth Screen

if (!user) {
  return <AuthForm onLoginSuccess={setUser} />;
}


  // Application Layout Content
  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">Trade Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user.name}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Calculations</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{calculations.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Landed Cost (Last month)</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                ${calculations.reduce((acc, curr) => acc + curr.totalLandedCost, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-medium text-slate-500">HS Codes Queried</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {new Set(calculations.map(c => c.hsCode)).size}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Recent Calculations</h3>
              <button 
                onClick={() => setActiveTab('calculator')}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                + New Calculation
              </button>
            </div>
            <div className="overflow-x-auto">
              {calculations.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">HS Code</th>
                      <th className="px-6 py-4 text-right">Route</th>
                      <th className="px-6 py-4 text-right">Landed Cost</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calculations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{c.productName || 'Unnamed Cargo'}</td>
                        <td className="px-6 py-4 font-mono text-xs">{c.hsCode}</td>
                        <td className="px-6 py-4 text-slate-600">{c.originCountry} → {c.destinationCountry}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">${c.totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-right text-slate-400">{new Date(c.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <p>No calculations found. Start your first trade analysis to see data here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <TradeCalculator 
          onSave={handleSaveCalculation} 
          countries={countries} 
          hsCodes={hsCodes} 
        />
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">Trade Analytics</h1>
            <p className="text-slate-500">Detailed historical breakdown and reporting</p>
          </header>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <History size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">History Explorer</h3>
            <p className="text-slate-500 mb-6">View and export all your past trade calculations into PDF or Excel.</p>
            <button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
               Download CSV Report
            </button>
          </div>
        </div>
      )}

      {activeTab === 'assistant' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">AI Trade Assistant</h1>
            <p className="text-slate-500">Get expert advice on HS codes and international regulations</p>
          </header>
          <TradeAssistant />
        </div>
      )}

      {activeTab === 'admin-dashboard' && user.role === UserRole.ADMIN && (
        <AdminDashboard 
          countries={countries} 
          setCountries={setCountries} 
          hsCodes={hsCodes} 
          setHsCodes={setHsCodes}
          users={users}
          setUsers={setUsers}
          calculations={calculations}
          
        />
      )}
    </Layout>
  );
};

export default App;
