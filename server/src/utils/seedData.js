import { WorkoutPlan, WorkoutLog, Measurement } from '../models/dbAdapter.js';

export const presetTemplates = [
  {
    title: 'Push Pull Legs (PPL) Split',
    description: 'Classic 3-to-6 day split targeting upper body push, upper body pull, and lower body.',
    category: 'Hypertrophy',
    difficulty: 'Intermediate',
    daysPerWeek: 6,
    isTemplate: true,
    days: [
      {
        dayName: 'Day 1: Push (Chest, Shoulders, Triceps)',
        exercises: [
          { name: 'Barbell Bench Press', targetMuscle: 'Chest', sets: 4, reps: 8, targetWeight: 75, restSeconds: 90 },
          { name: 'Incline Dumbbell Press', targetMuscle: 'Chest', sets: 3, reps: 10, targetWeight: 24, restSeconds: 75 },
          { name: 'Overhead Barbell Shoulder Press', targetMuscle: 'Shoulders', sets: 3, reps: 8, targetWeight: 45, restSeconds: 90 },
          { name: 'Dumbbell Lateral Raises', targetMuscle: 'Shoulders', sets: 4, reps: 12, targetWeight: 10, restSeconds: 60 },
          { name: 'Triceps Cable Rope Pushdown', targetMuscle: 'Triceps', sets: 3, reps: 12, targetWeight: 25, restSeconds: 60 },
          { name: 'Overhead Tricep Extension', targetMuscle: 'Triceps', sets: 3, reps: 12, targetWeight: 20, restSeconds: 60 },
        ],
      },
      {
        dayName: 'Day 2: Pull (Back, Biceps, Rear Delts)',
        exercises: [
          { name: 'Conventional Deadlift', targetMuscle: 'Back', sets: 3, reps: 6, targetWeight: 110, restSeconds: 120 },
          { name: 'Lat Pulldown', targetMuscle: 'Back', sets: 4, reps: 10, targetWeight: 55, restSeconds: 75 },
          { name: 'Barbell Bent Over Row', targetMuscle: 'Back', sets: 3, reps: 8, targetWeight: 60, restSeconds: 90 },
          { name: 'Face Pulls', targetMuscle: 'Shoulders', sets: 4, reps: 15, targetWeight: 20, restSeconds: 60 },
          { name: 'Barbell Bicep Curl', targetMuscle: 'Biceps', sets: 3, reps: 10, targetWeight: 28, restSeconds: 60 },
          { name: 'Incline Dumbbell Hammer Curl', targetMuscle: 'Biceps', sets: 3, reps: 12, targetWeight: 14, restSeconds: 60 },
        ],
      },
      {
        dayName: 'Day 3: Legs & Core',
        exercises: [
          { name: 'Barbell Back Squat', targetMuscle: 'Legs', sets: 4, reps: 8, targetWeight: 95, restSeconds: 120 },
          { name: 'Romanian Deadlift (RDL)', targetMuscle: 'Legs', sets: 3, reps: 10, targetWeight: 80, restSeconds: 90 },
          { name: 'Leg Press', targetMuscle: 'Legs', sets: 3, reps: 12, targetWeight: 160, restSeconds: 90 },
          { name: 'Standing Calf Raises', targetMuscle: 'Legs', sets: 4, reps: 15, targetWeight: 40, restSeconds: 60 },
          { name: 'Hanging Leg Raises', targetMuscle: 'Core', sets: 3, reps: 15, targetWeight: 0, restSeconds: 60 },
        ],
      },
    ],
  },
  {
    title: 'Upper / Lower Power Split',
    description: 'Heavy compound movements combined with accessory hypertrophy work for balanced strength.',
    category: 'Strength',
    difficulty: 'Advanced',
    daysPerWeek: 4,
    isTemplate: true,
    days: [
      {
        dayName: 'Upper Power Day',
        exercises: [
          { name: 'Flat Barbell Bench Press', targetMuscle: 'Chest', sets: 5, reps: 5, targetWeight: 85, restSeconds: 120 },
          { name: 'Weighted Pull-Ups', targetMuscle: 'Back', sets: 4, reps: 6, targetWeight: 10, restSeconds: 90 },
          { name: 'Standing Military Press', targetMuscle: 'Shoulders', sets: 4, reps: 6, targetWeight: 50, restSeconds: 90 },
          { name: 'Dumbbell Hammer Curls', targetMuscle: 'Biceps', sets: 3, reps: 8, targetWeight: 16, restSeconds: 60 },
        ],
      },
      {
        dayName: 'Lower Power Day',
        exercises: [
          { name: 'Heavy Barbell Squats', targetMuscle: 'Legs', sets: 5, reps: 5, targetWeight: 105, restSeconds: 150 },
          { name: 'Deadlifts', targetMuscle: 'Back', sets: 3, reps: 5, targetWeight: 130, restSeconds: 150 },
          { name: 'Hamstring Leg Curls', targetMuscle: 'Legs', sets: 4, reps: 10, targetWeight: 45, restSeconds: 75 },
          { name: 'Cable Crunches', targetMuscle: 'Core', sets: 4, reps: 15, targetWeight: 35, restSeconds: 60 },
        ],
      },
    ],
  },
  {
    title: 'HIIT Cardio & Athletic Conditioning',
    description: 'High energy metabolic conditioning designed to melt fat and enhance cardiovascular capacity.',
    category: 'Cardio / HIIT',
    difficulty: 'Beginner',
    daysPerWeek: 3,
    isTemplate: true,
    days: [
      {
        dayName: 'Full Body Torch',
        exercises: [
          { name: 'Kettlebell Swings', targetMuscle: 'Full Body', sets: 4, reps: 20, targetWeight: 16, restSeconds: 45 },
          { name: 'Burpees', targetMuscle: 'Full Body', sets: 4, reps: 15, targetWeight: 0, restSeconds: 45 },
          { name: 'Box Jumps', targetMuscle: 'Legs', sets: 4, reps: 12, targetWeight: 0, restSeconds: 45 },
          { name: 'Plank with Shoulder Taps', targetMuscle: 'Core', sets: 3, reps: 20, targetWeight: 0, restSeconds: 30 },
        ],
      },
    ],
  },
];

export const seedUserDataIfEmpty = async (userId, force = false) => {
  const existingWorkouts = await WorkoutLog.countDocuments({ user: userId });
  if (existingWorkouts > 0 && !force) return;

  console.log(`Seeding sample fitness data for user ${userId}...`);

  // 1. Seed user's custom copy of Push Pull Legs
  const samplePlan = await WorkoutPlan.create({
    user: userId,
    title: 'Push Pull Legs (PPL) Split',
    description: 'My main training split focused on progressive overload and aesthetic hypertrophy.',
    category: 'Hypertrophy',
    difficulty: 'Intermediate',
    daysPerWeek: 5,
    isTemplate: false,
    days: presetTemplates[0].days,
  });

  // 2. Seed 14 realistic past workout logs spread across the last 30 days
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const pastWorkoutsData = [
    {
      dayOffset: 28,
      title: 'Push Day A - Chest & Triceps',
      durationMinutes: 50,
      caloriesBurned: 380,
      exercises: [
        {
          name: 'Barbell Bench Press',
          targetMuscle: 'Chest',
          sets: [
            { setNumber: 1, weight: 65, reps: 10, completed: true },
            { setNumber: 2, weight: 70, reps: 8, completed: true },
            { setNumber: 3, weight: 70, reps: 8, completed: true },
          ],
        },
        {
          name: 'Incline Dumbbell Press',
          targetMuscle: 'Chest',
          sets: [
            { setNumber: 1, weight: 22, reps: 10, completed: true },
            { setNumber: 2, weight: 22, reps: 10, completed: true },
            { setNumber: 3, weight: 24, reps: 8, completed: true },
          ],
        },
        {
          name: 'Triceps Cable Pushdown',
          targetMuscle: 'Triceps',
          sets: [
            { setNumber: 1, weight: 20, reps: 12, completed: true },
            { setNumber: 2, weight: 22.5, reps: 12, completed: true },
          ],
        },
      ],
      notes: 'Felt great, warming up well before benching.',
    },
    {
      dayOffset: 26,
      title: 'Pull Day A - Back & Biceps',
      durationMinutes: 55,
      caloriesBurned: 410,
      exercises: [
        {
          name: 'Deadlifts',
          targetMuscle: 'Back',
          sets: [
            { setNumber: 1, weight: 100, reps: 6, completed: true },
            { setNumber: 2, weight: 105, reps: 6, completed: true },
            { setNumber: 3, weight: 110, reps: 5, completed: true },
          ],
        },
        {
          name: 'Lat Pulldowns',
          targetMuscle: 'Back',
          sets: [
            { setNumber: 1, weight: 50, reps: 10, completed: true },
            { setNumber: 2, weight: 55, reps: 10, completed: true },
          ],
        },
        {
          name: 'Barbell Bicep Curls',
          targetMuscle: 'Biceps',
          sets: [
            { setNumber: 1, weight: 25, reps: 10, completed: true },
            { setNumber: 2, weight: 27.5, reps: 8, completed: true },
          ],
        },
      ],
      notes: 'Strong deadlift grip today.',
    },
    {
      dayOffset: 24,
      title: 'Legs Day - Quad Focus',
      durationMinutes: 60,
      caloriesBurned: 450,
      exercises: [
        {
          name: 'Barbell Back Squat',
          targetMuscle: 'Legs',
          sets: [
            { setNumber: 1, weight: 85, reps: 8, completed: true },
            { setNumber: 2, weight: 90, reps: 8, completed: true },
            { setNumber: 3, weight: 95, reps: 6, completed: true },
          ],
        },
        {
          name: 'Leg Press',
          targetMuscle: 'Legs',
          sets: [
            { setNumber: 1, weight: 140, reps: 12, completed: true },
            { setNumber: 2, weight: 150, reps: 10, completed: true },
          ],
        },
        {
          name: 'Calf Raises',
          targetMuscle: 'Legs',
          sets: [{ setNumber: 1, weight: 35, reps: 15, completed: true }],
        },
      ],
      notes: 'Quads burned out on final squat dropset.',
    },
    {
      dayOffset: 21,
      title: 'Push Day B - Shoulders & Upper Chest',
      durationMinutes: 48,
      caloriesBurned: 360,
      exercises: [
        {
          name: 'Overhead Barbell Press',
          targetMuscle: 'Shoulders',
          sets: [
            { setNumber: 1, weight: 40, reps: 8, completed: true },
            { setNumber: 2, weight: 42.5, reps: 8, completed: true },
            { setNumber: 3, weight: 45, reps: 7, completed: true },
          ],
        },
        {
          name: 'Lateral Raises',
          targetMuscle: 'Shoulders',
          sets: [
            { setNumber: 1, weight: 10, reps: 12, completed: true },
            { setNumber: 2, weight: 10, reps: 12, completed: true },
          ],
        },
      ],
      notes: 'Shoulder pump was insane.',
    },
    {
      dayOffset: 18,
      title: 'Pull Day B - Lat Thickness & Rear Delts',
      durationMinutes: 52,
      caloriesBurned: 390,
      exercises: [
        {
          name: 'Barbell Bent Over Row',
          targetMuscle: 'Back',
          sets: [
            { setNumber: 1, weight: 55, reps: 10, completed: true },
            { setNumber: 2, weight: 60, reps: 8, completed: true },
          ],
        },
        {
          name: 'Face Pulls',
          targetMuscle: 'Shoulders',
          sets: [
            { setNumber: 1, weight: 20, reps: 15, completed: true },
            { setNumber: 2, weight: 22.5, reps: 15, completed: true },
          ],
        },
        {
          name: 'Dumbbell Hammer Curls',
          targetMuscle: 'Biceps',
          sets: [
            { setNumber: 1, weight: 14, reps: 10, completed: true },
            { setNumber: 2, weight: 16, reps: 8, completed: true },
          ],
        },
      ],
      notes: 'Great lat activation.',
    },
    {
      dayOffset: 15,
      title: 'Legs & Core Power',
      durationMinutes: 58,
      caloriesBurned: 430,
      exercises: [
        {
          name: 'Barbell Squat',
          targetMuscle: 'Legs',
          sets: [
            { setNumber: 1, weight: 90, reps: 8, completed: true },
            { setNumber: 2, weight: 95, reps: 8, completed: true },
          ],
        },
        {
          name: 'Romanian Deadlift',
          targetMuscle: 'Legs',
          sets: [
            { setNumber: 1, weight: 75, reps: 10, completed: true },
            { setNumber: 2, weight: 80, reps: 8, completed: true },
          ],
        },
        {
          name: 'Cable Crunches',
          targetMuscle: 'Core',
          sets: [{ setNumber: 1, weight: 30, reps: 15, completed: true }],
        },
      ],
      notes: 'Hamstrings felt worked.',
    },
    {
      dayOffset: 12,
      title: 'Push Heavy Session',
      durationMinutes: 54,
      caloriesBurned: 410,
      exercises: [
        {
          name: 'Barbell Bench Press',
          targetMuscle: 'Chest',
          sets: [
            { setNumber: 1, weight: 72.5, reps: 8, completed: true },
            { setNumber: 2, weight: 75, reps: 7, completed: true },
            { setNumber: 3, weight: 75, reps: 6, completed: true },
          ],
        },
        {
          name: 'Incline Dumbbell Press',
          targetMuscle: 'Chest',
          sets: [
            { setNumber: 1, weight: 24, reps: 10, completed: true },
            { setNumber: 2, weight: 26, reps: 8, completed: true },
          ],
        },
      ],
      notes: 'Hit 75kg on bench press for 7 clean reps!',
    },
    {
      dayOffset: 9,
      title: 'Pull Heavy Session',
      durationMinutes: 55,
      caloriesBurned: 420,
      exercises: [
        {
          name: 'Deadlifts',
          targetMuscle: 'Back',
          sets: [
            { setNumber: 1, weight: 110, reps: 6, completed: true },
            { setNumber: 2, weight: 115, reps: 5, completed: true },
          ],
        },
        {
          name: 'Lat Pulldowns',
          targetMuscle: 'Back',
          sets: [{ setNumber: 1, weight: 60, reps: 8, completed: true }],
        },
      ],
      notes: 'Good clean lockout on deadlifts.',
    },
    {
      dayOffset: 6,
      title: 'Legs Heavy Session',
      durationMinutes: 62,
      caloriesBurned: 470,
      exercises: [
        {
          name: 'Barbell Squat',
          targetMuscle: 'Legs',
          sets: [
            { setNumber: 1, weight: 95, reps: 8, completed: true },
            { setNumber: 2, weight: 100, reps: 6, completed: true },
          ],
        },
      ],
      notes: 'Broke 100kg squat plateau!',
    },
    {
      dayOffset: 4,
      title: 'Upper Hypertrophy Express',
      durationMinutes: 45,
      caloriesBurned: 350,
      exercises: [
        {
          name: 'Incline Dumbbell Press',
          targetMuscle: 'Chest',
          sets: [{ setNumber: 1, weight: 26, reps: 10, completed: true }],
        },
        {
          name: 'Pull-Ups',
          targetMuscle: 'Back',
          sets: [{ setNumber: 1, weight: 0, reps: 10, completed: true }],
        },
      ],
      notes: 'Fast paced tempo.',
    },
    {
      dayOffset: 2,
      title: 'Push Power & Arms Blast',
      durationMinutes: 52,
      caloriesBurned: 395,
      exercises: [
        {
          name: 'Barbell Bench Press',
          targetMuscle: 'Chest',
          sets: [
            { setNumber: 1, weight: 75, reps: 8, completed: true },
            { setNumber: 2, weight: 77.5, reps: 6, completed: true },
          ],
        },
        {
          name: 'Triceps Overhead Extension',
          targetMuscle: 'Triceps',
          sets: [{ setNumber: 1, weight: 22, reps: 12, completed: true }],
        },
      ],
      notes: 'Bench strength feeling rock solid.',
    },
    {
      dayOffset: 0,
      title: 'Pull & Core Session (Today)',
      durationMinutes: 50,
      caloriesBurned: 405,
      exercises: [
        {
          name: 'Conventional Deadlift',
          targetMuscle: 'Back',
          sets: [
            { setNumber: 1, weight: 115, reps: 5, completed: true },
            { setNumber: 2, weight: 120, reps: 4, completed: true },
          ],
        },
        {
          name: 'Cable Crunches',
          targetMuscle: 'Core',
          sets: [{ setNumber: 1, weight: 35, reps: 15, completed: true }],
        },
      ],
      notes: 'Hit 120kg PR! Feeling energized.',
    },
  ];

  for (const w of pastWorkoutsData) {
    const logDate = new Date(now - w.dayOffset * dayMs);
    const newLog = new WorkoutLog({
      user: userId,
      plan: samplePlan._id,
      title: w.title,
      date: logDate,
      durationMinutes: w.durationMinutes,
      caloriesBurned: w.caloriesBurned,
      rating: 5,
      exercises: w.exercises,
      notes: w.notes,
    });
    await newLog.save();
  }

  // 3. Seed 6 body measurements over the last 30 days showing progressive results
  const measurementsData = [
    {
      dayOffset: 30,
      weightKg: 78.5,
      bodyFatPercentage: 18.2,
      chestCm: 99,
      waistCm: 85,
      hipsCm: 98,
      bicepsCm: 34.5,
      thighsCm: 57,
      notes: 'Initial baseline weigh-in. Committing to consistency!',
    },
    {
      dayOffset: 24,
      weightKg: 77.8,
      bodyFatPercentage: 17.8,
      chestCm: 99.5,
      waistCm: 84.2,
      hipsCm: 97.5,
      bicepsCm: 35.0,
      thighsCm: 57.2,
      notes: 'First week completed, water weight dropping.',
    },
    {
      dayOffset: 18,
      weightKg: 77.1,
      bodyFatPercentage: 17.3,
      chestCm: 100.0,
      waistCm: 83.5,
      hipsCm: 97.0,
      bicepsCm: 35.2,
      thighsCm: 57.5,
      notes: 'Feeling leaner and waist circumference down by 1.5 cm.',
    },
    {
      dayOffset: 12,
      weightKg: 76.4,
      bodyFatPercentage: 16.8,
      chestCm: 100.5,
      waistCm: 82.8,
      hipsCm: 96.5,
      bicepsCm: 35.6,
      thighsCm: 57.8,
      notes: 'Chest and arms filling out nicely.',
    },
    {
      dayOffset: 6,
      weightKg: 75.8,
      bodyFatPercentage: 16.3,
      chestCm: 101.0,
      waistCm: 82.0,
      hipsCm: 96.0,
      bicepsCm: 36.0,
      thighsCm: 58.2,
      notes: 'Biceps reached 36cm! Definition noticeably sharper.',
    },
    {
      dayOffset: 0,
      weightKg: 75.2,
      bodyFatPercentage: 15.9,
      chestCm: 101.5,
      waistCm: 81.2,
      hipsCm: 95.5,
      bicepsCm: 36.4,
      thighsCm: 58.5,
      notes: '3.3kg down, body fat dropped by 2.3%, chest & arms expanded!',
    },
  ];

  for (const m of measurementsData) {
    const mDate = new Date(now - m.dayOffset * dayMs);
    await Measurement.create({
      user: userId,
      date: mDate,
      weightKg: m.weightKg,
      bodyFatPercentage: m.bodyFatPercentage,
      chestCm: m.chestCm,
      waistCm: m.waistCm,
      hipsCm: m.hipsCm,
      bicepsCm: m.bicepsCm,
      thighsCm: m.thighsCm,
      notes: m.notes,
    });
  }

  // 4. Ensure public system templates exist
  await seedSystemTemplates();

  console.log(`Seeding complete for user ${userId}.`);
};

export const seedSystemTemplates = async () => {
  try {
    for (const tpl of presetTemplates) {
      const existing = await WorkoutPlan.findOne({ title: tpl.title, isTemplate: true });
      if (!existing) {
        await WorkoutPlan.create({
          ...tpl,
          user: null,
        });
      }
    }
  } catch (err) {
    console.error('Error seeding system templates:', err.message);
  }
};
