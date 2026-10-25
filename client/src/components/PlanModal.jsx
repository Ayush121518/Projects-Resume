import React, { useState, useEffect } from 'react';
import { plansApi } from '../api/plansApi.js';
import { X, Plus, Trash2, Dumbbell, Save } from 'lucide-react';

export const PlanModal = ({ isOpen, onClose, onPlanSaved, editPlan = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hypertrophy');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [days, setDays] = useState([
    {
      dayName: 'Day 1: Upper Body Focus',
      exercises: [
        { name: 'Barbell Bench Press', targetMuscle: 'Chest', sets: 4, reps: 8, targetWeight: 70, restSeconds: 90 },
        { name: 'Bent Over Row', targetMuscle: 'Back', sets: 4, reps: 8, targetWeight: 60, restSeconds: 90 },
      ],
    },
    {
      dayName: 'Day 2: Lower Body Focus',
      exercises: [
        { name: 'Barbell Back Squat', targetMuscle: 'Legs', sets: 4, reps: 8, targetWeight: 90, restSeconds: 120 },
        { name: 'Romanian Deadlift', targetMuscle: 'Legs', sets: 3, reps: 10, targetWeight: 75, restSeconds: 90 },
      ],
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editPlan) {
      setTitle(editPlan.title || '');
      setDescription(editPlan.description || '');
      setCategory(editPlan.category || 'Hypertrophy');
      setDifficulty(editPlan.difficulty || 'Intermediate');
      setDaysPerWeek(editPlan.daysPerWeek || 4);
      setDays(editPlan.days || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Hypertrophy');
      setDifficulty('Intermediate');
      setDaysPerWeek(4);
      setDays([
        {
          dayName: 'Day 1: Push (Chest, Shoulders, Triceps)',
          exercises: [
            { name: 'Barbell Bench Press', targetMuscle: 'Chest', sets: 4, reps: 8, targetWeight: 70, restSeconds: 90 },
            { name: 'Incline Dumbbell Press', targetMuscle: 'Chest', sets: 3, reps: 10, targetWeight: 24, restSeconds: 75 },
          ],
        },
        {
          dayName: 'Day 2: Pull (Back & Biceps)',
          exercises: [
            { name: 'Lat Pulldown', targetMuscle: 'Back', sets: 4, reps: 10, targetWeight: 55, restSeconds: 75 },
            { name: 'Barbell Curl', targetMuscle: 'Biceps', sets: 3, reps: 10, targetWeight: 28, restSeconds: 60 },
          ],
        },
      ]);
    }
  }, [editPlan, isOpen]);

  const handleAddDay = () => {
    setDays([
      ...days,
      {
        dayName: `Day ${days.length + 1}: Custom Focus`,
        exercises: [
          { name: 'Exercise 1', targetMuscle: 'Full Body', sets: 3, reps: 10, targetWeight: 20, restSeconds: 60 },
        ],
      },
    ]);
  };

  const handleRemoveDay = (dayIndex) => {
    setDays(days.filter((_, i) => i !== dayIndex));
  };

  const handleDayNameChange = (dayIndex, name) => {
    const updated = [...days];
    updated[dayIndex].dayName = name;
    setDays(updated);
  };

  const handleAddExerciseToDay = (dayIndex) => {
    const updated = [...days];
    updated[dayIndex].exercises.push({
      name: 'New Exercise',
      targetMuscle: 'Full Body',
      sets: 3,
      reps: 10,
      targetWeight: 20,
      restSeconds: 60,
    });
    setDays(updated);
  };

  const handleRemoveExerciseFromDay = (dayIndex, exIndex) => {
    const updated = [...days];
    updated[dayIndex].exercises = updated[dayIndex].exercises.filter((_, i) => i !== exIndex);
    setDays(updated);
  };

  const handleExerciseChange = (dayIndex, exIndex, field, value) => {
    const updated = [...days];
    updated[dayIndex].exercises[exIndex][field] =
      field === 'sets' || field === 'reps' || field === 'targetWeight' || field === 'restSeconds'
        ? Number(value)
        : value;
    setDays(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a plan title');
      return;
    }
    setError('');
    setSaving(true);

    try {
      const payload = {
        title,
        description,
        category,
        difficulty,
        daysPerWeek: Number(daysPerWeek),
        days,
      };

      if (editPlan && editPlan._id) {
        await plansApi.updatePlan(editPlan._id, payload);
      } else {
        await plansApi.createPlan(payload);
      }

      if (onPlanSaved) onPlanSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save plan');
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
        style={{ maxWidth: '800px' }}
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
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editPlan ? 'Edit Workout Plan' : 'Create Custom Workout Plan'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Configure multi-day split, exercises, target sets and reps
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

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label className="input-label">Plan Title *</label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Upper / Lower Hypertrophy Split"
                required
              />
            </div>
            <div>
              <label className="input-label">Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {['Hypertrophy', 'Strength', 'Cardio / HIIT', 'Weight Loss', 'Flexibility & Core'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">Difficulty</label>
              <select
                className="input-field"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="input-label">Description / Goal</label>
            <textarea
              className="input-field"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the philosophy and frequency of this routine..."
            />
          </div>

          {/* Days & Exercises Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Workout Days & Exercises</h4>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddDay}
              >
                <Plus size={14} /> Add Day
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    <input
                      type="text"
                      className="input-field"
                      value={day.dayName}
                      onChange={(e) => handleDayNameChange(dayIdx, e.target.value)}
                      placeholder="Day Name (e.g. Day 1: Chest & Triceps)"
                      style={{ fontWeight: 700, color: '#38bdf8' }}
                    />
                    {days.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(dayIdx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fb7185',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Day's Exercises */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {day.exercises.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.5fr 1fr 65px 65px 75px 30px',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          className="input-field"
                          value={ex.name}
                          onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'name', e.target.value)}
                          placeholder="Exercise Name"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        />
                        <select
                          className="input-field"
                          value={ex.targetMuscle}
                          onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'targetMuscle', e.target.value)}
                          style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                        >
                          {['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Full Body', 'Cardio'].map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          className="input-field"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'sets', e.target.value)}
                          placeholder="Sets"
                          title="Sets"
                          style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                        />
                        <input
                          type="number"
                          className="input-field"
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'reps', e.target.value)}
                          placeholder="Reps"
                          title="Reps"
                          style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                        />
                        <input
                          type="number"
                          className="input-field"
                          value={ex.targetWeight}
                          onChange={(e) => handleExerciseChange(dayIdx, exIdx, 'targetWeight', e.target.value)}
                          placeholder="Kg"
                          title="Target Weight (kg)"
                          style={{ padding: '6px 8px', fontSize: '0.85rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseFromDay(dayIdx, exIdx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddExerciseToDay(dayIdx)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: '6px',
                        color: 'var(--text-muted)',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '4px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <Plus size={13} /> Add Exercise
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
              id="btn-save-plan"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Workout Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
