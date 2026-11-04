import React from 'react';
import { Scale, Plus, FolderOpen, Sparkles, Share2, Coins } from 'lucide-react';
import { Dilemma } from '../types/decision';

interface HeaderProps {
  onNewDilemma: () => void;
  onOpenTemplates: () => void;
  onOpenSaved: () => void;
  onOpenExport: () => void;
  onOpenClarityCoin: () => void;
  savedCount: number;
  currentDilemma: Dilemma;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDilemma,
  onOpenTemplates,
  onOpenSaved,
  onOpenExport,
  onOpenClarityCoin,
  savedCount,
  currentDilemma,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 font-heading">
                Desempate
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Tomada de Decisões
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Prós & Contras • Tabela Comparativa • Análise SWOT
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Decision Clarity Coin */}
          <button
            onClick={onOpenClarityCoin}
            title="Empatou? Teste da Moeda da Clareza Mental"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 transition-colors"
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Moeda da Clareza</span>
          </button>

          {/* Templates */}
          <button
            onClick={onOpenTemplates}
            title="Explorar exemplos prontos de carreira, finanças e negócios"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Exemplos Prontos</span>
          </button>

          {/* Saved History */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors relative"
            title="Histórico de decisões salvas no seu navegador"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Meus Dilemas</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
              {savedCount}
            </span>
          </button>

          {/* Export / Share */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Exportar relatório ou imprimir"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Relatório</span>
          </button>

          {/* New Dilemma */}
          <button
            onClick={onNewDilemma}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition shadow-xs shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Dilema</span>
          </button>
        </div>
      </div>
    </header>
  );
};
