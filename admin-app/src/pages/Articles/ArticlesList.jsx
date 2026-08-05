import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (q) => {
    const { articles: list } = await api.get(`/articles${q ? `?search=${encodeURIComponent(q)}` : ''}`);
    setArticles(list);
  }, []);

  useEffect(() => { load(''); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search), 250);
    return () => clearTimeout(t);
  }, [search, load]);

  async function togglePublish(article) {
    setBusyId(article.id);
    try {
      await api.post(`/articles/${article.id}/${article.status === 'PUBLISHED' ? 'unpublish' : 'publish'}`);
      await load(search);
    } finally {
      setBusyId(null);
    }
  }

  async function duplicate(article) {
    setBusyId(article.id);
    try {
      await api.post(`/articles/${article.id}/duplicate`);
      await load(search);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(article) {
    if (!window.confirm(`Excluir "${article.title}"? Essa ação não pode ser desfeita.`)) return;
    setBusyId(article.id);
    try {
      await api.delete(`/articles/${article.id}`);
      await load(search);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Artigos</h1>
        <Link className="btn btn--primary" to="/artigos/novo">+ Novo artigo</Link>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Pesquisar por título, categoria ou slug…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr><th>Título</th><th>Categoria</th><th>Status</th><th>Atualizado</th><th></th></tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id}>
                <td><Link to={`/artigos/${a.id}`}>{a.title}</Link></td>
                <td>{a.category}</td>
                <td><span className={`badge badge--${a.status === 'PUBLISHED' ? 'published' : 'draft'}`}>{a.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}</span></td>
                <td>{formatDate(a.updatedAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn--outline btn--sm" disabled={busyId === a.id} onClick={() => togglePublish(a)}>
                      {a.status === 'PUBLISHED' ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button className="btn btn--outline btn--sm" disabled={busyId === a.id} onClick={() => duplicate(a)}>Duplicar</button>
                    <button className="btn btn--danger btn--sm" disabled={busyId === a.id} onClick={() => remove(a)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr><td colSpan={5} style={{ color: 'var(--color-ink-faint)' }}>Nenhum artigo encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
