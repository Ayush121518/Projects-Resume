import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    fitnessGoal: {
      type: String,
      enum: ['muscle_gain', 'fat_loss', 'maintenance', 'endurance', 'general_fitness'],
      default: 'muscle_gain',
    },
    targetWeight: {
      type: Number,
      default: 72,
    },
    height: {
      type: Number,
      default: 178, // in cm
    },
    units: {
      weight: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg',
      },
      measurement: {
        type: String,
        enum: ['cm', 'in'],
        default: 'cm',
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
