import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import SubjectLessons from './pages/SubjectLessons';
import LessonView from './pages/LessonView';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />}
          />
          <Route
            path="/tutor"
            element={<ProtectedRoute element={<TutorDashboard />} requiredRole="tutor" />}
          />
          <Route
            path="/subject/:subjectId"
            element={<ProtectedRoute element={<SubjectLessons />} />}
          />
          <Route
            path="/lesson/:lessonId"
            element={<ProtectedRoute element={<LessonView />} />}
          />
          <Route
            path="/quiz/:lessonId"
            element={<ProtectedRoute element={<QuizPage />} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
