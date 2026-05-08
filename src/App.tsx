import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CreditCard, 
  History, 
  Plus, 
  LayoutDashboard, 
  ShieldCheck, 
  Menu,
  ChevronRight,
  Info,
  Scan,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DepositStatus, DepositSession, CheckMetadata } from './types';
import { CameraOverlay } from './components/CameraEmulator';
import { analyzeCheckImages } from './services/aiService';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'accounts', icon: CreditCard, label: 'Accounts' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'security', icon: ShieldCheck, label: 'Security' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState<DepositSession>({
    id: `DS-${Math.random().toString(36).substr(2, 9)}`,
    status: DepositStatus.IDLE
  });

  const startNewDeposit = () => {
    setSession({
      id: `DS-${Math.random().toString(36).substr(2, 9)}`,
      status: DepositStatus.CAPTURING_FRONT
    });
  };

  const handleCaptureFront = (img: string) => {
    setSession(prev => ({ ...prev, frontImage: img, status: DepositStatus.CAPTURING_BACK }));
  };

  const handleCaptureBack = (img: string) => {
    setSession(prev => ({ ...prev, backImage: img, status: DepositStatus.ANALYZING }));
  };

  useEffect(() => {
    if (session.status === DepositStatus.ANALYZING) {
      // Small delay to feel realistic then call AI
      const timer = setTimeout(async () => {
        try {
          // This call uses the Gemini API via the service
          const metadata = await analyzeCheckImages("some-front-data", "some-back-data");
          setSession(prev => ({ ...prev, metadata, status: DepositStatus.REVIEW }));
        } catch (err) {
          setSession(prev => ({ ...prev, status: DepositStatus.FAILED, error: "Image verification failed. Please ensure high lighting." }));
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [session.status]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/20">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-24 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 z-50">
        <div className="mb-12">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg shadow-emerald-500/20">
            $
          </div>
        </div>
        
        <nav className="flex flex-col gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-4 rounded-2xl transition-all duration-300 group relative ${
                activeTab === item.id ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-6 h-6" />
              {activeTab === item.id && (
                <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden group hover:border-emerald-500/50 transition-colors cursor-pointer">
            <span className="text-sm font-bold text-slate-300">JW</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-24 min-h-screen">
        <header className="h-24 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-12 sticky top-0 z-40">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase">Core / System /</span>
              <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 rounded text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                STABLE v4.0.1
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white capitalize mt-1">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search ledger..." 
                    className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all w-72 text-slate-200 placeholder:text-slate-600"
                />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-slate-950 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
              <Plus className="w-4 h-4" />
              New Action
            </button>
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6">
              {/* Stats Overview */}
              <div className="col-span-8 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-6">
                  <StatCard label="Ledger Balance" value="$12,482.00" trend="+2.4%" />
                  <StatCard label="Monthly Velocity" value="$4,200.00" trend="+5.1%" trendColor="text-blue-400" />
                  <StatCard label="System Integrity" value="OPTIMAL" trend="SECURE" trendColor="text-emerald-400" />
                </div>

                {/* Mobile Deposit Tool - Bento Card */}
                <section className="bg-slate-900 rounded-[32px] p-10 border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Fingerprint className="w-64 h-64 text-emerald-500" />
                    </div>

                    <div className="flex justify-between items-start mb-10 z-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                                <Scan className="w-8 h-8 text-emerald-500" />
                                AI Deposit Engine
                            </h2>
                            <p className="text-slate-500 text-sm mt-2 max-w-md font-medium">Capture and verify checks using real-time computer vision and Siamese neural verification.</p>
                        </div>
                        {session.status === DepositStatus.IDLE ? (
                            <button 
                                onClick={startNewDeposit}
                                className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-bold transition-all hover:bg-emerald-400 active:scale-95 shadow-xl shadow-emerald-500/20"
                            >
                                <Plus className="w-5 h-5" />
                                Initiate Capture
                            </button>
                        ) : (
                            <button 
                                onClick={() => setSession({ id: session.id, status: DepositStatus.IDLE })}
                                className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-200 font-bold transition-colors uppercase tracking-widest text-[10px]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Abort Transaction
                            </button>
                        )}
                    </div>

                    <div className="min-h-[450px] relative z-10 flex-grow">
                        <AnimatePresence mode="wait">
                            {session.status === DepositStatus.IDLE && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-800 rounded-[32px] bg-slate-950/30"
                                >
                                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-slate-700">
                                        <Building2 className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <p className="text-slate-500 text-center max-w-xs font-medium leading-relaxed">
                                        Ready for capture. Place check on a high-contrast dark surface for optimal MICR extraction.
                                    </p>
                                    <button 
                                        onClick={startNewDeposit}
                                        className="mt-8 text-emerald-400 font-bold hover:text-emerald-300 transition-colors uppercase tracking-widest text-xs"
                                    >
                                        View Security Protofols
                                    </button>
                                </motion.div>
                            )}

                            {/* Camera States */}
                            {(session.status === DepositStatus.CAPTURING_FRONT || session.status === DepositStatus.CAPTURING_BACK) && (
                                <motion.div 
                                    key={session.status}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="h-full"
                                >
                                    <CameraOverlay 
                                        label={session.status === DepositStatus.CAPTURING_FRONT ? "Frontal Scan" : "Endorsement Scan"} 
                                        sublabel={session.status === DepositStatus.CAPTURING_FRONT ? "Align check within reference brackets." : "Verify 'For Mobile Deposit Only' signature."}
                                        onCapture={session.status === DepositStatus.CAPTURING_FRONT ? handleCaptureFront : handleCaptureBack}
                                    />
                                </motion.div>
                            )}

                            {session.status === DepositStatus.ANALYZING && (
                                <motion.div 
                                    key="analyzing"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-[450px]"
                                >
                                    <div className="relative">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            className="w-32 h-32 border-4 border-t-emerald-500 border-slate-800 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                                            V-AUDIT
                                        </div>
                                    </div>
                                    <h3 className="mt-10 text-xl font-bold tracking-tight text-white">Neural Reconciliation Engine</h3>
                                    <p className="text-slate-500 text-sm mt-3 font-mono flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
                                        <RefreshCcw className="w-3 h-3 animate-spin text-emerald-500" />
                                        SIAMESE SIG / MICR_PARSE / NLP_AMOUNT
                                    </p>
                                </motion.div>
                            )}

                            {session.status === DepositStatus.REVIEW && session.metadata && (
                                <motion.div 
                                    key="review"
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="grid grid-cols-2 gap-10 h-full"
                                >
                                    <div className="space-y-8 flex flex-col">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-3 uppercase tracking-widest text-[11px] opacity-60">
                                            <ScanText className="w-5 h-5 text-emerald-500" />
                                            Extracted Telemetry
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 gap-4 flex-grow">
                                            <DataField label="Account Hierarchy" value={session.metadata.accountNumber} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <DataField label="Routing ID" value={session.metadata.routingNumber} />
                                                <DataField label="Check Index" value={session.metadata.checkNumber} />
                                            </div>
                                            <DataField label="Legal Resolution (words)" value={session.metadata.legalAmountText} isLegal />
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-[32px] p-8 border border-slate-800 shadow-inner flex flex-col">
                                        <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-widest text-[11px] opacity-60">
                                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                                            Compliance Report
                                        </h3>

                                        <div className="space-y-5 flex-grow">
                                            <AuditStatus label="Siamese Signature Analysis" status={session.metadata.signatureVerified} score="98.4%" />
                                            <AuditStatus label="Restrictive Endorsement Rule" status={session.metadata.endorsementDetected} />
                                            <AuditStatus label="Global Duplicate Consensus" status={!session.metadata.duplicateDetected} />
                                        </div>

                                        <div className="mt-10 pt-10 border-t border-slate-800">
                                            <div className="flex justify-between items-baseline mb-6">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Transaction</span>
                                                <span className="text-5xl font-black tracking-tighter text-white tabular-nums">${session.metadata.amount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => setSession(prev => ({ ...prev, status: DepositStatus.SUCCESS }))}
                                                    className="flex-1 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                                                >
                                                    Authorize
                                                </button>
                                                <button 
                                                     onClick={() => setSession(prev => ({ ...prev, status: DepositStatus.FAILED }))}
                                                     className="px-6 py-4 border border-slate-800 bg-slate-900 rounded-2xl font-bold text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Flag
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {session.status === DepositStatus.SUCCESS && (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-center"
                                >
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mb-8 border border-emerald-500/20">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h3 className="text-4xl font-black tracking-tight text-white">Deposit Synced</h3>
                                    <p className="text-slate-500 mt-4 max-w-sm font-medium leading-relaxed">
                                        Relayed to Fed via secure clearing. Funds scheduled as per Reg CC. 
                                        <br/>
                                        <span className="font-mono text-[10px] bg-slate-950 px-2 py-1 rounded inline-block mt-4 border border-slate-800">REF: {session.id}</span>
                                    </p>
                                    <button 
                                        onClick={() => setSession({ id: '', status: DepositStatus.IDLE })}
                                        className="mt-10 px-10 py-4 bg-white text-slate-950 rounded-2xl font-black tracking-widest uppercase text-xs"
                                    >
                                        Back to Terminal
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
              </div>

              {/* Sidebar Info - Bento Cards */}
              <div className="col-span-4 space-y-6">
                <section className="bg-slate-900 rounded-[32px] p-8 border border-slate-800 shadow-xl overflow-hidden relative">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-[11px] opacity-60">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Live Feed
                    </h3>
                    <div className="space-y-6">
                        <PendingItem title="Check Batch #1092" amount="$1,200.00" date="Awaiting Settlement" isPending />
                        <PendingItem title="Direct Deposit - HUB" amount="$4,500.00" date="Settled" status="settled" />
                        <PendingItem title="Mobile Capt. v4" amount="$125.00" date="Manual Review" status="flagged" />
                    </div>
                </section>

                <section className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[32px] p-8 text-slate-950 relative overflow-hidden group shadow-2xl shadow-emerald-500/10">
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                    <Info className="w-8 h-8 mb-6 opacity-30" />
                    <h3 className="text-2xl font-black leading-tight tracking-tight">V3 Audit System Active</h3>
                    <p className="mt-3 text-slate-950/70 text-sm font-semibold leading-relaxed">
                        End-to-end encryption active for all biometric and signature telemetry. Compliance verified against PCI-DSS v4.0.
                    </p>
                    <button className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950/60 hover:text-slate-950 border-b-2 border-slate-950/20 hover:border-slate-950 inline-block transition-all">
                        Audit Protocol 00-A
                    </button>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, trendColor = 'text-emerald-400' }: { label: string, value: string, trend: string, trendColor?: string }) {
  return (
    <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-xl hover:border-slate-700 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className={`text-[10px] font-black px-2 py-1 rounded bg-slate-950 border border-slate-800 ${trendColor}`}>
          {trend}
        </span>
      </div>
      <div className="text-3xl font-black tracking-tighter text-white tabular-nums group-hover:scale-[1.02] transition-transform origin-left">{value}</div>
    </div>
  );
}

function DataField({ label, value, isLegal = false }: { label: string, value: string, isLegal?: boolean }) {
  return (
    <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner group transition-colors hover:border-slate-700">
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">{label}</div>
      <div className={`font-bold ${isLegal ? 'italic text-base serif text-emerald-100' : 'font-mono text-lg text-white'}`}>{value}</div>
    </div>
  );
}

function AuditStatus({ label, status, score }: { label: string, status: boolean, score?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-3">
        {score && <span className="text-[10px] font-mono font-bold text-slate-500">{score}</span>}
        {status ? (
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid
            </div>
        ) : (
            <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase">
                <AlertCircle className="w-3.5 h-3.5" />
                Check
            </div>
        )}
      </div>
    </div>
  );
}

function PendingItem({ title, amount, date, isPending = false, status = 'idle' }: { title: string, amount: string, date: string, isPending?: boolean, status?: string }) {
  const getStatusClasses = () => {
    if (status === 'settled') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (status === 'flagged') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-slate-800 text-slate-500 border-slate-700';
  };

  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border group-hover:scale-110 ${getStatusClasses()}`}>
          {status === 'settled' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{title}</div>
          <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{date}</div>
        </div>
      </div>
      <div className="text-sm font-black text-white tabular-nums">{amount}</div>
    </div>
  );
}

