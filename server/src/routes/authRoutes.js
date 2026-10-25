import express from 'express';
import { User } from '../models/dbAdapter.js';
import { protect, generateToken } from '../middleware/auth.js';
import { seedUserDataIfEmpty } from '../utils/seedData.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, targetWeight, height, fitnessGoal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      targetWeight: targetWeight || 72,
      height: height || 178,
      fitnessGoal: fitnessGoal || 'muscle_gain',
    });

    // Seed realistic starter templates and history for this user
    await seedUserDataIfEmpty(user._id);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        fitnessGoal: user.fitnessGoal,
        targetWeight: user.targetWeight,
        height: user.height,
        units: user.units,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        fitnessGoal: user.fitnessGoal,
        targetWeight: user.targetWeight,
        height: user.height,
        units: user.units,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/demo
// @desc    1-Click Demo Login with seeded data
router.post('/demo', async (req, res) => {
  try {
    const demoEmail = 'alex.fit@fittrack.dev';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Johnson',
        email: demoEmail,
        password: 'Password123!',
        targetWeight: 75,
        height: 180,
        fitnessGoal: 'muscle_gain',
      });
      await seedUserDataIfEmpty(demoUser._id, true);
    }

    res.json({
      success: true,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        fitnessGoal: demoUser.fitnessGoal,
        targetWeight: demoUser.targetWeight,
        height: demoUser.height,
        units: demoUser.units,
      },
      token: generateToken(demoUser._id),
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ message: 'Server error during demo login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile & goals
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, targetWeight, height, fitnessGoal, units } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (targetWeight !== undefined) user.targetWeight = Number(targetWeight);
    if (height !== undefined) user.height = Number(height);
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;
    if (units) user.units = { ...user.units, ...units };

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        fitnessGoal: updatedUser.fitnessGoal,
        targetWeight: updatedUser.targetWeight,
        height: updatedUser.height,
        units: updatedUser.units,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
});

export default router;
