import { useMemo, useState } from 'react';
import type { ActivityEntry } from '../App';

type ActivityPageProps = { activity: ActivityEntry[] };

function formatTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const actionLabels: Record<string, string> = { added: 'Added', updated: 'Updated', deleted: 'Deleted' };
const actionIcons: Record<string, string> = { added: '➕', updated: '✏️', deleted: '🗑️' };

export function ActivityPage({ activity }: ActivityPageProps) {
  const [filter, setFilter] = useState<'all' | 'added' | 'updated' | 'deleted'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return activity;
    return activity.filter((a) => a.action === filter);
  }, [activity, filter]);

  return (
    <>
      <div className="page-header">
        <h1>Activity Log</h1>
        <p>Track every inventory change with full audit history.</p>
      </div>

      <div className="filter-pills">
        {(['all', 'added', 'updated', 'deleted'] as const).map((f) => (
          <button key={f} className={`pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? '📋 All' : `${actionIcons[f]} ${actionLabels[f]}`}
          </button>
        ))}
      </div>

      <div className="section-card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No activity found</h3>
            <p>Actions will appear here as you manage your inventory.</p>
          </div>
        ) : (
          <div className="activity-timeline">
            {filtered.map((act) => (
              <div className="timeline-item" key={act.id}>
                <div className={`timeline-icon ${act.action}`}>
                  {actionIcons[act.action]}
                </div>
                <div className="timeline-body">
                  <div className="timeline-title">
                    <span className={`action-label ${act.action}`}>{actionLabels[act.action]}</span>
                    {' '}{act.itemName}
                  </div>
                  <div className="timeline-desc">{act.details}</div>
                  <div className="timeline-stamp">{formatTime(act.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
