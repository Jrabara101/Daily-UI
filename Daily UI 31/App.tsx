import React, { useState, useEffect } from 'react';
import { UploadedFile, FileStatus, AnalysisStats } from './types';
import DropZone from './components/DropZone';
import ContainmentUnit from './components/ContainmentUnit';
import StatsChart from './components/StatsChart';
import { analyzeSpectralEntity } from './services/geminiService';
import { Activity, ShieldCheck, Zap, Ghost } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [stats, setStats] = useState<AnalysisStats>({
    totalSize: 0,
    typeDistribution: []
  });

  // Calculate stats whenever files change
  useEffect(() => {
    const totalSize = files.reduce((acc, curr) => acc + curr.file.size, 0);
    
    // Group by MIME type
    const typeMap = new Map<string, number>();
    files.forEach(f => {
      const type = f.file.type || 'unknown/ectoplasm';
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });

    const typeDistribution = Array.from(typeMap.entries()).map(([name, value]) => ({
      name: name.split('/')[1] || name, // simplify name for chart
      value
    }));

    setStats({ totalSize, typeDistribution });
  }, [files]);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    // Generate IDs and initial state
    const newUploads: UploadedFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: FileStatus.IDLE,
      progress: 0,
      type: file.type || 'unknown',
      size: file.size
    }));

    setFiles(prev => [...newUploads, ...prev]);

    // Process each file (Upload Simulation -> Gemini Analysis)
    newUploads.forEach(upload => processFile(upload.id, upload.file));
  };

  const processFile = async (id: string, file: File) => {
    // 1. Simulate Upload "Trapping" Phase
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: FileStatus.UPLOADING } : f));

    // Simulation steps
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100)); // fast simulated upload
      setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: i } : f));
    }

    // 2. Gemini Analysis Phase
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: FileStatus.ANALYZING } : f));
    
    // Call Gemini Service
    const analysisResult = await analyzeSpectralEntity(file);

    // 3. Complete
    setFiles(prev => prev.map(f => 
      f.id === id ? { 
        ...f, 
        status: FileStatus.COMPLETED, 
        analysis: analysisResult 
      } : f
    ));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-ecto-green selection:text-slate-900 pb-20">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
               <ShieldCheck className="w-8 h-8 text-ecto-green" />
               <div className="absolute inset-0 bg-ecto-green blur-lg opacity-20 animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tighter text-white">
                SPECTRAL<span className="text-ecto-green">CONTAINMENT</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                Secure Entity Storage V.2.5
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
             <div className="flex items-center gap-2">
               <Activity className="w-4 h-4 text-plasma-purple" />
               <span>Grid Stability: 98%</span>
             </div>
             <div className="flex items-center gap-2">
               <Zap className="w-4 h-4 text-yellow-400" />
               <span>PKE Levels: Normal</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-slate-900/40 p-1 rounded-3xl border border-slate-800 shadow-2xl">
              <div className="bg-slate-950 rounded-[22px] p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Containment Intake</h2>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <DropZone 
                  onFilesSelected={handleFilesSelected} 
                  isProcessing={false} 
                />
              </div>
            </div>

            {/* List of Files */}
            <ContainmentUnit files={files} />
          </div>

          {/* Right Column: Stats & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              
              {/* Stats Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-slate-200">Sector Analysis</h3>
                   <span className="text-xs text-ecto-green font-mono border border-ecto-green/30 px-2 py-0.5 rounded">
                     LIVE DATA
                   </span>
                 </div>
                 <StatsChart stats={stats} />
                 
                 <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                     <p className="text-xs text-slate-500 uppercase">Total Mass</p>
                     <p className="text-2xl font-mono text-white">
                       {(stats.totalSize / 1024).toFixed(1)} <span className="text-sm text-slate-500">KB</span>
                     </p>
                   </div>
                   <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                     <p className="text-xs text-slate-500 uppercase">Entities</p>
                     <p className="text-2xl font-mono text-white">
                       {files.length}
                     </p>
                   </div>
                 </div>
              </div>

              {/* Decorative Info Panel */}
              <div className="relative overflow-hidden bg-gradient-to-br from-plasma-purple/20 to-slate-900 border border-plasma-purple/30 rounded-xl p-6">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Ghost className="w-32 h-32" />
                </div>
                <h3 className="font-bold text-plasma-purple mb-2">Protocol 031-B</h3>
                <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                  All contained entities are subjected to immediate Level 5 PKE analysis via the Gemini-2.5 Neural Cortex. 
                  Do not look directly into the containment beam.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="h-1 w-12 bg-plasma-purple rounded-full opacity-50"></span>
                  <span className="h-1 w-8 bg-plasma-purple rounded-full opacity-30"></span>
                  <span className="h-1 w-4 bg-plasma-purple rounded-full opacity-20"></span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;