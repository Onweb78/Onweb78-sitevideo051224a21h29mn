import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { MovieDetails } from './pages/MovieDetails';
import { TVShowDetails } from './pages/TVShowDetails';
import { ActorDetails } from './pages/ActorDetails';
import { TVShows } from './pages/TVShows';
import { Latest } from './pages/Latest';
import { Favorites } from './pages/Favorites';
import { AuthPage } from './pages/auth/AuthPage';
import { Profile } from './pages/Profile';
import { PasswordPage } from './pages/PasswordPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAdministrators } from './pages/admin/AdminAdministrators';
import { AdminCreateUser } from './pages/admin/AdminCreateUser';
import { AdminPages } from './pages/admin/AdminPages';
import { AdminSynthesis } from './pages/admin/AdminSynthesis';
import { UserWelcome } from './pages/UserWelcome';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { DynamicPage } from './pages/DynamicPage';
import { useAuth } from './contexts/AuthContext';
import { useAdmin } from './contexts/AdminContext';

function AppRoutes() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVShowDetails />} />
        <Route path="/actor/:id" element={<ActorDetails />} />
        <Route path="/series" element={<TVShows />} />
        <Route path="/latest" element={<Latest />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/:pageId" element={<DynamicPage />} />
        <Route path="/favorites" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminSynthesis />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/administrators" element={<AdminAdministrators />} />
          <Route path="/admin/create-user" element={<AdminCreateUser />} />
          <Route path="/admin/pages" element={<AdminPages />} />
        </Route>
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVShowDetails />} />
        <Route path="/actor/:id" element={<ActorDetails />} />
        <Route path="/series" element={<TVShows />} />
        <Route path="/latest" element={<Latest />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/:pageId" element={<DynamicPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserWelcome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/password" element={<PasswordPage />} />
      </Route>
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/tv/:id" element={<TVShowDetails />} />
      <Route path="/actor/:id" element={<ActorDetails />} />
      <Route path="/series" element={<TVShows />} />
      <Route path="/latest" element={<Latest />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/:pageId" element={<DynamicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-1">
              <AppRoutes />
            </div>
            <Footer />
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}