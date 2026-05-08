import { useState, type FormEvent } from 'react';

type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  onSwitchToRegister: () => void;
};

export function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await onLogin(email, password);
    setMessage(result.success ? null : result.message ?? 'Login failed');
    setLoading(false);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to manage your stock, suppliers, and inventory movements.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          {message && <div className="alert-msg error">{message}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className="auth-footer">
            <span>Don't have an account?</span>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onSwitchToRegister}>Create one</button>
          </div>
        </form>
      </div>
    </div>
  );
}
