import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { Clock, CheckSquare, BookOpen, Volume2, VolumeX } from 'lucide-react-native';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [isNoisePlaying, setIsNoisePlaying] = useState(false);
  const [quote, setQuote] = useState('');
  const [greeting, setGreeting] = useState('');

  // Load background ocean loop
  const oceanPlayer = useAudioPlayer(require('./assets/ocean.mp3'), {
    loop: true,
  });

  // Load zen chime bell
  const chimePlayer = useAudioPlayer(require('./assets/chime.mp3'));

  // Initialize messages and volume settings
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
  }, []);

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
        return <Timer playChime={playChime} />;
      case 'tasks':
        return <Tasks />;
      case 'journal':
        return <Journal />;
      default:
        return <Timer playChime={playChime} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
      
      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        {/* Header Title Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>Zen Focus</Text>
            <Text style={styles.greetingText}>{greeting}, mente focada.</Text>
          </View>

          {/* Ocean noise control switch button */}
          <TouchableOpacity 
            onPress={toggleNoise}
            style={[
              styles.noiseToggle,
              isNoisePlaying ? styles.noiseToggleActive : styles.noiseToggleInactive
            ]}
            activeOpacity={0.8}
          >
            {isNoisePlaying ? (
              <>
                <Volume2 size={16} color="#2dd4bf" />
                <Text style={styles.noiseTextActive}>Ruído Zen: ON</Text>
              </>
            ) : (
              <>
                <VolumeX size={16} color="#64748b" />
                <Text style={styles.noiseTextInactive}>Ruído Zen: OFF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quote banner */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{quote}"</Text>
        </View>

        {/* Dynamic component rendering */}
        <View style={styles.componentWrapper}>
          {renderContent()}
        </View>
      </ScrollView>

      {/* Modern Bottom Float Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('timer')}
          style={[styles.navButton, activeTab === 'timer' && styles.navButtonActive]}
          activeOpacity={0.7}
        >
          <Clock size={20} color={activeTab === 'timer' ? '#a855f7' : '#94a3b8'} />
          <Text style={[styles.navText, activeTab === 'timer' && styles.navTextActive]}>Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('tasks')}
          style={[styles.navButton, activeTab === 'tasks' && styles.navButtonActive]}
          activeOpacity={0.7}
        >
          <CheckSquare size={20} color={activeTab === 'tasks' ? '#a855f7' : '#94a3b8'} />
          <Text style={[styles.navText, activeTab === 'tasks' && styles.navTextActive]}>Tarefas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('journal')}
          style={[styles.navButton, activeTab === 'journal' && styles.navButtonActive]}
          activeOpacity={0.7}
        >
          <BookOpen size={20} color={activeTab === 'journal' ? '#a855f7' : '#94a3b8'} />
          <Text style={[styles.navText, activeTab === 'journal' && styles.navTextActive]}>Diário</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
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
