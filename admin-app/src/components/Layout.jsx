import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/artigos', label: 'Artigos' },
  { to: '/imagens', label: 'Imagens' },
  { to: '/hero-home', label: 'Hero da Home' },
  { to: '/hero-artigos', label: 'Hero de Artigos' },
  { to: '/configuracoes', label: 'Configurações' },
  { to: '/seo', label: 'SEO' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          Igor Soares
          <span>Painel Administrativo</span>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <div style={{ marginBottom: '0.5rem' }}>{user?.name}</div>
          <button type="button" onClick={logout}>Sair</button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <strong>Painel Administrativo</strong>
          <a href="/" target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem' }}>Ver site publicado ↗</a>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
