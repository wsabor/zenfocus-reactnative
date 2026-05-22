import React, { useState, useEffect } from 'react';
import { PenTool, Calendar, BookOpen, Trash } from 'lucide-react';

const MOODS = [
  { emoji: '🌟', label: 'Inspirado', color: 'hover:bg-amber-500/20 hover:border-amber-500/40 text-amber-300' },
  { emoji: '⚡', label: 'Focado', color: 'hover:bg-purple-500/20 hover:border-purple-500/40 text-purple-300' },
  { emoji: '🍃', label: 'Calmo', color: 'hover:bg-teal-500/20 hover:border-teal-500/40 text-teal-300' },
  { emoji: '🧩', label: 'Reflexivo', color: 'hover:bg-indigo-500/20 hover:border-indigo-500/40 text-indigo-300' },
  { emoji: '😴', label: 'Cansado', color: 'hover:bg-slate-500/20 hover:border-slate-500/40 text-slate-400' },
];

export default function Journal() {
  const [mood, setMood] = useState('');
  const [intention, setIntention] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('zen_journal_history');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: '21/05/2026', mood: '⚡', intention: 'Finalizar a refatoração do layout' },
      { id: '2', date: '20/05/2026', mood: '🍃', intention: 'Estudar conceitos de Web Audio API' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('zen_journal_history', JSON.stringify(history));
  }, [history]);

  const saveEntry = (e) => {
    e.preventDefault();
    if (!mood && !intention.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      mood: mood || '🍃',
      intention: intention.trim() || 'Viver o presente consciente',
    };

    setHistory([newEntry, ...history]);
    setIntention('');
    setMood('');
  };

  const deleteEntry = (id) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="glass-panel glass-panel-hover p-6 flex flex-col h-[420px]">
      <h2 className="text-xl font-semibold text-white mb-4 text-left flex items-center gap-2">
        <PenTool size={18} className="text-teal-400" />
        <span>Diário de Estado & Intenção</span>
      </h2>

      <form onSubmit={saveEntry} className="space-y-4 flex-shrink-0">
        {/* Mood Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-400 text-left mb-2">
            Como você se sente agora?
          </label>
          <div className="flex justify-between gap-1">
            {MOODS.map((m) => (
              <button
                type="button"
                key={m.emoji}
                onClick={() => setMood(m.emoji)}
                className={`flex-1 py-2 px-1 text-center border rounded-xl transition-all duration-300 ${
                  mood === m.emoji
                    ? 'bg-teal-500/20 border-teal-500/50 scale-105 shadow-md shadow-teal-500/10'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                } ${m.color}`}
                title={m.label}
              >
                <div className="text-xl mb-0.5">{m.emoji}</div>
                <div className="text-[10px] hidden sm:block truncate">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Intention Input */}
        <div>
          <label className="block text-xs font-medium text-slate-400 text-left mb-2">
            Qual sua intenção ou foco para hoje?
          </label>
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Ex: Manter a calma diante de desafios..."
            className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-teal-500/80 focus:ring-1 focus:ring-teal-500/30 transition-all duration-200 placeholder:text-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={!mood && !intention.trim()}
          className="w-full py-2.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl hover:bg-teal-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:hover:bg-teal-500/20 transition-all duration-200 text-sm font-medium"
        >
          Registrar no Diário
        </button>
      </form>

      {/* History Log */}
      <div className="mt-4 flex-1 flex flex-col min-h-0 border-t border-slate-800/60 pt-3">
        <label className="text-xs font-medium text-slate-400 text-left mb-2 flex items-center gap-1.5 flex-shrink-0">
          <BookOpen size={13} className="text-slate-500" />
          <span>Registros Recentes</span>
        </label>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {history.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
              Nenhum registro anterior.
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2.5 bg-slate-950/20 border border-slate-800/40 rounded-xl text-xs hover:bg-slate-900/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg bg-slate-950/40 w-8 h-8 rounded-lg flex items-center justify-center border border-slate-800/60 flex-shrink-0">
                    {entry.mood}
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-slate-200 font-medium truncate">{entry.intention}</p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar size={10} />
                      {entry.date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                  title="Excluir entrada"
                >
                  <Trash size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
