import React, { useState } from 'react';
import { measurementsApi } from '../api/measurementsApi.js';
import { X, Scale, Ruler, CheckCircle2 } from 'lucide-react';

export const MeasurementModal = ({ isOpen, onClose, onMeasurementSaved }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState('');
  const [chestCm, setChestCm] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [hipsCm, setHipsCm] = useState('');
  const [bicepsCm, setBicepsCm] = useState('');
  const [thighsCm, setThighsCm] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weightKg) {
      setError('Please provide your weight in kg');
      return;
    }
    setError('');
    setSaving(true);

    try {
      await measurementsApi.addMeasurement({
        date: new Date(date),
        weightKg: Number(weightKg),
        bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : null,
        chestCm: chestCm ? Number(chestCm) : null,
        waistCm: waistCm ? Number(waistCm) : null,
        hipsCm: hipsCm ? Number(hipsCm) : null,
        bicepsCm: bicepsCm ? Number(bicepsCm) : null,
        thighsCm: thighsCm ? Number(thighsCm) : null,
        notes,
      });

      if (onMeasurementSaved) onMeasurementSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save measurement');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px' }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#051410',
            }}>
              <Scale size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Record Body Measurements</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Track weigh-ins, body composition, and circumferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid #f43f5e',
              color: '#fb7185',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Date & Primary Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label className="input-label">Date *</label>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 74.8"
                required
              />
            </div>
            <div>
              <label className="input-label">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value)}
                placeholder="e.g. 15.5"
              />
            </div>
          </div>

          {/* Circumferences Section */}
          <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '18px',
          }}>
            <h4 style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
              color: '#38bdf8',
            }}>
              <Ruler size={16} /> Body Circumferences (cm) - Optional
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label className="input-label">Chest</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={chestCm}
                  onChange={(e) => setChestCm(e.target.value)}
                  placeholder="e.g. 101"
                />
              </div>
              <div>
                <label className="input-label">Waist</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  placeholder="e.g. 81"
                />
              </div>
              <div>
                <label className="input-label">Hips</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={hipsCm}
                  onChange={(e) => setHipsCm(e.target.value)}
                  placeholder="e.g. 96"
                />
              </div>
              <div>
                <label className="input-label">Biceps</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={bicepsCm}
                  onChange={(e) => setBicepsCm(e.target.value)}
                  placeholder="e.g. 36.5"
                />
              </div>
              <div>
                <label className="input-label">Thighs</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={thighsCm}
                  onChange={(e) => setThighsCm(e.target.value)}
                  placeholder="e.g. 58"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label className="input-label">Notes (Condition, morning weigh-in, etc.)</label>
            <textarea
              className="input-field"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Fasting morning weigh-in, feeling energised..."
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              id="btn-save-measurement"
            >
              <CheckCircle2 size={16} />
              <span>{saving ? 'Saving...' : 'Save Measurement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
