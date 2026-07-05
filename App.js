import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { Clock, CheckSquare, BookOpen, Volume2, VolumeX, Sun, Moon, Monitor } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import Journal from './components/Journal';

const FOCUS_QUOTES = [
  "O foco é a arte de dizer não a centenas de boas ideias.",
  "A simplicidade é o último grau da sofisticação.",
  "Sua mente é para ter ideias, não para guardá-las.",
  "A quietude da mente é o segredo de toda produtividade.",
  "Onde quer que você esteja, esteja lá por inteiro.",
  "Foque no processo, não apenas no resultado."
];

const themes = {
  dark: {
    background: '#0b0f19',
    cardBackground: '#151e33',
    cardBorder: '#273556',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: '#1e293b',
    presetBackground: '#090d16',
    presetActive: 'rgba(168, 85, 247, 0.12)',
    presetActiveBorder: 'rgba(168, 85, 247, 0.3)',
    presetTextActive: '#d8b4fe',
    inputBackground: '#0e1524',
    navBackground: '#151e33',
    navBorder: '#273556',
    navTextActive: '#ffffff',
    quoteCardBg: 'rgba(21, 30, 51, 0.4)',
    noiseToggleBgInactive: '#151e33',
    noiseToggleBorderInactive: '#273556',
    innerCircleStroke: '#1e293b',
    shadowColor: '#a855f7',
    secondaryButtonBg: '#0f172a',
    secondaryButtonBorder: '#334155',
    secondaryButtonIcon: '#cbd5e1',
    taskItemBg: 'rgba(9, 13, 22, 0.4)',
    textLight: '#cbd5e1',
    placeholder: '#64748b',
  },
  light: {
    background: '#f1f5f9',
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    border: '#cbd5e1',
    presetBackground: '#f8fafc',
    presetActive: 'rgba(168, 85, 247, 0.08)',
    presetActiveBorder: 'rgba(168, 85, 247, 0.2)',
    presetTextActive: '#a855f7',
    inputBackground: '#f8fafc',
    navBackground: '#ffffff',
    navBorder: '#e2e8f0',
    navTextActive: '#0f172a',
    quoteCardBg: 'rgba(168, 85, 247, 0.05)',
    noiseToggleBgInactive: '#ffffff',
    noiseToggleBorderInactive: '#cbd5e1',
    innerCircleStroke: '#cbd5e1',
    shadowColor: '#64748b',
    secondaryButtonBg: '#e2e8f0',
    secondaryButtonBorder: '#cbd5e1',
    secondaryButtonIcon: '#475569',
    taskItemBg: '#f8fafc',
    textLight: '#334155',
    placeholder: '#94a3b8',
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [isNoisePlaying, setIsNoisePlaying] = useState(false);
  const [quote, setQuote] = useState('');
  const [greeting, setGreeting] = useState('');
  const [themeMode, setThemeMode] = useState('auto'); // 'auto' | 'light' | 'dark'

  const systemColorScheme = useColorScheme();
  const currentTheme = themeMode === 'auto' ? (systemColorScheme || 'dark') : themeMode;
  const theme = themes[currentTheme];

  // Load background ocean loop
  const oceanPlayer = useAudioPlayer(require('./assets/ocean.mp3'), {
    loop: true,
  });

  // Load zen chime bell
  const chimePlayer = useAudioPlayer(require('./assets/chime.mp3'));

  // Initialize messages, volume settings and theme mode
  useEffect(() => {
    // Pick random quote
    const randomQuote = FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)];
    setQuote(randomQuote);

    // Set greeting based on hours
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    // Configure initial volumes
    oceanPlayer.volume = 0.4;
    chimePlayer.volume = 0.7;

    // Load saved theme mode
    const loadThemeMode = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('zen_theme_mode');
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme mode', error);
      }
    };
    loadThemeMode();
  }, []);

  const changeThemeMode = async (mode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('zen_theme_mode', mode);
    } catch (error) {
      console.error('Failed to save theme mode', error);
    }
  };

  const toggleNoise = () => {
    try {
      if (isNoisePlaying) {
        oceanPlayer.pause();
        setIsNoisePlaying(false);
      } else {
        oceanPlayer.play();
        setIsNoisePlaying(true);
      }
    } catch (error) {
      console.error('Error toggling ocean noise:', error);
    }
  };

  const playChime = () => {
    try {
      chimePlayer.seekTo(0);
      chimePlayer.play();
    } catch (error) {
      console.error('Error playing completion chime:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer playChime={playChime} theme={theme} />;
      case 'tasks':
        return <Tasks theme={theme} />;
      case 'journal':
        return <Journal theme={theme} />;
      default:
        return <Timer playChime={playChime} theme={theme} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />

        {/* Main Content Area */}
        <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
          {/* Header Title Bar */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.logoText, { color: theme.textPrimary }]}>Zen Focus</Text>
              <Text style={styles.greetingText}>{greeting}, mente focada.</Text>
            </View>

            {/* Theme Selector & Ocean noise control */}
            <View style={styles.headerControls}>
              <View style={[styles.themeSelector, { backgroundColor: theme.presetBackground, borderColor: theme.cardBorder }]}>
                <TouchableOpacity
                  onPress={() => changeThemeMode('auto')}
                  style={[styles.themePill, themeMode === 'auto' && { backgroundColor: theme.presetActive, borderColor: theme.presetActiveBorder }]}
                  activeOpacity={0.7}
                >
                  <Monitor size={14} color={themeMode === 'auto' ? '#a855f7' : theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => changeThemeMode('light')}
                  style={[styles.themePill, themeMode === 'light' && { backgroundColor: theme.presetActive, borderColor: theme.presetActiveBorder }]}
                  activeOpacity={0.7}
                >
                  <Sun size={14} color={themeMode === 'light' ? '#a855f7' : theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => changeThemeMode('dark')}
                  style={[styles.themePill, themeMode === 'dark' && { backgroundColor: theme.presetActive, borderColor: theme.presetActiveBorder }]}
                  activeOpacity={0.7}
                >
                  <Moon size={14} color={themeMode === 'dark' ? '#a855f7' : theme.textSecondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={toggleNoise}
                style={[
                  styles.noiseToggle,
                  isNoisePlaying
                    ? styles.noiseToggleActive
                    : [styles.noiseToggleInactive, { backgroundColor: theme.noiseToggleBgInactive, borderColor: theme.noiseToggleBorderInactive }]
                ]}
                activeOpacity={0.8}
              >
                {isNoisePlaying ? (
                  <>
                    <Volume2 size={16} color="#2dd4bf" />
                    <Text style={styles.noiseTextActive}>Zen: ON</Text>
                  </>
                ) : (
                  <>
                    <VolumeX size={16} color={theme.textSecondary} />
                    <Text style={[styles.noiseTextInactive, { color: theme.textSecondary }]}>Zen: OFF</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Quote banner */}
          <View style={[styles.quoteCard, { backgroundColor: theme.quoteCardBg }]}>
            <Text style={[styles.quoteText, { color: theme.textSecondary }]}>"{quote}"</Text>
          </View>

          {/* Dynamic component rendering */}
          <View style={styles.componentWrapper}>
            {renderContent()}
          </View>
        </ScrollView>

        {/* Modern Bottom Float Navigation Bar */}
        <View style={[styles.navBar, { backgroundColor: theme.navBackground, borderColor: theme.navBorder }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('timer')}
            style={[styles.navButton, activeTab === 'timer' && styles.navButtonActive]}
            activeOpacity={0.7}
          >
            <Clock size={20} color={activeTab === 'timer' ? '#a855f7' : theme.textSecondary} />
            <Text style={[styles.navText, { color: theme.textSecondary }, activeTab === 'timer' && [styles.navTextActive, { color: theme.navTextActive }]]}>Timer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('tasks')}
            style={[styles.navButton, activeTab === 'tasks' && styles.navButtonActive]}
            activeOpacity={0.7}
          >
            <CheckSquare size={20} color={activeTab === 'tasks' ? '#a855f7' : theme.textSecondary} />
            <Text style={[styles.navText, { color: theme.textSecondary }, activeTab === 'tasks' && [styles.navTextActive, { color: theme.navTextActive }]]}>Tarefas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('journal')}
            style={[styles.navButton, activeTab === 'journal' && styles.navButtonActive]}
            activeOpacity={0.7}
          >
            <BookOpen size={20} color={activeTab === 'journal' ? '#a855f7' : theme.textSecondary} />
            <Text style={[styles.navText, { color: theme.textSecondary }, activeTab === 'journal' && [styles.navTextActive, { color: theme.navTextActive }]]}>Diário</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // Space for navigation bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeSelector: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  themePill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  greetingText: {
    fontSize: 13,
    color: '#a855f7',
    fontWeight: '600',
    marginTop: 2,
  },
  noiseToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  noiseToggleInactive: {
    backgroundColor: '#151e33',
    borderColor: '#273556',
  },
  noiseToggleActive: {
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderColor: 'rgba(45, 212, 191, 0.3)',
  },
  noiseTextInactive: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  noiseTextActive: {
    fontSize: 11,
    color: '#2dd4bf',
    fontWeight: '700',
  },
  quoteCard: {
    backgroundColor: 'rgba(21, 30, 51, 0.4)',
    borderLeftWidth: 3,
    borderLeftColor: '#a855f7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94a3b8',
    lineHeight: 18,
  },
  componentWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  navBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#151e33',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#273556',
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  navButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 4,
  },
  navButtonActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  navText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
