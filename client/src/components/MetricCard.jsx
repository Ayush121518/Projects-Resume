import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  gradient = 'var(--gradient-brand)',
  trend = null, // { value: '+2.4%', isPositive: true/false }
  color = '#10b981',
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', lineHeight: 1.1 }}>
              {value}
            </span>
            {unit && (
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {unit}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: `rgba(${color === '#10b981' ? '16, 185, 129' : color === '#06b6d4' ? '6, 182, 212' : color === '#8b5cf6' ? '139, 92, 246' : '245, 158, 11'}, 0.15)`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
        {trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: trend.isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: trend.isPositive ? '#34d399' : '#fb7185',
            }}
          >
            {trend.isPositive ? <ArrowUpRight size={13} strokeWidth={2.5} /> : <ArrowDownRight size={13} strokeWidth={2.5} />}
            {trend.value}
          </span>
        )}
        <span style={{ color: 'var(--text-dim)' }}>{subtitle}</span>
      </div>
    </div>
  );
};
