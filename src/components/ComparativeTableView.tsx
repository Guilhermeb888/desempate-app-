import React, { useState } from 'react';
import { ComparativeData, ComparativeOption, ComparativeCriterion } from '../types/decision';
import { 
  Plus, 
  Trash2, 
  Trophy, 
  Sparkles, 
  Sliders, 
  BarChart3, 
  Check, 
  Info,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComparativeTableViewProps {
  data: ComparativeData;
  onChange: (data: ComparativeData) => void;
}

const COLOR_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const QUICK_CRITERIA_PRESETS = [
  'Custo Financeiro / Preço',
  'Retorno Sobre Investimento (ROI)',
  'Qualidade de Vida / Bem-estar',
  'Tempo de Execução / Agilidade',
  'Nível de Risco / Incerteza',
  'Alinhamento a Longo Prazo',
  'Facilidade de Implementação',
];

export const ComparativeTableView: React.FC<ComparativeTableViewProps> = ({
  data,
  onChange,
}) => {
  const [newOptionName, setNewOptionName] = useState('');
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionWeight, setNewCriterionWeight] = useState(4);

  // Compute total scores and percentages for each option
  const totalMaxScore = data.criteria.reduce((sum, crit) => sum + 10 * crit.weight, 0);

  const rankedOptions = data.options.map((opt) => {
    let scoreSum = 0;
    data.criteria.forEach((crit) => {
      const score = data.scores[opt.id]?.[crit.id] ?? 0;
      scoreSum += score * crit.weight;
    });
    const percentage = totalMaxScore > 0 ? Math.round((scoreSum / totalMaxScore) * 100) : 0;
    return {
      ...opt,
      totalScore: scoreSum,
      percentage,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const highestScore = rankedOptions[0]?.totalScore ?? 0;
  const winner = rankedOptions[0];

  // Option actions
  const addOption = () => {
    if (!newOptionName.trim()) return;
    const newId = 'opt-' + Date.now();
    const color = COLOR_PALETTE[data.options.length % COLOR_PALETTE.length];
    const newOpt: ComparativeOption = {
      id: newId,
      name: newOptionName.trim(),
      color,
    };
    
    // initialize scores with 5
    const updatedScores: Record<string, Record<string, number>> = {
      ...data.scores,
      [newId]: {},
    };
    data.criteria.forEach((crit) => {
      updatedScores[newId][crit.id] = 5;
    });

    onChange({
      ...data,
      options: [...data.options, newOpt],
      scores: updatedScores,
    });
    setNewOptionName('');
  };

  const removeOption = (id: string) => {
    if (data.options.length <= 1) {
      alert('Você precisa manter pelo menos uma opção para comparar.');
      return;
    }
    const filteredOptions = data.options.filter((o) => o.id !== id);
    const updatedScores = { ...data.scores };
    delete updatedScores[id];
    onChange({
      ...data,
      options: filteredOptions,
      scores: updatedScores,
    });
  };

  const updateOptionName = (id: string, name: string) => {
    onChange({
      ...data,
      options: data.options.map((o) => (o.id === id ? { ...o, name } : o)),
    });
  };

  // Criteria actions
  const addCriterion = (name?: string, weight?: number) => {
    const finalName = name || newCriterionName;
    if (!finalName.trim()) return;
    const newId = 'crit-' + Date.now();
    const newCrit: ComparativeCriterion = {
      id: newId,
      name: finalName.trim(),
      weight: weight ?? newCriterionWeight,
    };

    // initialize scores for all options on this criterion
    const updatedScores = { ...data.scores };
    data.options.forEach((opt) => {
      if (!updatedScores[opt.id]) updatedScores[opt.id] = {};
      updatedScores[opt.id][newId] = 5;
    });

    onChange({
      ...data,
      criteria: [...data.criteria, newCrit],
      scores: updatedScores,
    });
    setNewCriterionName('');
    setNewCriterionWeight(4);
  };

  const removeCriterion = (id: string) => {
    if (data.criteria.length <= 1) {
      alert('Mantenha pelo menos um critério de avaliação.');
      return;
    }
    const filteredCriteria = data.criteria.filter((c) => c.id !== id);
    const updatedScores = { ...data.scores };
    Object.keys(updatedScores).forEach((optId) => {
      const copy = { ...updatedScores[optId] };
      delete copy[id];
      updatedScores[optId] = copy;
    });

    onChange({
      ...data,
      criteria: filteredCriteria,
      scores: updatedScores,
    });
  };

  const updateCriterionWeight = (id: string, weight: number) => {
    onChange({
      ...data,
      criteria: data.criteria.map((c) => (c.id === id ? { ...c, weight } : c)),
    });
  };

  const updateCriterionName = (id: string, name: string) => {
    onChange({
      ...data,
      criteria: data.criteria.map((c) => (c.id === id ? { ...c, name } : c)),
    });
  };

  const setScore = (optionId: string, criterionId: string, score: number) => {
    const safeScore = Math.max(0, Math.min(10, score));
    const currentOptScores = data.scores[optionId] || {};
    onChange({
      ...data,
      scores: {
        ...data.scores,
        [optionId]: {
          ...currentOptScores,
          [criterionId]: safeScore,
        },
      },
    });
  };

  const celebrateWinner = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Ranking Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-300">
                Resultado da Matriz Ponderada
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {winner && highestScore > 0 ? (
                <span>Opção Vencedora: <span className="text-amber-300">{winner.name}</span></span>
              ) : (
                'Preencha as notas dos critérios para ver o vencedor'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Cada critério possui um peso multiplicador de 1 a 5. A pontuação final é a média ponderada com nota de 0 a 10.
            </p>
          </div>

          {winner && highestScore > 0 && (
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-slate-300">Pontuação</span>
                <span className="text-2xl font-bold text-amber-300 font-heading">
                  {winner.totalScore}
                  <span className="text-xs text-slate-400 font-normal">/{totalMaxScore} pts</span>
                </span>
              </div>
              <button
                onClick={celebrateWinner}
                className="px-3.5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Celebrar Decisão</span>
              </button>
            </div>
          )}
        </div>

        {/* Visual Comparison Progress Bars */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rankedOptions.map((opt, index) => {
            const isWinner = index === 0 && opt.totalScore > 0;
            const medal = index === 0 ? '🥇 1º Lugar' : index === 1 ? '🥈 2º Lugar' : index === 2 ? '🥉 3º Lugar' : `${index + 1}º Lugar`;
            return (
              <div
                key={opt.id}
                className={`p-3 rounded-xl transition ${
                  isWinner ? 'bg-white/15 border border-amber-400/50' : 'bg-white/5 border border-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className="text-[11px] text-amber-300">{medal}</span>
                    <span className="truncate max-w-[140px] text-white">{opt.name}</span>
                  </div>
                  <span className="font-bold font-heading text-slate-200">
                    {opt.totalScore} pts ({opt.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${opt.percentage}%`,
                      backgroundColor: opt.color || '#3b82f6',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls: Add Options & Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add Alternative Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-800">Adicionar Nova Alternativa</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Inclua outra opção para comparar lado a lado no dilema.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
              placeholder="Ex: Opção C (Contratar Consultor)..."
              className="flex-1 text-xs sm:text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addOption}
              disabled={!newOptionName.trim()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Opção</span>
            </button>
          </div>
        </div>

        {/* Add Criterion Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-800">Adicionar Critério de Decisão</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              O que você mais valoriza? Dê um nome e defina o peso multiplicador (1 a 5).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newCriterionName}
              onChange={(e) => setNewCriterionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCriterion()}
              placeholder="Ex: Impacto na Saúde Mental..."
              className="flex-1 text-xs sm:text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-semibold">Peso:</span>
              <select
                value={newCriterionWeight}
                onChange={(e) => setNewCriterionWeight(Number(e.target.value))}
                className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((w) => (
                  <option key={w} value={w}>
                    {w} {w === 5 ? '(Máx)' : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={() => addCriterion()}
                disabled={!newCriterionName.trim()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Criteria Quick Buttons */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 font-semibold text-[11px] mr-1">Sugestões de critérios:</span>
        {QUICK_CRITERIA_PRESETS.map((preset, idx) => {
          const alreadyExists = data.criteria.some((c) => c.name.toLowerCase() === preset.toLowerCase());
          if (alreadyExists) return null;
          return (
            <button
              key={idx}
              onClick={() => addCriterion(preset, 4)}
              className="text-[11px] text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 px-2 py-0.5 rounded-md transition"
            >
              + {preset}
            </button>
          );
        })}
      </div>

      {/* Main Comparative Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-xs">
                <th className="p-4 font-bold text-slate-700 min-w-[220px]">
                  Critérios de Decisão
                </th>
                <th className="p-4 font-bold text-slate-700 w-28 text-center">
                  Peso (1-5)
                </th>
                {data.options.map((opt) => {
                  const isTop = opt.id === winner?.id && (winner?.totalScore ?? 0) > 0;
                  return (
                    <th
                      key={opt.id}
                      className={`p-4 font-bold min-w-[190px] transition ${
                        isTop ? 'bg-amber-50/80 border-l border-r border-amber-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: opt.color || '#3b82f6' }}
                          />
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => updateOptionName(opt.id, e.target.value)}
                            className="text-xs sm:text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none w-full"
                          />
                        </div>
                        {data.options.length > 1 && (
                          <button
                            onClick={() => removeOption(opt.id)}
                            className="text-slate-300 hover:text-rose-600 transition p-1"
                            title="Remover alternativa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        Nota de 0 a 10 por critério
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {data.criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-slate-50/50 transition">
                  {/* Criterion Name */}
                  <td className="p-4">
                    <div className="flex items-center justify-between gap-2 group">
                      <input
                        type="text"
                        value={crit.name}
                        onChange={(e) => updateCriterionName(crit.id, e.target.value)}
                        className="font-medium text-slate-800 bg-transparent border-b border-transparent group-hover:border-slate-300 focus:border-indigo-600 focus:outline-none w-full"
                      />
                      {data.criteria.length > 1 && (
                        <button
                          onClick={() => removeCriterion(crit.id)}
                          className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition p-1"
                          title="Remover critério"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Weight Selector */}
                  <td className="p-4 text-center">
                    <select
                      value={crit.weight}
                      onChange={(e) => updateCriterionWeight(crit.id, Number(e.target.value))}
                      className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5].map((w) => (
                        <option key={w} value={w}>
                          x{w}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Option Scores */}
                  {data.options.map((opt) => {
                    const score = data.scores[opt.id]?.[crit.id] ?? 0;
                    const weighted = score * crit.weight;
                    const isTop = opt.id === winner?.id && (winner?.totalScore ?? 0) > 0;
                    return (
                      <td
                        key={opt.id}
                        className={`p-4 ${isTop ? 'bg-amber-50/40 border-l border-r border-amber-200' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={score}
                            onChange={(e) => setScore(opt.id, crit.id, Number(e.target.value))}
                            className="w-24 sm:w-28 accent-indigo-600 cursor-pointer"
                          />
                          <div className="flex items-center gap-1 font-mono">
                            <span className="font-bold text-slate-800 text-xs sm:text-sm w-5 text-right">
                              {score}
                            </span>
                            <span className="text-[10px] text-slate-400">/10</span>
                          </div>
                          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded ml-auto">
                            ={weighted}p
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            {/* Total Footer Row */}
            <tfoot>
              <tr className="bg-slate-900 text-white font-heading">
                <td className="p-4 font-bold text-sm sm:text-base">
                  TOTAL PONDERADO
                </td>
                <td className="p-4 text-center text-xs text-slate-400">
                  {totalMaxScore} máx
                </td>
                {data.options.map((opt) => {
                  const ranked = rankedOptions.find((r) => r.id === opt.id);
                  const isTop = opt.id === winner?.id && (winner?.totalScore ?? 0) > 0;
                  return (
                    <td
                      key={opt.id}
                      className={`p-4 ${isTop ? 'bg-amber-500 text-slate-950 font-bold' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-bold">
                          {ranked?.totalScore ?? 0} pts
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isTop ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ranked?.percentage ?? 0}%
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
