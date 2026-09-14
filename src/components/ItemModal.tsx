import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Camera } from 'lucide-react';
import { CatalogItem } from '../types';
import { ImageManagerModal } from './ImageManagerModal';
import { CONSUMO_GERAL_CATEGORIAS, CONSUMO_MANUTENCAO_CATEGORIAS } from '../data/initialCatalog';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CatalogItem) => void;
  itemToEdit: CatalogItem | null;
  categories: readonly string[];
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  categories,
}) => {
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState(categories[1] || 'MATERIAL MECÂNICO');
  const [descricao, setDescricao] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [dimensao, setDimensao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [palavrasChaveStr, setPalavrasChaveStr] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [status, setStatus] = useState<'disponivel' | 'baixo_estoque' | 'em_revisao'>('disponivel');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const availableCategories = categories.filter((c) => c !== 'TODOS');

  useEffect(() => {
    if (itemToEdit) {
      setCodigo(itemToEdit.codigo);
      setCategoria(itemToEdit.categoria);
      setDescricao(itemToEdit.descricao);
      setFabricante(itemToEdit.fabricante || '');
      setDimensao(itemToEdit.dimensao || '');
      setLocalizacao(itemToEdit.localizacao || '');
      setPalavrasChaveStr(itemToEdit.palavrasChave ? itemToEdit.palavrasChave.join(', ') : '');
      setImagemUrl(itemToEdit.imagemUrl || '');
      setObservacoes(itemToEdit.observacoes || '');
      setStatus(itemToEdit.status || 'disponivel');
    } else {
      // Reset form
      setCodigo('');
      setCategoria(availableCategories[0] || 'ROLAMENTOS');
      setDescricao('');
      setFabricante('');
      setDimensao('');
      setLocalizacao('');
      setPalavrasChaveStr('');
      setImagemUrl('');
      setObservacoes('');
      setStatus('disponivel');
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim() || !descricao.trim()) {
      alert('Por favor, preencha o código e a descrição do item.');
      return;
    }

    const keywords = palavrasChaveStr
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const savedItem: CatalogItem = {
      id: itemToEdit ? itemToEdit.id : `item-${Date.now()}`,
      codigo: codigo.trim().toUpperCase(),
      categoria,
      descricao: descricao.trim(),
      fabricante: fabricante.trim() || undefined,
      dimensao: dimensao.trim() || undefined,
      localizacao: localizacao.trim() || undefined,
      palavrasChave: keywords,
      imagemUrl: imagemUrl.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      favorito: itemToEdit ? itemToEdit.favorito : false,
      status,
      documentos: itemToEdit?.documentos || [],
      dataCriacao: itemToEdit?.dataCriacao || new Date().toISOString().split('T')[0],
    };

    onSave(savedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="modal-item-form"
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
              NOVO REGISTRO
            </div>
            <h2 className="text-base font-black text-slate-900 uppercase">
              {itemToEdit ? 'EDITAR ITEM' : 'ADICIONAR ITEM'}
            </h2>
          </div>
          <button
            id="btn-close-item-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Código */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[11px]">
                Código do Item *
              </label>
              <input
                id="input-item-codigo"
                type="text"
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: MM-REPOS-00127-00"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden uppercase"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[11px]">
                Categoria *
              </label>
              <select
                id="select-item-categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-[#3F78CC] focus:outline-hidden"
              >
                <optgroup label="Consumo Geral">
                  {CONSUMO_GERAL_CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Consumo Manutenção">
                  {CONSUMO_MANUTENCAO_CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
                {availableCategories
                  .filter(
                    (c) =>
                      !CONSUMO_GERAL_CATEGORIAS.includes(c as any) &&
                      !CONSUMO_MANUTENCAO_CATEGORIAS.includes(c as any)
                  )
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Descrição Técnica */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[11px]">
              Descrição Técnica *
            </label>
            <textarea
              id="textarea-item-descricao"
              required
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição técnica detalhada como aparece na documentação ou etiqueta..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Fabricante, Dimensão, Localização (3 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1 font-mono text-[10px]">
                Fabricante
              </label>
              <input
                id="input-item-fabricante"
                type="text"
                value={fabricante}
                onChange={(e) => setFabricante(e.target.value)}
                placeholder="Ex: SKF, Festo"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1 font-mono text-[10px]">
                Dimensão
              </label>
              <input
                id="input-item-dimensao"
                type="text"
                value={dimensao}
                onChange={(e) => setDimensao(e.target.value)}
                placeholder="Ex: 20 x 47 x 14mm"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1 font-mono text-[10px]">
                Localização
              </label>
              <input
                id="input-item-localizacao"
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Prateleira B-04"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Palavras-chave */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[11px]">
              Palavras-chave (separadas por vírgula)
            </label>
            <input
              id="input-item-palavras-chave"
              type="text"
              value={palavrasChaveStr}
              onChange={(e) => setPalavrasChaveStr(e.target.value)}
              placeholder="ex: rolamento, esferas, repos, 6204"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* URL da Imagem */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                Imagem do Componente (opcional)
              </label>
              <button
                type="button"
                onClick={() => setShowImagePicker(true)}
                className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-300 transition-colors"
                title="Buscar imagens na web, sugestões ou fazer upload"
              >
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span>Buscar / Alterar Imagem</span>
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                id="input-item-imagem-url"
                type="url"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="https://... ou clique em 'Buscar / Alterar Imagem'"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
              />
              {imagemUrl && (
                <div className="w-10 h-10 rounded border border-slate-200 bg-white p-0.5 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                  <img
                    src={imagemUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono text-[11px]">
              Observações Adicionais
            </label>
            <textarea
              id="textarea-item-observacoes"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações técnicas complementares..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              id="btn-cancel-item-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800 uppercase tracking-wider rounded-md text-xs hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-submit-item-modal"
              type="submit"
              className="px-5 py-2 font-extrabold text-slate-950 uppercase tracking-wider bg-[#f59e0b] hover:bg-[#d97706] rounded-md shadow-xs text-xs transition-colors"
            >
              {itemToEdit ? 'Salvar Alterações' : 'Adicionar ao catálogo'}
            </button>
          </div>
        </form>
      </div>

      {showImagePicker && (
        <ImageManagerModal
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          item={{
            id: itemToEdit ? itemToEdit.id : 'item-preview',
            codigo: codigo.trim() || 'NOVO-ITEM',
            descricao: descricao.trim() || 'Novo Item',
            categoria: categoria || 'MATERIAL MECÂNICO',
            fabricante: fabricante || undefined,
            imagemUrl: imagemUrl || undefined,
            palavrasChave: palavrasChaveStr.split(',').map((s) => s.trim()).filter(Boolean),
          }}
          onSelectUrl={(url) => {
            setImagemUrl(url);
            setShowImagePicker(false);
          }}
        />
      )}
    </div>
  );
};
