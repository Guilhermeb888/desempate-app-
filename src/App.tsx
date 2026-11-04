import React, { useState, useEffect } from 'react';
import { Dilemma, AnalysisMethod } from './types/decision';
import { DEFAULT_DILEMMA, PRESET_TEMPLATES } from './data/templates';
import { 
  getSavedDilemmas, 
  saveDilemmas, 
  getActiveDilemmaId, 
  setActiveDilemmaId 
} from './utils/storage';

import { Header } from './components/Header';
import { DilemmaHeader } from './components/DilemmaHeader';
import { ProsConsView } from './components/ProsConsView';
import { ComparativeTableView } from './components/ComparativeTableView';
import { SwotView } from './components/SwotView';
import { VerdictSummaryView } from './components/VerdictSummaryView';

import { TemplatesModal } from './components/TemplatesModal';
import { SavedDilemmasModal } from './components/SavedDilemmasModal';
import { ExportModal } from './components/ExportModal';
import { ClarityCoinModal } from './components/ClarityCoinModal';

export default function App() {
  const [dilemmas, setDilemmas] = useState<Dilemma[]>(() => getSavedDilemmas());
  const [currentId, setCurrentId] = useState<string>(() => getActiveDilemmaId(dilemmas));
  const [activeTab, setActiveTab] = useState<AnalysisMethod | 'verdict'>('pros-cons');

  // Modals state
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCoinOpen, setIsCoinOpen] = useState(false);

  // Sync to local storage whenever dilemmas change
  useEffect(() => {
    saveDilemmas(dilemmas);
  }, [dilemmas]);

  // Sync active ID
  useEffect(() => {
    setActiveDilemmaId(currentId);
  }, [currentId]);

  // Current active dilemma
  const currentDilemma = dilemmas.find((d) => d.id === currentId) || dilemmas[0] || DEFAULT_DILEMMA;

  // Update current dilemma handler
  const handleUpdateCurrentDilemma = (updated: Dilemma) => {
    setDilemmas((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  // Create brand new blank dilemma
  const handleNewDilemma = () => {
    const newId = 'dilemma-' + Date.now();
    const newDilemma: Dilemma = {
      id: newId,
      title: 'Minha Nova Decisão',
      description: '',
      category: 'carreira',
      status: 'em_analise',
      activeMethod: 'pros-cons',
      prosCons: {
        targetOptionName: 'Opção em Análise',
        pros: [],
        cons: [],
      },
      comparative: {
        options: [
          { id: 'opt-1', name: 'Opção 1', color: '#3b82f6' },
          { id: 'opt-2', name: 'Opção 2', color: '#10b981' },
        ],
        criteria: [
          { id: 'crit-1', name: 'Custo Financeiro', weight: 4 },
          { id: 'crit-2', name: 'Benefício a Longo Prazo', weight: 5 },
          { id: 'crit-3', name: 'Facilidade de Execução', weight: 3 },
        ],
        scores: {
          'opt-1': { 'crit-1': 6, 'crit-2': 8, 'crit-3': 7 },
          'opt-2': { 'crit-1': 8, 'crit-2': 6, 'crit-3': 8 },
        },
      },
      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setDilemmas((prev) => [newDilemma, ...prev]);
    setCurrentId(newId);
    setActiveTab('pros-cons');
  };

  // Select template
  const handleSelectTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    const newId = 'dilemma-tmpl-' + Date.now();
    const created: Dilemma = {
      ...template.dilemma,
      id: newId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDilemmas((prev) => [created, ...prev]);
    setCurrentId(newId);
    setActiveTab(created.activeMethod || 'pros-cons');
  };

  // Delete dilemma
  const handleDeleteDilemma = (id: string) => {
    const remaining = dilemmas.filter((d) => d.id !== id);
    if (remaining.length === 0) {
      setDilemmas([DEFAULT_DILEMMA]);
      setCurrentId(DEFAULT_DILEMMA.id);
    } else {
      setDilemmas(remaining);
      if (currentId === id) {
        setCurrentId(remaining[0].id);
      }
    }
  };

  // Duplicate dilemma
  const handleDuplicateDilemma = (source: Dilemma) => {
    const newId = 'dilemma-copy-' + Date.now();
    const clone: Dilemma = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      title: `${source.title} (Cópia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDilemmas((prev) => [clone, ...prev]);
    setCurrentId(newId);
  };

  // Import full backups
  const handleImportDilemmas = (imported: Dilemma[]) => {
    setDilemmas(imported);
    if (imported[0]) {
      setCurrentId(imported[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        onNewDilemma={handleNewDilemma}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenClarityCoin={() => setIsCoinOpen(true)}
        savedCount={dilemmas.length}
        currentDilemma={currentDilemma}
      />

      {/* Dilemma Title, Category & Tab Bar */}
      <DilemmaHeader
        dilemma={currentDilemma}
        onChange={handleUpdateCurrentDilemma}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'pros-cons' && (
          <ProsConsView
            data={currentDilemma.prosCons}
            onChange={(updatedData) =>
              handleUpdateCurrentDilemma({
                ...currentDilemma,
                prosCons: updatedData,
                updatedAt: Date.now(),
              })
            }
            dilemmaTitle={currentDilemma.title}
          />
        )}

        {activeTab === 'comparative' && (
          <ComparativeTableView
            data={currentDilemma.comparative}
            onChange={(updatedData) =>
              handleUpdateCurrentDilemma({
                ...currentDilemma,
                comparative: updatedData,
                updatedAt: Date.now(),
              })
            }
          />
        )}

        {activeTab === 'swot' && (
          <SwotView
            data={currentDilemma.swot}
            onChange={(updatedData) =>
              handleUpdateCurrentDilemma({
                ...currentDilemma,
                swot: updatedData,
                updatedAt: Date.now(),
              })
            }
          />
        )}

        {activeTab === 'verdict' && (
          <VerdictSummaryView
            dilemma={currentDilemma}
            onChange={handleUpdateCurrentDilemma}
            onGoToMethod={(m) => setActiveTab(m)}
          />
        )}
      </main>

      {/* Printable Report Summary (Visible only in print mode) */}
      <div className="hidden print:block p-8 bg-white text-black">
        <h1 className="text-2xl font-bold mb-2">Relatório de Decisão: {currentDilemma.title}</h1>
        <p className="text-sm text-gray-600 mb-4">{currentDilemma.description}</p>
        <div className="border-t pt-4">
          <h2 className="text-lg font-bold mb-2">Prós e Contras</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-emerald-800">Prós:</h3>
              <ul className="list-disc pl-5 text-sm">
                {currentDilemma.prosCons.pros.map((p) => (
                  <li key={p.id}>[Peso {p.weight}] {p.text}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Contras:</h3>
              <ul className="list-disc pl-5 text-sm">
                {currentDilemma.prosCons.cons.map((c) => (
                  <li key={c.id}>[Peso {c.weight}] {c.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>Desempate</strong> — Seu assistente metodológico para decisões difíceis. 100% no navegador.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacidade total (armazenamento local)</span>
            <span>•</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-indigo-600 hover:underline font-medium"
            >
              Exportar Análise
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <SavedDilemmasModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        dilemmas={dilemmas}
        currentId={currentId}
        onSelect={setCurrentId}
        onDelete={handleDeleteDilemma}
        onDuplicate={handleDuplicateDilemma}
        onImport={handleImportDilemmas}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dilemma={currentDilemma}
      />

      <ClarityCoinModal
        isOpen={isCoinOpen}
        onClose={() => setIsCoinOpen(false)}
        defaultOptionA={currentDilemma.comparative.options[0]?.name || 'Opção A'}
        defaultOptionB={currentDilemma.comparative.options[1]?.name || 'Opção B'}
        onApplyDecision={(chosen) => {
          handleUpdateCurrentDilemma({
            ...currentDilemma,
            finalDecision: `Decidido via Moeda da Clareza: ${chosen}`,
            status: 'decidido',
            updatedAt: Date.now(),
          });
          setActiveTab('verdict');
        }}
      />
    </div>
  );
}
