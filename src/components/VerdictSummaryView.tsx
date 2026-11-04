import React from 'react';
import { Dilemma } from '../types/decision';
import { 
  Award, 
  CheckCircle2, 
  Scale, 
  Table2, 
  Compass, 
  Sparkles, 
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerdictSummaryViewProps {
  dilemma: Dilemma;
  onChange: (updated: Dilemma) => void;
  onGoToMethod: (method: 'pros-cons' | 'comparative' | 'swot') => void;
}

export const VerdictSummaryView: React.FC<VerdictSummaryViewProps> = ({
  dilemma,
  onChange,
  onGoToMethod,
}) => {
  // Pros & Cons stats
  const prosSum = dilemma.prosCons.pros.reduce((acc, p) => acc + p.weight, 0);
  const consSum = dilemma.prosCons.cons.reduce((acc, c) => acc + c.weight, 0);
  const netScore = prosSum - consSum;

  // Comparative winner
  const totalMaxScore = dilemma.comparative.criteria.reduce((sum, crit) => sum + 10 * crit.weight, 0);
  const ranked = dilemma.comparative.options.map((opt) => {
    let scoreSum = 0;
    dilemma.comparative.criteria.forEach((crit) => {
      scoreSum += (dilemma.comparative.scores[opt.id]?.[crit.id] ?? 0) * crit.weight;
    });
    const percentage = totalMaxScore > 0 ? Math.round((scoreSum / totalMaxScore) * 100) : 0;
    return { ...opt, totalScore: scoreSum, percentage };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const topOption = ranked[0];

  // SWOT stats
  const strengthCount = dilemma.swot.strengths.length;
  const weaknessCount = dilemma.swot.weaknesses.length;
  const opportunityCount = dilemma.swot.opportunities.length;
  const threatCount = dilemma.swot.threats.length;

  const handleFinalNotesChange = (text: string) => {
    onChange({
      ...dilemma,
      finalNotes: text,
      updatedAt: Date.now(),
    });
  };

  const handleFinalDecisionChange = (text: string) => {
    onChange({
      ...dilemma,
      finalDecision: text,
      updatedAt: Date.now(),
    });
  };

  const handleMarkDecided = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
    });
    onChange({
      ...dilemma,
      status: 'decidido',
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Big Hero Veredito */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-xs">
          <Award className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mb-2">
          Síntese & Veredito do Dilema
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Veja a convergência dos resultados entre Prós e Contras, Matriz Comparativa e Análise SWOT para tomar sua decisão com confiança e tranquilidade.
        </p>

        {/* Status Callout */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {dilemma.status === 'decidido' ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Decisão Concluída e Registrada</span>
            </div>
          ) : (
            <button
              onClick={handleMarkDecided}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Concluir e Bater o Martelo!</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Methods Comparative Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Method 1: Pros & Cons Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase text-slate-500">Prós e Contras</span>
              </div>
              <button
                onClick={() => onGoToMethod('pros-cons')}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                Ver detalhes
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl mb-3">
              <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
                Saldo Ponderado
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold font-heading ${netScore > 0 ? 'text-emerald-600' : netScore < 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                  {netScore > 0 ? `+${netScore}` : netScore} pts
                </span>
                <span className="text-xs text-slate-500">
                  ({prosSum} prós / {consSum} contras)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {netScore > 0 ? (
                <span className="text-emerald-700 font-medium">
                  ✓ Os prós superam as desvantagens de forma clara.
                </span>
              ) : netScore < 0 ? (
                <span className="text-rose-700 font-medium">
                  ✗ As objeções pesam mais que os ganhos imediatos.
                </span>
              ) : (
                <span className="text-slate-600">
                  Empate nos prós e contras ponderados.
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            {dilemma.prosCons.pros.length + dilemma.prosCons.cons.length} argumentos ponderados
          </div>
        </div>

        {/* Method 2: Comparative Table Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Table2 className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase text-slate-500">Tabela Comparativa</span>
              </div>
              <button
                onClick={() => onGoToMethod('comparative')}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                Ver matriz
              </button>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl mb-3">
              <span className="text-[11px] text-amber-800 uppercase font-bold block mb-1">
                Melhor Alternativa
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-bold font-heading text-slate-900 truncate">
                  {topOption ? topOption.name : 'Nenhuma opção'}
                </span>
                <span className="text-sm font-bold text-amber-600 shrink-0">
                  {topOption?.percentage}%
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              {ranked.slice(0, 2).map((opt, i) => (
                <div key={opt.id} className="flex justify-between items-center text-[11px]">
                  <span className="truncate">{i === 0 ? '🥇' : '🥈'} {opt.name}</span>
                  <span className="font-semibold text-slate-700">{opt.totalScore} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            {dilemma.comparative.options.length} alternativas • {dilemma.comparative.criteria.length} critérios
          </div>
        </div>

        {/* Method 3: SWOT Summary Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase text-slate-500">Análise SWOT (FOFA)</span>
              </div>
              <button
                onClick={() => onGoToMethod('swot')}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                Ver quadrantes
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl mb-3 grid grid-cols-2 gap-2 text-center">
              <div className="p-1 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Interno</span>
                <span className="text-xs font-bold text-emerald-600">{strengthCount} F</span> / <span className="text-xs font-bold text-amber-600">{weaknessCount} F</span>
              </div>
              <div className="p-1 rounded bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">Externo</span>
                <span className="text-xs font-bold text-sky-600">{opportunityCount} O</span> / <span className="text-xs font-bold text-rose-600">{threatCount} A</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {strengthCount >= weaknessCount ? (
                <span className="text-emerald-700 font-medium">
                  ✓ Recursos internos suficientes para suportar os riscos.
                </span>
              ) : (
                <span className="text-amber-700 font-medium">
                  ⚠️ Atenção para mitigar as fraquezas internas identificadas.
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            {strengthCount + weaknessCount + opportunityCount + threatCount} fatores mapeados
          </div>
        </div>
      </div>

      {/* Decision Registry Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base sm:text-lg font-bold font-heading">
            Registro Oficial da sua Decisão & Próximos Passos
          </h3>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Qual foi o desfecho escolhido?
          </label>
          <input
            type="text"
            value={dilemma.finalDecision || ''}
            onChange={(e) => handleFinalDecisionChange(e.target.value)}
            placeholder="Ex: Decidi aceitar a proposta e negociar 2 semanas para a transição..."
            className="w-full text-sm font-semibold border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Notas de reflexão, plano de ação e gatilhos de segurança
          </label>
          <textarea
            value={dilemma.finalNotes || ''}
            onChange={(e) => handleFinalNotesChange(e.target.value)}
            placeholder="Ex: 1) Comunicar a liderança até sexta-feira. 2) Reorganizar a reserva financeira. 3) Reavaliar em 6 meses se as expectativas foram atendidas."
            rows={4}
            className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
