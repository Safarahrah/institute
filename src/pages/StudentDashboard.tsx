import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, Globe, Palette, Languages, Beaker, LogOut, TrendingUp } from 'lucide-react';

interface QuizResult {
  id: string;
  lesson_id: string;
  score: number;
  created_at: string;
}

const subjects = [
  { id: 'math', name: 'Mathématiques', icon: Calculator, color: 'bg-blue-500' },
  { id: 'french', name: 'Français', icon: BookOpen, color: 'bg-green-500' },
  { id: 'science', name: 'Sciences', icon: Beaker, color: 'bg-red-500' },
  { id: 'history', name: 'Histoire-Géo', icon: Globe, color: 'bg-yellow-500' },
  { id: 'english', name: 'Anglais', icon: Languages, color: 'bg-pink-500' },
  { id: 'arts', name: 'Arts', icon: Palette, color: 'bg-orange-500' },
];

export default function StudentDashboard() {
  const [user, setUser] = useState<{ full_name: string } | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    loadResults();
  }, []);

  const loadUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase
        .from('users_profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .single();
      setUser(data);
    }
  };

  const loadResults = async () => {
    setLoadingResults(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(5);
        setResults(data || []);
      }
    } finally {
      setLoadingResults(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">VifTutor</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bonjour, {user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Matières</h1>
          <p className="text-gray-600 mt-2">Choisissez une matière pour commencer à apprendre</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <button
                key={subject.id}
                onClick={() => navigate(`/subject/${subject.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-left"
              >
                <div className={`${subject.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
                <p className="text-gray-600 mt-2">Découvrez les leçons disponibles</p>
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Mes Résultats</h2>
          </div>
          <p className="text-gray-600">Vos 5 derniers scores aux quiz</p>
        </div>

        {loadingResults ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
            <p className="text-gray-600">Complétez un quiz pour voir vos résultats</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Leçon {result.lesson_id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${result.score}%` }}
                          />
                        </div>
                        <span className="ml-3 text-sm font-semibold text-gray-900">{result.score.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
