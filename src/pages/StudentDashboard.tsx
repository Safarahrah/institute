import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calculator, Globe, Palette, Languages, Beaker, LogOut } from 'lucide-react';

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
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}
