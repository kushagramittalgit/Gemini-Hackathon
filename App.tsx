
import React, { useState, useCallback } from 'react';
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
  MessageCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [file, setFile] = useState<FileData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Scholar is observing the ingredients...",
    "Scanning audio for health claims...",
    "Consulting classical medical texts...",
    "Searching global clinical databases...",
    "Calculating safety probability...",
    "Drafting your verdict card..."
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const commaIndex = base64.indexOf(',');
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
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    try {
      const analysis = await analyzeClaim({ base64: file.base64, mimeType: file.mimeType });
      setResult(analysis);
    } catch (err) {
      setError("The Scholar encountered an error. Please check your connection or try a different file.");
      console.error(err);
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `*Nuskha-Verify Result*\n\n*Verdict:* ${result.verdict.safetyRating}\n\n*English:* ${result.multilingualSummary.english}\n\n*Local:* ${result.multilingualSummary.local}\n\n_Verification by Nuskha-Verify Scholar_`;
    navigator.clipboard.writeText(text);
    alert("Summary copied for WhatsApp sharing!");
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="scholar-title text-xl font-bold text-slate-800 leading-tight">Nuskha-Verify</h1>
              <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Multimodal Scholar</p>
            </div>
          </div>
          {result && (
            <button 
              onClick={reset}
              className="text-slate-500 hover:text-emerald-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <RefreshCcw size={20} />
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!result && !analyzing ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h2 className="scholar-title text-4xl md:text-5xl font-bold text-slate-900 italic">
                Debunk Viral Health Hacks with Science
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto text-lg">
                Upload a video or image of a "miracle cure." Our scholar contrasts traditional wisdom with modern clinical evidence.
              </p>
            </div>

            {/* Upload Area */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
                file ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 group-hover:border-emerald-400 bg-white'
              }`}>
                {file ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <FileText size={32} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 truncate max-w-xs mx-auto">{file.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{file.mimeType}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-900">Drop claim video or image here</p>
                      <p className="text-sm text-slate-500">MP4, JPG, PNG supported</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {file && (
              <button
                onClick={startAnalysis}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Analyze Claim Now
              </button>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center space-x-3">
                <AlertTriangle size={20} className="shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        ) : analyzing ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Scholar at Work</h3>
              <p className="text-slate-500 text-lg italic transition-all duration-500 min-h-[1.5rem]">
                "{loadingMessages[loadingStep]}"
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            {/* Verdict Header */}
            <div className={`p-8 rounded-[2rem] border-2 shadow-sm flex flex-col md:flex-row items-center gap-6 ${
              SafetyColor[result!.verdict.safetyRating as keyof typeof SafetyColor]
            }`}>
              <div className="shrink-0 w-20 h-20 rounded-full bg-white/50 flex items-center justify-center">
                {result!.verdict.safetyRating === 'SAFE' ? (
                  <CheckCircle size={40} className="text-emerald-600" />
                ) : result!.verdict.safetyRating === 'DANGEROUS' ? (
                  <AlertTriangle size={40} className="text-rose-600" />
                ) : (
                  <Info size={40} className="text-amber-600" />
                )}
              </div>
              <div className="text-center md:text-left space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest opacity-70">Scholar Verdict</p>
                <h2 className="text-4xl scholar-title font-bold leading-none">{result!.verdict.safetyRating}</h2>
                <p className="text-lg font-medium max-w-lg">{result!.verdict.riskLevel}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ingredient Spotlight */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Upload size={20} />
                  <h3 className="font-bold text-lg">Ingredient Spotlight</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result!.ingredients.identified.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full uppercase">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm italic">
                  &ldquo;{result!.ingredients.visualEvidence}&rdquo;
                </p>
              </div>

              {/* The Claim */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-slate-900">
                  <MessageCircle size={20} />
                  <h3 className="font-bold text-lg">Viral Claim</h3>
                </div>
                <p className="text-slate-700 leading-relaxed italic">
                  {result!.claim}
                </p>
              </div>
            </div>

            {/* Contrastive Analysis Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                <div className="p-8 space-y-4">
                  <div className="flex items-center space-x-2 text-amber-700">
                    <BookOpen size={20} />
                    <h3 className="font-bold text-xl scholar-title">Traditional Knowledge</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {result!.realityCheck.traditionalPerspective}
                  </p>
                </div>
                <div className="p-8 space-y-4 bg-emerald-50/30">
                  <div className="flex items-center space-x-2 text-emerald-800">
                    <Microscope size={20} />
                    <h3 className="font-bold text-xl scholar-title">Modern Clinical Science</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {result!.realityCheck.modernScientificView}
                  </p>
                </div>
              </div>
              <div className="p-8 bg-slate-900 text-white">
                <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-xs mb-3">The Critical Gap</h4>
                <p className="text-slate-200 leading-relaxed">
                  {result!.realityCheck.theGap}
                </p>
              </div>
            </div>

            {/* Grounding Sources */}
            {result?.groundingSources && result.groundingSources.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ExternalLink size={18} />
                  Verification Sources
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.groundingSources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors flex items-center justify-between group shadow-sm"
                    >
                      <span className="text-sm font-medium text-slate-700 truncate mr-2">{source.title}</span>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-emerald-600 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp Summary Card */}
            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-6 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Shareable Verdict</p>
                  <h3 className="text-2xl font-bold scholar-title">WhatsApp Summary</h3>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all active:scale-90"
                >
                  <Share2 size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-emerald-50 text-sm leading-relaxed">&ldquo;{result!.multilingualSummary.english}&rdquo;</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border-l-4 border-white/40">
                  <p className="text-emerald-50 text-sm leading-relaxed italic">{result!.multilingualSummary.local}</p>
                </div>
              </div>
              <p className="text-[10px] text-emerald-200/60 uppercase tracking-tighter">
                Verification ID: {Math.random().toString(36).substring(7).toUpperCase()} • Powered by Gemini 3 Flash
              </p>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-slate-100 rounded-2xl text-center">
              <p className="text-xs text-slate-500 font-medium">
                DISCLAIMER: This is a safety verification using AI research, not medical advice. Always consult a qualified physician before beginning any traditional or alternative treatment.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Persistent CTA on Desktop / Mobile bottom bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 px-4 py-4 md:hidden">
        {result ? (
          <button 
            onClick={reset}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2"
          >
            <RefreshCcw size={18} />
            <span>New Analysis</span>
          </button>
        ) : !analyzing && file && (
          <button 
            onClick={startAnalysis}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold"
          >
            Start Analyzing
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;
