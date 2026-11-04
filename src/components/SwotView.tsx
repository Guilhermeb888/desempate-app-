import React, { useState } from 'react';
import { SwotData, SwotItem, ImpactLevel } from '../types/decision';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Rocket, 
  Zap, 
  Plus, 
  Trash2, 
  Target, 
  Layers, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface SwotViewProps {
  data: SwotData;
  onChange: (data: SwotData) => void;
}

const IMPACT_COLORS: Record<ImpactLevel, { bg: string; text: string; border: string }> = {
  alto: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  medio: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  baixo: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const SwotView: React.FC<SwotViewProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'cross'>('matrix');

  // Input states for each quadrant
  const [newStrengthText, setNewStrengthText] = useState('');
  const [newStrengthImpact, setNewStrengthImpact] = useState<ImpactLevel>('alto');

  const [newWeaknessText, setNewWeaknessText] = useState('');
  const [newWeaknessImpact, setNewWeaknessImpact] = useState<ImpactLevel>('medio');

  const [newOpportunityText, setNewOpportunityText] = useState('');
  const [newOpportunityImpact, setNewOpportunityImpact] = useState<ImpactLevel>('alto');

  const [newThreatText, setNewThreatText] = useState('');
  const [newThreatImpact, setNewThreatImpact] = useState<ImpactLevel>('medio');

  // Helpers to add items
  const addItem = (
    key: keyof SwotData,
    text: string,
    impact: ImpactLevel,
    clearFn: () => void
  ) => {
    if (!text.trim()) return;
    const newItem: SwotItem = {
      id: 'swot-' + Date.now(),
      text: text.trim(),
      impact,
    };
    onChange({
      ...data,
      [key]: [...data[key], newItem],
    });
    clearFn();
  };

  const removeItem = (key: keyof SwotData, id: string) => {
    onChange({
      ...data,
      [key]: data[key].filter((item) => item.id !== id),
    });
  };

  const updateImpact = (key: keyof SwotData, id: string, impact: ImpactLevel) => {
    onChange({
      ...data,
      [key]: data[key].map((item) => (item.id === id ? { ...item, impact } : item)),
    });
  };

  // Calculation of balance
  const strengthCount = data.strengths.length;
  const weaknessCount = data.weaknesses.length;
  const opportunityCount = data.opportunities.length;
  const threatCount = data.threats.length;

  const internalRatio = strengthCount + weaknessCount === 0 ? 50 : Math.round((strengthCount / (strengthCount + weaknessCount)) * 100);
  const externalRatio = opportunityCount + threatCount === 0 ? 50 : Math.round((opportunityCount / (opportunityCount + threatCount)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Strategic Overview Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-700">
              Análise SWOT / FOFA Estratégica
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
            Mapeamento de Forças, Fraquezas, Oportunidades e Ameaças
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compreenda os fatores internos que você controla e os fatores externos do ambiente que exigem adaptação.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch md:self-auto justify-center">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matriz 2x2
          </button>
          <button
            onClick={() => setActiveTab('cross')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              activeTab === 'cross' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Estratégia Cruzada</span>
          </button>
        </div>
      </div>

      {/* Internal vs External Health Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-700">Fatores Internos (Você / Organização)</span>
            <span className="text-indigo-600">{internalRatio}% Favorável</span>
          </div>
          <div className="w-full bg-rose-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${internalRatio}%` }}
              title={`Forças: ${strengthCount} vs Fraquezas: ${weaknessCount}`}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>🛡️ {strengthCount} Forças</span>
            <span>⚠️ {weaknessCount} Fraquezas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-700">Fatores Externos (Mercado / Ambiente)</span>
            <span className="text-indigo-600">{externalRatio}% Favorável</span>
          </div>
          <div className="w-full bg-rose-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `${externalRatio}%` }}
              title={`Oportunidades: ${opportunityCount} vs Ameaças: ${threatCount}`}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>🚀 {opportunityCount} Oportunidades</span>
            <span>🌪️ {threatCount} Ameaças</span>
          </div>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        /* 2x2 Matrix View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quadrant 1: FORÇAS (Interno +) */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200/90 shadow-xs p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-heading">
                    Forças (Strengths)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Fatores Internos Positivos • Seus diferenciais e recursos
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {strengthCount}
              </span>
            </div>

            {/* Input Form */}
            <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100 mb-3 flex flex-col gap-2">
              <input
                type="text"
                value={newStrengthText}
                onChange={(e) => setNewStrengthText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('strengths', newStrengthText, newStrengthImpact, () => setNewStrengthText(''))}
                placeholder="Ex: Reserva financeira sólida, domínio técnico..."
                className="w-full text-xs bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Impacto:</span>
                  {(['baixo', 'medio', 'alto'] as ImpactLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewStrengthImpact(lvl)}
                      className={`capitalize px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        newStrengthImpact === lvl ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => addItem('strengths', newStrengthText, newStrengthImpact, () => setNewStrengthText(''))}
                  disabled={!newStrengthText.trim()}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 flex-1">
              {data.strengths.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 text-xs"
                >
                  <span className="font-medium text-slate-800 flex-1">{item.text}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${IMPACT_COLORS[item.impact].bg} ${IMPACT_COLORS[item.impact].text} ${IMPACT_COLORS[item.impact].border}`}>
                      {item.impact}
                    </span>
                    <button
                      onClick={() => removeItem('strengths', item.id)}
                      className="text-slate-300 hover:text-rose-600 opacity-60 group-hover:opacity-100 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {data.strengths.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Nenhuma força cadastrada.
                </div>
              )}
            </div>
          </div>

          {/* Quadrant 2: FRAQUEZAS (Interno -) */}
          <div className="bg-white rounded-2xl border-2 border-amber-200/90 shadow-xs p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-heading">
                    Fraquezas (Weaknesses)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Fatores Internos Negativos • Limitações e carências
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {weaknessCount}
              </span>
            </div>

            {/* Input Form */}
            <div className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-100 mb-3 flex flex-col gap-2">
              <input
                type="text"
                value={newWeaknessText}
                onChange={(e) => setNewWeaknessText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('weaknesses', newWeaknessText, newWeaknessImpact, () => setNewWeaknessText(''))}
                placeholder="Ex: Pouca experiência no nicho, ansiedade..."
                className="w-full text-xs bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Impacto:</span>
                  {(['baixo', 'medio', 'alto'] as ImpactLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewWeaknessImpact(lvl)}
                      className={`capitalize px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        newWeaknessImpact === lvl ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => addItem('weaknesses', newWeaknessText, newWeaknessImpact, () => setNewWeaknessText(''))}
                  disabled={!newWeaknessText.trim()}
                  className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 flex-1">
              {data.weaknesses.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 text-xs"
                >
                  <span className="font-medium text-slate-800 flex-1">{item.text}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${IMPACT_COLORS[item.impact].bg} ${IMPACT_COLORS[item.impact].text} ${IMPACT_COLORS[item.impact].border}`}>
                      {item.impact}
                    </span>
                    <button
                      onClick={() => removeItem('weaknesses', item.id)}
                      className="text-slate-300 hover:text-rose-600 opacity-60 group-hover:opacity-100 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {data.weaknesses.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Nenhuma fraqueza cadastrada.
                </div>
              )}
            </div>
          </div>

          {/* Quadrant 3: OPORTUNIDADES (Externo +) */}
          <div className="bg-white rounded-2xl border-2 border-sky-200/90 shadow-xs p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-heading">
                    Oportunidades (Opportunities)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Fatores Externos Positivos • Tendências favoráveis do mercado
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                {opportunityCount}
              </span>
            </div>

            {/* Input Form */}
            <div className="bg-sky-50/40 p-2.5 rounded-xl border border-sky-100 mb-3 flex flex-col gap-2">
              <input
                type="text"
                value={newOpportunityText}
                onChange={(e) => setNewOpportunityText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('opportunities', newOpportunityText, newOpportunityImpact, () => setNewOpportunityText(''))}
                placeholder="Ex: Demanda alta por profissionais, novas tecnologias..."
                className="w-full text-xs bg-white border border-sky-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Impacto:</span>
                  {(['baixo', 'medio', 'alto'] as ImpactLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewOpportunityImpact(lvl)}
                      className={`capitalize px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        newOpportunityImpact === lvl ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => addItem('opportunities', newOpportunityText, newOpportunityImpact, () => setNewOpportunityText(''))}
                  disabled={!newOpportunityText.trim()}
                  className="px-2.5 py-1 bg-sky-600 text-white rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 flex-1">
              {data.opportunities.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/20 text-xs"
                >
                  <span className="font-medium text-slate-800 flex-1">{item.text}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${IMPACT_COLORS[item.impact].bg} ${IMPACT_COLORS[item.impact].text} ${IMPACT_COLORS[item.impact].border}`}>
                      {item.impact}
                    </span>
                    <button
                      onClick={() => removeItem('opportunities', item.id)}
                      className="text-slate-300 hover:text-rose-600 opacity-60 group-hover:opacity-100 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {data.opportunities.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Nenhuma oportunidade cadastrada.
                </div>
              )}
            </div>
          </div>

          {/* Quadrant 4: AMEAÇAS (Externo -) */}
          <div className="bg-white rounded-2xl border-2 border-rose-200/90 shadow-xs p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-heading">
                    Ameaças (Threats)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Fatores Externos Negativos • Riscos e turbulências
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                {threatCount}
              </span>
            </div>

            {/* Input Form */}
            <div className="bg-rose-50/40 p-2.5 rounded-xl border border-rose-100 mb-3 flex flex-col gap-2">
              <input
                type="text"
                value={newThreatText}
                onChange={(e) => setNewThreatText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('threats', newThreatText, newThreatImpact, () => setNewThreatText(''))}
                placeholder="Ex: Concorrência acirrada, instabilidade econômica..."
                className="w-full text-xs bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>Impacto:</span>
                  {(['baixo', 'medio', 'alto'] as ImpactLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewThreatImpact(lvl)}
                      className={`capitalize px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        newThreatImpact === lvl ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => addItem('threats', newThreatText, newThreatImpact, () => setNewThreatText(''))}
                  disabled={!newThreatText.trim()}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" /> Adicionar
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 flex-1">
              {data.threats.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50/20 text-xs"
                >
                  <span className="font-medium text-slate-800 flex-1">{item.text}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${IMPACT_COLORS[item.impact].bg} ${IMPACT_COLORS[item.impact].text} ${IMPACT_COLORS[item.impact].border}`}>
                      {item.impact}
                    </span>
                    <button
                      onClick={() => removeItem('threats', item.id)}
                      className="text-slate-300 hover:text-rose-600 opacity-60 group-hover:opacity-100 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {data.threats.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Nenhuma ameaça cadastrada.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Cross Strategy Synthesis (Matriz Estratégica Cruzada) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* FO: Forças + Oportunidades */}
          <div className="bg-emerald-50/80 rounded-2xl border border-emerald-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded">
                Estratégia Ofensiva (F x O)
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Como usar suas Forças para capturar as Oportunidades?
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Combine seus diferenciais internos para maximizar ganhos externos.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-emerald-150">
              {data.strengths.slice(0, 2).map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Aproveitar "{s.text}" para acelerar resultados.</span>
                </div>
              ))}
              {data.strengths.length === 0 && (
                <span className="text-slate-400 italic">Preencha Forças para ver as ações recomendadas.</span>
              )}
            </div>
          </div>

          {/* FA: Forças + Ameaças */}
          <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase bg-amber-600 text-white px-2 py-0.5 rounded">
                Estratégia de Confronto (F x A)
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Como usar suas Forças para neutralizar as Ameaças?
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Crie defesas ativas usando os recursos que você já possui.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-amber-150">
              {data.threats.slice(0, 2).map((t, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Blindar contra "{t.text}" através da sua base sólida.</span>
                </div>
              ))}
              {data.threats.length === 0 && (
                <span className="text-slate-400 italic">Cadastre Ameaças para analisar o escudo.</span>
              )}
            </div>
          </div>

          {/* WO: Fraquezas + Oportunidades */}
          <div className="bg-sky-50/80 rounded-2xl border border-sky-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase bg-sky-600 text-white px-2 py-0.5 rounded">
                Estratégia de Reforço (F x O)
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Quais Fraquezas você precisa corrigir para não perder as Oportunidades?
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Desenvolva novas competências ou busque parceiros complementares.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-sky-150">
              {data.weaknesses.slice(0, 2).map((w, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-sky-600 shrink-0" />
                  <span>Treinar ou delegar "{w.text}".</span>
                </div>
              ))}
              {data.weaknesses.length === 0 && (
                <span className="text-slate-400 italic">Nenhuma fraqueza cadastrada.</span>
              )}
            </div>
          </div>

          {/* WT: Fraquezas + Ameaças */}
          <div className="bg-rose-50/80 rounded-2xl border border-rose-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase bg-rose-600 text-white px-2 py-0.5 rounded">
                Estratégia Defensiva (F x A)
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Como minimizar Fraquezas e evitar o pior cenário de Ameaças?
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Zona de maior risco. Requer plano de contingência e cautela redobrada.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700 bg-white/70 p-3 rounded-xl border border-rose-150">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-rose-600 shrink-0" />
                <span>Definir gatilho de saída seguro (Stop Loss) caso o ambiente piore.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
