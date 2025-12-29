import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle, XCircle, Volume2, VolumeX, Pause } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface Exercise {
  question: string;
  type: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
}

export default function QuizPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
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
      .select('id, title, exercises')
      .eq('id', lessonId)
      .single();
    setLesson(data);
    setLoading(false);
  };

  const handleNarrate = (text: string) => {
    stop();
    speak(text);
  };

  const handleNarrateQuestion = () => {
    const exercise = lesson?.exercises[currentQuestion];
    if (exercise) {
      const fullText = `${exercise.question}`;
      handleNarrate(fullText);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer,
    });
  };

  const handleNext = () => {
    if (lesson && currentQuestion < lesson.exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!lesson) return;

    let totalScore = 0;
    lesson.exercises.forEach((exercise, index) => {
      const userAnswer = answers[index];
      if (userAnswer?.toLowerCase() === exercise.correct_answer.toLowerCase()) {
        totalScore += exercise.points;
      }
    });

    setScore(totalScore);
    setShowResults(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        lesson_id: lessonId,
        score: totalScore,
        total_points: lesson.exercises.reduce((sum, ex) => sum + ex.points, 0),
        answers: answers,
      });
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz introuvable</h2>
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

  const currentExercise = lesson.exercises[currentQuestion];
  const maxPoints = lesson.exercises.reduce((sum, ex) => sum + ex.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-50">
      <nav className="bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-yellow-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <button
              onClick={handleNarrateQuestion}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                isPlaying || isPaused
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white text-yellow-600 hover:shadow-lg'
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
                  Écouter
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showResults ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-yellow-400">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Résultats du quiz
              </h1>
              <div className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                {score}/{maxPoints}
              </div>
              <p className="text-gray-600 text-lg font-semibold">
                {Math.round((score / maxPoints) * 100)}% de réussite
              </p>
            </div>

            <div className="space-y-6">
              {lesson.exercises.map((exercise, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer?.toLowerCase() === exercise.correct_answer.toLowerCase();

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      isCorrect
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {isCorrect ? (
                        <CheckCircle className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-7 h-7 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-3 text-lg">
                          Question {index + 1}: {exercise.question}
                        </h3>
                        <p className="text-gray-700 mb-2">
                          Votre réponse: <span className="font-semibold">{userAnswer || '(pas de réponse)'}</span>
                        </p>
                        <p className="text-gray-700 mb-3">
                          Bonne réponse: <span className="font-semibold text-emerald-700">{exercise.correct_answer}</span>
                        </p>
                        <p className="text-gray-800 bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg border-l-4 border-blue-500">
                          <span className="font-bold text-blue-700">Explication:</span> {exercise.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-full hover:from-gray-600 hover:to-slate-700 font-bold transition-all transform hover:scale-105"
              >
                Retour à la leçon
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full hover:from-sky-600 hover:to-cyan-600 font-bold transition-all transform hover:scale-105"
              >
                Tableau de bord
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-yellow-400">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Quiz: {lesson.title}
                </h1>
                <span className="text-lg font-bold text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full">
                  Question {currentQuestion + 1} / {lesson.exercises.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / lesson.exercises.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {currentExercise.question}
              </h2>

              {currentExercise.type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentExercise.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 font-semibold transition-all transform hover:scale-105 ${
                        answers[currentQuestion] === option
                          ? 'border-emerald-500 bg-emerald-100 text-gray-900'
                          : 'border-gray-300 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentExercise.type === 'true_false' && (
                <div className="space-y-3">
                  {['true', 'false'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 font-semibold transition-all transform hover:scale-105 ${
                        answers[currentQuestion] === option
                          ? option === 'true'
                            ? 'border-emerald-500 bg-emerald-100 text-gray-900'
                            : 'border-red-500 bg-red-100 text-gray-900'
                          : 'border-gray-300 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-gray-700'
                      }`}
                    >
                      {option === 'true' ? 'Vrai' : 'Faux'}
                    </button>
                  ))}
                </div>
              )}

              {currentExercise.type === 'short_answer' && (
                <input
                  type="text"
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Entrez votre réponse..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 text-lg font-medium transition-all"
                />
              )}
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t-2 border-yellow-200">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gradient-to-r from-gray-400 to-slate-500 text-white rounded-full hover:from-gray-500 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all transform hover:scale-105"
              >
                Précédent
              </button>

              {currentQuestion === lesson.exercises.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== lesson.exercises.length}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all transform hover:scale-105"
                >
                  Soumettre le quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full hover:from-yellow-600 hover:to-orange-600 font-bold text-lg transition-all transform hover:scale-105"
                >
                  Suivant
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
