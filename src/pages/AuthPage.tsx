import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp, signIn, profile } = useAuth();

  useEffect(() => {
    if (profile) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-900 to-emerald-900 flex flex-col p-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white/70 hover:text-white transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">EduNarrative</h1>
              <p className="text-gray-300 mt-2">
                {isLogin ? 'Bienvenue de retour!' : 'Rejoins-nous dès maintenant'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 focus:outline-none transition-all"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 focus:outline-none transition-all"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/50 focus:outline-none transition-all"
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                />
              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold rounded-lg hover:from-sky-600 hover:to-emerald-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-gray-300 hover:text-sky-400 text-sm font-medium transition-colors"
              >
                {isLogin ? "Pas de compte? S'inscrire" : 'Déjà un compte? Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
