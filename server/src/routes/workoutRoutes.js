import express from 'express';
import { WorkoutLog } from '../models/dbAdapter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/workouts
// @desc    Get all logged workouts for current user
router.get('/', async (req, res) => {
  try {
    const { limit = 50, sort = '-date' } = req.query;
    const workouts = await WorkoutLog.find({ user: req.user._id })
      .populate('plan', 'title category')
      .sort(sort)
      .limit(parseInt(limit));

    res.json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving workout history', error: error.message });
  }
});

// @route   GET /api/workouts/streak
// @desc    Calculate workout streak and high-level summary
router.get('/stats/streak', async (req, res) => {
  try {
    const workouts = await WorkoutLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .select('date durationMinutes caloriesBurned totalVolumeKg');

    if (!workouts || workouts.length === 0) {
      return res.json({
        success: true,
        streakDays: 0,
        totalWorkouts: 0,
        totalVolumeKg: 0,
        totalCalories: 0,
        totalMinutes: 0,
      });
    }

    // Calculate totals
    const totalWorkouts = workouts.length;
    const totalVolumeKg = workouts.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalMinutes = workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

    // Calculate consecutive day streak
    const uniqueDates = [
      ...new Set(
        workouts.map((w) => new Date(w.date).toISOString().split('T')[0])
      ),
    ].sort().reverse();

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentCheck = uniqueDates[0] === today ? today : uniqueDates[0] === yesterday ? yesterday : null;

    if (currentCheck) {
      streak = 1;
      let checkDate = new Date(currentCheck);

      for (let i = 1; i < uniqueDates.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expected = checkDate.toISOString().split('T')[0];
        if (uniqueDates[i] === expected) {
          streak++;
        } else {
          break;
        }
      }
    }

    res.json({
      success: true,
      streakDays: streak,
      totalWorkouts,
      totalVolumeKg,
      totalCalories,
      totalMinutes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error computing streak', error: error.message });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout log
router.get('/:id', async (req, res) => {
  try {
    const workout = await WorkoutLog.findById(req.params.id).populate('plan', 'title category');
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving workout', error: error.message });
  }
});

// @route   POST /api/workouts
// @desc    Log a new workout
router.post('/', async (req, res) => {
  try {
    const { title, date, durationMinutes, caloriesBurned, exercises, notes, plan, rating } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Please provide workout title' });
    }

    const newWorkout = new WorkoutLog({
      user: req.user._id,
      title,
      plan: plan || null,
      date: date ? new Date(date) : new Date(),
      durationMinutes: durationMinutes !== undefined ? Number(durationMinutes) : 45,
      caloriesBurned: caloriesBurned !== undefined ? Number(caloriesBurned) : 320,
      rating: rating || 5,
      exercises: exercises || [],
      notes: notes || '',
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json({ success: true, data: savedWorkout });
  } catch (error) {
    res.status(500).json({ message: 'Error recording workout', error: error.message });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update a workout log
router.put('/:id', async (req, res) => {
  try {
    const workout = await WorkoutLog.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(workout, req.body);
    const updatedWorkout = await workout.save();

    res.json({ success: true, data: updatedWorkout });
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout', error: error.message });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout log
router.delete('/:id', async (req, res) => {
  try {
    const workout = await WorkoutLog.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await workout.deleteOne();
    res.json({ success: true, message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout', error: error.message });
  }
});

export default router;
