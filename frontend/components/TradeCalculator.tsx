
import React, { useState } from 'react';
import { TradeCalculation, Incoterm, ShippingMethod, CountryRule, HSCodeRule } from '../types';
import { INCOTERMS, SHIPPING_METHODS } from '../constants';
import { calculateLandedCost } from '../utils/calculations';
import { 
  Plus, 
  FileText, 
  Download, 
  ChevronRight, 
  Info, 
  Truck, 
  Ship, 
  Plane,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface TradeCalculatorProps {
  onSave: (calc: TradeCalculation) => void;
  countries: CountryRule[];
  hsCodes: HSCodeRule[];
}

const TradeCalculator: React.FC<TradeCalculatorProps> = ({ onSave, countries, hsCodes }) => {
  const [formData, setFormData] = useState<Partial<TradeCalculation>>({
    productName: '',
    hsCode: '',
    quantity: 100,
    unitPrice: 50,
    originCountry: 'CHN',
    destinationCountry: 'USA',
    incoterm: 'FOB',
    shippingMethod: 'SEA',
    insuranceRate: 0.5,
    expectedProfitMargin: 20
  });

  const [result, setResult] = useState<TradeCalculation | null>(null);

  const handleCalculate = () => {
    const origin = countries.find(c => c.countryCode === formData.originCountry) || countries[0];
    const dest = countries.find(c => c.countryCode === formData.destinationCountry) || countries[1];
    const hs = hsCodes.find(h => h.code === formData.hsCode);
    
    const calc = calculateLandedCost(formData, origin, dest, hs);
    setResult(calc);
  };

  const chartData = result ? [
    { name: 'FOB Value', value: result.fobValue, color: '#2563eb' },
    { name: 'Freight', value: result.freightCost, color: '#3b82f6' },
    { name: 'Duty & Tax', value: result.customsDuty + result.importTax, color: '#ef4444' },
    { name: 'VAT', value: result.vatAmount, color: '#10b981' },
    { name: 'Misc/Handling', value: result.handlingCharges + result.insuranceCost, color: '#f59e0b' },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="text-blue-600" />
          Trade Parameters
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.productName}
                onChange={e => setFormData({...formData, productName: e.target.value})}
                placeholder="e.g. Premium Cotton T-Shirts"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">HS Code</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.hsCode}
                onChange={e => setFormData({...formData, hsCode: e.target.value})}
              >
                <option value="">Select HS Code...</option>
                {hsCodes.map(h => <option key={h.code} value={h.code}>{h.code} - {h.category}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
              <input 
                type="number" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Unit Price ($)</label>
              <input 
                type="number" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.unitPrice}
                onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Incoterm</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.incoterm}
                onChange={e => setFormData({...formData, incoterm: e.target.value as Incoterm})}
              >
                {INCOTERMS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Origin</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.originCountry}
                onChange={e => setFormData({...formData, originCountry: e.target.value})}
              >
                {countries.map(c => <option key={c.countryCode} value={c.countryCode}>{c.countryName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Destination</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.destinationCountry}
                onChange={e => setFormData({...formData, destinationCountry: e.target.value})}
              >
                {countries.map(c => <option key={c.countryCode} value={c.countryCode}>{c.countryName}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-3">Shipping Method</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setFormData({...formData, shippingMethod: 'SEA'})}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.shippingMethod === 'SEA' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                <Ship size={20} />
                <span className="text-xs font-semibold">Sea</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, shippingMethod: 'AIR'})}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.shippingMethod === 'AIR' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                <Plane size={20} />
                <span className="text-xs font-semibold">Air</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, shippingMethod: 'LAND'})}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.shippingMethod === 'LAND' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                <Truck size={20} />
                <span className="text-xs font-semibold">Land</span>
              </button>
            </div>
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Calculate Landed Cost
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {result ? (
          <>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => onSave(result)}
                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
                >
                  <Plus size={16} />
                  Save Record
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="text-blue-600" />
                Calculation Results
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-sm text-slate-500 mb-1">Total Landed Cost</p>
                  <p className="text-3xl font-black text-slate-900">${result.totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-sm text-slate-500 mb-1">Cost Per Unit</p>
                  <p className="text-3xl font-black text-blue-600">${result.costPerUnit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-4 border-t border-slate-100">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2 w-full">
                   {chartData.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                         <span className="text-slate-600">{item.name}</span>
                       </div>
                       <span className="font-semibold text-slate-900">${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                   ))}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="text-blue-500 shrink-0 mt-1" size={18} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Landed cost includes freight, insurance, port handling, and estimated customs duties based on the {result.destinationCountry} profile. Local VAT may be recoverable depending on your business status.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Info size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-slate-500">No Calculation Yet</h3>
            <p className="text-sm max-w-xs">Fill in the parameters on the left and click calculate to see your detailed landed cost breakdown.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeCalculator;
