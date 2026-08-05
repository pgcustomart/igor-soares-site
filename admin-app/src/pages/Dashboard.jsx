import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then(setData).catch(() => setData(null));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link className="btn btn--primary" to="/artigos/novo">+ Novo artigo</Link>
      </div>

      <div className="admin-grid admin-grid--stats" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-stat">
          <div className="admin-stat__value">{data ? data.publishedCount : '—'}</div>
          <div className="admin-stat__label">Artigos publicados</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__value">{data ? data.draftCount : '—'}</div>
          <div className="admin-stat__label">Rascunhos</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__value" style={{ fontSize: '1.1rem' }}>{data ? formatDate(data.lastUpdatedAt) : '—'}</div>
          <div className="admin-stat__label">Última atualização</div>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.05rem' }}>Últimos artigos editados</h2>
        <table className="admin-table">
          <thead>
            <tr><th>Título</th><th>Status</th><th>Atualizado em</th></tr>
          </thead>
          <tbody>
            {data?.recentArticles.map((a) => (
              <tr key={a.id}>
                <td><Link to={`/artigos/${a.id}`}>{a.title}</Link></td>
                <td><span className={`badge badge--${a.status === 'PUBLISHED' ? 'published' : 'draft'}`}>{a.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}</span></td>
                <td>{formatDate(a.updatedAt)}</td>
              </tr>
            ))}
            {data && data.recentArticles.length === 0 && (
              <tr><td colSpan={3} style={{ color: 'var(--color-ink-faint)' }}>Nenhum artigo ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
