import React, { useState } from 'react';
import { Coins, X, RotateCw, Heart, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClarityCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOptionA?: string;
  defaultOptionB?: string;
  onApplyDecision?: (chosen: string) => void;
}

export const ClarityCoinModal: React.FC<ClarityCoinModalProps> = ({
  isOpen,
  onClose,
  defaultOptionA = 'Opção A',
  defaultOptionB = 'Opção B',
  onApplyDecision,
}) => {
  const [optionA, setOptionA] = useState(defaultOptionA);
  const [optionB, setOptionB] = useState(defaultOptionB);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);
  const [hasFlipped, setHasFlipped] = useState(false);

  if (!isOpen) return null;

  const flipCoin = () => {
    setIsFlipping(true);
    setResult(null);

    // Random choice after 1.4 seconds
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'A' : 'B';
      setResult(outcome);
      setIsFlipping(false);
      setHasFlipped(true);

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.5 },
      });
    }, 1400);
  };

  const chosenName = result === 'A' ? optionA : optionB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Teste da Moeda da Clareza Mental
              </h3>
              <p className="text-xs text-slate-500">
                O truque psicológico para destravar a intuição inconsciente.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 text-left text-xs text-amber-900 leading-relaxed">
            <span className="font-bold block mb-1">Como funciona o teste?</span>
            Ao jogar a moeda para o alto, no instante em que ela gira no ar, seu cérebro subconsciente torce por um dos lados. E quando ela cai, <strong>se você sentir alívio</strong>, aquela é a resposta. <strong>Se você sentir vontade de jogar de novo</strong>, você já sabe que prefere a outra opção!
          </div>

          {/* Option inputs */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-[11px] font-bold text-indigo-700 uppercase mb-1">
                Cara (Opção A)
              </label>
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Ex: Mudar de Emprego"
                className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-amber-700 uppercase mb-1">
                Coroa (Opção B)
              </label>
              <input
                type="text"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Ex: Ficar no Atual"
                className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Coin Visual */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div
              className={`w-28 h-28 rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-200 shadow-xl flex items-center justify-center transition-all duration-300 ${
                isFlipping ? 'animate-bounce rotate-180 scale-105' : 'hover:scale-102'
              }`}
            >
              <div className="w-22 h-22 rounded-full border-2 border-dashed border-amber-600/40 flex flex-col items-center justify-center text-amber-950 font-bold p-1">
                {isFlipping ? (
                  <RotateCw className="w-8 h-8 animate-spin text-amber-900" />
                ) : result ? (
                  <>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-amber-900">
                      {result === 'A' ? 'Cara' : 'Coroa'}
                    </span>
                    <span className="text-xs font-heading text-center leading-tight mt-0.5 line-clamp-2 px-1">
                      {result === 'A' ? optionA : optionB}
                    </span>
                  </>
                ) : (
                  <>
                    <Coins className="w-7 h-7 text-amber-800 mb-0.5" />
                    <span className="text-[10px] uppercase font-bold text-amber-900">Pronto</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={flipCoin}
              disabled={isFlipping || !optionA.trim() || !optionB.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2 mx-auto active:scale-95"
            >
              <Coins className="w-4 h-4 text-slate-950" />
              <span>{isFlipping ? 'Moeda Girando no Ar...' : hasFlipped ? 'Jogar a Moeda Novamente' : 'Jogar a Moeda para o Alto!'}</span>
            </button>
          </div>

          {/* Reflection result */}
          {hasFlipped && result && !isFlipping && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Momento de reflexão sincera:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ao ver a moeda indicar <strong>"{chosenName}"</strong>:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onApplyDecision?.(chosenName);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex flex-col items-center transition"
                >
                  <span>Sentiu Alívio? 😊</span>
                  <span className="text-[10px] font-normal text-emerald-700 mt-0.5">
                    Essa é a sua escolha!
                  </span>
                </button>

                <button
                  onClick={() => {
                    const otherName = result === 'A' ? optionB : optionA;
                    onApplyDecision?.(otherName);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-300 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold flex flex-col items-center transition"
                >
                  <span>Sentiu Decepção? 😕</span>
                  <span className="text-[10px] font-normal text-indigo-700 mt-0.5">
                    Escolha a outra opção!
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
