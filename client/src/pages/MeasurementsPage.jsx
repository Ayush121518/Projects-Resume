import React, { useState, useEffect } from 'react';
import { measurementsApi } from '../api/measurementsApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { WeightProgressChart } from '../components/Charts/WeightProgressChart.jsx';
import { CircumferenceChart } from '../components/Charts/CircumferenceChart.jsx';
import { Plus, Trash2 } from 'lucide-react';

export const MeasurementsPage = ({ onOpenMeasurementModal, refreshTrigger }) => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const [listRes, summaryRes] = await Promise.all([
        measurementsApi.getMeasurements(),
        measurementsApi.getSummary(),
      ]);

      if (listRes.success) {
        setMeasurements(listRes.data);
      }
      if (summaryRes.success) {
        setSummary(summaryRes);
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this measurement entry?')) return;
    try {
      await measurementsApi.deleteMeasurement(id);
      fetchMeasurements();
    } catch (err) {
      alert(err.message || 'Error deleting measurement');
    }
  };

  // Prepare chart formatted data
  const chartData = measurements.map((m) => {
    const d = new Date(m.date);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: m.weightKg,
      bodyFat: m.bodyFatPercentage,
      chest: m.chestCm,
      waist: m.waistCm,
      hips: m.hipsCm,
      biceps: m.bicepsCm,
      thighs: m.thighsCm,
    };
  });

  const latest = summary?.latest;
  const baseline = summary?.baseline;
  const weightDelta = summary?.weightDelta || 0;
  const bodyFatDelta = summary?.bodyFatDelta || 0;

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '28px 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '24px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Body Measurements & Progress</h1>
            <span className="badge badge-emerald">{measurements.length} Weigh-ins</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Track weight, body fat %, and tape circumferences over time
          </p>
        </div>

        <button
          id="btn-add-measurement-page"
          className="btn btn-primary"
          onClick={onOpenMeasurementModal}
        >
          <Plus size={16} strokeWidth={3} />
          <span>Record Weigh-in</span>
        </button>
      </div>

      {/* Progress Delta Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Current Weight
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {latest?.weightKg ? `${latest.weightKg} kg` : '--'}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Baseline: {baseline?.weightKg || '--'} kg
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Weight Change
          </span>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: weightDelta <= 0 ? '#34d399' : '#fb7185',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {weightDelta > 0 ? `+${weightDelta} kg` : `${weightDelta} kg`}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Since {baseline ? new Date(baseline.date).toLocaleDateString() : 'start'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Body Fat %
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
            {latest?.bodyFatPercentage ? `${latest.bodyFatPercentage}%` : '--'}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Change: {bodyFatDelta !== null ? `${bodyFatDelta > 0 ? '+' : ''}${bodyFatDelta}%` : '--'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
            Goal Target
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {user?.targetWeight || 75} kg
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {latest ? `${Math.abs(+(latest.weightKg - (user?.targetWeight || 75)).toFixed(1))} kg to go` : 'Set your target'}
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '24px',
        marginBottom: '32px',
      }} className="charts-split-row">
        <WeightProgressChart
          data={chartData}
          targetWeight={user?.targetWeight || 75}
        />
        <CircumferenceChart
          data={chartData}
        />
      </div>

      {/* Historical Measurements Table */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          Measurement Log History
        </h3>

        {measurements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No measurements recorded yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Weight</th>
                <th style={{ padding: '10px 14px' }}>Body Fat</th>
                <th style={{ padding: '10px 14px' }}>Chest</th>
                <th style={{ padding: '10px 14px' }}>Waist</th>
                <th style={{ padding: '10px 14px' }}>Biceps</th>
                <th style={{ padding: '10px 14px' }}>Notes</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...measurements].reverse().map((m) => {
                const dateStr = new Date(m.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <tr
                    key={m._id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{dateStr}</td>
                    <td style={{ padding: '12px 14px', color: '#10b981', fontWeight: 700 }}>{m.weightKg} kg</td>
                    <td style={{ padding: '12px 14px', color: '#06b6d4' }}>{m.bodyFatPercentage ? `${m.bodyFatPercentage}%` : '--'}</td>
                    <td style={{ padding: '12px 14px' }}>{m.chestCm ? `${m.chestCm} cm` : '--'}</td>
                    <td style={{ padding: '12px 14px' }}>{m.waistCm ? `${m.waistCm} cm` : '--'}</td>
                    <td style={{ padding: '12px 14px' }}>{m.bicepsCm ? `${m.bicepsCm} cm` : '--'}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-dim)', fontStyle: 'italic', maxWidth: '200px' }}>
                      {m.notes || '--'}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(m._id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        title="Delete Weigh-in"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @media (max-width: 980px) {
          .charts-split-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
