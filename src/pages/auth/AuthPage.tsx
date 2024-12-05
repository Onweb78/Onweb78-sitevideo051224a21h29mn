import { useState } from 'react';
import { SignInForm } from '../../components/auth/SignInForm';
import { SignUpForm } from '../../components/auth/SignUpForm';

export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="mb-8">
            <h2 className="text-center text-3xl font-bold text-white">
              {isSignIn ? 'Connexion' : 'Créer un compte'}
            </h2>
          </div>

          {isSignIn ? <SignInForm /> : <SignUpForm />}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-blue-400 hover:text-blue-500 transition-colors"
            >
              {isSignIn ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}