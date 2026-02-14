
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, FileData, SafetyColor } from './types';
import { analyzeClaim } from './geminiService';
import { 
  ShieldCheck, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Share2, 
  FileText, 
  RefreshCcw,
  BookOpen,
  Microscope,
  ExternalLink,
  MessageCircle,
  Zap,
  ChevronRight,
  Stethoscope,
  Dna
} from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<FileData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    "Initializing neural diagnostic tools...",
    "Scanning video frames for botanical markers...",
    "Processing audio waveforms for medical claims...",
    "Cross-referencing Charaka Samhita archives...",
    "Querying NIH clinical databases...",
    "Synthesizing contrastive analysis...",
    "Formulating the final verdict..."
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const commaIndex = base64.indexOf(',');
      
      setPreviewUrl(base64);
      setFile({
        base64: base64.substring(commaIndex + 1),
        mimeType: selectedFile.type,
        name: selectedFile.name,
      });
      setError(null);
      setResult(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const startAnalysis = async () => {
    if (!file) return;

    setAnalyzing(true);
    setResult(null);
    setError(null);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    try {
      const analysis = await analyzeClaim({ base64: file.base64, mimeType: file.mimeType });
      setResult(analysis);
    } catch (err) {
      setError("The Scholar encountered a transmission error. Please attempt diagnostic again.");
      console.error(err);
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `🔍 *Nuskha-Verify Diagnostic*\n\n🛡️ *Safety:* ${result.verdict.safetyRating}\n\n📝 *Verdict:* ${result.multilingualSummary.english}\n\n🇮🇳 *Native:* ${result.multilingualSummary.local}\n\n⚠️ _Verification for safety only. Consult a real doctor._`;
    navigator.clipboard.writeText(text);
    alert("Diagnostic Summary copied!");
  };

  return (
    <div className="min-h-screen">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-10 float opacity-30"><Dna size={120} className="text-emerald-300" /></div>
        <div className="absolute bottom-1/4 right-10 float opacity-20" style={{animationDelay: '1s'}}><Stethoscope size={150} className="text-blue-300" /></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <nav className="glass sticky top-0 z-50 border-b border-white/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
               <div className="absolute inset-0 bg-emerald-400 blur-lg opacity-40 group-hover:opacity-60 transition-all"></div>
               <div className="relative w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:rotate-12 transition-transform">
                <ShieldCheck size={28} />
              </div>
            </div>
            <div>
              <h1 className="scholar-title text-2xl font-black text-slate-800 tracking-tight">Nuskha-Verify</h1>
              <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <p className="tech-font text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">Scholar Diagnostic AI</p>
              </div>
            </div>
          </div>
          {result && (
            <button 
              onClick={reset}
              className="group flex items-center space-x-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 px-4 py-2 rounded-xl transition-all border border-slate-200"
            >
              <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
              <span className="font-bold text-xs uppercase tracking-wider">New Diagnostic</span>
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {!result && !analyzing ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-emerald-100 shadow-sm mb-4">
                <Zap size={14} className="text-emerald-500 fill-emerald-500" />
                <span className="tech-font text-[10px] font-bold tracking-widest text-emerald-600">MULTIMODAL DEBUNKING ENGINE</span>
              </div>
              <h2 className="scholar-title text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Authenticity for <span className="text-emerald-600 italic">Tradition</span>, Rigor for <span className="text-slate-500">Science</span>.
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                Scan viral health "hacks" to instantly verify them against ancient wisdom and modern clinical data.
              </p>
            </div>

            {/* Upload Area */}
            <div className="max-w-3xl mx-auto">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-[3rem] p-4 transition-all duration-500 bg-white/50 backdrop-blur-sm ${
                  file ? 'border-emerald-500 ring-4 ring-emerald-50 shadow-2xl' : 'border-slate-300 hover:border-emerald-400 hover:bg-white shadow-lg'
                }`}
              >
                <div className={`rounded-[2.5rem] overflow-hidden p-10 flex flex-col items-center justify-center space-y-6 transition-all ${
                  file ? 'bg-emerald-50/50' : 'bg-slate-50'
                }`}>
                   {previewUrl ? (
                     <div className="relative w-full aspect-video md:aspect-auto md:h-[300px] rounded-2xl overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
                        {file?.mimeType.startsWith('video') ? (
                          <video src={previewUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={previewUrl} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-emerald-900/10 pointer-events-none"></div>
                        <div className="scan-line"></div>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl flex items-center justify-between">
                            <span className="text-white text-xs font-mono tracking-tighter truncate w-40">{file?.name}</span>
                            <div className="flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase">Ready</span>
                            </div>
                        </div>
                     </div>
                   ) : (
                    <>
                      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-xl transform group-hover:-rotate-6 group-hover:text-emerald-400 transition-all duration-500">
                        <Upload size={40} />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">Initiate Scanner</p>
                        <p className="text-slate-500 mt-2 font-medium">Click to upload health claim video or image</p>
                      </div>
                    </>
                   )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={startAnalysis}
                    className="group relative overflow-hidden bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-2xl hover:shadow-emerald-500/20 active:scale-95 flex items-center space-x-4"
                  >
                    <div className="absolute inset-0 shimmer opacity-20"></div>
                    <span>Run Diagnostic</span>
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="max-w-xl mx-auto p-5 bg-rose-50 border-2 border-rose-100 text-rose-700 rounded-2xl flex items-center space-x-4 animate-bounce">
                <AlertTriangle size={24} className="shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            )}
          </div>
        ) : analyzing ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-12 text-center">
            <div className="relative p-1">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-75"></div>
              {/* Spinning border */}
              <div className="relative w-40 h-40 border-8 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                 <div className="bg-white p-6 rounded-3xl shadow-lg">
                   <ShieldCheck size={48} className="animate-pulse" />
                 </div>
              </div>
            </div>
            <div className="space-y-4 max-w-md">
               <div className="flex justify-center space-x-1">
                  {[...Array(loadingStep + 1)].map((_, i) => (
                    <div key={i} className="w-8 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                  ))}
               </div>
               <h3 className="text-3xl font-black text-slate-900 tech-font uppercase tracking-tighter">Analysis in Progress</h3>
               <p className="text-slate-500 text-lg font-medium italic min-h-[1.5rem] px-4">
                 &ldquo;{loadingMessages[loadingStep]}&rdquo;
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-1000">
            {/* Verdict Header - High Impact */}
            <div className={`relative overflow-hidden p-1 bg-gradient-to-br rounded-[3rem] shadow-2xl ${
              result!.verdict.safetyRating === 'SAFE' ? 'from-emerald-400 to-emerald-600' : 
              result!.verdict.safetyRating === 'DANGEROUS' ? 'from-rose-500 to-rose-700' : 
              'from-amber-400 to-amber-600'
            }`}>
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <div className="absolute top-0 left-0 w-full h-full shimmer"></div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm rounded-[2.8rem] p-10 flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className={`shrink-0 w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-xl transform -rotate-3 ${
                  result!.verdict.safetyRating === 'SAFE' ? 'bg-emerald-100 text-emerald-600' : 
                  result!.verdict.safetyRating === 'DANGEROUS' ? 'bg-rose-100 text-rose-600' : 
                  'bg-amber-100 text-amber-600'
                }`}>
                  {result!.verdict.safetyRating === 'SAFE' ? <CheckCircle size={64} /> : 
                   result!.verdict.safetyRating === 'DANGEROUS' ? <AlertTriangle size={64} /> : 
                   <Info size={64} />}
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <span className="tech-font text-xs font-bold uppercase tracking-[0.3em] opacity-40">Final Verification Verdict</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>
                  <h2 className="text-6xl scholar-title font-black leading-tight mb-2 tracking-tight">
                    {result!.verdict.safetyRating}
                  </h2>
                  <p className="text-xl font-semibold text-slate-600 leading-relaxed max-w-2xl">
                    {result!.verdict.riskLevel}
                  </p>
                </div>
              </div>
            </div>

            {/* Scientific vs Traditional Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Context */}
              <div className="lg:col-span-4 space-y-8">
                {/* Ingredients */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center space-x-3 text-emerald-600">
                    <div className="p-2 bg-emerald-50 rounded-lg"><Upload size={18} /></div>
                    <h3 className="font-bold text-lg uppercase tracking-wider tech-font">Markers Identified</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result!.ingredients.identified.map((item, idx) => (
                      <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-700 text-[10px] font-black rounded-xl uppercase tracking-widest shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-slate-500 text-sm italic font-medium border-l-4 border-emerald-400">
                    &ldquo;{result!.ingredients.visualEvidence}&rdquo;
                  </div>
                </div>

                {/* The Claim */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl space-y-4">
                  <div className="flex items-center space-x-3 text-emerald-400">
                    <MessageCircle size={18} />
                    <h3 className="font-bold text-lg uppercase tracking-wider tech-font">Claim Context</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed italic text-lg font-light">
                    &ldquo;{result!.claim}&rdquo;
                  </p>
                </div>
              </div>

              {/* Right Column: Deep Dive */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden h-full flex flex-col">
                   <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 flex-1">
                      <div className="p-10 space-y-6 hover:bg-amber-50/20 transition-colors group">
                        <div className="flex items-center space-x-3 text-amber-700">
                          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                            <BookOpen size={24} />
                          </div>
                          <h3 className="font-bold text-2xl scholar-title">Traditional Root</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-base font-medium">
                          {result!.realityCheck.traditionalPerspective}
                        </p>
                      </div>
                      <div className="p-10 space-y-6 bg-slate-50/50 hover:bg-emerald-50/30 transition-colors group">
                        <div className="flex items-center space-x-3 text-emerald-800">
                          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:-rotate-6 transition-transform">
                            <Microscope size={24} />
                          </div>
                          <h3 className="font-bold text-2xl scholar-title">Clinical Review</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-base font-medium">
                          {result!.realityCheck.modernScientificView}
                        </p>
                      </div>
                   </div>
                   <div className="p-10 bg-emerald-900 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="shrink-0 w-16 h-16 bg-emerald-400/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center">
                           <AlertTriangle size={32} className="text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-black text-emerald-400 uppercase tracking-[0.2em] text-xs mb-2 tech-font">The Critical Deviation</h4>
                          <p className="text-emerald-50 leading-relaxed text-lg font-semibold">
                            {result!.realityCheck.theGap}
                          </p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Share & Sources Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* WhatsApp Summary */}
              <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-all">
                    <Share2 size={120} />
                 </div>
                 <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                       <h3 className="text-3xl font-bold scholar-title">Verdict Summary</h3>
                       <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 tech-font">WhatsApp Ready Diagnostic</p>
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="bg-white text-emerald-600 p-4 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <Share2 size={24} />
                    </button>
                 </div>
                 <div className="space-y-6">
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                       <p className="text-emerald-50 text-lg leading-relaxed font-semibold">&ldquo;{result!.multilingualSummary.english}&rdquo;</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-3xl border-l-8 border-emerald-300">
                       <p className="text-emerald-50 text-lg leading-relaxed italic font-medium">{result!.multilingualSummary.local}</p>
                    </div>
                 </div>
              </div>

              {/* Sources */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg tech-font uppercase tracking-widest">
                     <div className="p-2 bg-slate-200 rounded-xl"><ExternalLink size={20} /></div>
                     Grounding Sources
                   </h3>
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">Verified Results</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {result?.groundingSources && result.groundingSources.length > 0 ? (
                    result.groundingSources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all flex items-center justify-between group shadow-sm"
                      >
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                              <ExternalLink size={18} />
                           </div>
                           <span className="text-sm font-bold text-slate-700 line-clamp-1">{source.title}</span>
                        </div>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </a>
                    ))
                  ) : (
                    <div className="p-10 text-center bg-white border border-slate-200 rounded-3xl border-dashed">
                       <p className="text-slate-400 font-medium">No external citations found for this specific claim.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] text-center shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-slate-200 to-rose-500"></div>
               <p className="text-sm text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed italic">
                 "This verification engine uses generative AI to contrast sources. It does not replace the clinical judgment of a licensed medical professional. If you are experiencing health issues, seek immediate professional help."
               </p>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar (Mobile) */}
      <footer className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
        {result ? (
          <button 
            onClick={reset}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 shadow-2xl active:scale-95 transition-all"
          >
            <RefreshCcw size={20} />
            <span>New Analysis</span>
          </button>
        ) : !analyzing && file && (
          <button 
            onClick={startAnalysis}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <Zap size={20} className="fill-white" />
            <span>Initiate Analysis</span>
          </button>
        )}
      </footer>

      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default App;
