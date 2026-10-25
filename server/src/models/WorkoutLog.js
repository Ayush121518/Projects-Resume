import mongoose from 'mongoose';

const setLogSchema = new mongoose.Schema({
  setNumber: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  reps: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: true,
  },
});

const exerciseLogSchema = new mongoose.Schema({
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
  sets: [setLogSchema],
  notes: {
    type: String,
    default: '',
  },
});

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Please provide a workout session title'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    caloriesBurned: {
      type: Number,
      default: 320,
    },
    totalVolumeKg: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number, // 1 to 5 stars
      min: 1,
      max: 5,
      default: 5,
    },
    exercises: [exerciseLogSchema],
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Calculate total volume before saving
workoutLogSchema.pre('save', function (next) {
  let volume = 0;
  if (this.exercises && this.exercises.length > 0) {
    this.exercises.forEach((ex) => {
      if (ex.sets && ex.sets.length > 0) {
        ex.sets.forEach((s) => {
          if (s.completed) {
            volume += (s.weight || 0) * (s.reps || 0);
          }
        });
      }
    });
  }
  this.totalVolumeKg = Math.round(volume);
  next();
});

export default mongoose.model('WorkoutLog', workoutLogSchema);
