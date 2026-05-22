import React, { useState, useEffect, useRef } from 'react';
import Timer from './components/Timer';
import Tasks from './components/Tasks';
import Journal from './components/Journal';
import { Sparkles, Volume2, VolumeX, Moon, ShieldCheck, Heart } from 'lucide-react';

const FOCUS_QUOTES = [
  "A simplicidade é o último grau de sofisticação. — Leonardo da Vinci",
  "Foco é dizer não para centenas de outras boas ideias. — Steve Jobs",
  "A mente humana cresce apenas quando desafiada. — Sêneca",
  "O que você faz todos os dias importa mais do que o que faz de vez em quando.",
  "Mantenha a mente calma e o trabalho fluirá naturalmente.",
];

function App() {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(false);
  
  // Audio state refs
  const audioContextRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const filterNodeRef = useRef(null);

  useEffect(() => {
    // Generate greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    // Pick a random quote
    setQuote(FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)]);
  }, []);

  // Synthesize rain/ocean sound using browser Web Audio API
  const startSoundscape = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      // Create brownian-like noise buffer (sounds like rain/ocean)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brownian noise filter
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 4.0; // scale up
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      // Lowpass filter to simulate deep ocean/rain muffled sounds
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      // Slow periodic frequency modulation to simulate ocean waves
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08; // 12 seconds wave cycles
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 150; // modulate frequency by +/- 150Hz
      
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      // Fade in soundscape
      mainGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);

      source.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      source.start();

      noiseSourceRef.current = source;
      filterNodeRef.current = filter;
      setIsPlayingSoundscape(true);
    } catch (e) {
      console.error('AudioContext failed to initialize', e);
    }
  };

  const stopSoundscape = () => {
    if (audioContextRef.current) {
      // Fade out
      const gainNode = noiseSourceRef.current.context.createGain(); // simplified, we just close context
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        noiseSourceRef.current = null;
        filterNodeRef.current = null;
        setIsPlayingSoundscape(false);
      });
    }
  };

  const toggleSoundscape = () => {
    if (isPlayingSoundscape) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 w-full">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600/30 p-2.5 rounded-xl border border-purple-500/40 text-purple-300 animate-float">
            <Sparkles size={24} />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Zen Focus <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-normal">v1.0</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Seu espaço de calma e produtividade</p>
          </div>
        </div>

        {/* Ambient Sound Controller */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-md">
          <span className="text-xs text-slate-400 font-medium">Ruído Zen (Oceano):</span>
          <button
            onClick={toggleSoundscape}
            className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg border transition-all duration-300 font-medium ${
              isPlayingSoundscape
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 shadow-md shadow-teal-500/10'
                : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPlayingSoundscape ? (
              <>
                <Volume2 size={14} className="animate-pulse" />
                Ativo
              </>
            ) : (
              <>
                <VolumeX size={14} />
                Desativado
              </>
            )}
          </button>
        </div>
      </header>

      {/* Hero Welcome & Quote Card */}
      <section className="glass-panel p-6 sm:p-8 mb-8 text-left relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            {greeting}, <span className="text-purple-400">focado hoje?</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed italic">
            "{quote}"
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800/60 px-4 py-3 rounded-xl flex-shrink-0 z-10 self-start md:self-center">
          <Moon size={16} className="text-purple-400" />
          <span className="text-xs text-slate-400">
            Foque 25 min, descanse 5 min.
          </span>
        </div>
        {/* Subtle background glow decorator */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      </section>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Timer />
        <Tasks />
        <Journal />
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-6 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Dados salvos localmente em segurança.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Feito com</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>em React + Tailwind v4</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
