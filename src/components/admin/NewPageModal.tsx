import { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Page } from '../../services/pageService';

interface NewPageModalProps {
  onClose: () => void;
  onSave: (page: Omit<Page, 'lastModified'>) => void;
}

interface FormData {
  title: string;
  path: string;
  content: string;
  location: 'navbar' | 'footer' | 'none';
  isVisible: string; // Changed to string for form handling
}

export function NewPageModal({ onClose, onSave }: NewPageModalProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      location: 'none',
      isVisible: 'false' // Default value as string
    }
  });
  const [error, setError] = useState<string | null>(null);

  const path = watch('path');

  const onSubmit = (data: FormData) => {
    try {
      const formattedPath = data.path.startsWith('/') ? data.path : `/${data.path}`;
      const id = formattedPath.replace(/^\//, '').replace(/\//g, '-');
      
      onSave({
        id,
        title: data.title,
        path: formattedPath,
        content: data.content,
        location: data.location,
        isVisible: data.isVisible === 'true' // Convert string to boolean
      });
    } catch (err) {
      setError('Erreur lors de la création de la page');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Nouvelle page</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Titre de la page *</label>
            <input
              {...register('title', { required: 'Le titre est requis' })}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Mentions légales"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Chemin d'accès *</label>
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">/</span>
              <input
                {...register('path', { 
                  required: 'Le chemin est requis',
                  pattern: {
                    value: /^[a-z0-9-/]+$/,
                    message: 'Le chemin ne doit contenir que des lettres minuscules, chiffres et tirets'
                  }
                })}
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: mentions-legales"
              />
            </div>
            {errors.path && (
              <p className="text-red-500 text-sm mt-1">{errors.path.message}</p>
            )}
            {path && (
              <p className="text-gray-400 text-sm mt-1">
                URL complète: {window.location.origin}{path.startsWith('/') ? path : `/${path}`}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Emplacement du lien</label>
            <select
              {...register('location')}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">Aucun</option>
              <option value="navbar">Barre de navigation</option>
              <option value="footer">Pied de page</option>
            </select>
            <p className="text-gray-400 text-sm mt-1">
              Choisissez où le lien vers cette page apparaîtra
            </p>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Visibilité de la page</label>
            <select
              {...register('isVisible')}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="false">Non (invisible)</option>
              <option value="true">Oui (visible)</option>
            </select>
            <p className="text-gray-400 text-sm mt-1">
              Choisissez si la page sera visible sur le site
            </p>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Contenu initial</label>
            <textarea
              {...register('content')}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Contenu de la page..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer la page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}