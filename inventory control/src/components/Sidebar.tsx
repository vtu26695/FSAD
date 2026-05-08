import type { UserAccount } from '../App';

export type NavPage = 'dashboard' | 'inventory' | 'activity';

type SidebarProps = {
  user: UserAccount;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ user, currentPage, onNavigate, onLogout, open, onClose }: SidebarProps) {
  const nav = (page: NavPage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">IC</div>
        <span className="sidebar-brand-text">Inventory Control</span>
      </div>

      <nav className="sidebar-nav">
        <button className={`nav-link${currentPage === 'dashboard' ? ' active' : ''}`} onClick={() => nav('dashboard')}>
          <span className="nav-icon">📊</span> Dashboard
        </button>
        <button className={`nav-link${currentPage === 'inventory' ? ' active' : ''}`} onClick={() => nav('inventory')}>
          <span className="nav-icon">📦</span> Inventory
        </button>
        <button className={`nav-link${currentPage === 'activity' ? ' active' : ''}`} onClick={() => nav('activity')}>
          <span className="nav-icon">📋</span> Activity Log
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm sidebar-logout" onClick={onLogout}>
          ↩ Sign Out
        </button>
      </div>
    </aside>
  );
}
