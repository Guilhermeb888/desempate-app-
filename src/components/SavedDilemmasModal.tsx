import React from 'react';
import { Dilemma } from '../types/decision';
import { 
  FolderOpen, 
  X, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  HelpCircle, 
  Calendar,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react';

interface SavedDilemmasModalProps {
  isOpen: boolean;
  onClose: () => void;
  dilemmas: Dilemma[];
  currentId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (dilemma: Dilemma) => void;
  onImport: (dilemmas: Dilemma[]) => void;
}

export const SavedDilemmasModal: React.FC<SavedDilemmasModalProps> = ({
  isOpen,
  onClose,
  dilemmas,
  currentId,
  onSelect,
  onDelete,
  onDuplicate,
  onImport,
}) => {
  if (!isOpen) return null;

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dilemmas, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `desempate-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImport(parsed);
          alert('Decisões importadas com sucesso!');
        }
      } catch (err) {
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Meus Dilemas Salvos
              </h3>
              <p className="text-xs text-slate-500">
                Seus dados ficam 100% gravados localmente no seu navegador.
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

        {/* List of dilemmas */}
        <div className="p-5 space-y-2.5 overflow-y-auto">
          {dilemmas.map((d) => {
            const isCurrent = d.id === currentId;
            return (
              <div
                key={d.id}
                className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/30'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div 
                  onClick={() => {
                    onSelect(d.id);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {d.category}
                    </span>
                    {d.status === 'decidido' ? (
                      <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Decidido
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-700 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> Em Análise
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.2 rounded">
                        Ativo agora
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {d.title || 'Dilema sem título'}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span>•</span>
                    <span>{d.prosCons.pros.length + d.prosCons.cons.length} prós/contras</span>
                    <span>•</span>
                    <span>{d.comparative.options.length} opções</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicate(d)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                    title="Duplicar dilema"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {dilemmas.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja apagar o dilema "${d.title}"?`)) {
                          onDelete(d.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSelect(d.id);
                      onClose();
                    }}
                    className="ml-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <span>Abrir</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Backup Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" /> Baixar Backup JSON
            </button>
            <label className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Importar Backup
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
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
