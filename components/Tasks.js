import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react-native';

const PRIORITY_META = {
  low: { label: 'Baixa', activeStyle: 'priorityLowActive', textStyle: 'priorityLowText', borderClass: '#10b981' },
  medium: { label: 'Média', activeStyle: 'priorityMediumActive', textStyle: 'priorityMediumText', borderClass: '#f59e0b' },
  high: { label: 'Alta', activeStyle: 'priorityHighActive', textStyle: 'priorityHighText', borderClass: '#f43f5e' },
};

export default function Tasks({ theme }) {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem('zen_tasks');
        if (saved) {
          setTasks(JSON.parse(saved));
        } else {
          const defaultTasks = [
            { id: '1', text: 'Concluir leitura de documentação', completed: false, priority: 'medium' },
            { id: '2', text: 'Praticar 15 minutos de meditação diária', completed: true, priority: 'low' },
            { id: '3', text: 'Desenvolver protótipo em React Native', completed: false, priority: 'high' }
          ];
          setTasks(defaultTasks);
          await AsyncStorage.setItem('zen_tasks', JSON.stringify(defaultTasks));
        }
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    };
    loadTasks();
  }, []);

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('zen_tasks', JSON.stringify(newTasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  };

  const addTask = () => {
    if (!inputText.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      priority,
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setInputText('');
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder, shadowColor: theme.shadowColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Foco de Hoje</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {tasks.filter(t => !t.completed).length} pendente(s)
        </Text>
      </View>

      {/* Add Task Input Form */}
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Adicionar nova tarefa..."
          placeholderTextColor={theme.placeholder}
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.textPrimary }]}
        />
        <TouchableOpacity
          onPress={addTask}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#a855f7" />
        </TouchableOpacity>
      </View>

      {/* Priority Selection Pills */}
      <View style={styles.prioritySelector}>
        <Text style={[styles.priorityLabel, { color: theme.textSecondary }]}>Prioridade:</Text>
        <View style={styles.pillsContainer}>
          {Object.entries(PRIORITY_META).map(([key, meta]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setPriority(key)}
              style={[
                styles.pill,
                { backgroundColor: theme.inputBackground, borderColor: theme.border },
                priority === key && styles[meta.activeStyle]
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.pillText,
                styles[meta.textStyle]
              ]}>
                {meta.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filters bar */}
      <View style={[styles.filtersBar, { borderBottomColor: theme.border }]}>
        {['all', 'active', 'completed'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterButton,
              filter === f && [styles.filterButtonActive, { backgroundColor: theme.border }]
            ]}
          >
            <Text style={[
              styles.filterText,
              { color: theme.textMuted },
              filter === f && [styles.filterTextActive, { color: theme.presetTextActive }]
            ]}>
              {f === 'all' ? 'Tudo' : f === 'active' ? 'Ativas' : 'Concluídas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list container */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Nenhuma tarefa encontrada.</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskItem,
                { backgroundColor: theme.taskItemBg },
                task.completed 
                  ? [styles.taskItemCompleted, { borderColor: theme.border }] 
                  : [styles.taskItemActive, { borderColor: theme.border }]
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleTask(task.id)}
                style={styles.checkboxContainer}
                activeOpacity={0.7}
              >
                {task.completed ? (
                  <CheckCircle2 size={20} color="#2dd4bf" />
                ) : (
                  <Circle size={20} color={theme.textMuted} />
                )}
              </TouchableOpacity>

              <Text
                style={[
                  styles.taskText,
                  { color: theme.textPrimary },
                  task.completed && [styles.taskTextCompleted, { color: theme.textMuted }]
                ]}
                numberOfLines={2}
              >
                {task.text}
              </Text>

              <View style={task.completed ? { opacity: 0.5 } : styles.taskMeta}>
                <View style={[
                  styles.priorityTag,
                  { borderColor: PRIORITY_META[task.priority].borderClass + '30', backgroundColor: PRIORITY_META[task.priority].borderClass + '10' }
                ]}>
                  <Text style={[styles.priorityTagText, { color: PRIORITY_META[task.priority].borderClass }]}>
                    {PRIORITY_META[task.priority].label}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => deleteTask(task.id)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
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
    alignItems: 'baseline',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#f8fafc',
    fontSize: 14,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prioritySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  priorityLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  pill: {
    flex: 1,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#090d16',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityLowActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  priorityMediumActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  priorityHighActive: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  priorityLowText: {
    color: '#34d399',
  },
  priorityMediumText: {
    color: '#fbbf24',
  },
  priorityHighText: {
    color: '#f87171',
  },
  filtersBar: {
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: '#1e293b',
  },
  filterText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#d8b4fe',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(9, 13, 22, 0.4)',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 8,
    gap: 12,
  },
  taskItemActive: {
    borderColor: '#1e293b',
  },
  taskItemCompleted: {
    borderColor: 'rgba(9, 13, 22, 0.2)',
    opacity: 0.5,
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskText: {
    flex: 1,
    fontSize: 13,
    color: '#e2e8f0',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityTagText: {
    fontSize: 9,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 6,
  },
});
