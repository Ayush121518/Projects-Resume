import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { workoutsApi } from '../api/workoutsApi.js';
import { measurementsApi } from '../api/measurementsApi.js';
import { 
  Settings, 
  Download, 
  Save, 
  CheckCircle2, 
  Scale, 
  LogOut 
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [targetWeight, setTargetWeight] = useState(user?.targetWeight || 75);
  const [height, setHeight] = useState(user?.height || 180);
  const [fitnessGoal, setFitnessGoal] = useState(user?.fitnessGoal || 'muscle_gain');
  const [weightUnit, setWeightUnit] = useState(user?.units?.weight || 'kg');
  const [measurementUnit, setMeasurementUnit] = useState(user?.units?.measurement || 'cm');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate BMI
  const heightMeters = (height || 180) / 100;
  const currentBmi = targetWeight && heightMeters > 0
    ? +(targetWeight / (heightMeters * heightMeters)).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({
        name,
        targetWeight: Number(targetWeight),
        height: Number(height),
        fitnessGoal,
        units: {
          weight: weightUnit,
          measurement: measurementUnit,
        },
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [workouts, measurements] = await Promise.all([
        workoutsApi.getWorkouts({ limit: 1000 }),
        measurementsApi.getMeasurements(),
      ]);

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        user: {
          name: user.name,
          email: user.email,
          targetWeight,
          height,
          fitnessGoal,
        },
        workouts: workouts.data || [],
        measurements: measurements.data || [],
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `fittrack-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Error exporting fitness data: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Profile & Fitness Preferences</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Personalize your fitness goals, target body weight, and system measurements
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="profile-grid">
        {/* Profile Settings Form */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="#10b981" /> Account Settings
          </h3>

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#34d399',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid #f43f5e',
              color: '#fb7185',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '16px',
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Email (Read Only)</label>
              <input
                type="email"
                className="input-field"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="input-label">Target Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="input-label">Height (cm)</label>
                <input
                  type="number"
                  className="input-field"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">Primary Fitness Goal</label>
              <select
                className="input-field"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
              >
                <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
                <option value="fat_loss">Fat Loss & Leanness</option>
                <option value="endurance">Endurance & Cardio</option>
                <option value="maintenance">Body Recomposition / Maintenance</option>
                <option value="general_fitness">General Health & Fitness</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="input-label">Weight Unit</label>
                <select
                  className="input-field"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                </select>
              </div>

              <div>
                <label className="input-label">Measurement Unit</label>
                <select
                  className="input-field"
                  value={measurementUnit}
                  onChange={(e) => setMeasurementUnit(e.target.value)}
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>
            </div>

            <button
              id="btn-save-profile"
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ marginTop: '8px' }}
            >
              <Save size={16} />
              <span>{saving ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Health Stats & Data Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Target & BMI Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={18} color="#06b6d4" /> Target Composition
            </h4>

            <div style={{
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Goal BMI</span>
                <span className="badge badge-cyan">
                  {currentBmi < 18.5 ? 'Underweight' : currentBmi < 25 ? 'Normal / Athletic' : 'Overweight'}
                </span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>
                {currentBmi} <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 500 }}>kg/m²</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Calculated using your target weight ({targetWeight} kg) and height ({height} cm).
            </p>
          </div>

          {/* Data Export Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} color="#8b5cf6" /> Export Fitness Data
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
              Download your full workout history, sets, and body measurements in standard JSON format.
            </p>
            <button
              onClick={handleExportData}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <Download size={15} />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Sign Out Card */}
          <div className="glass-card" style={{ padding: '20px 24px' }}>
            <button
              id="btn-profile-logout"
              onClick={logout}
              className="btn btn-danger"
              style={{ width: '100%' }}
            >
              <LogOut size={16} />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
