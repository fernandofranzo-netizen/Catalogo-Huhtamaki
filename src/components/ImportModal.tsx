import React, { useState, useRef } from 'react';
import { X, Upload, FileText, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { CatalogItem } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newItems: CatalogItem[]) => void;
  onRestoreDefaults: () => void;
}

const SAMPLE_JSON = `[
  {
    "codigo": "MM-REPOS-00999-00",
    "descricao": "ROLAMENTO AUTOCOMPENSADOR SKF 22210 - 50 x 90 x 23mm",
    "categoria": "ROLAMENTOS",
    "fabricante": "SKF",
    "dimensao": "50 x 90 x 23mm",
    "localizacao": "Almoxarifado Central - Prateleira B-09",
    "palavrasChave": ["rolamento", "autocompensador", "skf", "22210"]
  }
]`;

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onRestoreDefaults,
}) => {
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonText(content);
        setError(null);
      } catch (err) {
        setError('Erro ao ler o arquivo selecionado.');
      }
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setError('O JSON deve ser uma lista (array) de objetos contendo os itens.');
        return;
      }

      if (parsed.length === 0) {
        setError('A lista fornecida está vazia.');
        return;
      }

      const validItems: CatalogItem[] = parsed.map((raw: any, index: number) => {
        if (!raw.codigo || !raw.descricao) {
          throw new Error(`Item na posição ${index + 1} não possui 'codigo' ou 'descricao'.`);
        }
        return {
          id: raw.id || `item-import-${Date.now()}-${index}`,
          codigo: String(raw.codigo).toUpperCase(),
          descricao: String(raw.descricao),
          categoria: String(raw.categoria || 'OUTROS / REPOSIÇÃO').toUpperCase(),
          fabricante: raw.fabricante ? String(raw.fabricante) : undefined,
          dimensao: raw.dimensao ? String(raw.dimensao) : undefined,
          localizacao: raw.localizacao ? String(raw.localizacao) : undefined,
          palavrasChave: Array.isArray(raw.palavrasChave)
            ? raw.palavrasChave.map(String)
            : Array.isArray(raw.palavras_chave)
            ? raw.palavras_chave.map(String)
            : [],
          imagemUrl: raw.imagemUrl || raw.imagem_url || undefined,
          favorito: Boolean(raw.favorito),
          status: raw.status || 'disponivel',
          observacoes: raw.observacoes || undefined,
          dataCriacao: raw.dataCriacao || new Date().toISOString().split('T')[0],
        };
      });

      onImport(validItems);
      onClose();
    } catch (err: any) {
      setError(err.message || 'JSON inválido. Verifique a formatação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="modal-import-catalog"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              ENTRADA DE DADOS
            </div>
            <h2 className="text-base font-black text-slate-900 uppercase">
              IMPORTAR CATÁLOGO
            </h2>
          </div>
          <button
            id="btn-close-import-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Cole um array JSON com os dados (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">codigo</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">descricao</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">categoria</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">palavrasChave</code>) ou selecione um arquivo <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">.json</code> do seu computador.
          </p>

          <div className="relative">
            <textarea
              id="textarea-import-json"
              rows={9}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setError(null);
              }}
              className="w-full p-3 font-mono text-[11px] bg-slate-900 text-cyan-300 rounded-md border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
              spellCheck={false}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bottom Bar: File Upload button + Restore Default button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                id="btn-select-file-import"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Selecionar arquivo</span>
              </button>

              <button
                id="btn-restore-defaults"
                type="button"
                onClick={() => {
                  if (window.confirm('Restaurar o catálogo original completo com todos os itens técnicos de fábrica?')) {
                    onRestoreDefaults();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                title="Restaurar catálogo inicial completo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restaurar Padrão</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-import-json"
                type="button"
                onClick={handleProcessImport}
                className="px-4 py-2 text-xs font-extrabold text-slate-950 uppercase tracking-wider bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs transition-colors"
              >
                Importar dados
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
