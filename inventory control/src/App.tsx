import { useEffect, useMemo, useState } from 'react';
import { Sidebar, type NavPage } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { ActivityPage } from './pages/ActivityPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  sku: string;
  quantity: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

export type UserAccount = {
  id: string;
  name: string;
  email: string;
};

export type ActivityEntry = {
  id: string;
  action: 'added' | 'updated' | 'deleted';
  itemName: string;
  details: string;
  timestamp: string;
};

export type DashboardStats = {
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  inStockCount: number;
  categories: { name: string; count: number; value: number }[];
  suppliers: { name: string; count: number; items: number }[];
  topItems: { name: string; value: number; quantity: number; price: number }[];
};

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export type AuthRoute = 'login' | 'register';

function App() {
  const [authRoute, setAuthRoute] = useState<AuthRoute>('login');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [navPage, setNavPage] = useState<NavPage>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch all data
  const refreshData = async () => {
    try {
      const [invRes, statsRes, actRes] = await Promise.all([
        fetch(`${apiBase}/api/inventory`),
        fetch(`${apiBase}/api/stats`),
        fetch(`${apiBase}/api/activity`),
      ]);
      if (!invRes.ok || !statsRes.ok || !actRes.ok) throw new Error('Backend request failed');
      setInventory(await invRes.json());
      setStats(await statsRes.json());
      setActivity(await actRes.json());
      setBackendError(null);
    } catch (err) {
      setBackendError((err as Error).message);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => { refreshData(); }, []);

  async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const response = await fetch(input, init);
    if (response.status === 204) return undefined as T;
    const data = await response.json();
    if (!response.ok) throw new Error((data as any)?.message || 'Request failed');
    return data as T;
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await fetchJson<{ user: UserAccount }>(`${apiBase}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setCurrentUser(data.user);
      await refreshData();
      return { success: true } as const;
    } catch (error) {
      return { success: false, message: (error as Error).message } as const;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const data = await fetchJson<{ user: UserAccount }>(`${apiBase}/api/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      setCurrentUser(data.user);
      await refreshData();
      return { success: true } as const;
    } catch (error) {
      return { success: false, message: (error as Error).message } as const;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthRoute('login');
    setNavPage('dashboard');
  };

  const handleAddItem = async (item: Omit<InventoryItem, 'id' | 'status'>) => {
    await fetchJson<InventoryItem>(`${apiBase}/api/inventory`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    await refreshData();
  };

  const handleUpdateItem = async (item: InventoryItem) => {
    await fetchJson<InventoryItem>(`${apiBase}/api/inventory/${item.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    await refreshData();
  };

  const handleRemoveItem = async (id: string) => {
    await fetch(`${apiBase}/api/inventory/${id}`, { method: 'DELETE' });
    await refreshData();
  };

  const categories = useMemo(() => ['Electronics', 'Packaging', 'Office', 'Parts'], []);
  const suppliers = useMemo(() => ['Atlas Supply', 'GreenLine Logistics', 'Prime Warehousing', 'Nova Traders'], []);

  // ── Not logged in ──
  if (!currentUser) {
    if (!ready) {
      return <div className="loading-shell"><div className="loading-spinner" /></div>;
    }
    if (backendError) {
      return (
        <div className="auth-shell">
          <div className="auth-card">
            <h1>Connection Error</h1>
            <p className="subtitle">{backendError}</p>
            <p className="subtitle" style={{ marginTop: 8 }}>Start the backend with <code>npm run dev:server</code></p>
          </div>
        </div>
      );
    }
    if (authRoute === 'register') {
      return <RegisterPage onRegister={handleRegister} onSwitchToLogin={() => setAuthRoute('login')} />;
    }
    return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setAuthRoute('register')} />;
  }

  // ── Logged in — Dashboard layout ──
  return (
    <div className="app-layout">
      <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      <Sidebar
        user={currentUser}
        currentPage={navPage}
        onNavigate={setNavPage}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-content">
        {navPage === 'dashboard' && (
          <DashboardPage stats={stats} activity={activity} user={currentUser} />
        )}
        {navPage === 'inventory' && (
          <InventoryPage
            inventory={inventory}
            categories={categories}
            suppliers={suppliers}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
          />
        )}
        {navPage === 'activity' && (
          <ActivityPage activity={activity} />
        )}
      </main>
    </div>
  );
}

export default App;
