import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Plus, Minus, Bell } from 'lucide-react';

export const RestTimer = ({ initialSeconds = 60, onClose }) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      // Play a subtle sound and haptic cue if supported
      try {
        navigator.vibrate?.([200, 100, 200]);
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch {
        // AudioContext not allowed or unsupported
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setSecondsLeft(totalSeconds);
    setIsActive(true);
    setIsFinished(false);
  };

  const adjustTime = (delta) => {
    setSecondsLeft((prev) => Math.max(5, prev + delta));
    setTotalSeconds((prev) => Math.max(5, prev + delta));
  };

  const progressPct = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        background: '#131929',
        border: '1px solid var(--accent-emerald)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px 20px',
        boxShadow: '0 10px 35px rgba(0,0,0,0.7), 0 0 25px rgba(16, 185, 129, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        animation: 'scaleUp 0.2s ease-out',
      }}
    >
      <div style={{ position: 'relative', width: '48px', height: '48px' }}>
        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke={isFinished ? '#f43f5e' : '#10b981'}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * progressPct) / 100}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFinished ? '#f43f5e' : '#10b981',
          }}
        >
          {isFinished ? <Bell size={18} className="pulse-glow" /> : <Timer size={18} />}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isFinished ? 'Rest Over - Next Set!' : 'Rest Interval'}
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: isFinished ? '#fb7185' : '#ffffff' }}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => adjustTime(-15)}
          className="btn btn-secondary btn-sm"
          title="-15s"
          style={{ padding: '4px 8px' }}
        >
          <Minus size={14} />
        </button>
        <button
          onClick={toggleTimer}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 12px' }}
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          onClick={() => adjustTime(30)}
          className="btn btn-secondary btn-sm"
          title="+30s"
          style={{ padding: '4px 8px' }}
        >
          <Plus size={14} />
        </button>
        <button
          onClick={resetTimer}
          className="btn btn-secondary btn-sm"
          title="Reset"
          style={{ padding: '4px 8px' }}
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '4px',
            marginLeft: '4px',
          }}
          title="Close Timer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
