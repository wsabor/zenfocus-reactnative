import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Play, Pause, RotateCcw, SkipForward, Bell, BellOff } from 'lucide-react-native';

const TIMER_PRESETS = {
  focus: { label: 'Foco', minutes: 25 },
  shortBreak: { label: 'Pausa Curta', minutes: 5 },
  longBreak: { label: 'Pausa Longa', minutes: 15 },
};

export default function Timer({ playChime, theme }) {
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
    if (soundEnabled && playChime) {
      playChime();
    }
    // Switch to next mode naturally
    if (mode === 'focus') {
      setMode('shortBreak');
    } else {
      setMode('focus');
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
    <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder, shadowColor: theme.shadowColor }]}>
      {/* Card Header with Title and Sound Toggle */}
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Temporizador</Text>
        <TouchableOpacity 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          onPress={() => setSoundEnabled(!soundEnabled)}
          style={styles.soundButton}
          activeOpacity={0.7}
        >
          {soundEnabled ? (
            <Bell size={18} color={theme.textSecondary} />
          ) : (
            <BellOff size={18} color={theme.textMuted} />
          )}
        </TouchableOpacity>
      </View>

      {/* Mode Switches */}
      <View style={[styles.presetsContainer, { backgroundColor: theme.presetBackground, borderColor: theme.border }]}>
        {Object.entries(TIMER_PRESETS).map(([key, config]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setMode(key)}
            style={[
              styles.presetButton,
              mode === key && [styles.presetButtonActive, { backgroundColor: theme.presetActive, borderColor: theme.presetActiveBorder }]
            ]}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.presetText,
              { color: theme.textSecondary },
              mode === key && [styles.presetTextActive, { color: theme.presetTextActive }]
            ]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Circular Progress */}
      <View style={styles.timerCircleContainer}>
        <Svg width="220" height="220" style={styles.svgContainer}>
          {/* Inner static circle */}
          <Circle
            cx="110"
            cy="110"
            r={radius}
            stroke={theme.innerCircleStroke}
            strokeWidth="8"
            fill="transparent"
          />
          {/* Outer active circle */}
          <Circle
            cx="110"
            cy="110"
            r={radius}
            stroke="#a855f7"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>

        {/* Numeric Display inside Circle */}
        <View style={styles.timeTextContainer}>
          <Text style={[styles.timeText, { color: theme.textPrimary }]}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={[styles.modeText, { color: theme.textSecondary }]}>
            {mode === 'focus' ? 'Foco total' : 'Relaxamento'}
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={resetTimer}
          style={[styles.secondaryButton, { backgroundColor: theme.secondaryButtonBg, borderColor: theme.secondaryButtonBorder }]}
          activeOpacity={0.7}
        >
          <RotateCcw size={20} color={theme.secondaryButtonIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTimer}
          style={[
            styles.playButton,
            isActive ? styles.playButtonActive : styles.playButtonPaused
          ]}
          activeOpacity={0.8}
        >
          {isActive ? (
            <Pause size={32} color="#f87171" />
          ) : (
            <Play size={32} color="#2dd4bf" style={styles.playIconOffset} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={skipTimer}
          style={[styles.secondaryButton, { backgroundColor: theme.secondaryButtonBg, borderColor: theme.secondaryButtonBorder }]}
          activeOpacity={0.7}
        >
          <SkipForward size={20} color={theme.secondaryButtonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151e33',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#273556',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  soundButton: {
    padding: 6,
  },
  presetsContainer: {
    flexDirection: 'row',
    backgroundColor: '#090d16',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 4,
    width: '100%',
    marginBottom: 24,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  presetTextActive: {
    color: '#d8b4fe',
  },
  timerCircleContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  svgContainer: {
    transform: [{ rotate: '-90deg' }],
  },
  timeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: 'rgba(216, 180, 254, 0.6)',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 20,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  playButtonPaused: {
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    borderColor: 'rgba(45, 212, 191, 0.4)',
  },
  playButtonActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  playIconOffset: {
    marginLeft: 4,
  },
});
