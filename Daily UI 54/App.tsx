
import React, { useState, useCallback } from 'react';
import { Trash2, Save, Send, ShieldAlert, Sparkles, LayoutGrid, Check, Plus } from 'lucide-react';
import ConfirmationDialog from './components/ConfirmationDialog';
import { generateConfirmationMessage } from './services/geminiService';
import { Scenario, DialogVariant } from './types';

const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'delete',
    title: 'Delete Project',
    description: 'Permanent removal of project data and associated assets.',
    variant: 'danger',
    actionLabel: 'Delete Permanently'
  },
  {
    id: 'save',
    title: 'Apply Changes',
    description: 'Updating your global system configuration.',
    variant: 'success',
    actionLabel: 'Apply Now'
  },
  {
    id: 'publish',
    title: 'Publish Site',
    description: 'Make your content visible to everyone on the web.',
    variant: 'info',
    actionLabel: 'Publish'
  },
  {
    id: 'warning',
    title: 'Unsaved Changes',
    description: 'Leaving this page will discard your recent progress.',
    variant: 'warning',
    actionLabel: 'Exit Anyway'
  }
];

const App: React.FC = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: DialogVariant;
    confirmLabel: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'default',
    confirmLabel: 'Confirm'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const openDialog = useCallback((scenario: Scenario) => {
    setDialogState({
      isOpen: true,
      title: scenario.title,
      message: scenario.description,
      variant: scenario.variant,
      confirmLabel: scenario.actionLabel
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    closeDialog();
    alert('Action successfully confirmed!');
  };

  const handleAiGeneration = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const content = await generateConfirmationMessage(aiInput);
    setDialogState({
      isOpen: true,
      title: content.title,
      message: content.message,
      variant: 'info',
      confirmLabel: 'Confirm AI Action'
    });
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ConfirmElite</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Design Tokens</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Accessibility</a>
          </nav>
          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-sm">
            Getting Started
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            The Gold Standard of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Confirmation.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Beautifully crafted, fully accessible, and contextually aware. 
            Reduce user errors with confirmation dialogs that command attention without breaking flow.
          </p>
          
          {/* AI Generator Box */}
          <div className="max-w-xl mx-auto p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex gap-2">
            <div className="flex-1 flex items-center px-4">
              <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Try: 'Deleting a production database'..."
                className="w-full text-sm outline-none bg-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGeneration()}
              />
            </div>
            <button 
              onClick={handleAiGeneration}
              disabled={isAiLoading || !aiInput.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {isAiLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Generate <Plus className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </section>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Clarity & Hierarchy</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every pixel is placed to guide the user's attention. Bold headings and clear action buttons eliminate ambiguity.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Accessibility First</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Full WCAG 2.1 AA compliance including focus trapping, screen reader ARIA labels, and escape key support.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Atomic Components</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Built with reusable React patterns that scale from simple alerts to complex multi-step transaction flows.
            </p>
          </div>
        </div>

        {/* Demo Playground */}
        <section className="bg-slate-900 rounded-[32px] p-8 md:p-12 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold mb-4">Live Demo Playground</h2>
              <p className="text-slate-400 mb-6">
                Interact with our pre-built confirmation scenarios to see the system in action. Observe the focus management and smooth transitions.
              </p>
              <div className="flex flex-wrap gap-4">
                {INITIAL_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => openDialog(scenario)}
                    className="group relative flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all text-sm font-semibold"
                  >
                    {scenario.id === 'delete' && <Trash2 className="w-4 h-4 text-red-400" />}
                    {scenario.id === 'save' && <Save className="w-4 h-4 text-emerald-400" />}
                    {scenario.id === 'publish' && <Send className="w-4 h-4 text-blue-400" />}
                    {scenario.id === 'warning' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
                    {scenario.title}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-sm">
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-20 bg-white/10 rounded w-full"></div>
                  <div className="flex justify-end gap-2">
                    <div className="h-8 bg-white/20 rounded w-20"></div>
                    <div className="h-8 bg-indigo-500 rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © 2025 ConfirmElite Component Library. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">GitHub</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">NPM</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

      {/* Global Confirmation Dialog Instance */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        onConfirm={handleConfirm}
        onCancel={closeDialog}
        variant={dialogState.variant}
        confirmButtonText={dialogState.confirmLabel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;
