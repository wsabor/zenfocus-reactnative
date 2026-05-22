import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookOpen, Calendar, Trash2 } from 'lucide-react-native';

const MOODS = [
  { emoji: '🌟', label: 'Inspirado', color: '#fbbf24' },
  { emoji: '⚡', label: 'Focado', color: '#a855f7' },
  { emoji: '🍃', label: 'Calmo', color: '#10b981' },
  { emoji: '🧩', label: 'Desafiado', color: '#3b82f6' },
  { emoji: '😴', label: 'Cansado', color: '#64748b' }
];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState('🍃');

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const saved = await AsyncStorage.getItem('zen_journal');
        if (saved) {
          setEntries(JSON.parse(saved));
        } else {
          const defaultEntries = [
            {
              id: '1',
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
              mood: '⚡',
              text: 'Produtividade excelente hoje. Consegui focar por 4 ciclos Pomodoro seguidos e organizar minhas tarefas do dia.'
            },
            {
              id: '2',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
              mood: '🍃',
              text: 'Dia mais tranquilo. Foquei na leitura e em organizar o escopo de novas ideias para o app Zen Focus.'
            }
          ];
          setEntries(defaultEntries);
          await AsyncStorage.setItem('zen_journal', JSON.stringify(defaultEntries));
        }
      } catch (e) {
        console.error('Failed to load journal entries', e);
      }
    };
    loadEntries();
  }, []);

  const saveEntries = async (newEntries) => {
    try {
      await AsyncStorage.setItem('zen_journal', JSON.stringify(newEntries));
    } catch (e) {
      console.error('Failed to save journal entries', e);
    }
  };

  const addEntry = () => {
    if (!text.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      mood: selectedMood,
      text: text.trim(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setText('');
    setSelectedMood('🍃');
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <BookOpen size={20} color="#a855f7" />
          <Text style={styles.title}>Reflexões & Intenções</Text>
        </View>
        <Text style={styles.subtitle}>Acompanhe sua mente</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Mood Picker */}
        <Text style={styles.sectionLabel}>Como você se sente agora?</Text>
        <View style={styles.moodContainer}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.emoji}
              onPress={() => setSelectedMood(mood.emoji)}
              style={[
                styles.moodButton,
                selectedMood === mood.emoji && styles.moodButtonActive,
                selectedMood === mood.emoji && { borderColor: mood.color + '40', backgroundColor: mood.color + '15' }
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[
                styles.moodLabel,
                selectedMood === mood.emoji && { color: '#ffffff', fontWeight: '600' }
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input box */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="O que está na sua mente hoje? Escreva suas intenções ou aprendizados..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={4}
          style={styles.textInput}
          textAlignVertical="top"
        />

        <TouchableOpacity
          onPress={addEntry}
          style={[styles.saveButton, !text.trim() && styles.saveButtonDisabled]}
          disabled={!text.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Registrar no Diário</Text>
        </TouchableOpacity>

        {/* Entry History */}
        <Text style={styles.sectionLabelHistory}>Registros Recentes</Text>
        {entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum registro no diário ainda.</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entryItem}>
              <View style={styles.entryHeader}>
                <View style={styles.entryMeta}>
                  <Text style={styles.entryEmoji}>{entry.mood}</Text>
                  <View style={styles.dateContainer}>
                    <Calendar size={12} color="#94a3b8" />
                    <Text style={styles.entryDate}>{entry.date}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => deleteEntry(entry.id)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Trash2 size={14} color="#ef4444" />
                </TouchableOpacity>
              </View>
              <Text style={styles.entryText}>{entry.text}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#151e33',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#273556',
    padding: 20,
    width: '100%',
    height: 440,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 11,
    color: '#94a3b8',
  },
  scrollContainer: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 8,
  },
  sectionLabelHistory: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 8,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 4,
  },
  moodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonActive: {
    borderColor: 'rgba(168, 85, 247, 0.4)',
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
  },
  moodEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  textInput: {
    minHeight: 80,
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    color: '#f8fafc',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  saveButton: {
    height: 40,
    backgroundColor: '#a855f7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  entryItem: {
    padding: 12,
    backgroundColor: 'rgba(9, 13, 22, 0.4)',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryEmoji: {
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  entryDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  deleteButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  entryText: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 16,
  },
});
