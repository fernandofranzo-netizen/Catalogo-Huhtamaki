import React, { useState, useRef } from 'react';
import { X, FileText, Upload, Link2, Download, Trash2, ExternalLink, Plus, FileCode, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { CatalogItem, TechnicalDocument, UserRole } from '../types';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CatalogItem | null;
  onSaveDocuments: (itemId: string, documents: TechnicalDocument[]) => void;
  userRole: UserRole;
  onPromptGestor?: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveDocuments,
  userRole,
  onPromptGestor,
}) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TechnicalDocument['tipo']>('datasheet');
  const [url, setUrl] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !item) return null;

  const currentDocs = item.documentos || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB for local base64 storage)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('O arquivo selecionado é maior que 10MB. Para arquivos maiores, utilize o modo Link / URL externa.');
      return;
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    setFileName(file.name);
    setTamanho(formatSize(file.size));
    if (!nome) {
      // Auto fill name based on file name
      setNome(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !url.trim()) {
      alert('Preencha o nome do documento e anexe um arquivo ou forneça a URL.');
      return;
    }

    const newDoc: TechnicalDocument = {
      id: `doc-${Date.now()}`,
      nome: nome.trim(),
      tipo,
      url: url.trim(),
      tamanho: tamanho || (mode === 'url' ? 'Link Web' : 'Arquivo'),
      dataUpload: new Date().toLocaleDateString('pt-BR'),
    };

    const updated = [...currentDocs, newDoc];
    onSaveDocuments(item.id, updated);

    // Reset form
    setNome('');
    setUrl('');
    setTamanho('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteDocument = (docId: string) => {
    const updated = currentDocs.filter((d) => d.id !== docId);
    onSaveDocuments(item.id, updated);
  };

  const getTipoBadge = (type: TechnicalDocument['tipo']) => {
    switch (type) {
      case 'datasheet':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-50 text-rose-700 border border-rose-200">Data-sheet</span>;
      case 'manual':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-50 text-blue-700 border border-blue-200">Manual</span>;
      case 'desenho':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Desenho 2D/3D</span>;
      case 'certificado':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Certificado</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700 border border-slate-200">Documento</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="modal-documentacao-tecnica"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-cyan-700 uppercase">
              DOCUMENTAÇÃO TÉCNICA // DATA-SHEETS
            </div>
            <h2 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
              <span className="font-mono">{item.codigo}</span>
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">
              {item.descricao}
            </p>
          </div>
          <button
            id="btn-close-doc-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Section 1: Attached Documents List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-600" />
                <span>Documentos Anexados ({currentDocs.length})</span>
              </h3>
            </div>

            {currentDocs.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">Nenhum data-sheet ou documento técnico anexado.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Utilize o formulário abaixo para anexar PDFs, manuais de fabricantes ou links oficiais.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-md shrink-0">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs truncate max-w-xs sm:max-w-md">
                            {doc.nome}
                          </span>
                          {getTipoBadge(doc.tipo)}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                          {doc.tamanho && <span>{doc.tamanho}</span>}
                          {doc.dataUpload && (
                            <>
                              <span>•</span>
                              <span>Adicionado em {doc.dataUpload}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={doc.nome}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-cyan-900 bg-cyan-50 hover:bg-cyan-100 rounded-md border border-cyan-300 transition-colors shadow-xs"
                        title="Visualizar documento"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir / Baixar</span>
                      </a>
                      {userRole === 'gestor' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          title="Remover documento (Apenas Gestor)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Form to Add / Upload New Document (Only for Gestor) */}
          {userRole === 'gestor' ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <h4 className="font-extrabold uppercase text-xs tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>Anexar Novo Data-sheet / Documento</span>
                </h4>

                {/* Mode switch */}
                <div className="flex items-center bg-slate-200/70 p-0.5 rounded text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`px-2 py-1 rounded transition-colors ${
                      mode === 'upload' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Carregar Arquivo (PDF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`px-2 py-1 rounded transition-colors ${
                      mode === 'url' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Link / URL Externa
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddDocument} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nome do Documento */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[10px]">
                      Nome do Documento *
                    </label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Data-sheet Técnico SKF 6204-2RS1"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Tipo de Documento */}
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[10px]">
                      Tipo de Documento *
                    </label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    >
                      <option value="datasheet">Data-sheet Técnico</option>
                      <option value="manual">Manual do Fabricante / Instalação</option>
                      <option value="desenho">Desenho Técnico (2D / 3D / CAD)</option>
                      <option value="certificado">Certificado de Qualidade / Conformidade</option>
                      <option value="outro">Outro Documento Técnico</option>
                    </select>
                  </div>
                </div>

                {/* Upload Input or URL Input */}
                {mode === 'upload' ? (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[10px]">
                      Arquivo Técnico (PDF, DWG, STEP, etc.) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.dwg,.step,.stp,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{fileName ? 'Trocar arquivo...' : 'Selecionar arquivo...'}</span>
                      </button>
                      {fileName ? (
                        <span className="text-xs text-slate-700 font-mono truncate max-w-xs">
                          {fileName} ({tamanho})
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Nenhum arquivo selecionado</span>
                      )}
                    </div>
                    {fileError && <p className="text-[11px] text-rose-600 mt-1">{fileError}</p>}
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[10px]">
                      URL / Link do Data-sheet Online *
                    </label>
                    <div className="relative">
                      <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://fabricante.com/downloads/datasheet.pdf"
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-slate-950 uppercase tracking-wider bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Anexar ao Item</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong className="text-slate-800">Modo Manutentor (Leitura): </strong>
                  Apenas o gestor pode anexar novos documentos técnicos ou remover arquivos existentes.
                </span>
              </div>
              {onPromptGestor && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPromptGestor();
                  }}
                  className="shrink-0 px-3 py-1 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded transition-colors uppercase tracking-wider"
                >
                  Entrar como Gestor
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
