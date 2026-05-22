import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Bell, BellOff } from 'lucide-react';

const TIMER_PRESETS = {
  focus: { label: 'Foco', minutes: 25 },
  shortBreak: { label: 'Pausa Curta', minutes: 5 },
  longBreak: { label: 'Pausa Longa', minutes: 15 },
};

export default function Timer() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const timerRef = useRef(null);

  const totalSeconds = TIMER_PRESETS[mode].minutes * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Circle dimensions
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  useEffect(() => {
    setTimeLeft(TIMER_PRESETS[mode].minutes * 60);
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            triggerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const triggerCompletion = () => {
    if (soundEnabled) {
      playZenChime();
    }
    // Switch to next mode naturally
    if (mode === 'focus') {
      setMode('shortBreak');
    } else {
      setMode('focus');
    }
  };

  const playZenChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Dual oscillators for a rich, harmonic bell tone
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5 (harmonic)

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4 (deep base)
      osc2.frequency.exponentialRampToValueAtTime(523.25, audioCtx.currentTime + 0.4);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 0.05); // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.0); // Release/Decay

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 2.0);
      osc2.stop(audioCtx.currentTime + 2.0);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked by browser', e);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_PRESETS[mode].minutes * 60);
  };

  const skipTimer = () => {
    setIsActive(false);
    triggerCompletion();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel glass-panel-hover p-8 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden">
      {/* Sound Toggle Icon */}
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)} 
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
        title={soundEnabled ? "Desativar som" : "Ativar som"}
      >
        {soundEnabled ? <Bell size={18} /> : <BellOff size={18} className="text-slate-600" />}
      </button>

      {/* Mode Switches */}
      <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 w-full max-w-sm mb-6 z-10">
        {Object.entries(TIMER_PRESETS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              mode === key
                ? 'bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Timer Circular Progress */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-56 h-56 transform -rotate-90">
          {/* Inner Glow circle (static) */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-slate-800/40 fill-transparent"
            strokeWidth="8"
          />
          {/* Outer active circle */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-purple-500/80 fill-transparent transition-all duration-300 ease-linear"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0px 0px 8px rgba(168, 85, 247, 0.5))'
            }}
          />
        </svg>

        {/* Numeric Display inside Circle */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tracking-wider text-white text-glow-purple">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs uppercase tracking-widest text-purple-300/60 mt-1 font-medium">
            {mode === 'focus' ? 'Foco total' : 'Relaxamento'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-6 mt-4 z-10">
        <button
          onClick={resetTimer}
          className="p-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
          title="Reiniciar"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={toggleTimer}
          className={`p-5 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg ${
            isActive
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
              : 'bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
          }`}
          title={isActive ? 'Pausar' : 'Iniciar'}
        >
          {isActive ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>

        <button
          onClick={skipTimer}
          className="p-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
          title="Pular"
        >
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}
