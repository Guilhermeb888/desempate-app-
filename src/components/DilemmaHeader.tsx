import React, { useState } from 'react';
import { Dilemma, AnalysisMethod } from '../types/decision';
import { 
  CheckCircle2, 
  HelpCircle, 
  Check, 
  Edit3, 
  Layers, 
  Scale, 
  Table2, 
  Compass, 
  Award,
  ChevronDown
} from 'lucide-react';

interface DilemmaHeaderProps {
  dilemma: Dilemma;
  onChange: (updated: Dilemma) => void;
  activeTab: AnalysisMethod | 'verdict';
  onSelectTab: (tab: AnalysisMethod | 'verdict') => void;
}

const CATEGORIES: Array<{ key: Dilemma['category']; label: string; icon: string }> = [
  { key: 'carreira', label: 'Carreira & Trabalho', icon: '💼' },
  { key: 'financas', label: 'Finanças & Patrimônio', icon: '💰' },
  { key: 'negocios', label: 'Negócios & Projetos', icon: '🚀' },
  { key: 'estudos', label: 'Estudos & Formação', icon: '🎓' },
  { key: 'pessoal', label: 'Vida Pessoal & Relacionamentos', icon: '🌱' },
  { key: 'outro', label: 'Outro Tema', icon: '🎯' },
];

export const DilemmaHeader: React.FC<DilemmaHeaderProps> = ({
  dilemma,
  onChange,
  activeTab,
  onSelectTab,
}) => {
  const [isEditingContext, setIsEditingContext] = useState(false);

  const handleTitleChange = (val: string) => {
    onChange({ ...dilemma, title: val, updatedAt: Date.now() });
  };

  const handleDescChange = (val: string) => {
    onChange({ ...dilemma, description: val, updatedAt: Date.now() });
  };

  const handleCategoryChange = (cat: Dilemma['category']) => {
    onChange({ ...dilemma, category: cat, updatedAt: Date.now() });
  };

  const toggleStatus = () => {
    const nextStatus = dilemma.status === 'decidido' ? 'em_analise' : 'decidido';
    onChange({ ...dilemma, status: nextStatus, updatedAt: Date.now() });
  };

  // Quick stats
  const prosCount = dilemma.prosCons.pros.length;
  const consCount = dilemma.prosCons.cons.length;
  const optionsCount = dilemma.comparative.options.length;
  const criteriaCount = dilemma.comparative.criteria.length;
  const swotTotal = dilemma.swot.strengths.length + dilemma.swot.weaknesses.length + dilemma.swot.opportunities.length + dilemma.swot.threats.length;

  return (
    <div className="bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {/* Category Dropdown */}
            <div className="relative group">
              <select
                value={dilemma.category}
                onChange={(e) => handleCategoryChange(e.target.value as Dilemma['category'])}
                className="appearance-none bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold pl-2.5 pr-7 py-1 rounded-full cursor-pointer border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Last updated indicator */}
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Atualizado {new Date(dilemma.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Status badge & toggle button */}
          <button
            onClick={toggleStatus}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-xs ${
              dilemma.status === 'decidido'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
            }`}
            title="Clique para alternar o status da decisão"
          >
            {dilemma.status === 'decidido' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Decisão Tomada</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Em Análise</span>
              </>
            )}
          </button>
        </div>

        {/* Main Dilemma Input */}
        <div className="relative group">
          <label className="block text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
            Qual é o seu dilema ou decisão a ser tomada?
          </label>
          <div className="relative">
            <input
              type="text"
              value={dilemma.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Devo aceitar a nova proposta de emprego ou continuar na empresa atual?"
              className="w-full text-lg sm:text-2xl font-bold font-heading text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none pb-2 pr-10 transition-colors placeholder:text-slate-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors pointer-events-none">
              <Edit3 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Context / Background description */}
        <div className="mt-3">
          {isEditingContext ? (
            <div className="space-y-2">
              <textarea
                value={dilemma.description}
                onChange={(e) => handleDescChange(e.target.value)}
                placeholder="Adicione notas sobre o contexto, prazos, pressões envolvidas ou o que está em jogo..."
                rows={2}
                className="w-full text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setIsEditingContext(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition"
              >
                <Check className="w-3 h-3" /> Concluir contexto
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingContext(true)}
              className="group cursor-pointer flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
            >
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic flex-1">
                {dilemma.description || (
                  <span className="text-slate-400 not-italic">
                    + Clique aqui para adicionar contexto, data limite ou observações sobre o dilema...
                  </span>
                )}
              </p>
              <span className="text-slate-400 group-hover:text-indigo-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                Editar
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs between Methods */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Prós e Contras */}
            <button
              onClick={() => onSelectTab('pros-cons')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'pros-cons'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Prós e Contras</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'pros-cons' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {prosCount}P / {consCount}C
              </span>
            </button>

            {/* Tabela Comparativa */}
            <button
              onClick={() => onSelectTab('comparative')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'comparative'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-4 h-4" />
              <span>Tabela Comparativa</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'comparative' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {optionsCount} opções • {criteriaCount} critérios
              </span>
            </button>

            {/* Análise SWOT */}
            <button
              onClick={() => onSelectTab('swot')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'swot'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Análise SWOT</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'swot' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {swotTotal} fatores
              </span>
            </button>
          </div>

          {/* Veredito Geral */}
          <button
            onClick={() => onSelectTab('verdict')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'verdict'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Veredito & Resumo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
