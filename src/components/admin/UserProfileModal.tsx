import { useForm } from 'react-hook-form';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { updatePassword } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import { X, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface UserProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdate: () => void;
}

interface ExtendedUserProfile extends UserProfile {
  login?: string;
  password?: string;
}

export function UserProfileModal({ user, onClose, onUpdate }: UserProfileModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ExtendedUserProfile>({
    defaultValues: {
      ...user,
      login: user.email
    }
  });

  const onSubmit = async (data: ExtendedUserProfile) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const updateData: Partial<UserProfile> = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        phone: data.phone,
        birthDate: data.birthDate,
        address: data.address,
        postalCode: data.postalCode,
        city: data.city,
        bio: data.bio,
        isAdmin: data.isAdmin,
        updatedAt: new Date()
      };

      // Mise à jour du profil dans Firestore
      await updateDoc(userRef, updateData);

      // Mise à jour du mot de passe si fourni
      if (data.password && auth.currentUser) {
        await updatePassword(auth.currentUser, data.password);
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Modifier le profil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Identifiants */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Identifiants</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Login (Email)</label>
                  <input
                    {...register('login')}
                    type="email"
                    disabled
                    className="w-full bg-gray-700 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pr-10"
                      placeholder="Laisser vide pour ne pas modifier"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Informations personnelles</h3>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Prénom</label>
              <input
                {...register('firstName', { required: 'Prénom requis' })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Nom</label>
              <input
                {...register('lastName', { required: 'Nom requis' })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Pseudo</label>
              <input
                {...register('username', { required: 'Pseudo requis' })}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Téléphone</label>
              <input
                {...register('phone')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Date de naissance</label>
              <input
                {...register('birthDate')}
                type="date"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Adresse</label>
              <input
                {...register('address')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Code postal</label>
              <input
                {...register('postalCode')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Ville</label>
              <input
                {...register('city')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Bio</label>
              <textarea
                {...register('bio')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg h-32"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isAdmin')}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-gray-300">Administrateur</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}