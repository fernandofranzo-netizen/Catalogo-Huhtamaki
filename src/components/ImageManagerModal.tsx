import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Link2, Search, Trash2, Check, RefreshCw, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { CatalogItem } from '../types';
import { searchTechnicalImages, TechnicalImageSuggestion } from '../utils/technicalImages';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CatalogItem | null;
  onSaveImage?: (itemId: string, newImageUrl?: string) => void;
  onSelectUrl?: (url: string) => void;
}

type TabMode = 'suggestions' | 'upload' | 'url';

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveImage,
  onSelectUrl,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('suggestions');
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<TechnicalImageSuggestion[]>([]);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state when item changes or modal opens
  useEffect(() => {
    if (item) {
      const initialUrl = item.imagemUrl || '';
      setSelectedUrl(initialUrl);
      setCustomUrlInput(initialUrl);
      setPreviewError(false);

      const initialQuery = `${item.categoria} ${item.descricao.split(' ').slice(0, 4).join(' ')}`;
      setSearchQuery(initialQuery);
      const results = searchTechnicalImages(initialQuery, item.categoria);
      setSuggestions(results);

      // If item has no image, default to suggestions tab
      setActiveTab(item.imagemUrl ? 'suggestions' : 'suggestions');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchTechnicalImages(searchQuery, item.categoria);
    setSuggestions(results);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo selecionado é muito grande. Tamanho máximo recomendado: 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedUrl(result);
      setCustomUrlInput('');
      setPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setSelectedUrl(customUrlInput.trim());
    setPreviewError(false);
  };

  const handleSelectSuggestion = (suggestion: TechnicalImageSuggestion) => {
    setSelectedUrl(suggestion.url);
    setCustomUrlInput(suggestion.url);
    setPreviewError(false);
  };

  const handleRemoveImage = () => {
    setSelectedUrl('');
    setCustomUrlInput('');
    setPreviewError(false);
  };

  const handleSave = () => {
    if (onSelectUrl) {
      onSelectUrl(selectedUrl || '');
    }
    if (onSaveImage && item) {
      onSaveImage(item.id, selectedUrl ? selectedUrl : undefined);
    }
    onClose();
  };

  const isChanged = selectedUrl !== (item.imagemUrl || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        id="modal-image-manager"
        className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider bg-amber-500 text-slate-950 rounded uppercase">
                {item.categoria}
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {item.codigo}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1 line-clamp-1">
              Incluir / Alterar Imagem do Componente
            </h2>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {item.descricao}
            </p>
          </div>
          <button
            id="btn-close-image-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top: Current / New Preview Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
            {/* Image Preview Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-md p-3 min-h-[190px] relative overflow-hidden">
              {selectedUrl && !previewError ? (
                <div className="w-full h-44 flex items-center justify-center">
                  <img
                    src={selectedUrl}
                    alt="Preview do componente"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    onError={() => setPreviewError(true)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 text-slate-400">
                  <ImageIcon className="w-10 h-10 stroke-[1.5] text-slate-300 mb-2" />
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {previewError ? 'Erro ao carregar imagem' : 'Nenhuma imagem selecionada'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {previewError
                      ? 'O link fornecido não pôde ser exibido'
                      : 'O item exibirá o esquema técnico padrão'}
                  </span>
                </div>
              )}

              {/* Status Pill */}
              <div className="absolute top-2 left-2">
                {selectedUrl ? (
                  isChanged ? (
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-mono font-bold text-[10px] rounded shadow-xs">
                      NOVA SELEÇÃO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-800 text-white font-mono font-bold text-[10px] rounded">
                      FOTO ATUAL
                    </span>
                  )
                ) : (
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-mono font-bold text-[10px] rounded">
                    SEM FOTO
                  </span>
                )}
              </div>

              {/* Remove button if image exists */}
              {selectedUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute bottom-2 right-2 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-mono font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  title="Remover imagem e usar visual técnico padrão"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remover</span>
                </button>
              )}
            </div>

            {/* Explanatory Details */}
            <div className="md:col-span-7 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                  Personalização Visual da Peça
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Você pode escolher uma imagem da biblioteca técnica recomendada para <strong>{item.categoria}</strong>, enviar uma foto tirada pelo celular/computador ou colar um link da web.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.fabricante && (
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600">
                      Fabricante: <strong>{item.fabricante}</strong>
                    </span>
                  )}
                  {item.dimensao && (
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600">
                      Dimensão: <strong>{item.dimensao}</strong>
                    </span>
                  )}
                </div>
              </div>

              {previewError && (
                <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Não foi possível carregar a imagem. Verifique o link ou envie um arquivo diretamente.</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold font-mono border-b-2 transition-colors ${
                activeTab === 'suggestions'
                  ? 'border-[#f59e0b] text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              <span>1. Sugestões da Internet ({suggestions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold font-mono border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-[#f59e0b] text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-4 h-4 text-cyan-600" />
              <span>2. Enviar Arquivo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-bold font-mono border-b-2 transition-colors ${
                activeTab === 'url'
                  ? 'border-[#f59e0b] text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Link2 className="w-4 h-4 text-slate-600" />
              <span>3. Link / URL Direto</span>
            </button>
          </div>

          {/* Tab 1: Suggestions / Web Search */}
          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar componente por nome, tipo ou categoria..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs rounded-md transition-colors"
                >
                  Buscar
                </button>
              </form>

              <div className="text-[11px] text-slate-500 font-mono">
                Selecione uma imagem correspondente para vincular a este item:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                {suggestions.map((suggestion) => {
                  const isSelected = selectedUrl === suggestion.url;
                  return (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={`group relative flex flex-col bg-white border rounded-lg p-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="w-full h-24 bg-slate-50 rounded flex items-center justify-center p-1 overflow-hidden relative">
                        <img
                          src={suggestion.url}
                          alt={suggestion.title}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform mix-blend-multiply"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="mt-1.5 text-[10px] font-medium text-slate-800 line-clamp-2 leading-tight">
                        {suggestion.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/20 rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1 font-mono">
                  Clique aqui para selecionar uma foto
                </h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Suporta arquivos JPG, PNG, WEBP ou SVG. A imagem é convertida e salva localmente para acesso imediato.
                </p>
                <span className="mt-3 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-mono font-semibold">
                  Navegar nos arquivos
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Direct URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                  Cole o endereço (URL) da imagem na internet
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="https://exemplo.com/imagem-do-componente.jpg"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 bg-[#0b1329] hover:bg-slate-800 text-white font-mono font-bold text-xs rounded-md transition-colors"
                  >
                    Visualizar
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Dica: Você pode copiar o endereço de imagem direto do site do fabricante (SKF, Festo, WEG, SMC, Siemens) e colar aqui.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            <button
              id="btn-confirm-save-image"
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-xs font-mono font-black uppercase tracking-wider text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Imagem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
