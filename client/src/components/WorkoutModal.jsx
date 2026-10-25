import React, { useState, useEffect } from 'react';
import { workoutsApi } from '../api/workoutsApi.js';
import { plansApi } from '../api/plansApi.js';
import confetti from 'canvas-confetti';
import { 
  X, 
  Plus, 
  Trash2, 
  Dumbbell, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Timer, 
  Sparkles,
  Layers,
  Star
} from 'lucide-react';

export const WorkoutModal = ({ isOpen, onClose, onWorkoutSaved, onStartTimer, initialPlan = null }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlan ? initialPlan._id : '');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [title, setTitle] = useState(initialPlan ? initialPlan.title : 'Strength & Hypertrophy Session');
  const [durationMinutes, setDurationMinutes] = useState(50);
  const [caloriesBurned, setCaloriesBurned] = useState(380);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    {
      name: 'Barbell Bench Press',
      targetMuscle: 'Chest',
      sets: [
        { setNumber: 1, weight: 60, reps: 10, completed: true },
        { setNumber: 2, weight: 70, reps: 8, completed: true },
        { setNumber: 3, weight: 75, reps: 6, completed: true },
      ],
    },
    {
      name: 'Incline Dumbbell Press',
      targetMuscle: 'Chest',
      sets: [
        { setNumber: 1, weight: 22, reps: 10, completed: true },
        { setNumber: 2, weight: 24, reps: 8, completed: true },
      ],
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const applyPlanDayExercises = (plan, dayIndex = 0) => {
    if (!plan || !plan.days || plan.days.length === 0) return;
    const targetDay = plan.days[dayIndex] || plan.days[0];
    if (targetDay && targetDay.exercises && targetDay.exercises.length > 0) {
      const mappedExercises = targetDay.exercises.map((ex) => ({
        name: ex.name,
        targetMuscle: ex.targetMuscle || 'Full Body',
        sets: Array.from({ length: ex.sets || 3 }, (_, idx) => ({
          setNumber: idx + 1,
          weight: ex.targetWeight || 0,
          reps: ex.reps || 10,
          completed: true,
        })),
      }));
      setExercises(mappedExercises);
    }
  };

  // Fetch available workout plans for autofill
  useEffect(() => {
    if (isOpen) {
      plansApi.getPlans().then((res) => {
        if (res.success) setPlans(res.data);
      }).catch(console.error);
    }
  }, [isOpen]);

  // When initialPlan changes
  useEffect(() => {
    if (initialPlan) {
      setSelectedPlanId(initialPlan._id);
      setTitle(initialPlan.title);
      setSelectedDayIndex(0);
      applyPlanDayExercises(initialPlan, 0);
    }
  }, [initialPlan]);

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    setSelectedDayIndex(0);
    if (!planId) return;
    const plan = plans.find((p) => p._id === planId);
    if (plan) {
      setTitle(plan.title);
      applyPlanDayExercises(plan, 0);
    }
  };

  const handleDayChange = (dayIdx) => {
    setSelectedDayIndex(dayIdx);
    const plan = plans.find((p) => p._id === selectedPlanId) || (initialPlan?._id === selectedPlanId ? initialPlan : null);
    if (plan) {
      applyPlanDayExercises(plan, dayIdx);
    }
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        name: 'New Exercise',
        targetMuscle: 'Full Body',
        sets: [
          { setNumber: 1, weight: 20, reps: 10, completed: true },
          { setNumber: 2, weight: 20, reps: 10, completed: true },
          { setNumber: 3, weight: 20, reps: 10, completed: true },
        ],
      },
    ]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleAddSet = (exerciseIndex) => {
    const updated = [...exercises];
    const targetEx = updated[exerciseIndex];
    const lastSet = targetEx.sets[targetEx.sets.length - 1];
    targetEx.sets.push({
      setNumber: targetEx.sets.length + 1,
      weight: lastSet ? lastSet.weight : 20,
      reps: lastSet ? lastSet.reps : 10,
      completed: true,
    });
    setExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets
      .filter((_, i) => i !== setIndex)
      .map((set, idx) => ({ ...set, setNumber: idx + 1 }));
    setExercises(updated);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] =
      field === 'completed' ? value : Number(value);
    setExercises(updated);
    if (field === 'completed' && value === true && onStartTimer) {
      onStartTimer(60);
    }
  };

  // Compute live total volume
  const liveVolume = exercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((sAcc, set) => {
        return sAcc + (set.completed ? (set.weight || 0) * (set.reps || 0) : 0);
      }, 0)
    );
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a workout title');
      return;
    }
    setError('');
    setSaving(true);

    try {
      const payload = {
        title,
        plan: selectedPlanId || null,
        durationMinutes: Number(durationMinutes),
        caloriesBurned: Number(caloriesBurned),
        rating: Number(rating),
        exercises,
        notes,
      };

      await workoutsApi.logWorkout(payload);

      // Trigger celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#fbbf24'],
        });
      } catch {
        // Confetti unsupported or skipped
      }

      if (onWorkoutSaved) onWorkoutSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save workout');
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
        style={{ maxWidth: '780px' }}
      >
        {/* Header */}
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
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#051410',
            }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Record Workout Session</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Log sets, weights, reps, and track progressive overload
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

        {/* Form Body */}
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

          {/* Plan selection & title */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label className="input-label">Load From Plan (Optional)</label>
              <select
                className="input-field"
                value={selectedPlanId}
                onChange={(e) => handlePlanSelect(e.target.value)}
              >
                <option value="">-- Custom / No Plan --</option>
                {plans.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} {p.isTemplate ? '(Template)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Workout Session Title *</label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Push Day - Chest & Triceps"
                required
              />
            </div>
          </div>

          {/* Routine Day Split Selector for multi-day plans */}
          {(() => {
            const activePlan = plans.find((p) => p._id === selectedPlanId) || (initialPlan?._id === selectedPlanId ? initialPlan : null);
            if (!activePlan || !activePlan.days || activePlan.days.length <= 1) return null;
            return (
              <div style={{
                marginBottom: '18px',
                padding: '12px 14px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
              }}>
                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                  <Layers size={14} /> Training Split Routine Day
                </label>
                <select
                  className="input-field"
                  value={selectedDayIndex}
                  onChange={(e) => handleDayChange(Number(e.target.value))}
                  style={{ marginTop: '4px' }}
                >
                  {activePlan.days.map((day, idx) => (
                    <option key={idx} value={idx}>
                      {day.dayName || `Day ${idx + 1}`} ({day.exercises?.length || 0} exercises)
                    </option>
                  ))}
                </select>
              </div>
            );
          })()}

          {/* Stats Bar (Duration, Calories, Live Volume) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
            background: 'var(--bg-glass)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div>
              <span className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} color="#06b6d4" /> Duration (mins)
              </span>
              <input
                type="number"
                className="input-field"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                min="5"
                max="300"
              />
            </div>
            <div>
              <span className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Flame size={14} color="#f59e0b" /> Calories Burned
              </span>
              <input
                type="number"
                className="input-field"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                min="0"
                max="3000"
              />
            </div>
            <div>
              <span className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={14} color="#10b981" /> Live Volume
              </span>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#10b981',
                fontFamily: 'var(--font-heading)',
                padding: '6px 0',
              }}>
                {liveVolume.toLocaleString()} kg
              </div>
            </div>
          </div>

          {/* Exercises & Sets List */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={18} color="#a78bfa" /> Exercises & Sets
              </h4>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddExercise}
                style={{ fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add Exercise
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {exercises.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: '10px',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <input
                      type="text"
                      className="input-field"
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(exIdx, 'name', e.target.value)}
                      placeholder="Exercise Name (e.g. Barbell Squat)"
                      style={{ fontWeight: 600 }}
                    />
                    <select
                      className="input-field"
                      value={ex.targetMuscle}
                      onChange={(e) => handleExerciseChange(exIdx, 'targetMuscle', e.target.value)}
                      style={{ width: '130px', fontSize: '0.85rem' }}
                    >
                      {['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Full Body', 'Cardio'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(exIdx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fb7185',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Sets Sub-table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 1fr 1fr 60px 40px',
                      gap: '8px',
                      fontSize: '0.75rem',
                      color: 'var(--text-dim)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      paddingLeft: '4px',
                    }}>
                      <span>Set</span>
                      <span>Weight (kg)</span>
                      <span>Reps</span>
                      <span>Done</span>
                      <span></span>
                    </div>

                    {ex.sets.map((set, setIdx) => (
                      <div
                        key={setIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '50px 1fr 1fr 60px 40px',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>
                          #{set.setNumber}
                        </span>
                        <input
                          type="number"
                          step="0.5"
                          className="input-field"
                          value={set.weight}
                          onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                          placeholder="kg"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        />
                        <input
                          type="number"
                          className="input-field"
                          value={set.reps}
                          onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', e.target.value)}
                          placeholder="reps"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <input
                            type="checkbox"
                            checked={set.completed}
                            onChange={(e) => {
                              handleSetChange(exIdx, setIdx, 'completed', e.target.checked);
                              if (e.target.checked && onStartTimer) {
                                onStartTimer(60);
                              }
                            }}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              accentColor: '#10b981',
                            }}
                          />
                        </div>
                        {ex.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-dim)',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleAddSet(exIdx)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px dashed var(--border-subtle)',
                          borderRadius: '6px',
                          color: 'var(--text-muted)',
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Plus size={12} /> Add Set
                      </button>

                      {onStartTimer && (
                        <button
                          type="button"
                          onClick={() => onStartTimer(60)}
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            borderRadius: '6px',
                            color: '#34d399',
                            padding: '4px 10px',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Timer size={12} /> 60s Rest Timer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Rating */}
          <div style={{ marginBottom: '18px' }}>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} color="#f59e0b" /> Session Intensity & Rating
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setRating(starVal)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                >
                  <Star
                    size={22}
                    fill={starVal <= rating ? '#f59e0b' : 'transparent'}
                    color={starVal <= rating ? '#f59e0b' : 'var(--text-dim)'}
                  />
                </button>
              ))}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 600 }}>
                {rating === 5 ? '5/5 - Outstanding workout!' :
                 rating === 4 ? '4/5 - Strong session!' :
                 rating === 3 ? '3/5 - Solid effort' :
                 rating === 2 ? '2/5 - Tough day' :
                 '1/5 - Low energy'}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label className="input-label">Workout Notes / Reflections</label>
            <textarea
              className="input-field"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Felt great on bench press, increased weight by 2.5kg..."
            />
          </div>

          {/* Footer Actions */}
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
              id="btn-save-workout"
            >
              <CheckCircle2 size={16} />
              <span>{saving ? 'Saving...' : 'Save & Finish Workout'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
