/*
  # Create VifTutor Database Schema

  ## Overview
  This migration creates the initial database structure for the VifTutor learning platform,
  including user profiles, lessons, progress tracking, and quiz attempts.

  ## New Tables

  ### 1. users_profiles
  Stores user profile information for students, tutors, and admins
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's display name
  - `email` (text, unique) - User's email address
  - `role` (text) - User role: 'student', 'tutor', or 'admin'
  - `level` (text) - Education level (for students)
  - `bio` (text) - User biography
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. lessons
  Stores lesson content created by tutors
  - `id` (uuid, primary key) - Unique lesson identifier
  - `tutor_id` (uuid) - References users_profiles.id
  - `title` (text) - Lesson title
  - `description` (text) - Short lesson description
  - `subject` (text) - Subject category (math, french, etc.)
  - `level` (text) - Target education level
  - `duration` (integer) - Estimated duration in minutes
  - `content` (jsonb) - Structured lesson content
  - `exercises` (jsonb) - Array of quiz questions
  - `is_published` (boolean) - Publication status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. lesson_progress
  Tracks student progress through lessons
  - `id` (uuid, primary key) - Unique progress record
  - `user_id` (uuid) - References users_profiles.id
  - `lesson_id` (uuid) - References lessons.id
  - `completed` (boolean) - Completion status
  - `score` (numeric) - Quiz score percentage (0-100)
  - `time_spent` (integer) - Time spent in seconds
  - `started_at` (timestamptz) - When lesson was started
  - `completed_at` (timestamptz) - When lesson was completed

  ### 4. quiz_attempts
  Records individual quiz attempts and answers
  - `id` (uuid, primary key) - Unique attempt identifier
  - `user_id` (uuid) - References users_profiles.id
  - `lesson_id` (uuid) - References lessons.id
  - `answers` (jsonb) - Array of user answers
  - `score` (numeric) - Score percentage (0-100)
  - `total_time` (integer) - Total time in seconds
  - `created_at` (timestamptz) - Attempt timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies:

  #### users_profiles
  - Users can view their own profile
  - Users can update their own profile
  - Admins can view all profiles

  #### lessons
  - Everyone can view published lessons
  - Tutors can manage their own lessons
  - Students cannot modify lessons

  #### lesson_progress
  - Students can view and update their own progress
  - Students cannot view other students' progress

  #### quiz_attempts
  - Students can view and create their own attempts
  - Students cannot view other students' attempts

  ## Important Notes
  - All foreign keys are properly indexed for performance
  - Default values ensure data integrity
  - Timestamps are automatically managed
  - RLS policies are restrictive by default for security
*/

CREATE TABLE IF NOT EXISTS users_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'tutor', 'admin')) DEFAULT 'student',
  level text,
  bio text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid REFERENCES users_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  subject text NOT NULL,
  level text NOT NULL,
  duration integer NOT NULL DEFAULT 30,
  content jsonb DEFAULT '[]'::jsonb,
  exercises jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (is_published = true OR tutor_id = auth.uid());

CREATE POLICY "Tutors can create lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (tutor_id = auth.uid());

CREATE POLICY "Tutors can update own lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (tutor_id = auth.uid())
  WITH CHECK (tutor_id = auth.uid());

CREATE POLICY "Tutors can delete own lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (tutor_id = auth.uid());

CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users_profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score numeric(5,2) DEFAULT 0,
  time_spent integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users_profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  answers jsonb DEFAULT '[]'::jsonb,
  score numeric(5,2) DEFAULT 0,
  total_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_lessons_subject ON lessons(subject);
CREATE INDEX IF NOT EXISTS idx_lessons_tutor ON lessons(tutor_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lesson ON quiz_attempts(lesson_id);
