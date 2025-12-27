import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import SubjectLessons from './pages/SubjectLessons';
import LessonView from './pages/LessonView';
import { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={user ? <StudentDashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/tutor"
          element={user ? <TutorDashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/subject/:subjectId"
          element={user ? <SubjectLessons /> : <Navigate to="/auth" />}
        />
        <Route
          path="/lesson/:lessonId"
          element={user ? <LessonView /> : <Navigate to="/auth" />}
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
      </Routes>
    </Router>
  );
}

export default App;
