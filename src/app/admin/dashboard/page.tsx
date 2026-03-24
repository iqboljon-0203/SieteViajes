'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Map, TrendingUp, Bell, Mail, ChevronRight, Plus, 
  RefreshCcw, Loader2, Sparkles, Target, BarChart3, 
  PieChart as PieIcon, Activity, ArrowUpRight, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

export default function AdminDashboard() {
  const [syncing, setSyncing] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeTours: 0,
    newLeads: 0,
    conversionRate: 0,
    potentialRevenue: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  const fetchDashboardData = async () => {
    const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact' });
    const { count: toursCount } = await supabase.from('tours').select('*', { count: 'exact' });
    const { data: recentLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(10);
    const { data: allLeads } = await supabase.from('leads').select('created_at, type, status');
    
    // Process lead velocity (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            date: d.toLocaleDateString([], { weekday: 'short' }),
            count: allLeads?.filter(l => new Date(l.created_at).toDateString() === d.toDateString()).length || 0,
            fullDate: d.toDateString()
        };
    }).reverse();

    // Process types for pie
    const types = [
        { name: 'Booking', value: allLeads?.filter(l => l.type === 'booking').length || 0, color: '#3B82F6' },
        { name: 'Inquiry', value: allLeads?.filter(l => l.type === 'inquiry' || l.type === 'quote').length || 0, color: '#F59E0B' }
    ];

    // Process monthly trajectory (last 12 months)
    const last12Months = [...Array(12)].map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
            date: d.toLocaleDateString([], { month: 'short' }),
            count: allLeads?.filter(l => {
                const leadDate = new Date(l.created_at);
                return leadDate.getMonth() === d.getMonth() && leadDate.getFullYear() === d.getFullYear();
            }).length || 0
        };
    }).reverse();

    setStats({
      totalLeads: leadsCount || 0,
      activeTours: toursCount || 0,
      newLeads: recentLeads?.filter(l => l.status === 'new').length || 0,
      conversionRate: leadsCount ? Math.round((recentLeads?.filter(l => l.status === 'contacted').length || 0) / leadsCount * 100) : 0,
      potentialRevenue: (leadsCount || 0) * 1250 // Estimated average commission
    });

    setLeads(recentLeads || []);
    setChartData(last7Days);
    setMonthlyData(last12Months);
    setTypeData(types);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1 px-0.5">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Intelligence Matrix</span>
           </div>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter leading-none mb-1">
              Commander Dashboard
           </h1>
           <p className="text-slate-500 font-bold italic text-xs pl-0.5">Real-time operational telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={fetchDashboardData}
             className="w-11 h-11 bg-white dark:bg-slate-800 border border-border rounded-xl flex items-center justify-center text-azure shadow-soft hover:rotate-180 transition-all duration-700 active:scale-95"
          >
             <RefreshCcw size={18} />
          </button>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 pr-4 rounded-2xl border border-border shadow-soft">
             <div className="w-10 h-10 rounded-xl azure-gradient text-white flex items-center justify-center font-black text-lg shadow-xl shadow-azure/20">A</div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Primary Admin</p>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Status: Elevated</p>
             </div>
          </div>
        </div>
      </header>

      {/* Hero Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Cloud Inventory', val: stats.activeTours, sub: 'Active Exp', icon: Map, color: 'blue', secondary: 'Live' },
           { label: 'Lead Velocity', val: stats.newLeads, sub: 'Inquiries', icon: Users, color: 'gold', secondary: 'Urgent' },
           { label: 'Revenue', val: `$${stats.potentialRevenue.toLocaleString()}`, sub: 'Projected', icon: TrendingUp, color: 'emerald', secondary: 'Est' },
           { label: 'Conversion', val: `${stats.conversionRate}%`, sub: 'Yield', icon: Target, color: 'purple', secondary: 'Opt' }
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] border border-border shadow-soft relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
           >
              <div className="absolute -right-3 -top-3 opacity-5 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-1000">
                 <stat.icon size={100} />
              </div>
              <div className="flex items-center justify-between mb-6">
                 <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-azure group-hover:text-white transition-all duration-700`}>
                    <stat.icon size={20} />
                 </div>
                 <div className="px-2 py-0.5 bg-emerald-50 text-emerald-500 text-[7px] font-black uppercase rounded-lg tracking-widest">{stat.secondary}</div>
              </div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">{stat.label}</p>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-1">{stat.val}</h3>
                 <p className="text-[10px] font-bold text-slate-500 italic">{stat.sub}</p>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Analytics Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[3rem] border border-border p-8 shadow-soft relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 px-1">
               <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white flex items-center gap-3 text-nowrap">
                     <Activity className="text-azure w-5 h-5" /> Lead Velocity
                  </h3>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">
                     Engagement telemetry over {view === 'monthly' ? '12M' : '7D'}
                  </p>
               </div>
               <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border shadow-inner">
                  <button 
                     onClick={() => setView('weekly')}
                     className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${view === 'weekly' ? 'azure-gradient text-white shadow-xl shadow-azure/20' : 'text-slate-400 hover:text-azure'}`}
                  >
                     Weekly
                  </button>
                  <button 
                     onClick={() => setView('monthly')}
                     className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${view === 'monthly' ? 'azure-gradient text-white shadow-xl shadow-azure/20' : 'text-slate-400 hover:text-azure'}`}
                  >
                     Monthly
                  </button>
               </div>
            </div>

            <div className="h-[280px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={view === 'monthly' ? monthlyData : chartData}>
                     <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                     <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900, fill: '#94A3B8'}} 
                        dy={10}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: '#1E293B', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontWeight: 900, fontSize: '12px' }}
                        labelStyle={{ color: '#64748B', fontSize: '10px', marginBottom: '8px', fontWeight: 900, textTransform: 'uppercase' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3B82F6" 
                        strokeWidth={4} 
                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: '#3B82F6', stroke: '#fff', strokeWidth: 4 }}
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                        animationDuration={2000}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Pie Analysis */}
         <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-border p-8 shadow-soft relative overflow-hidden flex flex-col items-center text-center">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-1">Intent Matrix</h3>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-6">Engagement type</p>
            
            <div className="h-[200px] w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={80}
                        paddingAngle={6}
                        dataKey="value"
                        animationDuration={1500}
                     >
                        {typeData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{stats.totalLeads}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</span>
               </div>
            </div>

            <div className="w-full space-y-3 mt-6">
               {typeData.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-transparent hover:border-border transition-all group">
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }}></div>
                        <span className="text-[10px] font-black uppercase italic tracking-tight text-slate-600 dark:text-slate-300">{t.name}</span>
                     </div>
                     <span className="text-base font-black italic tracking-tighter text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{t.value}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Secondary Intelligence: Recent Activity Terminal */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-border shadow-soft overflow-hidden">
         <div className="p-8 border-b border-border flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/10">
            <div>
               <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Recent Signal Ingest</h2>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Live operational telemetry</p>
            </div>
            <Link href="/admin/inquiries" className="azure-gradient text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
               Analyze <ArrowUpRight size={14} />
            </Link>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-[8px] uppercase tracking-[0.2em] font-black">
                  <tr>
                     <th className="px-8 py-4">Identity</th>
                     <th className="px-8 py-4">Objective</th>
                     <th className="px-8 py-4">Time</th>
                     <th className="px-8 py-4">Vector</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border text-xs">
                  {leads.map((lead) => (
                     <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl azure-gradient text-white flex items-center justify-center text-xl font-black italic shadow-2xl shadow-azure/10 ring-4 ring-azure/5">
                                 {lead.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                 <p className="font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{lead.name}</p>
                                 <p className="text-[10px] text-slate-400 font-bold italic">{lead.phone || lead.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-0.5">
                              <span className="font-black text-slate-700 dark:text-white uppercase italic tracking-tighter">{lead.tour_name || 'General Discov'}</span>
                              <div className={`px-2 py-0.5 w-fit ${lead.type === 'booking' ? 'bg-emerald-50 text-emerald-500' : 'bg-gold/10 text-gold'} text-[7px] font-black rounded-md uppercase tracking-widest border border-transparent`}>
                                 {lead.type}
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-[10px] text-slate-500 font-black uppercase tracking-widest italic opacity-60">
                           {new Date(lead.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${lead.status === 'new' ? 'bg-azure animate-pulse' : 'bg-slate-200'}`}></div>
                              <span className={`text-[9px] font-black uppercase tracking-widest ${lead.status === 'new' ? 'text-azure' : 'text-slate-400'}`}>{lead.status}</span>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {leads.length === 0 && (
                     <tr>
                        <td colSpan={4} className="px-12 py-32 text-center">
                           <div className="flex flex-col items-center gap-4 opacity-20">
                              <Activity size={64} className="text-slate-400" />
                              <p className="text-xl font-black uppercase italic tracking-tighter">Awaiting Signal Ingest...</p>
                           </div>
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
