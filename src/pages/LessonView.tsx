import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

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
  const [narrationMode, setNarrationMode] = useState<'title' | 'section' | 'off'>('off');
  const { isPlaying, isPaused, speak, pause, resume, stop } = useSpeechSynthesis({
    rate: 0.9,
    pitch: 1.1,
    volume: 1,
  });

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

  const handleNarrate = (text: string) => {
    stop();
    speak(text);
  };

  const handleToggleNarration = () => {
    if (isPlaying || isPaused) {
      stop();
      setNarrationMode('off');
    } else if (narrationMode === 'off' && lesson) {
      setNarrationMode('title');
      handleNarrate(lesson.title);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
      <nav className="bg-gradient-to-r from-sky-500 to-cyan-500 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-sky-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <button
              onClick={handleToggleNarration}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                isPlaying || isPaused
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white text-sky-600 hover:shadow-lg'
              }`}
            >
              {isPlaying || isPaused ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  Arrêter
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  Narrateur
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-sky-400">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 text-lg">{lesson.description}</p>
            </div>
          </div>

          <div className="space-y-8">
            {lesson.content?.map((section, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border-2 border-sky-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-sky-800">
                    {section.title}
                  </h2>
                  <button
                    onClick={() => handleNarrate(section.text)}
                    className={`flex-shrink-0 ml-4 px-3 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      isPlaying
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                    }`}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {lesson.exercises && lesson.exercises.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-sky-200">
              <button
                onClick={() => navigate(`/quiz/${lesson.id}`)}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 font-bold text-lg transition-all transform hover:scale-105 hover:shadow-lg"
              >
                <Play className="w-6 h-6 mr-3" />
                Commencer le quiz ({lesson.exercises.length} questions)
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
