import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { Activity } from 'lucide-react';

export const MuscleDistributionChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
        <Activity size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
        <h4 style={{ color: 'var(--text-muted)' }}>No Muscle Distribution Yet</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Log exercises across muscle groups to populate your radar chart.
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(12, 17, 29, 0.95)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{item.subject}</p>
          <p style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '2px' }}>
            <strong>{item.workouts}</strong> sets/exercises completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Muscle Focus Radar</h3>
          <span className="badge badge-cyan">Split Balance</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Visualizing training distribution across key muscle groups
        </p>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="subject"
              stroke="#9ca3af"
              tick={{ fill: '#d1d5db', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="rgba(255,255,255,0.08)" />
            <Radar
              name="Muscle Focus"
              dataKey="workouts"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.45}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
