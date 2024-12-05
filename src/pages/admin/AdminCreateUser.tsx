import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { User, Mail, Lock, Calendar, Phone, MapPin, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface CreateUserFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  bio?: string;
  isAdmin: boolean;
}

export function AdminCreateUser() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateUserFormData>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSubmit = async (data: CreateUserFormData) => {
    if (!user) return;

    try {
      setError('');
      setSuccess(false);

      // Créer le nouvel utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const { uid } = userCredential.user;

      // Créer le profil utilisateur dans Firestore
      const userProfile = {
        uid,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        birthDate: data.birthDate,
        address: data.address || '',
        postalCode: data.postalCode || '',
        city: data.city || '',
        phone: data.phone || '',
        bio: data.bio || '',
        isAdmin: data.isAdmin,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', uid), userProfile);

      // Reconnecter l'administrateur
      if (user.email) {
        await signInWithEmailAndPassword(auth, user.email, data.password);
      }

      setSuccess(true);
      reset();

      // Rediriger vers la liste des utilisateurs après un court délai
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);

    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      setError('Erreur lors de la création de l\'utilisateur');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Création d'utilisateur</h1>

      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center mb-6">
            Utilisateur créé avec succès
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Prénom *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('firstName', { required: 'Prénom requis' })}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Nom *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('lastName', { required: 'Nom requis' })}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Pseudo *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('username', { required: 'Pseudo requis' })}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Email requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide'
                    }
                  })}
                  type="email"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Mot de passe requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-gray-700 text-white pl-10 pr-10 py-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Date de naissance *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('birthDate', { required: 'Date de naissance requise' })}
                  type="date"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('address')}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
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

            <div>
              <label className="block text-gray-300 mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Présentation</label>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer l'utilisateur
          </button>
        </form>
      </div>
    </div>
  );
}