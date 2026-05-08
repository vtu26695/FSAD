import type { ActivityEntry, DashboardStats, UserAccount } from '../App';

type DashboardPageProps = {
  stats: DashboardStats | null;
  activity: ActivityEntry[];
  user: UserAccount;
};

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function DashboardPage({ stats, activity, user }: DashboardPageProps) {
  if (!stats) {
    return (
      <div className="loading-shell" style={{ minHeight: 'auto', padding: 60 }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const maxCatCount = Math.max(...stats.categories.map((c) => c.count), 1);
  const maxSupCount = Math.max(...stats.suppliers.map((s) => s.count), 1);

  return (
    <>
      <div className="page-header">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Here's an overview of your inventory performance today.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-icon blue">📦</div>
          <div className="stat-label">Total Items</div>
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-sub">{stats.totalQuantity} units in stock</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple">💰</div>
          <div className="stat-label">Total Value</div>
          <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
          <div className="stat-sub">across all categories</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber">⚠️</div>
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{stats.lowStockCount}</div>
          <div className="stat-sub">items need restocking</div>
        </div>
        <div className="stat-card rose">
          <div className="stat-icon rose">🚫</div>
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value">{stats.outOfStockCount}</div>
          <div className="stat-sub">{stats.inStockCount} items healthy</div>
        </div>
      </div>

      {/* ── Charts + Activity ── */}
      <div className="grid-2">
        {/* Left: Category + Supplier breakdown */}
        <div>
          <div className="section-card">
            <div className="section-title"><span className="section-title-icon">📊</span> Stock by Category</div>
            <div className="bar-list">
              {stats.categories.map((cat) => (
                <div key={cat.name}>
                  <div className="bar-item-label">
                    <span>{cat.name}</span>
                    <span>{cat.count} units · {formatCurrency(cat.value)}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(cat.count / maxCatCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-title"><span className="section-title-icon">🏭</span> Supplier Distribution</div>
            <div className="bar-list">
              {stats.suppliers.map((sup) => (
                <div key={sup.name}>
                  <div className="bar-item-label">
                    <span>{sup.name}</span>
                    <span>{sup.items} items · {sup.count} units</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill emerald" style={{ width: `${(sup.count / maxSupCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Activity + Top Items */}
        <div>
          <div className="section-card">
            <div className="section-title"><span className="section-title-icon">⏱️</span> Recent Activity</div>
            <div className="activity-list">
              {activity.slice(0, 6).map((act) => (
                <div className="activity-item" key={act.id}>
                  <div className={`activity-dot ${act.action}`} />
                  <div className="activity-text">
                    <div className="activity-name">
                      {act.action === 'added' && '➕ '}
                      {act.action === 'updated' && '✏️ '}
                      {act.action === 'deleted' && '🗑️ '}
                      {act.itemName}
                    </div>
                    <div className="activity-detail">{act.details}</div>
                  </div>
                  <div className="activity-time">{timeAgo(act.timestamp)}</div>
                </div>
              ))}
              {activity.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No activity yet
                </div>
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="section-title"><span className="section-title-icon">🏆</span> Top Items by Value</div>
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {stats.topItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td className="val">{formatCurrency(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
