import React, { useState, useEffect } from 'react';
import Breadcrumbs from './components/Breadcrumbs';
import { parsePath } from './utils/pathHelper';

const EXAMPLE_PATHS = [
  '/',
  '/projects',
  '/projects/2026/q1/marketing/social-ads',
  '/projects/2026/q1/marketing/social-ads/campaign-a',
  '/projects/2026/q1/engineering/backend',
  '/documents/invoices',
  '/settings/profile',
];

export default function App() {
  // Initialize from current URL or default to a deep path for demonstration
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname === '/' || window.location.pathname === '/index.html'
      ? EXAMPLE_PATHS[2]
      : window.location.pathname
  );

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // Parse path whenever it changes
  useEffect(() => {
    // If we are at root in dev, let's pretend we are at the deep path initially (if state was set)
    // But we should sync URL.
    if (window.location.pathname !== currentPath) {
      window.history.replaceState({}, '', currentPath);
    }

    const items = parsePath(currentPath);
    setBreadcrumbs(items);
  }, [currentPath]);

  // Listen for navigation events (internal)
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    // Dispatch event so our listener picks it up (pushState doesn't trigger popstate naturally)
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">O</div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">Omni-Path</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <input
                  type="search"
                  placeholder="Global Search..."
                  className="bg-gray-100 border-none rounded-md pl-9 pr-3 py-1.5 text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-sm border border-white"></div>
            </div>
          </div>
          {/* The Component */}
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Home'}
                </h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Edit</button>
                  <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">Share</button>
                </div>
              </div>

              <div className="p-4 bg-gray-900 rounded-lg text-gray-300 font-mono text-sm mb-8 overflow-x-auto">
                <span className="text-green-400">$</span> ls -la {currentPath}
              </div>

              <div className="prose max-w-none text-gray-600">
                <p className="lead">
                  You are currently viewing the content for the path
                  <strong className="text-gray-900 ml-1">{currentPath}</strong>.
                </p>

                <div className="mt-8">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Contents</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="group relative aspect-[4/3] bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 00-2 2h12a2 2 0 002-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Document_{i}.pdf</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Jump To
              </h3>
              <div className="flex flex-col gap-1">
                {EXAMPLE_PATHS.map(p => (
                  <button
                    key={p}
                    onClick={() => navigate(p)}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-all flex items-center justify-between group ${currentPath === p
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <span className="truncate">{p === '/' ? 'Home' : p}</span>
                    {currentPath === p && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg shadow-slate-900/20 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2 relative z-10">Features</h3>
              <ul className="text-slate-300 text-sm space-y-3 list-none relative z-10">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500/20 text-blue-400 p-1 rounded">↔</span>
                  <span><strong>Smart Truncation:</strong> Resize the window. The middle items collapse into "..." when space is tight.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-purple-500/20 text-purple-400 p-1 rounded">↓</span>
                  <span><strong>Branch Peek:</strong> Hover over any folder (e.g. "Projects") to jump to siblings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-500/20 text-green-400 p-1 rounded">⚡</span>
                  <span><strong>Dynamic Parsing:</strong> The path is recursively parsed from the URL string.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
