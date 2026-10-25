import express from 'express';
import { WorkoutPlan } from '../models/dbAdapter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all plan routes
router.use(protect);

// @route   GET /api/workout-plans
// @desc    Get all workout plans for logged-in user + public system templates
router.get('/', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({
      $or: [{ user: req.user._id }, { isTemplate: true }],
    }).sort({ isTemplate: 1, createdAt: -1 });

    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving workout plans', error: error.message });
  }
});

// @route   GET /api/workout-plans/:id
// @desc    Get single workout plan by ID
router.get('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    // Ensure user owns it or it's a template
    const isOwner = plan.user && plan.user.toString() === req.user._id.toString();
    if (!isOwner && !plan.isTemplate) {
      return res.status(403).json({ message: 'Not authorized to access this plan' });
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving plan', error: error.message });
  }
});

// @route   POST /api/workout-plans
// @desc    Create a new workout plan
router.post('/', async (req, res) => {
  try {
    const { title, description, category, difficulty, daysPerWeek, days } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide a plan title' });
    }

    const newPlan = await WorkoutPlan.create({
      user: req.user._id,
      title,
      description: description || '',
      category: category || 'Hypertrophy',
      difficulty: difficulty || 'Intermediate',
      daysPerWeek: daysPerWeek || 4,
      isTemplate: false,
      days: days || [],
    });

    res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout plan', error: error.message });
  }
});

// @route   PUT /api/workout-plans/:id
// @desc    Update a workout plan
router.put('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    if (plan.isTemplate) {
      return res.status(403).json({ message: 'System templates cannot be modified directly. Use duplicate instead.' });
    }

    if (!plan.user || plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this plan' });
    }

    const updatedPlan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedPlan });
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout plan', error: error.message });
  }
});

// @route   DELETE /api/workout-plans/:id
// @desc    Delete a workout plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    if (plan.isTemplate) {
      return res.status(403).json({ message: 'System templates cannot be deleted' });
    }

    if (!plan.user || plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this plan' });
    }

    await plan.deleteOne();

    res.json({ success: true, message: 'Workout plan removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout plan', error: error.message });
  }
});

// @route   POST /api/workout-plans/:id/duplicate
// @desc    Duplicate a template plan into user's own editable plans
router.post('/:id/duplicate', async (req, res) => {
  try {
    const sourcePlan = await WorkoutPlan.findById(req.params.id);
    if (!sourcePlan) {
      return res.status(404).json({ message: 'Source workout plan not found' });
    }

    const clonedPlan = await WorkoutPlan.create({
      user: req.user._id,
      title: `${sourcePlan.title} (Custom)`,
      description: sourcePlan.description,
      category: sourcePlan.category,
      difficulty: sourcePlan.difficulty,
      daysPerWeek: sourcePlan.daysPerWeek,
      isTemplate: false,
      days: sourcePlan.days,
    });

    res.status(201).json({ success: true, data: clonedPlan });
  } catch (error) {
    res.status(500).json({ message: 'Error cloning workout plan', error: error.message });
  }
});

export default router;
