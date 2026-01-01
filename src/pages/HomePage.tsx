import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'tutor') {
        navigate('/tutor');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, profile, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-900 to-emerald-900">
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                EduNarrative
              </span>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full hover:from-sky-600 hover:to-cyan-600 font-bold transition-all transform hover:scale-105"
            >
              Se connecter
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Apprendre avec une
            <span className="block bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Voix Qui Inspire
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            La plateforme d'apprentissage interactive avec narration vocale pour enfants.
            Étudiants et tuteurs, trouvez votre chemin vers le succès ensemble.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/auth?role=student')}
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-cyan-600"></div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-md group-hover:bg-white/30 transition-all">
                <BookOpen className="w-12 h-12 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Je suis Élève</h2>
                <p className="text-sky-100 text-lg leading-relaxed">
                  Accédez à des leçons captivantes avec narration vocale, complétez des exercices interactifs
                  et suivez votre progression.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/auth?role=tutor')}
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600"></div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-md group-hover:bg-white/30 transition-all">
                <Users className="w-12 h-12 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Je suis Tuteur</h2>
                <p className="text-emerald-100 text-lg leading-relaxed">
                  Créez des leçons, gérez vos élèves, suivez leur progression et inspirez
                  la prochaine génération.
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
                <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-400 text-sm">
            Déjà inscrit?{' '}
            <button
              onClick={() => navigate('/auth')}
              className="text-sky-400 hover:text-sky-300 font-bold underline transition-colors"
            >
              Connectez-vous ici
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
