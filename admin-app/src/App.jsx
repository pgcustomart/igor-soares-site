import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/Articles/ArticlesList';
import ArticleEditor from './pages/Articles/ArticleEditor';
import Images from './pages/Images';
import HeroHome from './pages/HeroHome';
import HeroArtigos from './pages/HeroArtigos';
import Settings from './pages/Settings';
import Seo from './pages/Seo';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Dashboard />} />
        <Route path="artigos" element={<ArticlesList />} />
        <Route path="artigos/novo" element={<ArticleEditor />} />
        <Route path="artigos/:id" element={<ArticleEditor />} />
        <Route path="imagens" element={<Images />} />
        <Route path="hero-home" element={<HeroHome />} />
        <Route path="hero-artigos" element={<HeroArtigos />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="seo" element={<Seo />} />
      </Route>
    </Routes>
  );
}
