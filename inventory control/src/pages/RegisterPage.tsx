import { useState, type FormEvent } from 'react';

type RegisterPageProps = {
  onRegister: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  onSwitchToLogin: () => void;
};

export function RegisterPage({ onRegister, onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await onRegister(name, email, password);
    setMessage(result.success ? null : result.message ?? 'Registration failed');
    setLoading(false);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="subtitle">Register to start tracking inventory, stock adjustments, and supplier relationships.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Full Name</label>
            <input className="field-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a strong password" required minLength={6} />
          </div>
          {message && <div className="alert-msg error">{message}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <div className="auth-footer">
            <span>Already have an account?</span>
            <button className="btn btn-ghost btn-sm" type="button" onClick={onSwitchToLogin}>Sign in</button>
          </div>
        </form>
      </div>
    </div>
  );
}
