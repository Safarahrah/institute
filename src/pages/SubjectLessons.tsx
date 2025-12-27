import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Clock, ArrowLeft, CheckCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  is_completed?: boolean;
}

export default function SubjectLessons() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, [subjectId]);

  const loadLessons = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && subjectId) {
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('subject', subjectId)
        .eq('is_published', true);

      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id);

      const progressMap = new Map(
        progressData?.map((p) => [p.lesson_id, p.completed]) || []
      );

      const lessonsWithProgress = lessonsData?.map((lesson) => ({
        ...lesson,
        is_completed: progressMap.get(lesson.id) || false,
      })) || [];

      setLessons(lessonsWithProgress);
    }
    setLoading(false);
  };

  const subjectNames: Record<string, string> = {
    math: 'Mathématiques',
    french: 'Français',
    science: 'Sciences',
    history: 'Histoire-Géo',
    english: 'Anglais',
    arts: 'Arts',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {subjectNames[subjectId || ''] || 'Leçons'}
          </h1>
          <p className="text-gray-600 mt-2">Sélectionnez une leçon pour commencer</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune leçon disponible</h3>
            <p className="text-gray-600">Revenez plus tard pour découvrir de nouvelles leçons</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-left relative"
              >
                {lesson.is_completed && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-8">
                  {lesson.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {lesson.level}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.duration} min
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
