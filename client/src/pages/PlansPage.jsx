import React, { useState, useEffect } from 'react';
import { plansApi } from '../api/plansApi.js';
import { 
  Dumbbell, 
  Plus, 
  Copy, 
  Play, 
  Edit3, 
  Trash2, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';

export const PlansPage = ({ onOpenPlanModal, onStartWorkoutWithPlan, refreshTrigger }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await plansApi.getPlans();
      if (res.success) {
        setPlans(res.data);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [refreshTrigger]);

  const handleDuplicate = async (id) => {
    try {
      const res = await plansApi.duplicatePlan(id);
      if (res.success) {
        setPlans([res.data, ...plans]);
      }
    } catch (err) {
      alert(err.message || 'Error duplicating plan');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom workout plan?')) return;
    try {
      await plansApi.deletePlan(id);
      setPlans(plans.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting plan');
    }
  };

  const categories = ['All', 'Hypertrophy', 'Strength', 'Cardio / HIIT', 'Weight Loss'];

  const filteredPlans = filterCategory === 'All'
    ? plans
    : plans.filter((p) => p.category === filterCategory);

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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Workout Plans & Splits</h1>
            <span className="badge badge-emerald">{plans.length} Routines</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Custom routines and curated templates structured for progressive overload
          </p>
        </div>

        <button
          id="btn-create-plan-page"
          className="btn btn-primary"
          onClick={() => onOpenPlanModal()}
        >
          <Plus size={16} strokeWidth={3} />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '24px',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: filterCategory === cat ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              background: filterCategory === cat ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-glass)',
              color: filterCategory === cat ? '#34d399' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading workout plans...
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <Dumbbell size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No Plans in this Category</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Create a custom plan to get started!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px',
        }}>
          {filteredPlans.map((plan) => {
            const totalExercises = plan.days?.reduce((acc, d) => acc + (d.exercises?.length || 0), 0) || 0;

            return (
              <div
                key={plan._id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: plan.isTemplate ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid var(--border-subtle)',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className={plan.isTemplate ? 'badge badge-cyan' : 'badge badge-emerald'}>
                      {plan.isTemplate ? 'Preset Template' : 'Custom Routine'}
                    </span>
                    <span className="badge badge-amber">{plan.difficulty || 'Intermediate'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {plan.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '18px',
                    minHeight: '40px',
                  }}>
                    {plan.description || 'Structured workout split designed for consistent muscle growth and conditioning.'}
                  </p>

                  {/* Days / Split Breakdown */}
                  <div style={{
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    marginBottom: '20px',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: 'var(--text-dim)',
                      fontWeight: 600,
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                    }}>
                      <span>{plan.days?.length || 0} Workout Days</span>
                      <span>{totalExercises} Total Exercises</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {plan.days?.slice(0, 3).map((day, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: '0.82rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: 'var(--text-main)',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{day.dayName}</span>
                          <span style={{ color: 'var(--text-dim)' }}>{day.exercises?.length || 0} exercises</span>
                        </div>
                      ))}
                      {plan.days?.length > 3 && (
                        <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontStyle: 'italic' }}>
                          +{plan.days.length - 3} more workout days
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => onStartWorkoutWithPlan(plan)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Start Workout</span>
                  </button>

                  {plan.isTemplate ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDuplicate(plan._id)}
                      title="Clone template to edit"
                      style={{ padding: '8px 12px' }}
                    >
                      <Copy size={15} />
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => onOpenPlanModal(plan)}
                        title="Edit Plan"
                        style={{ padding: '8px 10px' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(plan._id)}
                        title="Delete Plan"
                        style={{ padding: '8px 10px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
