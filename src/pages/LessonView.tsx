import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Play } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: Array<{ title: string; text: string }>;
  exercises: Array<{
    question: string;
    type: string;
    options?: string[];
    correct_answer: string;
    explanation: string;
  }>;
}

export default function LessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();
    setLesson(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Leçon introuvable</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
          <p className="text-gray-600 mb-8">{lesson.description}</p>

          <div className="space-y-8">
            {lesson.content?.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => navigate(`/quiz/${lesson.id}`)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Play className="w-5 h-5 mr-2" />
                Commencer le quiz ({lesson.exercises.length} questions)
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
