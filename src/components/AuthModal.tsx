import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin: string;
  onChangePin: (newPin: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPin,
  onChangePin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pinInput.trim() === currentPin.trim()) {
      setPinInput('');
      onSuccess();
      onClose();
    } else {
      setError('PIN incorreto. Tente novamente ou use o PIN padrão (1234).');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pinInput.trim() !== currentPin.trim()) {
      setError('PIN atual incorreto para autorizar a alteração.');
      return;
    }

    if (newPin.length < 4) {
      setError('O novo PIN deve conter no mínimo 4 caracteres ou dígitos.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('A confirmação do novo PIN não confere.');
      return;
    }

    onChangePin(newPin);
    setChangeSuccess(true);
    setTimeout(() => {
      setChangeSuccess(false);
      setIsChangingPin(false);
      setPinInput('');
      setNewPin('');
      setConfirmPin('');
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="modal-gestor-auth"
        className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Área Restrita // Gestor
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {isChangingPin ? 'Alteração de Chave de Acesso' : 'Autenticação de Supervisão'}
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
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 leading-relaxed">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Controle Operacional: </span>
                Os manutentores têm acesso livre para consulta técnica e abertura de data-sheets. Apenas o gestor pode cadastrar, editar e excluir dados.
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {changeSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>PIN alterado com sucesso! Autenticando...</span>
            </div>
          )}

          {!isChangingPin ? (
            /* Formulário de Login */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Digite o PIN do Gestor
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    autoFocus
                    required
                    maxLength={16}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setError('');
                    }}
                    placeholder="PIN (Padrão: 1234)"
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono tracking-widest bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>PIN padrão inicial: <strong className="font-mono text-slate-600">1234</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(true);
                      setError('');
                    }}
                    className="text-cyan-700 hover:text-cyan-900 font-semibold underline underline-offset-2"
                  >
                    Alterar PIN
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black uppercase tracking-wider text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-lg shadow-sm transition-colors"
                >
                  Entrar como Gestor
                </button>
              </div>
            </form>
          ) : (
            /* Formulário para Alterar PIN */
            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  PIN Atual *
                </label>
                <input
                  type="password"
                  required
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN atual (padrão: 1234)"
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Novo PIN *
                </label>
                <input
                  type="password"
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Mínimo 4 dígitos"
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 font-mono">
                  Confirmar Novo PIN *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Repita o novo PIN"
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Voltar ao login
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 bg-[#f59e0b] hover:bg-[#d97706] rounded-lg shadow-sm transition-colors"
                >
                  Salvar Novo PIN
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
