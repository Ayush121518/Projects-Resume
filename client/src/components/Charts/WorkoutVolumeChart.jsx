import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';
import { Dumbbell, Flame } from 'lucide-react';

export const WorkoutVolumeChart = ({ data = [] }) => {
  const [viewLimit, setViewLimit] = useState(8);

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (viewLimit === 'all') return data;
    return data.slice(-viewLimit);
  }, [data, viewLimit]);

  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
        <Dumbbell size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
        <h4 style={{ color: 'var(--text-muted)' }}>No Workouts Logged</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Log your workouts to unlock volume progression charts!
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(12, 17, 29, 0.95)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{item.title}</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>{item.date}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
            <span style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong>Volume:</strong> {item.volume.toLocaleString()} kg
            </span>
            <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong>Calories:</strong> {item.calories} kcal
            </span>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong>Duration:</strong> {item.duration} mins
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Volume Progression & Burn</h3>
            <span className="badge badge-violet">Overload Tracking</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Total weight lifted (Sets × Reps × Kg) and energy expenditure per session
          </p>
        </div>

        {/* View Limit Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
          border: '1px solid var(--border-subtle)',
        }}>
          {[8, 14, 'all'].map((limit) => (
            <button
              key={limit}
              onClick={() => setViewLimit(limit)}
              style={{
                background: viewLimit === limit ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: viewLimit === limit ? '#c4b5fd' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {limit === 'all' ? 'All' : `Last ${limit}`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis
              yAxisId="volumeAxis"
              stroke="#8b5cf6"
              tick={{ fill: '#a78bfa', fontSize: 11 }}
              unit="kg"
            />
            <YAxis
              yAxisId="calorieAxis"
              orientation="right"
              stroke="#f59e0b"
              tick={{ fill: '#fbbf24', fontSize: 11 }}
              unit="kcal"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar
              yAxisId="volumeAxis"
              dataKey="volume"
              name="Volume Lifted (kg)"
              fill="url(#volumeBarGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />
            <Line
              yAxisId="calorieAxis"
              type="monotone"
              dataKey="calories"
              name="Calories (kcal)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#f59e0b' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
