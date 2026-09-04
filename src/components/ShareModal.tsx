import React, { useState } from 'react';
import { X, Share2, Copy, Check, Smartphone, Globe, Shield, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    onCopySuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="modal-share-catalog"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Hospedagem & Acesso dos Manutentores
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Disponibilização gratuita para a equipe técnica
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-600">
          {/* Link box */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
              Link de Acesso Direto para os Manutentores
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg text-slate-800 select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase rounded-lg shadow-sm transition-colors ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#f59e0b] hover:bg-[#d97706] text-slate-950'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Cards explicativos */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-3 p-3 bg-cyan-50 border border-cyan-200/80 rounded-lg text-cyan-950">
              <Shield className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-xs text-cyan-900">1. Segurança e Somente Leitura</strong>
                Quem acessar por esse link entra automaticamente no <strong>Modo Manutentor</strong>. Eles podem buscar peças, copiar códigos e abrir todos os data-sheets anexados, mas <strong>não conseguem cadastrar, editar ou apagar nada</strong> sem o seu PIN de Gestor.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950">
              <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-xs text-amber-900">2. Atalho no Celular (Como Aplicativo)</strong>
                No celular do manutentor (Chrome no Android ou Safari no iPhone), basta clicar no menu do navegador e selecionar <strong>&quot;Adicionar à tela inicial&quot;</strong>. O catálogo vira um ícone direto no celular, rápido e sem instalar nada pela loja.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
              <Globe className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-xs text-slate-900">3. Hospedagem Gratuita</strong>
                Este link já está ativo e hospedado em nuvem Google Cloud Run via Google AI Studio. Você também pode exportar o projeto (Menu de Configurações &gt; Exportar ZIP ou GitHub) e publicar no <strong>Vercel</strong> ou <strong>Netlify</strong> com 1 clique de forma 100% gratuita.
              </div>
            </div>
          </div>
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
