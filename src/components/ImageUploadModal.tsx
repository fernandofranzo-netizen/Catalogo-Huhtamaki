import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Link,
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { CatalogItem } from '../types';

interface ImageUploadModalProps {
  isOpen: boolean;
  item: CatalogItem | null;
  onClose: () => void;
  onSaveImage: (itemId: string, imageUrl: string) => void;
  onRemoveImage?: (itemId: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  item,
  onClose,
  onSaveImage,
  onRemoveImage,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setImageUrl(item.imagemUrl || '');
      setPreviewUrl(item.imagemUrl || null);
      setError(null);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP, SVG).');
      return;
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('A imagem é muito grande. O tamanho máximo permitido é 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewUrl(result);
        setImageUrl(result);
      }
    };
    reader.onerror = () => {
      setError('Erro ao ler a imagem selecionada.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleSave = () => {
    if (!previewUrl && !imageUrl) {
      setError('Nenhuma imagem selecionada para salvar.');
      return;
    }
    onSaveImage(item.id, previewUrl || imageUrl);
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm(`Deseja realmente remover a foto do item ${item.codigo}?`)) {
      if (onRemoveImage) {
        onRemoveImage(item.id);
      } else {
        onSaveImage(item.id, '');
      }
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="modal-image-upload"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-100 text-cyan-800 rounded-md border border-cyan-200">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-700 uppercase">
                FOTO DO ITEM // REGISTRO VISUAL
              </div>
              <h2 className="text-base font-black text-slate-900 uppercase font-sans">
                Inserir / Alterar Imagem
              </h2>
            </div>
          </div>
          <button
            id="btn-close-image-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item reference banner */}
        <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-mono font-bold text-slate-900">{item.codigo}</span>
            <span className="mx-2 text-slate-400">•</span>
            <span className="text-slate-600 truncate max-w-xs inline-block align-bottom">
              {item.descricao}
            </span>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-800 bg-white border border-slate-200 rounded">
            {item.categoria}
          </span>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b border-slate-200 px-5 pt-3 bg-white gap-4">
          <button
            id="tab-upload-file"
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setError(null);
            }}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-cyan-600 text-cyan-800'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload do Computador</span>
          </button>

          <button
            id="tab-upload-url"
            type="button"
            onClick={() => {
              setActiveTab('url');
              setError(null);
            }}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'url'
                ? 'border-cyan-600 text-cyan-800'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Link / URL da Imagem</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {activeTab === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                id="dropzone-image"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all cursor-pointer text-center ${
                  isDragging
                    ? 'border-cyan-500 bg-cyan-50/60 scale-[1.01]'
                    : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-2.5 rounded-full bg-cyan-100 text-cyan-800 shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 uppercase">
                  Clique ou arraste a foto aqui
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Formatos suportados: PNG, JPG, JPEG, WEBP ou SVG (até 10 MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                Endereço URL da Imagem
              </label>
              <div className="relative">
                <input
                  id="input-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewUrl(e.target.value.trim() || null);
                    setError(null);
                  }}
                  placeholder="https://exemplo.com/fotos/peca-industrial.jpg"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xs focus:outline-hidden focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-sans"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Insira o link direto de uma imagem hospedada na web ou intranet da empresa.
              </p>
            </div>
          )}

          {/* Preview Section */}
          {previewUrl && (
            <div className="border border-slate-200 rounded-md p-3 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1 text-slate-700">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-700" />
                  Pré-visualização
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Imagem carregada
                </span>
              </div>
              <div className="w-full h-48 bg-white border border-slate-200 rounded-xs flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Pré-visualização do item"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                  onError={() => {
                    setError('Não foi possível carregar a imagem deste endereço.');
                    setPreviewUrl(null);
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
          <div>
            {item.imagemUrl && (
              <button
                id="btn-remove-image"
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 p-1.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                title="Remover imagem atual"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover Imagem</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-image-upload"
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              id="btn-save-item-image"
              type="button"
              onClick={handleSave}
              disabled={!previewUrl && !imageUrl}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xs shadow-xs transition-colors cursor-pointer ${
                previewUrl || imageUrl
                  ? 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Salvar Imagem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
