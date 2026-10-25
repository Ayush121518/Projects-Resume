import React, { useState, useEffect } from 'react';
import { workoutsApi } from '../api/workoutsApi.js';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Flame, 
  Dumbbell, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Calendar
} from 'lucide-react';

export const WorkoutsPage = ({ onOpenWorkoutModal, refreshTrigger }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await workoutsApi.getWorkouts({ limit: 100 });
      if (res.success) {
        setWorkouts(res.data);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [refreshTrigger]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this workout log?')) return;
    try {
      await workoutsApi.deleteWorkout(id);
      setWorkouts(workouts.filter((w) => w._id !== id));
    } catch (err) {
      alert(err.message || 'Error deleting workout');
    }
  };

  const filteredWorkouts = workouts.filter((w) => {
    const term = search.toLowerCase();
    const titleMatch = w.title.toLowerCase().includes(term);
    const exerciseMatch = w.exercises?.some((ex) => ex.name.toLowerCase().includes(term));
    return titleMatch || exerciseMatch;
  });

  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Workout Log & History</h1>
            <span className="badge badge-violet">{workouts.length} Sessions</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Comprehensive training log book with detailed exercise and set tracking
          </p>
        </div>

        <button
          id="btn-log-workout-page"
          className="btn btn-primary"
          onClick={() => onOpenWorkoutModal()}
        >
          <Plus size={16} strokeWidth={3} />
          <span>Record Workout</span>
        </button>
      </div>

      {/* Summary Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Total Sessions</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {workouts.length}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Total Volume Lifted</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', marginTop: '4px' }}>
            {totalVolume.toLocaleString()} kg
          </div>
        </div>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Total Calories</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {totalCalories.toLocaleString()} kcal
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input
          id="input-search-workouts"
          type="text"
          className="input-field"
          style={{ paddingLeft: '42px' }}
          placeholder="Search workouts or exercise name (e.g. Bench Press, Squat, Push Day)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Workouts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading workout history...
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <Dumbbell size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>No Workouts Found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {search ? 'Try clearing your search query.' : 'Click "Record Workout" to log your first session!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredWorkouts.map((workout) => {
            const isExpanded = expandedId === workout._id;
            const wDate = new Date(workout.date);
            const dateStr = wDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={workout._id}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  border: isExpanded ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                }}
                onClick={() => setExpandedId(isExpanded ? null : workout._id)}
              >
                {/* Summary Row */}
                <div style={{
                  padding: '18px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                    }}>
                      <CalendarCheck size={22} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          {workout.title}
                        </span>
                        {workout.plan && (
                          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                            {workout.plan.title}
                          </span>
                        )}
                        {workout.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title={`${workout.rating}/5 Intensity Rating`}>
                            {Array.from({ length: workout.rating }).map((_, i) => (
                              <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                        <Calendar size={13} />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges / Metrics */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#a78bfa' }}>
                        {(workout.totalVolumeKg || 0).toLocaleString()} kg
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Volume Lifted</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={14} />
                        {workout.caloriesBurned || 0} kcal
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{workout.durationMinutes || 0} mins</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={(e) => handleDelete(workout._id, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                        }}
                        title="Delete Workout"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div style={{ color: 'var(--text-dim)', padding: '4px' }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div style={{
                    padding: '16px 24px 22px',
                    borderTop: '1px solid var(--border-subtle)',
                    background: 'rgba(0, 0, 0, 0.2)',
                  }}>
                    {workout.notes && (
                      <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        marginBottom: '14px',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '6px',
                      }}>
                        "{workout.notes}"
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Exercises & Completed Sets ({workout.exercises?.length || 0})
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                        {workout.exercises?.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            style={{
                              background: 'var(--bg-glass)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              padding: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                {ex.name}
                              </span>
                              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                                {ex.targetMuscle}
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {ex.sets?.map((set, sIdx) => (
                                <div
                                  key={sIdx}
                                  style={{
                                    background: set.completed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                                    border: set.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    fontSize: '0.78rem',
                                    color: set.completed ? '#34d399' : 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <strong>Set {set.setNumber}:</strong> {set.weight}kg × {set.reps}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
