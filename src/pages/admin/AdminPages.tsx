import { useState, useEffect } from 'react';
import { FileText, Pencil, Settings, Plus } from 'lucide-react';
import { pageService, Page } from '../../services/pageService';
import { PageEditorModal } from '../../components/admin/PageEditorModal';
import { PageMetadataModal } from '../../components/admin/PageMetadataModal';
import { NewPageModal } from '../../components/admin/NewPageModal';
import { formatDate } from '../../utils/format';

export function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedPageMetadata, setSelectedPageMetadata] = useState<Page | null>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const fetchedPages = await pageService.getAllPages();
        setPages(fetchedPages);
      } catch (err) {
        console.error('Error getting pages:', err);
        setError('Erreur lors de la récupération des pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const handleSaveContent = async (pageId: string, content: string) => {
    try {
      await pageService.updatePageContent(pageId, content);
      setPages(prevPages => prevPages.map(page => 
        page.id === pageId 
          ? { ...page, content, lastModified: new Date() }
          : page
      ));
      setSelectedPage(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour du contenu');
    }
  };

  const handleSaveMetadata = async (pageId: string, title: string, path: string, location: string, isVisible: boolean) => {
    try {
      await pageService.updatePage(pageId, { 
        title, 
        path, 
        location: location as 'navbar' | 'footer' | 'none',
        isVisible 
      });
      
      setPages(prevPages => prevPages.map(page => 
        page.id === pageId 
          ? { 
              ...page, 
              title, 
              path, 
              location: location as 'navbar' | 'footer' | 'none',
              isVisible,
              lastModified: new Date() 
            }
          : page
      ));

      setSelectedPageMetadata(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour des métadonnées');
    }
  };

  const handleCreatePage = async (page: Omit<Page, 'lastModified'>) => {
    try {
      await pageService.createPage(page);
      const newPage = { ...page, lastModified: new Date() };
      setPages(prevPages => [...prevPages, newPage]);
      setShowNewPageModal(false);
    } catch (err) {
      setError('Erreur lors de la création de la page');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gestion des pages</h1>
        <button
          onClick={() => setShowNewPageModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle page
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Chemin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Emplacement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Visibilité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Dernière modification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm text-white">{page.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{page.path}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {page.location === 'navbar' && 'Barre de navigation'}
                      {page.location === 'footer' && 'Pied de page'}
                      {(!page.location || page.location === 'none') && 'Aucun'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${page.isVisible ? 'text-green-400' : 'text-red-400'}`}>
                      {page.isVisible ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {formatDate(page.lastModified instanceof Date ? page.lastModified.toISOString() : page.lastModified)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setSelectedPage(page)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Modifier le contenu"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedPageMetadata(page)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Modifier les paramètres"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPage && (
        <PageEditorModal
          title={selectedPage.title}
          content={selectedPage.content}
          onClose={() => setSelectedPage(null)}
          onSave={(content) => handleSaveContent(selectedPage.id, content)}
        />
      )}

      {selectedPageMetadata && (
        <PageMetadataModal
          page={selectedPageMetadata}
          onClose={() => setSelectedPageMetadata(null)}
          onSave={handleSaveMetadata}
        />
      )}

      {showNewPageModal && (
        <NewPageModal
          onClose={() => setShowNewPageModal(false)}
          onSave={handleCreatePage}
        />
      )}
    </div>
  );
}