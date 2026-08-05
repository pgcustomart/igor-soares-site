import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: '2rem' }}>Carregando…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
