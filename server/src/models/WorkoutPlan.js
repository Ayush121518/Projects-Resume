import mongoose from 'mongoose';

const exerciseTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  targetMuscle: {
    type: String,
    enum: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Full Body', 'Cardio'],
    default: 'Full Body',
  },
  sets: {
    type: Number,
    default: 3,
  },
  reps: {
    type: Number,
    default: 10,
  },
  targetWeight: {
    type: Number,
    default: 0,
  },
  restSeconds: {
    type: Number,
    default: 60,
  },
  notes: {
    type: String,
    default: '',
  },
});

const workoutDaySchema = new mongoose.Schema({
  dayName: {
    type: String,
    required: true,
    trim: true, // e.g. "Day 1: Chest & Triceps" or "Push Day"
  },
  exercises: [exerciseTemplateSchema],
});

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a workout plan title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Strength', 'Hypertrophy', 'Cardio / HIIT', 'Weight Loss', 'Flexibility & Core'],
      default: 'Hypertrophy',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    daysPerWeek: {
      type: Number,
      default: 4,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    days: [workoutDaySchema],
  },
  { timestamps: true }
);

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
