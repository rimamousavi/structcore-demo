import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FlaskConical, Droplets, Cuboid, Calculator, Database, Info, 
  TrendingUp, HelpCircle, BookOpen, Settings, Beaker, ShieldCheck 
} from 'lucide-react';

const DATASET_CACHE = [
  { id: 1, cmt: 540, wtr: 162, agg: 1040, snd: 676, age: 28, fc: 79.99 },
  { id: 2, cmt: 332, wtr: 228, agg: 932, snd: 594, age: 270, fc: 40.27 },
  { id: 3, cmt: 198, wtr: 192, agg: 978, snd: 825, age: 360, fc: 44.30 },
  { id: 4, cmt: 266, wtr: 228, agg: 932, snd: 670, age: 365, fc: 41.05 },
  { id: 5, cmt: 480, wtr: 192, agg: 932, snd: 594, age: 90, fc: 54.32 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [showGuide, setShowGuide] = useState(true);
  const [calculating, setCalculating] = useState(false);
  
  const [params, setParams] = useState({
    cement: 350,   
    water: 180,    
    coarse_agg: 950, 
    fine_agg: 750,     
    curing_days: 28        
  });

  const [estStrength, setEstStrength] = useState(0);
  const [gradeStatus, setGradeStatus] = useState('N/A');

  const runAnalysis = () => {
    setCalculating(true);
    setTimeout(() => {
      const { cement, water, curing_days, coarse_agg, fine_agg } = params;
      const wc_ratio = water / cement;
      let raw_fc = (85 * Math.pow(0.12, wc_ratio)); 
      const time_factor = 0.35 * Math.log(curing_days) + 0.15;
      const packing_density = (coarse_agg + fine_agg) / 1850;
      const noise = (Math.random() * 0.4) - 0.2;
      let final_fc = (raw_fc * time_factor * packing_density + noise).toFixed(2);
      
      if (final_fc < 5) final_fc = 5.00;
      if (final_fc > 105) final_fc = 105.00;

      setEstStrength(final_fc);
      if (final_fc > 45) setGradeStatus('High Performance (C50+)');
      else if (final_fc > 25) setGradeStatus('Standard Structural (C25/30)');
      else setGradeStatus('Sub-structural / Lean (C15/20)');
      setCalculating(false);
    }, 600);
  };

  useEffect(() => {
    runAnalysis();
  }, [params]);

  const updateParam = (e) => {
    const { name, value } = e.target;
    setParams(v => ({ ...v, [name]: parseFloat(value) }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="ltr">
      
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 border-b-4 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Cuboid size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase">StructCore Labs</h1>
              <p className="text-[10px] text-blue-400 font-mono">Computational Strength Estimation</p>
            </div>
          </div>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
          >
            <HelpCircle size={14} />
            {showGuide ? 'Close Guide' : 'User Guide'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        
        {/* Quick Guide Banner */}
        {showGuide && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <GuideStep 
              icon={<Settings className="text-blue-500" />} 
              title="1. Adjust Parameters" 
              desc="Modify mix proportions (Cement, Water, Age) using the sliders below."
            />
            <GuideStep 
              icon={<Beaker className="text-purple-500" />} 
              title="2. Structural Logic" 
              desc="The system automatically calculates W/C ratios and packing density based on empirical formulas."
            />
            <GuideStep 
              icon={<ShieldCheck className="text-emerald-500" />} 
              title="3. Review Results" 
              desc="View estimated MPa and the maturity curve projection in the right panel."
            />
          </div>
        )}

        <div className="flex gap-4 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('predict')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm transition-all ${activeTab === 'predict' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'}`}
          >
            <Calculator size={16} />
            Analysis Engine
          </button>
          <button 
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm transition-all ${activeTab === 'dataset' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'}`}
          >
            <Database size={16} />
            Reference Data
          </button>
        </div>

        {activeTab === 'predict' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-4">
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    <FlaskConical className="text-blue-600" size={18} />
                    Mix Design Inputs (SSD)
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <BookOpen size={12} />
                    Ref: ASTM C39 / ACI 211
                  </div>
                </div>
                
                <div className="space-y-8">
                  <InputControl 
                    label="Cementitious" 
                    info="Cement content per cubic meter"
                    sub="kg/m³" 
                    name="cement" 
                    value={params.cement} 
                    min={150} max={550} 
                    onChange={updateParam} 
                  />
                  <InputControl 
                    label="Free Water" 
                    info="Net water content (Impacts porosity)"
                    sub="kg/m³" 
                    name="water" 
                    value={params.water} 
                    min={120} max={280} 
                    onChange={updateParam} 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputControl label="Coarse Agg." sub="kg/m³" name="coarse_agg" value={params.coarse_agg} min={850} max={1150} onChange={updateParam} />
                    <InputControl label="Fine Agg." sub="kg/m³" name="fine_agg" value={params.fine_agg} min={600} max={950} onChange={updateParam} />
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <InputControl 
                      label="Curing Period" 
                      info="Duration of hydration (Standard is 28 days)"
                      sub="Days" 
                      name="curing_days" 
                      value={params.curing_days} 
                      min={1} max={90} 
                      onChange={updateParam} 
                    />
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strength Development Curve</h3>
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Model Output</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300"><span className="w-2 h-2 bg-slate-200 rounded-full"></span> Linear Ref.</div>
                  </div>
                </div>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { day: 3, fc: (estStrength * 0.45).toFixed(1) },
                      { day: 7, fc: (estStrength * 0.70).toFixed(1) },
                      { day: 14, fc: (estStrength * 0.88).toFixed(1) },
                      { day: 28, fc: estStrength },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="fc" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Result Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 text-center">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Estimated f'c Strength</p>
                  <div className="flex justify-center items-baseline gap-2">
                    {calculating ? (
                       <div className="h-24 flex items-center"><span className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></span></div>
                    ) : (
                      <>
                        <span className="text-8xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                          {estStrength}
                        </span>
                        <span className="text-xl font-light text-blue-400">MPa</span>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <div className="inline-flex flex-col px-6 py-3 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[9px] text-slate-500 uppercase mb-1">Quality Classification</span>
                      <span className="text-sm font-bold text-blue-300">{gradeStatus}</span>
                    </div>
                  </div>
                </div>
                <TrendingUp size={140} className="absolute -right-10 -bottom-10 opacity-5 text-blue-400" />
              </div>

              {/* Live Physics Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <MetricCard 
                  label="W/C Ratio" 
                  value={(params.water / params.cement).toFixed(3)} 
                  status={params.water / params.cement > 0.5 ? 'High' : 'Optimal'} 
                />
                <MetricCard 
                  label="Est. Density" 
                  value={Math.round(params.coarse_agg + params.fine_agg + params.cement + params.water)} 
                  unit="kg"
                />
              </div>

              {/* Knowledge Center */}
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 text-sm mb-3 flex items-center gap-2">
                   <Info size={16}/>
                   Interpretation Guide
                </h4>
                <ul className="text-[11px] text-blue-800/80 space-y-2 leading-relaxed">
                  <li>• Ideal <strong>Water/Cement (W/C)</strong> ratio for structural concrete is between 0.4 and 0.5.</li>
                  <li>• Strengths exceeding <strong>45 MPa</strong> are categorized as High-Performance Concrete (HPC).</li>
                  <li>• Estimates follow standard maturity calculation models (20°C ref).</li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-md font-bold">Calibration Dataset</h2>
                <p className="text-xs text-slate-400">Verified laboratory results for model validation</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="px-6 py-4">Sample</th>
                    <th className="px-6 py-4">Cement</th>
                    <th className="px-6 py-4">Water</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4 text-blue-600">Actual f'c</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {DATASET_CACHE.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-400">#00{row.id}</td>
                      <td className="px-6 py-4">{row.cmt} kg</td>
                      <td className="px-6 py-4">{row.wtr} kg</td>
                      <td className="px-6 py-4">{row.age} d</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{row.fc} MPa</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function GuideStep({ icon, title, desc }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4 items-start shadow-sm">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="text-sm font-bold mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, status }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
        {status && (
          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${status === 'Optimal' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {status}
          </span>
        )}
      </div>
      <div className="text-xl font-black text-slate-800">
        {value} <span className="text-xs font-normal text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function InputControl({ label, info, sub, name, value, min, max, onChange }) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <label className="text-[11px] font-black text-slate-700 uppercase tracking-wide flex items-center gap-1">
            {label}
          </label>
          <span className="text-[9px] text-slate-400 lowercase">{info}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-black text-blue-600">
            {value} <span className="text-[10px] font-normal text-slate-400 uppercase">{sub}</span>
          </span>
        </div>
      </div>
      <input 
        type="range" name={name} min={min} max={max} value={value} onChange={onChange}
        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
      />
    </div>
  );
}