import express from 'express';
import { Measurement } from '../models/dbAdapter.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/measurements
// @desc    Get all measurement records for current user
router.get('/', async (req, res) => {
  try {
    const measurements = await Measurement.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, count: measurements.length, data: measurements });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving measurements', error: error.message });
  }
});

// @route   GET /api/measurements/summary
// @desc    Get baseline, latest, and net delta stats
router.get('/summary', async (req, res) => {
  try {
    const measurements = await Measurement.find({ user: req.user._id }).sort({ date: 1 });

    if (!measurements || measurements.length === 0) {
      return res.json({
        success: true,
        baseline: null,
        latest: null,
        weightDelta: 0,
        bodyFatDelta: 0,
      });
    }

    const baseline = measurements[0];
    const latest = measurements[measurements.length - 1];

    const weightDelta = +(latest.weightKg - baseline.weightKg).toFixed(1);
    const bodyFatDelta =
      latest.bodyFatPercentage && baseline.bodyFatPercentage
        ? +(latest.bodyFatPercentage - baseline.bodyFatPercentage).toFixed(1)
        : null;

    res.json({
      success: true,
      baseline,
      latest,
      weightDelta,
      bodyFatDelta,
      count: measurements.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error computing measurement summary', error: error.message });
  }
});

// @route   POST /api/measurements
// @desc    Add a new measurement entry
router.post('/', async (req, res) => {
  try {
    const {
      date,
      weightKg,
      bodyFatPercentage,
      chestCm,
      waistCm,
      hipsCm,
      bicepsCm,
      thighsCm,
      calvesCm,
      shouldersCm,
      notes,
    } = req.body;

    if (weightKg === undefined || weightKg === '') {
      return res.status(400).json({ message: 'Weight (kg) is required' });
    }

    const measurement = await Measurement.create({
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      weightKg: Number(weightKg),
      bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : null,
      chestCm: chestCm ? Number(chestCm) : null,
      waistCm: waistCm ? Number(waistCm) : null,
      hipsCm: hipsCm ? Number(hipsCm) : null,
      bicepsCm: bicepsCm ? Number(bicepsCm) : null,
      thighsCm: thighsCm ? Number(thighsCm) : null,
      calvesCm: calvesCm ? Number(calvesCm) : null,
      shouldersCm: shouldersCm ? Number(shouldersCm) : null,
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: measurement });
  } catch (error) {
    res.status(500).json({ message: 'Error saving measurement', error: error.message });
  }
});

// @route   PUT /api/measurements/:id
// @desc    Update measurement record
router.put('/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    if (measurement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Measurement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating measurement', error: error.message });
  }
});

// @route   DELETE /api/measurements/:id
// @desc    Delete measurement entry
router.delete('/:id', async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }

    if (measurement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await measurement.deleteOne();
    res.json({ success: true, message: 'Measurement record removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting measurement', error: error.message });
  }
});

export default router;
