/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Plus, Lock, LogOut, Database } from 'lucide-react';
import { CatalogItem, ViewMode, TechnicalDocument, UserRole } from './types';
import { INITIAL_CATALOG_ITEMS, CATEGORIAS_PADRAO } from './data/initialCatalog';
import { Sidebar } from './components/Sidebar';
import { CatalogSearch } from './components/CatalogSearch';
import { ItemDetail } from './components/ItemDetail';
import { AdminView } from './components/AdminView';
import { ItemModal } from './components/ItemModal';
import { ImportModal } from './components/ImportModal';
import { DocumentModal } from './components/DocumentModal';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { ImageManagerModal } from './components/ImageManagerModal';
import { SupabaseTestModal } from './components/SupabaseTestModal';
import { DataImporter } from './components/DataImporter';
import { ToastContainer, ToastMessage } from './components/Toast';

const STORAGE_KEY = 'cm_catalog_items_v8';
const PREV_STORAGE_KEYS = ['cm_catalog_items_v7', 'cm_catalog_items_v6'];
const PIN_STORAGE_KEY = 'cm_gestor_pin_v1';
const ROLE_STORAGE_KEY = 'cm_user_role_v1';

export default function App() {
  const [items, setItems] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_CATALOG_ITEMS.length) {
          return parsed;
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          const parsedCodeMap = new Map(parsed.map((item: CatalogItem) => [item.codigo, item]));
          const merged = [...parsed];
          for (const initItem of INITIAL_CATALOG_ITEMS) {
            if (!parsedCodeMap.has(initItem.codigo)) {
              merged.push(initItem);
            }
          }
          if (merged.length >= INITIAL_CATALOG_ITEMS.length) {
            return merged;
          }
        }
      }

      // Check previous storage versions to migrate favorites and custom documents
      for (const prevKey of PREV_STORAGE_KEYS) {
        const prevSaved = localStorage.getItem(prevKey);
        if (prevSaved) {
          const prevParsed = JSON.parse(prevSaved);
          if (Array.isArray(prevParsed) && prevParsed.length > 0) {
            const userCustomMap = new Map();
            for (const item of prevParsed) {
              if (item.favorito || (item.documentos && item.documentos.length > 0)) {
                userCustomMap.set(item.codigo, item);
              }
            }
            if (userCustomMap.size > 0) {
              return INITIAL_CATALOG_ITEMS.map((item) => {
                const userEdit = userCustomMap.get(item.codigo);
                if (userEdit) {
                  return {
                    ...item,
                    favorito: userEdit.favorito ?? item.favorito,
                    documentos: userEdit.documentos?.length ? userEdit.documentos : item.documentos,
                  };
                }
                return item;
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved items from localStorage', e);
    }
    return INITIAL_CATALOG_ITEMS;
  });

  const [currentView, setCurrentView] = useState<ViewMode>('catalog');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<CatalogItem | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentModalItem, setDocumentModalItem] = useState<CatalogItem | null>(null);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [imageManagerItem, setImageManagerItem] = useState<CatalogItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isDataImporterOpen, setIsDataImporterOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // User role management (Default to manutentor for visitors, gestor requires PIN)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      return savedRole === 'gestor' ? 'gestor' : 'manutentor';
    } catch {
      return 'manutentor';
    }
  });

  // Gestor PIN (default: 1234)
  const [gestorPin, setGestorPin] = useState<string>(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || '1234';
    } catch {
      return '1234';
    }
  });

  // Persist items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [items]);

  // Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Copy success notification
  const handleCopySuccess = useCallback((code: string) => {
    showToast(`Código ${code} copiado para a área de transferência!`, 'success', 'Copiado');
  }, [showToast]);

  // Toggle favorite
  const handleToggleFavorite = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = !item.favorito;
          if (updated) {
            showToast(`Item ${item.codigo} adicionado aos favoritos.`, 'info');
          }
          return { ...item, favorito: updated };
        }
        return item;
      })
    );
    // Also update selectedItem if currently viewing it
    setSelectedItem((prev) => (prev && prev.id === id ? { ...prev, favorito: !prev.favorito } : prev));
  }, [showToast]);

  // Open modal to create new item (Gestor only)
  const handleOpenNewModal = () => {
    if (userRole !== 'gestor') {
      setIsAuthModalOpen(true);
      return;
    }
    setItemToEdit(null);
    setIsItemModalOpen(true);
  };

  // Open modal to edit existing item (Gestor only)
  const handleOpenEditModal = (item: CatalogItem) => {
    if (userRole !== 'gestor') {
      setIsAuthModalOpen(true);
      return;
    }
    setItemToEdit(item);
    setIsItemModalOpen(true);
  };

  // Open modal for technical documents / data-sheet
  const handleOpenDocuments = (item: CatalogItem) => {
    setDocumentModalItem(item);
    setIsDocumentModalOpen(true);
  };

  // RBAC handlers
  const handlePromptGestor = () => {
    setIsAuthModalOpen(true);
  };

  const handleSuccessGestor = () => {
    setUserRole('gestor');
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, 'gestor');
    } catch (e) {
      console.warn(e);
    }
    showToast('Acesso de Gestor liberado! Agora você pode cadastrar, editar e gerenciar data-sheets.', 'success', 'Modo Gestor Ativo');
  };

  const handleLogoutGestor = () => {
    setUserRole('manutentor');
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, 'manutentor');
    } catch (e) {
      console.warn(e);
    }
    if (currentView === 'admin') {
      setCurrentView('catalog');
    }
    showToast('Sessão de Gestor encerrada. O catálogo agora está no Modo Manutentor (somente leitura).', 'info', 'Modo Consulta Ativo');
  };

  const handleChangePin = (newPin: string) => {
    setGestorPin(newPin);
    try {
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
    } catch (e) {
      console.warn(e);
    }
    showToast('Novo PIN de 4 dígitos configurado com sucesso!', 'success', 'PIN Atualizado');
  };

  const handleShareLink = () => {
    setIsShareModalOpen(true);
  };

  // Save documents for an item
  const handleSaveDocuments = (itemId: string, documents: TechnicalDocument[]) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, documentos: documents };
        }
        return item;
      })
    );

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, documentos: documents } : null));
    }

    if (documentModalItem && documentModalItem.id === itemId) {
      setDocumentModalItem((prev) => (prev ? { ...prev, documentos: documents } : null));
    }

    showToast('Documentação técnica atualizada com sucesso!', 'success');
  };

  // Save item (add or update)
  const handleSaveItem = (savedItem: CatalogItem) => {
    setItems((prev) => {
      const existsIndex = prev.findIndex((i) => i.id === savedItem.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedItem;
        return updated;
      }
      return [savedItem, ...prev];
    });

    if (selectedItem && selectedItem.id === savedItem.id) {
      setSelectedItem(savedItem);
    }

    showToast(`Item ${savedItem.codigo} salvo no catálogo com sucesso!`, 'success');
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
      setCurrentView('catalog');
    }
    showToast(`Item ${itemToDelete?.codigo || ''} removido do catálogo.`, 'info');
  };

  // Select item for detail view
  const handleSelectItem = (item: CatalogItem) => {
    setSelectedItem(item);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Image Manager (search web suggestions, upload, or paste URL - Gestor only)
  const handleOpenImageManager = (item: CatalogItem) => {
    if (userRole !== 'gestor') {
      setIsAuthModalOpen(true);
      return;
    }
    setImageManagerItem(item);
    setIsImageManagerOpen(true);
  };

  // Save/Replace Image for an item (Gestor only)
  const handleSaveItemImage = (itemId: string, newImageUrl?: string) => {
    if (userRole !== 'gestor') {
      showToast('Apenas o gestor pode alterar ou gerenciar imagens de componentes.', 'error');
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, imagemUrl: newImageUrl };
        }
        return item;
      })
    );

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, imagemUrl: newImageUrl } : null));
    }

    showToast('Imagem do componente atualizada com sucesso!', 'success');
  };

  // Import items (Gestor only)
  const handleImportItems = (newItems: CatalogItem[]) => {
    if (userRole !== 'gestor') {
      showToast('Apenas o gestor pode importar novos itens.', 'error');
      return;
    }
    setItems((prev) => {
      // Merge by code to avoid duplicate codes, or append
      const existingCodes = new Set(prev.map((i) => i.codigo));
      const freshItems = newItems.filter((i) => !existingCodes.has(i.codigo));
      return [...freshItems, ...prev];
    });
    showToast(`${newItems.length} itens importados com sucesso!`, 'success');
  };

  // Callback when DataImporter successfully imports/upserts items to Supabase
  const handleDataImporterSuccess = (importedItems: CatalogItem[]) => {
    setItems((prev) => {
      const map = new Map(prev.map((i) => [i.codigo, i]));
      importedItems.forEach((i) => {
        map.set(i.codigo, i);
      });
      return Array.from(map.values());
    });
    showToast(
      `${importedItems.length} itens sincronizados com sucesso no Supabase e atualizados no catálogo!`,
      'success',
      'Sincronização Concluída'
    );
  };

  // Restore factory defaults (Gestor only)
  const handleRestoreDefaults = () => {
    if (userRole !== 'gestor') {
      showToast('Apenas o gestor pode restaurar o catálogo de fábrica.', 'error');
      return;
    }
    setItems(INITIAL_CATALOG_ITEMS);
    showToast('Catálogo padrão de fábrica restaurado com sucesso.', 'info');
  };

  // Export items to JSON file
  const handleExportItems = () => {
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(items, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `catalogo-cm-pecas-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exportação concluída com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao exportar catálogo.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'admin' && userRole !== 'gestor') {
            setIsAuthModalOpen(true);
            return;
          }
          setCurrentView(view);
          if (view !== 'detail') setSelectedItem(null);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        itemCount={items.length}
        userRole={userRole}
        onPromptGestor={handlePromptGestor}
        onLogoutGestor={handleLogoutGestor}
        onOpenSupabaseTest={() => setIsSupabaseModalOpen(true)}
        onOpenDataImporter={() => setIsDataImporterOpen(true)}
      />

      {/* Mobile Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between p-2.5 bg-[#080e1f] border-b border-slate-800 md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-open-sidebar-mobile"
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 text-slate-300 rounded hover:bg-slate-850"
            aria-label="Abrir menu lateral"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 font-black text-xs text-white bg-gradient-to-br from-[#3F78CC] to-[#1A3282] rounded shadow-xs">
              CM
            </span>
            <span className="font-extrabold text-sm text-white tracking-wider uppercase">
              Catálogo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSupabaseModalOpen(true)}
            className="p-1.5 text-[#3F78CC] hover:text-white rounded hover:bg-slate-850"
            title="Diagnóstico de Conexão Supabase"
          >
            <Database className="w-4 h-4" />
          </button>

          {userRole === 'gestor' ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleOpenNewModal}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-950 bg-[#f59e0b] rounded shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo</span>
              </button>
              <button
                type="button"
                onClick={handleLogoutGestor}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-800/60 rounded shadow-xs"
                title="Sair do modo gestor"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePromptGestor}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 rounded shadow-xs"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Gestor</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="md:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {currentView === 'catalog' && (
            <CatalogSearch
              items={items}
              categories={CATEGORIAS_PADRAO}
              onSelectItem={handleSelectItem}
              onOpenNewModal={handleOpenNewModal}
              onToggleFavorite={handleToggleFavorite}
              onCopySuccess={handleCopySuccess}
              onOpenDocuments={handleOpenDocuments}
              userRole={userRole}
              onPromptGestor={handlePromptGestor}
              onLogoutGestor={handleLogoutGestor}
              onOpenImageManager={userRole === 'gestor' ? handleOpenImageManager : undefined}
            />
          )}

          {currentView === 'detail' && selectedItem && (
            <ItemDetail
              item={selectedItem}
              onBack={() => setCurrentView('catalog')}
              onEdit={handleOpenEditModal}
              onToggleFavorite={handleToggleFavorite}
              onCopySuccess={handleCopySuccess}
              onOpenDocuments={handleOpenDocuments}
              userRole={userRole}
              onPromptGestor={handlePromptGestor}
              onOpenImageManager={userRole === 'gestor' ? handleOpenImageManager : undefined}
            />
          )}

          {currentView === 'admin' && (
            userRole === 'gestor' ? (
              <AdminView
                items={items}
                categories={CATEGORIAS_PADRAO}
                onOpenNewModal={handleOpenNewModal}
                onOpenImportModal={() => setIsImportModalOpen(true)}
                onExport={handleExportItems}
                onEditItem={handleOpenEditModal}
                onDeleteItem={handleDeleteItem}
                onSelectItem={handleSelectItem}
                onOpenDocuments={handleOpenDocuments}
                userRole={userRole}
                onPromptGestor={handlePromptGestor}
                onOpenChangePin={() => setIsAuthModalOpen(true)}
                onLogoutGestor={handleLogoutGestor}
                onShareLink={handleShareLink}
                onBackToCatalog={() => setCurrentView('catalog')}
                onOpenImageManager={handleOpenImageManager}
                onOpenSupabaseTest={() => setIsSupabaseModalOpen(true)}
                onOpenDataImporter={() => setIsDataImporterOpen(true)}
              />
            ) : (
              <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Acesso Restrito ao Gestor</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No ambiente de consulta o usuário não pode realizar alterações ou gerenciar fotos. Apenas no ambiente do gestor (com PIN) é permitido cadastrar, editar, importar ou alterar imagens.
                </p>
                <div className="flex justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setCurrentView('catalog')}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Voltar à Consulta
                  </button>
                  <button
                    type="button"
                    onClick={handlePromptGestor}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors"
                  >
                    Entrar como Gestor (PIN)
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer info bar */}
        <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-400 font-mono">
          CM Catálogo Industrial // Sistema de Busca Operacional de Componentes e Peças
        </footer>
      </main>

      {/* Add / Edit Item Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
        categories={CATEGORIAS_PADRAO}
      />

      {/* Technical Documents / Data-sheet Modal */}
      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        item={documentModalItem}
        onSaveDocuments={handleSaveDocuments}
        userRole={userRole}
        onPromptGestor={handlePromptGestor}
      />

      {/* Import JSON Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportItems}
        onRestoreDefaults={handleRestoreDefaults}
      />

      {/* Gestor PIN Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleSuccessGestor}
        currentPin={gestorPin}
        onChangePin={handleChangePin}
      />

      {/* Share / Hosting Access Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onCopySuccess={() =>
          showToast(
            'Link do catálogo copiado com sucesso! Envie para os técnicos de manutenção.',
            'success',
            'Link Copiado'
          )
        }
      />

      {/* Image Manager Modal (Web suggestions, upload, URL) */}
      {isImageManagerOpen && imageManagerItem && (
        <ImageManagerModal
          isOpen={isImageManagerOpen}
          onClose={() => {
            setIsImageManagerOpen(false);
            setImageManagerItem(null);
          }}
          item={imageManagerItem}
          onSaveImage={handleSaveItemImage}
        />
      )}

      {/* Supabase Realtime & Table Diagnostic Modal */}
      <SupabaseTestModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Supabase Data Importer (XLSX / CSV / PDF -> JSON -> Supabase Upsert) */}
      <DataImporter
        isOpen={isDataImporterOpen}
        onClose={() => setIsDataImporterOpen(false)}
        onImportSuccess={handleDataImporterSuccess}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
