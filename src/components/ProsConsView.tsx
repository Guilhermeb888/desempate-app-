import React, { useState } from 'react';
import { ProsConsData, WeightedItem } from '../types/decision';
import { 
  Plus, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  Scale, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProsConsViewProps {
  data: ProsConsData;
  onChange: (data: ProsConsData) => void;
  dilemmaTitle: string;
}

const COMMON_THOUGHT_PROMPTS = [
  'Impacto financeiro a curto e longo prazo',
  'Qualidade de vida e nível de estresse diário',
  'Alinhamento com valores e propósito pessoal',
  'Risco de arrependimento nos próximos 5 anos',
  'Tempo livre para família, saúde e lazer',
  'Dificuldade de reversão da decisão caso dê errado',
];

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  data,
  onChange,
  dilemmaTitle,
}) => {
  const [newProText, setNewProText] = useState('');
  const [newProWeight, setNewProWeight] = useState(3);
  const [newConText, setNewConText] = useState('');
  const [newConWeight, setNewConWeight] = useState(3);
  const [isEditingOption, setIsEditingOption] = useState(false);

  const targetOptionName = data.targetOptionName || 'Opção Principal em Avaliação';

  // Calculate weighted sums
  const totalProsWeight = data.pros.reduce((sum, item) => sum + item.weight, 0);
  const totalConsWeight = data.cons.reduce((sum, item) => sum + item.weight, 0);
  const totalWeight = totalProsWeight + totalConsWeight;
  const netScore = totalProsWeight - totalConsWeight;

  // Calculate balance tilt angle (-15 deg to +15 deg)
  const maxTilt = 14;
  const tiltAngle = totalWeight === 0 ? 0 : Math.max(-maxTilt, Math.min(maxTilt, (totalConsWeight - totalProsWeight) * 1.5));

  const addPro = () => {
    if (!newProText.trim()) return;
    const newItem: WeightedItem = {
      id: 'p-' + Date.now(),
      text: newProText.trim(),
      weight: newProWeight,
    };
    onChange({
      ...data,
      pros: [...data.pros, newItem],
    });
    setNewProText('');
    setNewProWeight(3);
  };

  const removePro = (id: string) => {
    onChange({
      ...data,
      pros: data.pros.filter((p) => p.id !== id),
    });
  };

  const updateProWeight = (id: string, weight: number) => {
    onChange({
      ...data,
      pros: data.pros.map((p) => (p.id === id ? { ...p, weight } : p)),
    });
  };

  const addCon = () => {
    if (!newConText.trim()) return;
    const newItem: WeightedItem = {
      id: 'c-' + Date.now(),
      text: newConText.trim(),
      weight: newConWeight,
    };
    onChange({
      ...data,
      cons: [...data.cons, newItem],
    });
    setNewConText('');
    setNewConWeight(3);
  };

  const removeCon = (id: string) => {
    onChange({
      ...data,
      cons: data.cons.filter((c) => c.id !== id),
    });
  };

  const updateConWeight = (id: string, weight: number) => {
    onChange({
      ...data,
      cons: data.cons.map((c) => (c.id === id ? { ...c, weight } : c)),
    });
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4f46e5', '#10b981', '#3b82f6', '#f59e0b'],
    });
  };

  // Verdict calculation
  const getVerdict = () => {
    if (totalWeight === 0) {
      return {
        title: 'Adicione prós e contras para ver o desempate',
        desc: 'Insira os argumentos e classifique a importância de cada um de 1 a 5.',
        badge: 'Aguardando Dados',
        color: 'text-slate-600 bg-slate-100 border-slate-200',
      };
    }
    if (netScore >= 4) {
      return {
        title: `Veredito Favorável: Os prós superam expressivamente os contras (+${netScore} pts)`,
        desc: `Com ${totalProsWeight} pontos positivos ponderados contra ${totalConsWeight} pontos negativos, a decisão apresenta fortes vantagens estratégicas para seguir adiante.`,
        badge: 'Seguir Adiante (Recomendado)',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
      };
    }
    if (netScore > 0) {
      return {
        title: `Veredito Ligeiramente Favorável (+${netScore} pts)`,
        desc: `Há vantagem positiva, mas considere se alguns contras podem ser mitigados ou renegociados antes da decisão final.`,
        badge: 'Favorável com Cautela',
        color: 'text-emerald-700 bg-emerald-50/70 border-emerald-200',
      };
    }
    if (netScore === 0) {
      return {
        title: 'Empate Técnico Perfeito (0 pts)',
        desc: 'O peso dos pontos positivos equivale exatamente ao dos pontos negativos. Use a Tabela Comparativa, a Análise SWOT ou o teste da Moeda da Clareza para desempatar!',
        badge: 'Empate Rigoroso',
        color: 'text-amber-800 bg-amber-50 border-amber-300',
      };
    }
    if (netScore > -4) {
      return {
        title: `Veredito Desfavorável (${netScore} pts)`,
        desc: `Os pontos negativos superam os positivos. A menos que os principais contras sejam contornados, o risco supera o benefício imediato.`,
        badge: 'Reavaliar Opção',
        color: 'text-rose-700 bg-rose-50/70 border-rose-200',
      };
    }
    return {
      title: `Veredito Fortemente Desfavorável (${netScore} pts)`,
      desc: `Com ${totalConsWeight} pontos contra e apenas ${totalProsWeight} a favor, os riscos e desvantagens superam amplamente os ganhos. Recomenda-se buscar outra alternativa.`,
      badge: 'Não Recomendado',
      color: 'text-rose-800 bg-rose-50 border-rose-300',
    };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-6">
      {/* Option Identifier Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">
            Opção sob avaliação de Prós & Contras
          </div>
          {isEditingOption ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={data.targetOptionName || ''}
                onChange={(e) => onChange({ ...data, targetOptionName: e.target.value })}
                placeholder="Ex: Aceitar a Nova Proposta"
                className="text-base font-bold text-slate-900 border border-indigo-400 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => setIsEditingOption(false)}
                className="text-xs bg-indigo-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700"
              >
                Salvar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                {targetOptionName}
              </h2>
              <button
                onClick={() => setIsEditingOption(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline ml-1"
              >
                Alterar nome
              </button>
            </div>
          )}
          <p className="text-xs text-slate-500 mt-0.5">
            Avalie os prós e contras atribuindo pesos de 1 (baixo) a 5 (decisivo) para cada fator.
          </p>
        </div>

        {/* Score Quick Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 self-stretch md:self-auto justify-around md:justify-end">
          <div className="text-center px-2">
            <span className="block text-[10px] uppercase font-bold text-emerald-700">Prós</span>
            <span className="text-xl font-bold text-emerald-600 font-heading">+{totalProsWeight}</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="block text-[10px] uppercase font-bold text-rose-700">Contras</span>
            <span className="text-xl font-bold text-rose-600 font-heading">-{totalConsWeight}</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-2">
            <span className="block text-[10px] uppercase font-bold text-slate-600">Saldo</span>
            <span className={`text-xl font-bold font-heading ${netScore > 0 ? 'text-emerald-600' : netScore < 0 ? 'text-rose-600' : 'text-slate-600'}`}>
              {netScore > 0 ? `+${netScore}` : netScore}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Balance Bar (Seesaw) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Balança Dinâmica de Decisão</span>
          </div>
          <span className="text-xs text-slate-500">
            {totalWeight === 0 ? '0 pontos avaliados' : `${totalWeight} pontos totais em jogo`}
          </span>
        </div>

        {/* Seesaw animation visual */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div 
            className="w-full max-w-lg h-3 rounded-full bg-slate-200 relative transition-transform duration-700 ease-out origin-center flex items-center"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Left Pan: Pros */}
            <div className="absolute -left-3 -top-12 sm:-top-14 flex flex-col items-center">
              <div className="px-3 py-1 rounded-xl bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{totalProsWeight} pts</span>
              </div>
              <div className="w-0.5 h-6 bg-emerald-400 mt-1" />
            </div>

            {/* Pivot Indicator */}
            <div className="w-4 h-4 rounded-full bg-slate-800 mx-auto shadow-sm border-2 border-white" />

            {/* Right Pan: Cons */}
            <div className="absolute -right-3 -top-12 sm:-top-14 flex flex-col items-center">
              <div className="px-3 py-1 rounded-xl bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{totalConsWeight} pts</span>
              </div>
              <div className="w-0.5 h-6 bg-rose-400 mt-1" />
            </div>
          </div>
          {/* Base Stand */}
          <div className="w-12 h-6 border-l-2 border-r-2 border-t-2 border-slate-400/80 rounded-t-sm -mt-0.5" />
          <div className="w-24 h-1.5 bg-slate-600 rounded-full" />
        </div>

        {/* Verdict Box */}
        <div className={`mt-4 p-4 rounded-xl border text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${verdict.color}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm sm:text-base font-heading">
                {verdict.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm opacity-90">
              {verdict.desc}
            </p>
          </div>
          {netScore > 0 && (
            <button
              onClick={handleCelebrate}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Comemorar Clareza
            </button>
          )}
        </div>
      </div>

      {/* Two Column Grid: Pros and Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: PRÓS */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-heading">
                  Prós (Vantagens)
                </h3>
                <span className="text-xs text-slate-500">
                  {data.pros.length} {data.pros.length === 1 ? 'item' : 'itens'} cadastrados
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Total: +{totalProsWeight} pts
            </span>
          </div>

          {/* Add Pro Form */}
          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 mb-4">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newProText}
                onChange={(e) => setNewProText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPro()}
                placeholder="Adicionar novo benefício ou pró..."
                className="w-full text-xs sm:text-sm bg-white border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-[11px] font-semibold text-emerald-800">Peso:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setNewProWeight(w)}
                        className={`w-6 h-6 rounded-md text-xs font-bold transition ${
                          newProWeight === w
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                        }`}
                        title={`Peso ${w}: ${w === 5 ? 'Impacto Decisivo' : w === 1 ? 'Impacto Leve' : 'Impacto Relevante'}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addPro}
                  disabled={!newProText.trim()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pros List */}
          <div className="space-y-2 flex-1">
            {data.pros.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs sm:text-sm border-2 border-dashed border-emerald-100 rounded-xl">
                Nenhuma vantagem adicionada ainda.
                <p className="text-[11px] text-slate-400 mt-1">O que torna essa decisão positiva?</p>
              </div>
            ) : (
              data.pros.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/20 transition shadow-2xs"
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug break-words">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Weight selector */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Peso</span>
                      <select
                        value={item.weight}
                        onChange={(e) => updateProWeight(item.id, Number(e.target.value))}
                        className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((w) => (
                          <option key={w} value={w}>
                            {w} {w === 5 ? '(Decisivo)' : w === 1 ? '(Baixo)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => removePro(item.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded transition opacity-80 group-hover:opacity-100"
                      title="Excluir pró"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: CONTRAS */}
        <div className="bg-white rounded-2xl border border-rose-200/80 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <ThumbsDown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-heading">
                  Contras (Desvantagens)
                </h3>
                <span className="text-xs text-slate-500">
                  {data.cons.length} {data.cons.length === 1 ? 'item' : 'itens'} cadastrados
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Total: -{totalConsWeight} pts
            </span>
          </div>

          {/* Add Con Form */}
          <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 mb-4">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newConText}
                onChange={(e) => setNewConText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCon()}
                placeholder="Adicionar novo risco, custo ou obstáculo..."
                className="w-full text-xs sm:text-sm bg-white border border-rose-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-[11px] font-semibold text-rose-800">Peso:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setNewConWeight(w)}
                        className={`w-6 h-6 rounded-md text-xs font-bold transition ${
                          newConWeight === w
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
                        }`}
                        title={`Peso ${w}: ${w === 5 ? 'Impacto Decisivo' : w === 1 ? 'Impacto Leve' : 'Impacto Relevante'}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addCon}
                  disabled={!newConText.trim()}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cons List */}
          <div className="space-y-2 flex-1">
            {data.cons.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs sm:text-sm border-2 border-dashed border-rose-100 rounded-xl">
                Nenhum contra adicionado ainda.
                <p className="text-[11px] text-slate-400 mt-1">Quais riscos ou concessões estão envolvidos?</p>
              </div>
            ) : (
              data.cons.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/20 transition shadow-2xs"
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug break-words">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Weight selector */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Peso</span>
                      <select
                        value={item.weight}
                        onChange={(e) => updateConWeight(item.id, Number(e.target.value))}
                        className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((w) => (
                          <option key={w} value={w}>
                            {w} {w === 5 ? '(Decisivo)' : w === 1 ? '(Baixo)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => removeCon(item.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded transition opacity-80 group-hover:opacity-100"
                      title="Excluir contra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Thought Prompts Helper */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Fatores-chave recomendados para não esquecer de ponderar:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_THOUGHT_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNewProText(prompt);
              }}
              className="text-[11px] text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition text-left"
              title="Clique para usar como texto de pró ou contra"
            >
              + {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
