import React, { useState } from 'react';
import { Dilemma } from '../types/decision';
import { generateExportMarkdown } from '../utils/storage';
import { 
  Share2, 
  X, 
  Copy, 
  Check, 
  Printer, 
  FileText,
  MessageSquare
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dilemma: Dilemma;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  dilemma,
}) => {
  const [copiedType, setCopiedType] = useState<'md' | 'plain' | null>(null);

  if (!isOpen) return null;

  const markdownText = generateExportMarkdown(dilemma);

  // Generate short message for WhatsApp
  const generateWhatsAppSummary = () => {
    const prosSum = dilemma.prosCons.pros.reduce((acc, p) => acc + p.weight, 0);
    const consSum = dilemma.prosCons.cons.reduce((acc, c) => acc + c.weight, 0);
    const net = prosSum - consSum;

    return `*Desempate — Análise de Decisão*\n\n` +
      `*Dilema:* ${dilemma.title}\n` +
      (dilemma.description ? `*Contexto:* ${dilemma.description}\n\n` : `\n`) +
      `*Prós e Contras:* ${prosSum} a favor vs ${consSum} contra (Saldo: ${net > 0 ? '+' : ''}${net} pts)\n` +
      `*Status:* ${dilemma.status === 'decidido' ? '✅ Decidido' : '🔍 Em Análise'}\n` +
      (dilemma.finalDecision ? `*Decisão Tomada:* ${dilemma.finalDecision}\n` : '') +
      `\nGerado pelo app Desempate`;
  };

  const copyToClipboard = (text: string, type: 'md' | 'plain') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Exportar Relatório do Dilema
              </h3>
              <p className="text-xs text-slate-500">
                Compartilhe com sócios, mentores ou guarde em seus documentos.
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

        {/* Quick Action Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/60 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => copyToClipboard(markdownText, 'md')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            {copiedType === 'md' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedType === 'md' ? 'Markdown Copiado!' : 'Copiar em Markdown'}</span>
          </button>

          <button
            onClick={() => copyToClipboard(generateWhatsAppSummary(), 'plain')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            {copiedType === 'plain' ? <Check className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
            <span>{copiedType === 'plain' ? 'Copiado para WhatsApp!' : 'Copiar Resumo (WhatsApp)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition ml-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>

        {/* Report Preview */}
        <div className="p-5 overflow-y-auto font-mono text-xs text-slate-700 bg-slate-50/60 flex-1 whitespace-pre-wrap leading-relaxed select-all border-inner">
          {markdownText}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
