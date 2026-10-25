import express from 'express';
import { WorkoutLog, Measurement, User } from '../models/dbAdapter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/analytics/dashboard
// @desc    Get aggregated data tailored for Recharts visualizations
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch workouts & measurements concurrently
    const [workouts, measurements, user] = await Promise.all([
      WorkoutLog.find({ user: userId }).sort({ date: 1 }),
      Measurement.find({ user: userId }).sort({ date: 1 }),
      User.findById(userId),
    ]);

    // 1. Weight & Body Fat Progress for Line/Area Chart
    const weightProgressData = measurements.map((m) => {
      const d = new Date(m.date);
      return {
        id: m._id,
        rawDate: m.date,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: m.weightKg,
        bodyFat: m.bodyFatPercentage || null,
        targetWeight: user?.targetWeight || 75,
      };
    });

    // 2. Workout Volume & Calories Progression (per workout session)
    const workoutProgressionData = workouts.map((w) => {
      const d = new Date(w.date);
      return {
        id: w._id,
        rawDate: w.date,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        title: w.title,
        volume: w.totalVolumeKg || 0,
        calories: w.caloriesBurned || 0,
        duration: w.durationMinutes || 0,
      };
    });

    // 3. Muscle Group Frequency Distribution for Radar / Pie Chart
    const muscleMap = {
      Chest: 0,
      Back: 0,
      Legs: 0,
      Shoulders: 0,
      Biceps: 0,
      Triceps: 0,
      Core: 0,
      Cardio: 0,
    };

    workouts.forEach((w) => {
      if (w.exercises && w.exercises.length > 0) {
        w.exercises.forEach((ex) => {
          const muscle = ex.targetMuscle || 'Full Body';
          if (muscleMap[muscle] !== undefined) {
            muscleMap[muscle] += 1;
          } else {
            muscleMap[muscle] = (muscleMap[muscle] || 0) + 1;
          }
        });
      }
    });

    const muscleDistributionData = Object.entries(muscleMap)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({
        subject: name,
        workouts: count,
        fullMark: Math.max(...Object.values(muscleMap), 10),
      }));

    // 4. Weekly Day-of-week breakdown (last 4 weeks or all-time)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdayActivity = dayNames.map((day) => ({ day, count: 0, calories: 0 }));

    workouts.forEach((w) => {
      const dayIdx = new Date(w.date).getDay();
      weekdayActivity[dayIdx].count += 1;
      weekdayActivity[dayIdx].calories += w.caloriesBurned || 0;
    });

    // 5. Circumference Trends (Chest, Waist, Hips, Biceps, Thighs)
    const circumferenceData = measurements
      .filter((m) => m.chestCm || m.waistCm || m.hipsCm || m.bicepsCm)
      .map((m) => {
        const d = new Date(m.date);
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          chest: m.chestCm || null,
          waist: m.waistCm || null,
          hips: m.hipsCm || null,
          biceps: m.bicepsCm || null,
          thighs: m.thighsCm || null,
        };
      });

    // 6. Summary metrics
    const totalVolume = workouts.reduce((acc, w) => acc + (w.totalVolumeKg || 0), 0);
    const totalCalories = workouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);
    const latestMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;
    const initialMeasurement = measurements.length > 0 ? measurements[0] : null;

    res.json({
      success: true,
      stats: {
        totalWorkouts: workouts.length,
        totalVolumeKg: totalVolume,
        totalCaloriesBurned: totalCalories,
        currentWeightKg: latestMeasurement ? latestMeasurement.weightKg : user?.targetWeight || 75,
        targetWeightKg: user?.targetWeight || 75,
        weightDelta:
          latestMeasurement && initialMeasurement
            ? +(latestMeasurement.weightKg - initialMeasurement.weightKg).toFixed(1)
            : 0,
      },
      charts: {
        weightProgress: weightProgressData,
        workoutProgression: workoutProgressionData,
        muscleDistribution: muscleDistributionData,
        weekdayActivity,
        circumferenceTrends: circumferenceData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error aggregating dashboard analytics', error: error.message });
  }
});

export default router;
