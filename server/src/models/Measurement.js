import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    weightKg: {
      type: Number,
      required: [true, 'Please provide weight in kg'],
    },
    bodyFatPercentage: {
      type: Number,
      default: null,
    },
    chestCm: {
      type: Number,
      default: null,
    },
    waistCm: {
      type: Number,
      default: null,
    },
    hipsCm: {
      type: Number,
      default: null,
    },
    bicepsCm: {
      type: Number,
      default: null,
    },
    thighsCm: {
      type: Number,
      default: null,
    },
    calvesCm: {
      type: Number,
      default: null,
    },
    shouldersCm: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Measurement', measurementSchema);
