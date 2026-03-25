import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/protected-route";
import { AuthProvider } from "./context/auth-context";
import { AppShell } from "./layouts/app-shell";
import { AIAssistantPage } from "./pages/ai-assistant-page";
import { AdminPage } from "./pages/admin-page";
import { BookLibraryPage } from "./pages/book-library-page";
import { CourseDetailPage } from "./pages/course-detail-page";
import { CoursesPage } from "./pages/courses-page";
import { DashboardPage } from "./pages/dashboard-page";
import { LoginPage } from "./pages/login-page";
import { PdfViewerPage } from "./pages/pdf-viewer-page";
import { PlannerPage } from "./pages/planner-page";
import { ProfilePage } from "./pages/profile-page";
import { ProgressPage } from "./pages/progress-page";
import { QuizAttemptPage } from "./pages/quiz-attempt-page";
import { QuizResultPage } from "./pages/quiz-result-page";
import { QuizSelectionPage } from "./pages/quiz-selection-page";
import { SettingsPage } from "./pages/settings-page";
import { VideoPlayerPage } from "./pages/video-player-page";

export const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/learn/video/:id" element={<VideoPlayerPage />} />
            <Route path="/learn/pdf/:id" element={<PdfViewerPage />} />
            <Route path="/library" element={<BookLibraryPage />} />
            <Route path="/quizzes" element={<QuizSelectionPage />} />
            <Route path="/quizzes/:id/attempt" element={<QuizAttemptPage />} />
            <Route path="/quizzes/result/:attemptId" element={<QuizResultPage />} />
            <Route path="/assistant" element={<AIAssistantPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
