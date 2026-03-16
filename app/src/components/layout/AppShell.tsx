import { Sidebar } from './Sidebar';
import { CanvasArea } from './CanvasArea';

export function AppShell() {
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="flex-none flex items-center gap-3 px-5 py-3 bg-slate-800 border-b border-slate-700">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
          B
        </div>
        <h1 className="text-base font-semibold text-white tracking-tight">Blog Image Generator</h1>
        <span className="ml-auto text-xs text-slate-400">6 brands • HTML Canvas</span>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <CanvasArea />
      </div>
    </div>
  );
}
