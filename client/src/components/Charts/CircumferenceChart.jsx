import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Ruler } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(12, 17, 29, 0.95)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#ffffff' }}>{label}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '0.82rem' }}>
          {payload.map((entry) => (
            <span key={entry.name} style={{ color: entry.color, display: 'flex', gap: '6px' }}>
              <span>{entry.name}:</span>
              <strong>{entry.value} cm</strong>
            </span>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const CircumferenceChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
        <Ruler size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
        <h4 style={{ color: 'var(--text-muted)' }}>No Body Circumference Data</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Add measurements for chest, waist, biceps, or thighs to visualize changes!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Body Circumference Trends</h3>
          <span className="badge badge-emerald">Shape & Size</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Tracking tape measurements (cm) across upper, core, and lower body
        </p>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} unit="cm" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            <Line type="monotone" dataKey="chest" name="Chest" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="waist" name="Waist" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="hips" name="Hips" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
            <Line type="monotone" dataKey="biceps" name="Biceps" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="thighs" name="Thighs" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
