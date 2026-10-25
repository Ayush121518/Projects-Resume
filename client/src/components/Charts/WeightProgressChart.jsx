import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Scale, Target, TrendingDown } from 'lucide-react';

export const WeightProgressChart = ({ data = [], targetWeight = 75 }) => {
  const [filter, setFilter] = useState('all');

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (filter === '30d') return data.slice(-10);
    if (filter === '14d') return data.slice(-5);
    return data;
  }, [data, filter]);

  if (!data || data.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
        <Scale size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
        <h4 style={{ color: 'var(--text-muted)' }}>No Weight Data Logged Yet</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          Record your first weigh-in in the Body Tracker to visualize progress!
        </p>
      </div>
    );
  }

  // Calculate min and max for nicely padded Y axis
  const weights = filteredData.map((d) => d.weight).filter(Boolean);
  const minWeight = Math.floor(Math.min(...weights, targetWeight) - 2);
  const maxWeight = Math.ceil(Math.max(...weights, targetWeight) + 2);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const currentWeight = payload.find((p) => p.dataKey === 'weight')?.value;
      const currentBodyFat = payload.find((p) => p.dataKey === 'bodyFat')?.value;
      const deltaToGoal = currentWeight ? +(currentWeight - targetWeight).toFixed(1) : null;

      return (
        <div style={{
          background: 'rgba(12, 17, 29, 0.95)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(10px)',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#ffffff' }}>
            {label}
          </p>
          {currentWeight && (
            <p style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Weight:</span>
              <strong>{currentWeight} kg</strong>
            </p>
          )}
          {currentBodyFat && (
            <p style={{ fontSize: '0.85rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>Body Fat:</span>
              <strong>{currentBodyFat}%</strong>
            </p>
          )}
          {deltaToGoal !== null && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
              {deltaToGoal > 0 ? `${deltaToGoal} kg above goal` : deltaToGoal < 0 ? `${Math.abs(deltaToGoal)} kg below goal` : 'Goal reached! 🎉'}
            </p>
          )}
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Weight & Body Fat Progression</h3>
            <span className="badge badge-emerald">Recharts</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Tracking weight trajectory towards target {targetWeight} kg
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
          border: '1px solid var(--border-subtle)',
        }}>
          {['all', '30d', '14d'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              style={{
                background: filter === opt ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: filter === opt ? '#34d399' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {opt === 'all' ? 'All Time' : opt === '30d' ? 'Last 30 Days' : 'Last 14 Days'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis
              yAxisId="weightAxis"
              domain={[minWeight, maxWeight]}
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              unit="kg"
            />
            <YAxis
              yAxisId="fatAxis"
              orientation="right"
              domain={['dataMin - 2', 'dataMax + 2']}
              stroke="#06b6d4"
              tick={{ fill: '#38bdf8', fontSize: 11 }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            
            {/* Target Weight Goal Reference Line */}
            {targetWeight && (
              <ReferenceLine
                yAxisId="weightAxis"
                y={targetWeight}
                label={{
                  value: `Goal: ${targetWeight}kg`,
                  fill: '#f59e0b',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
                stroke="#f59e0b"
                strokeDasharray="4 4"
              />
            )}

            <Area
              yAxisId="weightAxis"
              type="monotone"
              dataKey="weight"
              name="Weight (kg)"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#weightGradient)"
              activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Line
              yAxisId="fatAxis"
              type="monotone"
              dataKey="bodyFat"
              name="Body Fat (%)"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={{ r: 4, fill: '#06b6d4' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
