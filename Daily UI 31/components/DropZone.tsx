import React, { useRef, useState, useCallback } from 'react';
import { Upload, Zap, Ghost } from 'lucide-react';
import { DragState } from '../types';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, isProcessing }) => {
  const [dragState, setDragState] = useState<DragState>({ isDragging: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragState.isDragging) {
      setDragState({ isDragging: true });
    }
  }, [dragState.isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ isDragging: false });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ isDragging: false });
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(droppedFiles);
    }
  }, [onFilesSelected]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`
        relative group cursor-pointer overflow-hidden
        rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
        flex flex-col items-center justify-center text-center p-10 h-80
        ${dragState.isDragging 
          ? 'border-ecto-green bg-ecto-green/10 scale-[1.02] shadow-[0_0_30px_rgba(57,255,20,0.3)]' 
          : 'border-slate-600 hover:border-ecto-green hover:bg-slate-800/50 bg-slate-900/50'}
        ${isProcessing ? 'pointer-events-none opacity-50' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerSelect}
    >
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />

      {/* Background Animated Beams (Only visible on hover or drag) */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${dragState.isDragging ? 'opacity-100' : 'opacity-0'}`}>
         <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-ecto-green to-transparent animate-beam opacity-20"></div>
         <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-ecto-green to-transparent animate-beam opacity-20 delay-75"></div>
      </div>

      <div className="z-10 flex flex-col items-center space-y-4">
        <div className={`
          relative p-6 rounded-full bg-slate-800 border border-slate-700 
          transition-all duration-300
          ${dragState.isDragging ? 'rotate-12 scale-110 border-ecto-green shadow-[0_0_15px_#39ff14]' : 'group-hover:border-ecto-green/50'}
        `}>
          {dragState.isDragging ? (
             <Ghost className="w-10 h-10 text-ecto-green animate-bounce" />
          ) : (
             <Upload className="w-10 h-10 text-slate-400 group-hover:text-ecto-green transition-colors" />
          )}
          
          {/* Decorative Orbs */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-plasma-purple rounded-full blur-[2px] animate-pulse"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-ecto-green rounded-full blur-[2px] animate-pulse delay-150"></div>
        </div>

        <div>
          <h3 className={`text-xl font-bold mb-1 transition-colors ${dragState.isDragging ? 'text-ecto-green' : 'text-slate-200'}`}>
            {dragState.isDragging ? 'RELEASE TO CONTAIN' : 'Initiate Containment Sequence'}
          </h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Drag and drop spectral entities (files) here, or click to browse the dimensional plane.
          </p>
        </div>

        {/* Pseudo-Button */}
        <div className="mt-4 px-6 py-2 rounded-lg bg-slate-800 border border-slate-600 text-xs font-mono text-slate-400 group-hover:border-ecto-green group-hover:text-ecto-green transition-all">
          SYSTEM_READY.exe
        </div>
      </div>

      {/* Decorative Corner Brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-600 group-hover:border-ecto-green transition-colors"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-600 group-hover:border-ecto-green transition-colors"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-600 group-hover:border-ecto-green transition-colors"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-600 group-hover:border-ecto-green transition-colors"></div>
    </div>
  );
};

export default DropZone;