import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi.js';
import { workoutsApi } from '../api/workoutsApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { MetricCard } from '../components/MetricCard.jsx';
import { WeightProgressChart } from '../components/Charts/WeightProgressChart.jsx';
import { WorkoutVolumeChart } from '../components/Charts/WorkoutVolumeChart.jsx';
import { MuscleDistributionChart } from '../components/Charts/MuscleDistributionChart.jsx';
import { CircumferenceChart } from '../components/Charts/CircumferenceChart.jsx';
import { 
  Flame, 
  Dumbbell, 
  Scale, 
  Sparkles, 
  Plus, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const DashboardPage = ({
  onOpenWorkoutModal,
  onOpenMeasurementModal,
  onOpenPlanModal,
  setActiveTab,
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, streakRes] = await Promise.all([
        analyticsApi.getDashboardAnalytics(),
        workoutsApi.getStreakStats(),
      ]);

      if (dashRes.success) {
        setDashboardData(dashRes);
      }
      if (streakRes.success) {
        setStreakData(streakRes);
      }
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [refreshTrigger]);

  const stats = dashboardData?.stats;
  const charts = dashboardData?.charts;

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '28px 24px' }}>
      
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '28px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Athlete'}! 💪
            </h1>
            <span className="badge badge-emerald">Active Tracker</span>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Goal: <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>
              {user?.fitnessGoal ? user.fitnessGoal.replace('_', ' ') : 'Muscle Gain'}
            </strong> • Target: <strong style={{ color: '#10b981' }}>{user?.targetWeight || 75} kg</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="btn-dash-weighin"
            className="btn btn-secondary"
            onClick={onOpenMeasurementModal}
          >
            <Scale size={16} />
            <span>Record Weigh-in</span>
          </button>
          <button
            id="btn-dash-log-workout"
            className="btn btn-primary"
            onClick={() => onOpenWorkoutModal()}
          >
            <Plus size={16} strokeWidth={3} />
            <span>Log Workout</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '18px',
        marginBottom: '32px',
      }}>
        <MetricCard
          title="Active Streak"
          value={streakData?.streakDays || 0}
          unit="Days"
          subtitle={`${stats?.totalWorkouts || 0} Total Sessions Logged`}
          icon={Flame}
          color="#f59e0b"
          trend={streakData?.streakDays > 0 ? { value: 'On Fire!', isPositive: true } : null}
        />

        <MetricCard
          title="Total Volume Lifted"
          value={(stats?.totalVolumeKg || 0).toLocaleString()}
          unit="kg"
          subtitle="Cumulative Resistance Overload"
          icon={Dumbbell}
          color="#8b5cf6"
          trend={{ value: 'Overload Up', isPositive: true }}
        />

        <MetricCard
          title="Calories Burned"
          value={(stats?.totalCaloriesBurned || 0).toLocaleString()}
          unit="kcal"
          subtitle="Workout Energy Expenditure"
          icon={Sparkles}
          color="#06b6d4"
        />

        <MetricCard
          title="Current Weight"
          value={stats?.currentWeightKg || user?.targetWeight || 75}
          unit="kg"
          subtitle={`Target: ${stats?.targetWeightKg || 75} kg`}
          icon={Scale}
          color="#10b981"
          trend={stats?.weightDelta ? { value: `${stats.weightDelta > 0 ? '+' : ''}${stats.weightDelta} kg`, isPositive: stats.weightDelta <= 0 } : null}
        />
      </div>

      {/* Row 1 Charts: Weight Progress & Muscle Radar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1.2fr',
        gap: '24px',
        marginBottom: '28px',
      }} className="charts-split-row">
        <WeightProgressChart
          data={charts?.weightProgress || []}
          targetWeight={user?.targetWeight || 75}
        />
        <MuscleDistributionChart
          data={charts?.muscleDistribution || []}
        />
      </div>

      {/* Row 2 Charts: Workout Volume Progression & Body Circumferences */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1.2fr',
        gap: '24px',
        marginBottom: '32px',
      }} className="charts-split-row">
        <WorkoutVolumeChart
          data={charts?.workoutProgression || []}
        />
        <CircumferenceChart
          data={charts?.circumferenceTrends || []}
        />
      </div>

      {/* Quick Links Footer Bar */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981',
          }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Ready for your next workout?</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Choose from your saved plans or start a fresh custom session
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveTab('plans')}
          >
            <span>Browse Workout Plans</span>
            <ArrowRight size={15} />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onOpenWorkoutModal()}
          >
            <Plus size={15} />
            <span>Start Session Now</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .charts-split-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
