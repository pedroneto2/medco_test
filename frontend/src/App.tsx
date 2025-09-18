import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { type JSX } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Home from './pages/Home';
import CreateTask from './pages/CreateTask';

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
}

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/tasks" /> : children;
}

// Export the routes component separately for testing
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/tasks/new" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}