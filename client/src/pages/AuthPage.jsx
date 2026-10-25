import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Dumbbell, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Flame, TrendingUp } from 'lucide-react';

export const AuthPage = () => {
  const { login, register, demoLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetWeight, setTargetWeight] = useState(72);
  const [fitnessGoal, setFitnessGoal] = useState('muscle_gain');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          targetWeight: Number(targetWeight),
          fitnessGoal,
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setError('');
    setLoading(true);
    try {
      await demoLogin();
    } catch (err) {
      setError(err.message || 'Failed to start demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1040px',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '40px',
        alignItems: 'center',
      }} className="auth-container">
        
        {/* Left Side: Brand Pitch & Highlights */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            marginBottom: '20px',
          }}>
            <Sparkles size={16} color="#34d399" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#34d399', letterSpacing: '0.04em' }}>
              MERN STACK FITNESS PLATFORM
            </span>
          </div>

          <h1 style={{
            fontSize: '2.8rem',
            lineHeight: 1.15,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff 30%, #34d399 70%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Track Workouts.<br />Overload Progress.<br />Transform Physique.
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            marginBottom: '28px',
            lineHeight: 1.6,
          }}>
            FitTrack combines workout plan creation, real-time set logging, body measurements, and 
            interactive Recharts data visualizations for serious fitness progression.
          </p>

          {/* Highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Dumbbell size={18} />
              </div>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <strong>Dynamic Workout Plans & Logger:</strong> Sets, weights, reps & rest timer
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={18} />
              </div>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <strong>Recharts Progress Analytics:</strong> Volume progression & body composition
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#a78bfa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <strong>Secure JWT Authentication:</strong> Encrypted passwords & private data
              </span>
            </div>
          </div>

          {/* 1-Click Demo Login Highlight Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem' }}>
                <Sparkles size={16} color="#34d399" />
                <span>Instant Demo Access</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Test with pre-seeded 30-day workouts, volume charts & body trends
              </p>
            </div>
            <button
              id="btn-demo-instant-access"
              onClick={handleDemoClick}
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <span>{loading ? 'Entering...' : '1-Click Demo'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="glass-card" style={{ padding: '36px 32px' }}>
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid var(--border-subtle)',
          }}>
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                background: isLogin ? 'var(--gradient-brand)' : 'transparent',
                color: isLogin ? '#051410' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                background: !isLogin ? 'var(--gradient-brand)' : 'transparent',
                color: !isLogin ? '#051410' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid #f43f5e',
              color: '#fb7185',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label className="input-label">Full Name</label>
                <input
                  id="register-input-name"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Ayush Yadav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="input-label">Email Address</label>
              <input
                id="auth-input-email"
                type="email"
                className="input-field"
                placeholder="athlete@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Password</label>
              <input
                id="auth-input-password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Target Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Fitness Goal</label>
                  <select
                    className="input-field"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                  >
                    <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="endurance">Endurance</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            )}

            <button
              id="btn-auth-submit"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              <span>{loading ? 'Please wait...' : isLogin ? 'Sign In to FitTrack' : 'Register & Start Tracking'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-dim)',
          }}>
            JWT Secure Session • MongoDB Mongoose • Recharts Analytics
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-container {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </div>
  );
};
