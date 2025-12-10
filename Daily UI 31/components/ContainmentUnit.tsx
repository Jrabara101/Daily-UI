import React from 'react';
import { FileStatus, UploadedFile } from '../types';
import { Ghost, CheckCircle, AlertTriangle, Loader2, FileText, Image as ImageIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContainmentUnitProps {
  files: UploadedFile[];
}

const ContainmentUnit: React.FC<ContainmentUnitProps> = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Zap className="w-5 h-5 text-plasma-purple" />
          Containment Unit Status
        </h2>
        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
          CAPACITY: {files.length} ENTITIES
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`
                relative overflow-hidden rounded-xl border p-4
                bg-slate-900/80 backdrop-blur-md
                ${file.status === FileStatus.ERROR 
                  ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                  : file.status === FileStatus.COMPLETED 
                    ? 'border-ecto-green/50 shadow-[0_0_15px_rgba(57,255,20,0.1)]' 
                    : 'border-plasma-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.2)]'}
              `}
            >
              {/* Progress Background Bar */}
              {file.status === FileStatus.UPLOADING && (
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-plasma-purple transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              )}
              {file.status === FileStatus.COMPLETED && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-ecto-green" />
              )}

              <div className="flex items-start gap-4 relative z-10">
                {/* Icon Section */}
                <div className={`
                  p-3 rounded-lg flex-shrink-0
                  ${file.status === FileStatus.UPLOADING ? 'animate-pulse bg-plasma-purple/20' : 'bg-slate-800'}
                `}>
                  {file.file.type.startsWith('image') ? (
                    <ImageIcon className={`w-6 h-6 ${file.status === FileStatus.COMPLETED ? 'text-ecto-green' : 'text-slate-400'}`} />
                  ) : (
                    <FileText className={`w-6 h-6 ${file.status === FileStatus.COMPLETED ? 'text-ecto-green' : 'text-slate-400'}`} />
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-200 truncate pr-4">
                      {file.file.name}
                    </h3>
                    {getStatusIcon(file.status)}
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    {(file.file.size / 1024).toFixed(1)} KB | {file.type}
                  </div>

                  {/* Analysis Result */}
                  {file.analysis && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-xs text-slate-300 italic"
                    >
                      <div className="flex items-center gap-2 mb-1 text-ecto-green font-bold text-[10px] uppercase">
                        <Zap className="w-3 h-3" /> PKE Analysis
                      </div>
                      "{file.analysis}"
                    </motion.div>
                  )}
                  
                  {/* Status Text */}
                  {file.status === FileStatus.UPLOADING && (
                    <p className="text-xs text-plasma-purple mt-2 animate-pulse">
                      Confining entity... {file.progress}%
                    </p>
                  )}
                  {file.status === FileStatus.ANALYZING && (
                    <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Scanning ectoplasm...
                    </p>
                  )}
                </div>
              </div>

              {/* Decorative Scan Line for uploading/analyzing */}
              {(file.status === FileStatus.UPLOADING || file.status === FileStatus.ANALYZING) && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const getStatusIcon = (status: FileStatus) => {
  switch (status) {
    case FileStatus.COMPLETED:
      return <CheckCircle className="w-5 h-5 text-ecto-green" />;
    case FileStatus.ERROR:
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case FileStatus.UPLOADING:
    case FileStatus.ANALYZING:
      return <Ghost className="w-5 h-5 text-plasma-purple animate-bounce" />;
    default:
      return <div className="w-5 h-5" />;
  }
};

export default ContainmentUnit;