import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Star, Edit3, Tag, MapPin, Building2, Ruler, ShieldAlert, FileText, ExternalLink, Plus, Trash2, Lock, Camera, Upload } from 'lucide-react';
import { CatalogItem, TechnicalDocument, UserRole } from '../types';
import { TechnicalPlaceholder } from './TechnicalPlaceholder';
import { ImageUploadModal } from './ImageUploadModal';

interface ItemDetailProps {
  item: CatalogItem;
  onBack: () => void;
  onEdit: (item: CatalogItem) => void;
  onToggleFavorite: (id: string) => void;
  onCopySuccess: (code: string) => void;
  onOpenDocuments: (item: CatalogItem) => void;
  onUpdateImage?: (itemId: string, imageUrl: string) => void;
  userRole: UserRole;
  onPromptGestor?: () => void;
}

export const ItemDetail: React.FC<ItemDetailProps> = ({
  item,
  onBack,
  onEdit,
  onToggleFavorite,
  onCopySuccess,
  onOpenDocuments,
  onUpdateImage,
  userRole,
  onPromptGestor,
}) => {
  const [copied, setCopied] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const docs = item.documentos || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(item.codigo);
    setCopied(true);
    onCopySuccess(item.codigo);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSaveImage = (itemId: string, imageUrl: string) => {
    if (onUpdateImage) {
      onUpdateImage(itemId, imageUrl);
    }
  };

  const handleRemoveImage = (itemId: string) => {
    if (onUpdateImage) {
      onUpdateImage(itemId, '');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          id="btn-back-to-catalog"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider text-slate-600 hover:text-slate-950 uppercase font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao catálogo</span>
        </button>
      </div>

      {/* Main Header with Code & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1.5">
          <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200 rounded uppercase font-mono">
            {item.categoria}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
            {item.codigo}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl font-medium">
            {item.descricao}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Botão de Documentação Técnica / Data-sheet */}
          <button
            id="btn-detail-documents"
            type="button"
            onClick={() => onOpenDocuments(item)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 rounded-md shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-cyan-700" />
            <span>Data-sheet / Docs</span>
            {docs.length > 0 && (
              <span className="px-1.5 py-0.2 bg-cyan-700 text-white rounded text-[10px] font-mono font-bold">
                {docs.length}
              </span>
            )}
          </button>

          <button
            id="btn-detail-copy"
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-md shadow-xs transition-colors ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar código</span>
              </>
            )}
          </button>

          <button
            id="btn-detail-favorite"
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2.5 rounded-md border transition-colors ${
              item.favorito
                ? 'bg-amber-50 border-amber-300 text-amber-500'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title="Favoritar"
          >
            <Star className={`w-4 h-4 ${item.favorito ? 'fill-amber-400' : ''}`} />
          </button>

          {userRole === 'gestor' && (
            <button
              id="btn-detail-edit"
              type="button"
              onClick={() => onEdit(item)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Editar</span>
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout: Visual vs Identification Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual / Image Container */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col items-center justify-between min-h-[400px]">
            {/* Top Toolbar inside image card */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {item.imagemUrl ? 'FOTO REAL / REVISADA' : 'ESQUEMA TÉCNICO CAD'}
              </span>

              <button
                id="btn-upload-image-detail"
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 rounded-md shadow-2xs transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-700" />
                <span>{item.imagemUrl ? 'Alterar Imagem' : 'Inserir Imagem Manualmente'}</span>
              </button>
            </div>

            {/* Image display or placeholder */}
            <div className="w-full flex-1 flex items-center justify-center p-2 min-h-[260px]">
              {item.imagemUrl ? (
                <div className="w-full h-72 flex items-center justify-center p-2">
                  <img
                    src={item.imagemUrl}
                    alt={item.descricao}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-4">
                  <TechnicalPlaceholder size="lg" className="w-full h-56 border-0 bg-transparent" />
                  <button
                    id="btn-add-image-empty-state"
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="mt-3 flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Inserir Imagem Manualmente</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom info label */}
            <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>REF: {item.codigo}</span>
              <button
                id="btn-open-modal-sublink"
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="text-cyan-700 hover:text-cyan-900 font-sans font-bold hover:underline cursor-pointer"
              >
                {item.imagemUrl ? 'Substituir ou remover imagem' : 'Inserir foto do item'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Identification Card */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <div className="text-xs font-bold tracking-wider text-slate-900 uppercase border-b border-slate-100 pb-3">
              Identificação
            </div>

            <dl className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="py-2.5 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold">Código</dt>
                <dd className="col-span-2 font-mono font-bold text-slate-900">{item.codigo}</dd>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold">Categoria</dt>
                <dd className="col-span-2 font-medium text-slate-800">{item.categoria}</dd>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Fabricante
                </dt>
                <dd className="col-span-2 font-medium text-slate-800">
                  {item.fabricante || <span className="text-slate-400 italic">Não informado</span>}
                </dd>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" />
                  Dimensão
                </dt>
                <dd className="col-span-2 font-mono text-slate-800">
                  {item.dimensao || <span className="text-slate-400 italic">Não informado</span>}
                </dd>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Localização
                </dt>
                <dd className="col-span-2 font-medium text-slate-800">
                  {item.localizacao || <span className="text-slate-400 italic">Não informado</span>}
                </dd>
              </div>

              <div className="py-2.5 grid grid-cols-3 gap-2">
                <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold">Status</dt>
                <dd className="col-span-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Disponível no Almoxarifado
                  </span>
                </dd>
              </div>

              {/* Palavras-chave */}
              <div className="py-3">
                <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  Palavras-chave
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {item.palavrasChave && item.palavrasChave.length > 0 ? (
                    item.palavrasChave.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs font-mono font-medium text-slate-700 bg-slate-100 rounded border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-xs">Nenhuma tag cadastrada</span>
                  )}
                </dd>
              </div>

              {/* Observações */}
              {item.observacoes && (
                <div className="py-3">
                  <dt className="text-slate-400 uppercase font-mono text-[11px] font-bold mb-1">
                    Observações Técnicas
                  </dt>
                  <dd className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                    {item.observacoes}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Seção de Documentação Técnica / Data-sheets */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600" />
                <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                  Documentação Técnica & Data-sheets
                </h3>
              </div>
              {userRole === 'gestor' && (
                <button
                  id="btn-detail-add-doc"
                  type="button"
                  onClick={() => onOpenDocuments(item)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded transition-colors uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Anexar Data-sheet</span>
                </button>
              )}
            </div>

            {docs.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-md">
                <p className="text-xs text-slate-600 font-medium">Nenhum data-sheet ou manual anexado a este item.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {userRole === 'gestor'
                    ? 'Clique no botão acima para adicionar o PDF ou link do manual técnico do fabricante.'
                    : 'Aguardando inclusão de documentação técnica pela equipe de supervisão/gestão.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-md hover:border-cyan-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-800 text-xs truncate max-w-xs">{doc.nome}</span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-rose-50 text-rose-700 border border-rose-200">
                            {doc.tipo}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {doc.tamanho} {doc.dataUpload && `• ${doc.dataUpload}`}
                        </span>
                      </div>
                    </div>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-cyan-800 bg-white hover:bg-cyan-50 border border-cyan-200 rounded transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Abrir</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technical Disclaimer matching bottom of screenshot */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              As especificações técnicas contidas nesta tela são aproximadas e não substituem o manual do fabricante e as ordens de manutenção oficiais.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        item={item}
        onClose={() => setIsImageModalOpen(false)}
        onSaveImage={handleSaveImage}
        onRemoveImage={handleRemoveImage}
      />
    </div>
  );
};
