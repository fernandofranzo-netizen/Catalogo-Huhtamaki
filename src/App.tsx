/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, Plus, Lock, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';
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
import { ToastContainer, ToastMessage } from './components/Toast';

const STORAGE_KEY = 'cm_catalog_items_v8';
const PIN_STORAGE_KEY = 'cm_gestor_pin_v1';
const ROLE_STORAGE_KEY = 'cm_user_role_v1';

// Function to reliably recover and merge items across all previous and current storage keys
function loadAndMergeCatalog(): CatalogItem[] {
  try {
    // 1. Identify all candidate localStorage keys (v8, v7, v6, v5, v4, v3, v2, v1, etc.)
    const candidateKeys = [
      'cm_catalog_items_v8',
      'cm_catalog_items_v7',
      'cm_catalog_items_v6',
      'cm_catalog_items_v5',
      'cm_catalog_items_v4',
      'cm_catalog_items_v3',
      'cm_catalog_items_v2',
      'cm_catalog_items_v1',
      'cm_catalog_items',
      'catalog_items',
    ];

    // Dynamically check any other key in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.includes('catalog') || k.includes('item')) &&
        !candidateKeys.includes(k) &&
        k !== PIN_STORAGE_KEY &&
        k !== ROLE_STORAGE_KEY
      ) {
        candidateKeys.push(k);
      }
    }

    // Map to hold items extracted from previous user sessions
    const userSavedItemsMap = new Map<string, CatalogItem>();

    // Reverse so newer keys take precedence for edited fields
    for (const key of [...candidateKeys].reverse()) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            for (const it of parsed) {
              if (it && it.codigo && typeof it.codigo === 'string') {
                const codeKey = it.codigo.trim().toUpperCase();
                const existing = userSavedItemsMap.get(codeKey);
                if (!existing) {
                  userSavedItemsMap.set(codeKey, it);
                } else {
                  userSavedItemsMap.set(codeKey, {
                    ...existing,
                    ...it,
                    documentos:
                      it.documentos && it.documentos.length > 0
                        ? it.documentos
                        : existing.documentos,
                    imagemUrl: it.imagemUrl || existing.imagemUrl,
                    favorito: it.favorito ?? existing.favorito,
                  });
                }
              }
            }
          }
        }
      } catch {
        // Continue scanning remaining candidate keys
      }
    }

    // Now merge with INITIAL_CATALOG_ITEMS (which has the complete 1,106 items from the catalog)
    const initialMap = new Map(
      INITIAL_CATALOG_ITEMS.map((i) => [i.codigo.trim().toUpperCase(), i])
    );
    const mergedList: CatalogItem[] = [];
    const processedCodes = new Set<string>();

    // 1. Process all user-saved items first to retain any custom descriptions, images, docs, or locations
    for (const [codeKey, userItem] of userSavedItemsMap.entries()) {
      const defaultItem = initialMap.get(codeKey);
      const updated: CatalogItem = { ...userItem };
      updated.codigo = updated.codigo.trim();

      // Specific fix for user's Kampf brake disc
      if (codeKey === 'MM-REPOS-00213-00') {
        updated.descricao = 'DISCO DE FREIO COMPLETO KAMPF 877041685';
        updated.categoria = 'PEÇAS DE MÁQUINA / REPOSIÇÃO';
        updated.fabricante = 'KAMPF';
        updated.dimensao = 'P/N 877041685';
        updated.imagemUrl = '/assets/images/kampf_brake_disc_1788575763351.jpg';
      }

      // Preserve or set technical documents
      if (!updated.documentos || updated.documentos.length === 0) {
        updated.documentos = defaultItem?.documentos && defaultItem.documentos.length > 0
          ? defaultItem.documentos
          : [];
      }

      // Sync high-quality image if item doesn't have one or has generic fallback
      if (
        (!updated.imagemUrl || updated.imagemUrl.includes('bearing_skf_6204_1788569544706')) &&
        defaultItem?.imagemUrl
      ) {
        updated.imagemUrl = defaultItem.imagemUrl;
      }

      // Auto-heal empty or repeated code descriptions with official catalog description
      if (
        (!updated.descricao ||
          updated.descricao.trim().toUpperCase() === updated.codigo.trim().toUpperCase() ||
          updated.descricao.includes('(SEM DESCRIÇÃO')) &&
        defaultItem?.descricao
      ) {
        updated.descricao = defaultItem.descricao;
        if (defaultItem.categoria && (!updated.categoria || updated.categoria === 'OUTROS / REPOSIÇÃO')) {
          updated.categoria = defaultItem.categoria;
        }
        if (defaultItem.fabricante && !updated.fabricante) updated.fabricante = defaultItem.fabricante;
        if (defaultItem.dimensao && !updated.dimensao) updated.dimensao = defaultItem.dimensao;
      }

      mergedList.push(updated);
      processedCodes.add(codeKey);
    }

    // 2. Add any official catalog items that weren't in user's saved data
    for (const initItem of INITIAL_CATALOG_ITEMS) {
      const codeKey = initItem.codigo.trim().toUpperCase();
      if (!processedCodes.has(codeKey)) {
        mergedList.push(initItem);
        processedCodes.add(codeKey);
      }
    }

    return mergedList.length > 0 ? mergedList : INITIAL_CATALOG_ITEMS;
  } catch (err) {
    console.error('Failed to load and merge catalog:', err);
    return INITIAL_CATALOG_ITEMS;
  }
}

export default function App() {
  const [items, setItems] = useState<CatalogItem[]>(() => loadAndMergeCatalog());

  const [currentView, setCurrentView] = useState<ViewMode>('catalog');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<CatalogItem | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documentModalItem, setDocumentModalItem] = useState<CatalogItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
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

  // Update item image manually
  const handleUpdateItemImage = (itemId: string, imageUrl: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, imagemUrl: imageUrl } : item))
    );
    setSelectedItem((prev) =>
      prev && prev.id === itemId ? { ...prev, imagemUrl: imageUrl } : prev
    );
    showToast(
      imageUrl ? 'Foto técnica do item atualizada com sucesso!' : 'Imagem removida com sucesso.',
      'success'
    );
  };

  // Import items (bulk update via .xlsx, .csv or json)
  const handleImportItems = (newItems: CatalogItem[], mode: 'merge' | 'replace' = 'merge') => {
    if (mode === 'replace') {
      setItems(newItems);
      showToast(`Catálogo substituído com sucesso (${newItems.length} itens gravados)!`, 'success');
    } else {
      setItems((prev) => {
        // Map new items by normalized code
        const newMap = new Map(newItems.map((i) => [i.codigo.trim().toUpperCase(), i]));
        let updatedCount = 0;
        let addedCount = 0;

        // Update existing items that match code
        const updatedExisting = prev.map((item) => {
          const match = newMap.get(item.codigo.trim().toUpperCase());
          if (match) {
            newMap.delete(item.codigo.trim().toUpperCase());
            updatedCount++;

            // Preserve existing quality description if imported item just repeats the code or is placeholder
            let finalDescricao = match.descricao;
            const isMatchDescRepeatedCode =
              !match.descricao ||
              match.descricao.trim().toUpperCase() === item.codigo.trim().toUpperCase() ||
              match.descricao.includes('(SEM DESCRIÇÃO');

            const isExistingDescValid =
              item.descricao &&
              item.descricao.trim().toUpperCase() !== item.codigo.trim().toUpperCase() &&
              !item.descricao.includes('(SEM DESCRIÇÃO');

            if (isMatchDescRepeatedCode && isExistingDescValid) {
              finalDescricao = item.descricao;
            }

            return {
              ...item,
              descricao: finalDescricao || item.descricao,
              categoria: match.categoria !== 'OUTROS / REPOSIÇÃO' ? match.categoria : item.categoria,
              fabricante: match.fabricante || item.fabricante,
              dimensao: match.dimensao || item.dimensao,
              localizacao: match.localizacao || item.localizacao,
              palavrasChave:
                match.palavrasChave && match.palavrasChave.length > 0
                  ? match.palavrasChave
                  : item.palavrasChave,
              observacoes: match.observacoes || item.observacoes,
              status: match.status || item.status,
              imagemUrl: match.imagemUrl || item.imagemUrl,
            };
          }
          return item;
        });

        // Any remaining in map are brand new items
        const freshItems = Array.from(newMap.values());
        addedCount = freshItems.length;

        showToast(
          `Banco de dados atualizado: ${updatedCount} itens modificados e ${addedCount} novos itens adicionados!`,
          'success'
        );

        return [...freshItems, ...updatedExisting];
      });
    }
  };

  // Restore factory defaults / Sync complete official catalog
  const handleRestoreDefaults = () => {
    setItems(INITIAL_CATALOG_ITEMS);
    showToast(`Catálogo restaurado com sucesso (${INITIAL_CATALOG_ITEMS.length} itens oficiais carregados).`, 'info');
  };

  // Sync complete official catalog with current user data (keeps customizations, adds missing)
  const handleRestoreOfficialCatalog = () => {
    const initialMap = new Map(INITIAL_CATALOG_ITEMS.map((i) => [i.codigo.trim().toUpperCase(), i]));
    const mergedList: CatalogItem[] = [];
    const addedCodes = new Set<string>();

    // 1. Keep existing items and enhance if missing details
    for (const item of items) {
      const codeKey = item.codigo.trim().toUpperCase();
      const defaultItem = initialMap.get(codeKey);
      let updated = { ...item };
      if (defaultItem) {
        if (!updated.documentos || updated.documentos.length === 0) {
          updated.documentos = defaultItem.documentos;
        }
        if (!updated.imagemUrl && defaultItem.imagemUrl) {
          updated.imagemUrl = defaultItem.imagemUrl;
        }
        if (
          !updated.descricao ||
          updated.descricao.trim().toUpperCase() === updated.codigo.trim().toUpperCase() ||
          updated.descricao.includes('(SEM DESCRIÇÃO')
        ) {
          updated.descricao = defaultItem.descricao;
        }
      }
      mergedList.push(updated);
      addedCodes.add(codeKey);
    }

    // 2. Add any official items from INITIAL_CATALOG_ITEMS that weren't present
    let newCount = 0;
    for (const initItem of INITIAL_CATALOG_ITEMS) {
      const codeKey = initItem.codigo.trim().toUpperCase();
      if (!addedCodes.has(codeKey)) {
        mergedList.push(initItem);
        addedCodes.add(codeKey);
        newCount++;
      }
    }

    setItems(mergedList);
    showToast(
      `Base oficial sincronizada! ${mergedList.length} itens disponíveis no catálogo (${newCount} novos itens adicionados).`,
      'success',
      'Catálogo Sincronizado'
    );
  };

  // Export items to Excel (.xlsx) spreadsheet
  const handleExportItems = () => {
    try {
      const exportRows = items.map((item) => ({
        CODIGO: item.codigo,
        DESCRICAO: item.descricao,
        CATEGORIA: item.categoria,
        FABRICANTE: item.fabricante || '',
        DIMENSAO: item.dimensao || '',
        LOCALIZACAO: item.localizacao || '',
        PALAVRAS_CHAVE: item.palavrasChave ? item.palavrasChave.join(', ') : '',
        STATUS: item.status,
        OBSERVACOES: item.observacoes || '',
        IMAGEM_URL: item.imagemUrl || '',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      worksheet['!cols'] = [
        { wch: 22 },
        { wch: 45 },
        { wch: 25 },
        { wch: 16 },
        { wch: 18 },
        { wch: 35 },
        { wch: 35 },
        { wch: 14 },
        { wch: 35 },
        { wch: 20 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo Manutenção');
      XLSX.writeFile(
        workbook,
        `catalogo_cm_manutencao_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      showToast('Catálogo exportado para planilha Excel (.xlsx) com sucesso!', 'success');
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
          setCurrentView(view);
          if (view !== 'detail') setSelectedItem(null);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        itemCount={items.length}
        userRole={userRole}
        onPromptGestor={handlePromptGestor}
        onLogoutGestor={handleLogoutGestor}
      />

      {/* Mobile Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between p-3 bg-[#0b1329] border-b border-slate-800 md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-open-sidebar-mobile"
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 text-slate-300 rounded hover:bg-slate-800"
            aria-label="Abrir menu lateral"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 font-black text-xs text-slate-950 bg-[#f59e0b] rounded">
              CM
            </span>
            <span className="font-extrabold text-sm text-white tracking-wider uppercase">
              Catálogo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'gestor' ? (
            <button
              type="button"
              onClick={handleOpenNewModal}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-950 bg-[#f59e0b] rounded shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo</span>
            </button>
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
      <main className="md:pl-56 min-h-screen flex flex-col bg-[#f8fafc]">
        <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-5 lg:p-6">
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
              onUpdateImage={handleUpdateItemImage}
            />
          )}

          {currentView === 'admin' && (
            <AdminView
              items={items}
              categories={CATEGORIAS_PADRAO}
              onOpenNewModal={handleOpenNewModal}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onExport={handleExportItems}
              onRestoreOfficialCatalog={handleRestoreOfficialCatalog}
              onEditItem={handleOpenEditModal}
              onDeleteItem={handleDeleteItem}
              onSelectItem={handleSelectItem}
              onOpenDocuments={handleOpenDocuments}
              userRole={userRole}
              onPromptGestor={handlePromptGestor}
              onOpenChangePin={() => setIsAuthModalOpen(true)}
              onLogoutGestor={handleLogoutGestor}
              onShareLink={handleShareLink}
            />
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

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
