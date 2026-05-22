import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

const PRIORITY_META = {
  low: { label: 'Baixa', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  medium: { label: 'Média', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  high: { label: 'Alta', class: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export default function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('zen_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Concluir leitura de documentação', completed: false, priority: 'medium' },
      { id: '2', text: 'Praticar 15 minutos de meditação diária', completed: true, priority: 'low' },
      { id: '3', text: 'Desenvolver protótipo em React', completed: false, priority: 'high' }
    ];
  });
  
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('zen_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      priority,
    };

    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="glass-panel glass-panel-hover p-6 flex flex-col h-[420px]">
      <h2 className="text-xl font-semibold text-white mb-4 text-left flex justify-between items-center">
        <span>Foco de Hoje</span>
        <span className="text-xs font-normal text-slate-400">
          {tasks.filter(t => !t.completed).length} pendente(s)
        </span>
      </h2>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="flex-1 px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 placeholder:text-slate-500"
        />
        
        {/* Priority Badge Dropdown/Selector */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-2 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-purple-500/80 transition-all duration-200"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>

        <button
          type="submit"
          className="p-2.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
          title="Adicionar tarefa"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Filters */}
      <div className="flex gap-2 border-b border-slate-800/80 pb-3 mb-3">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-2.5 py-1 rounded-md transition-all duration-200 ${
              filter === f
                ? 'bg-slate-800 text-purple-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f === 'all' ? 'Tudo' : f === 'active' ? 'Ativas' : 'Concluídas'}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic py-8">
            Nenhuma tarefa encontrada.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 bg-slate-950/40 border rounded-xl hover:bg-slate-900/60 transition-all duration-200 group ${
                task.completed ? 'border-slate-900/40 opacity-60' : 'border-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 transition-colors duration-200 ${
                    task.completed ? 'text-teal-400' : 'text-slate-500 hover:text-purple-400'
                  }`}
                >
                  {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <span
                  className={`text-sm text-slate-200 truncate pr-2 select-none ${
                    task.completed ? 'line-through text-slate-500' : ''
                  }`}
                >
                  {task.text}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${PRIORITY_META[task.priority].class}`}>
                  {PRIORITY_META[task.priority].label}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
