import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

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
        {showResults ? (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Résultats du quiz</h1>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {score}/{maxPoints}
              </div>
              <p className="text-gray-600 text-lg">
                {Math.round((score / maxPoints) * 100)}% de réussite
              </p>
            </div>

            <div className="space-y-6">
              {lesson.exercises.map((exercise, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer?.toLowerCase() === exercise.correct_answer.toLowerCase();

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Question {index + 1}: {exercise.question}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Votre réponse: <span className="font-medium">{userAnswer || '(pas de réponse)'}</span>
                        </p>
                        <p className="text-gray-600 mb-2">
                          Bonne réponse: <span className="font-medium text-green-600">{exercise.correct_answer}</span>
                        </p>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded">
                          <span className="font-semibold">Explication:</span> {exercise.explanation}
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
                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Retour à la leçon
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Tableau de bord
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Quiz: {lesson.title}</h1>
                <span className="text-gray-600">
                  Question {currentQuestion + 1} / {lesson.exercises.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentQuestion + 1) / lesson.exercises.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentExercise.question}
              </h2>

              {currentExercise.type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentExercise.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        answers[currentQuestion] === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
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
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        answers[currentQuestion] === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
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
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Précédent
              </button>

              {currentQuestion === lesson.exercises.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== lesson.exercises.length}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Soumettre le quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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
