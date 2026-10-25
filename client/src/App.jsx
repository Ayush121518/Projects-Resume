import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { WorkoutsPage } from './pages/WorkoutsPage.jsx';
import { PlansPage } from './pages/PlansPage.jsx';
import { MeasurementsPage } from './pages/MeasurementsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { WorkoutModal } from './components/WorkoutModal.jsx';
import { PlanModal } from './components/PlanModal.jsx';
import { MeasurementModal } from './components/MeasurementModal.jsx';
import { RestTimer } from './components/RestTimer.jsx';

function MainApp() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [selectedPlanForWorkout, setSelectedPlanForWorkout] = useState(null);

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);

  // Floating Rest Timer
  const [timerSeconds, setTimerSeconds] = useState(null);

  // Cross-page live data synchronization
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: '#34d399',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.2rem',
        fontWeight: 600,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: '#10b981',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <span>Starting FitTrack...</span>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleStartWorkoutWithPlan = (plan) => {
    setSelectedPlanForWorkout(plan);
    setWorkoutModalOpen(true);
  };

  const handleOpenPlanModal = (plan = null) => {
    setEditingPlan(plan);
    setPlanModalOpen(true);
  };

  const handleStartTimer = (seconds = 60) => {
    setTimerSeconds(seconds);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)', paddingBottom: '60px' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWorkoutModal={() => {
          setSelectedPlanForWorkout(null);
          setWorkoutModalOpen(true);
        }}
      />

      <main>
        {activeTab === 'dashboard' && (
          <DashboardPage
            setActiveTab={setActiveTab}
            refreshTrigger={refreshTrigger}
            onOpenWorkoutModal={() => {
              setSelectedPlanForWorkout(null);
              setWorkoutModalOpen(true);
            }}
            onOpenMeasurementModal={() => setMeasurementModalOpen(true)}
            onOpenPlanModal={() => handleOpenPlanModal(null)}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsPage
            refreshTrigger={refreshTrigger}
            onOpenWorkoutModal={() => {
              setSelectedPlanForWorkout(null);
              setWorkoutModalOpen(true);
            }}
          />
        )}

        {activeTab === 'plans' && (
          <PlansPage
            refreshTrigger={refreshTrigger}
            onOpenPlanModal={handleOpenPlanModal}
            onStartWorkoutWithPlan={handleStartWorkoutWithPlan}
          />
        )}

        {activeTab === 'measurements' && (
          <MeasurementsPage
            refreshTrigger={refreshTrigger}
            onOpenMeasurementModal={() => setMeasurementModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Global Workout Modal */}
      <WorkoutModal
        isOpen={workoutModalOpen}
        onClose={() => {
          setWorkoutModalOpen(false);
          setSelectedPlanForWorkout(null);
        }}
        initialPlan={selectedPlanForWorkout}
        onStartTimer={handleStartTimer}
        onWorkoutSaved={triggerRefresh}
      />

      {/* Global Workout Plan Modal */}
      <PlanModal
        isOpen={planModalOpen}
        onClose={() => {
          setPlanModalOpen(false);
          setEditingPlan(null);
        }}
        editPlan={editingPlan}
        onPlanSaved={triggerRefresh}
      />

      {/* Global Measurement Modal */}
      <MeasurementModal
        isOpen={measurementModalOpen}
        onClose={() => setMeasurementModalOpen(false)}
        onMeasurementSaved={triggerRefresh}
      />

      {/* Floating Rest Timer */}
      {timerSeconds !== null && (
        <RestTimer
          initialSeconds={timerSeconds}
          onClose={() => setTimerSeconds(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
