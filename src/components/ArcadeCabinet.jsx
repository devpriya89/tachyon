import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Music, CheckSquare, Square, Key } from 'lucide-react';
import { playRetroSound } from '../utils/soundSynth';

export function ArcadeCabinet({ 
  children, 
  title = "TACHYON ARCADE", 
  isMuted, 
  toggleMute, 
  volume, 
  credits, 
  addCredit,
  scanlineOpacity,
  setScanlineOpacity,
  isFlickerOn,
  setIsFlickerOn,
  isCurvedScreen,
  setIsCurvedScreen,
  screenGlitch,
  siteTheme = 'nebula',
  unlockCheat
}) {
  const [synthFreq, setSynthFreq] = useState(440); // Standard A4 tuning default
  
  // Background Chiptune Sequencer States
  const [isMusicOn, setIsMusicOn] = useState(false);
  const musicStepRef = useRef(0);
  const musicIntervalRef = useRef(null);

  // Decryption cheat panel input state
  const [cheatCodeText, setCheatCodeText] = useState('');

  // Keyboard Konami Code progression state
  const [, setKonamiProgress] = useState([]);

  const themeNeonColor = {
    nebula: '#a855f7',     // Purple
    cyberpunk: '#06b6d4',   // Cyan
    crimson: '#e00024',     // Red
    acid: '#10b981',        // Green
    void: '#9333ea',        // Violet
    amber: '#ffd000',      // Amber
    dracula: '#ff79c6',    // Pink
    custom: 'var(--color-custom-primary)'
  };

  const currentNeon = themeNeonColor[siteTheme] || themeNeonColor.nebula;

  // Background Soundtrack sequencer effect
  useEffect(() => {
    if (isMusicOn && !isMuted) {
      const melody = [220, 261.63, 293.66, 329.63, 293.66, 329.63, 392, 440];
      musicIntervalRef.current = setInterval(() => {
        const freq = melody[musicStepRef.current % melody.length];
        musicStepRef.current++;
        
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } catch (e) {
          // Context block
        }
      }, 300);
    } else {
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
      }
    }
    
    return () => {
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
      }
    };
  }, [isMusicOn, isMuted, volume]);

  // Keyboard Konami Code Event Listener
  useEffect(() => {
    const targetCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const handleKeyDown = (e) => {
      setKonamiProgress((prev) => {
        const next = [...prev, e.key];
        if (next.length > targetCode.length) {
          next.shift();
        }
        
        const isMatch = targetCode.every((val, index) => val === next[index]);
        if (isMatch) {
          playRetroSound('coin', isMuted, volume);
          if (unlockCheat) {
            unlockCheat();
          }
          alert("🔓 SYSTEM BYPASS ACTIVE: 99 CREDITS INJECTED!");
          return [];
        }
        return next;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMuted, volume, unlockCheat]);

  const handleCheatSubmit = (e) => {
    e.preventDefault();
    const normalized = cheatCodeText.trim().toUpperCase();
    if (normalized === 'KONAMI' || normalized === 'BYPASS' || normalized === 'HACK') {
      playRetroSound('coin', isMuted, volume);
      if (unlockCheat) {
        unlockCheat();
      }
      setCheatCodeText('');
      alert("🔓 SYSTEM BYPASS ACTIVE: 99 CREDITS INJECTED!");
    } else {
      playRetroSound('hit', isMuted, volume);
      alert("❌ DECRYPTION KEY FAILURE");
    }
  };

  // Launchpad synth player
  const triggerCustomBeep = (waveType) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = waveType;
      osc.frequency.setValueAtTime(synthFreq, ctx.currentTime);
      
      gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("AudioContext setup blocked before interaction: ", e);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 px-4">
      {/* Dynamic Glow Backlight behind cabinet */}
      <div 
        className="absolute inset-0 blur-[95px] pointer-events-none rounded-3xl z-0 transition-all duration-300"
        style={{ backgroundColor: currentNeon + '15' }}
      ></div>

      {/* Main Wood/Metal Cabinet Frame */}
      <div 
        className="relative border-4 bg-[#14121e] rounded-3xl p-6 shadow-2xl select-none z-10 flex flex-col gap-6 ring-2 transition-all duration-300"
        style={{ borderColor: currentNeon, ringColor: currentNeon + '30', boxShadow: `0 0 35px ${currentNeon}20` }}
      >
        
        {/* Neon Light Header Billboard */}
        <div 
          className="relative w-full py-4 bg-[#08070d] border rounded-2xl flex items-center justify-between px-6 shadow-inner select-none transition-all duration-300"
          style={{ borderColor: currentNeon + '60' }}
        >
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
            style={{ background: `linear-gradient(to right, ${currentNeon}15, transparent)` }}
          ></div>
          
          <div className="flex items-center gap-2 relative">
            <span 
              className="w-2.5 h-2.5 rounded-full led-blink inline-block transition-all duration-300"
              style={{ backgroundColor: currentNeon, boxShadow: `0 0 10px ${currentNeon}` }}
            ></span>
            <span 
              className="font-orbitron font-extrabold text-xl sm:text-2xl tracking-widest transition-all duration-300"
              style={{ color: currentNeon, textShadow: `0 0 5px ${currentNeon}aa, 0 0 15px ${currentNeon}66` }}
            >
              {title}
            </span>
          </div>

          {/* Credits Counter Screen */}
          <div className="flex items-center gap-3 relative">
            <div className="bg-[#050407] border border-arcade-cyan/30 px-3.5 py-1.5 rounded-lg text-right font-mono shadow-md min-w-[90px]">
              <span className="block text-[8px] text-zinc-500 uppercase tracking-widest leading-none mb-0.5 font-bold">CREDITS</span>
              <span className="font-orbitron text-sm font-black text-arcade-cyan neon-text-cyan">
                {credits.toString().padStart(2, '0')}
              </span>
            </div>
            
            {/* Insert Coin Slot Trigger */}
            <button
              onClick={handleInsertCoin}
              className="px-3 py-2 bg-gradient-to-b from-arcade-amber/20 to-arcade-amber/5 border border-arcade-amber/40 hover:border-arcade-amber hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] text-arcade-amber font-mono font-bold text-[9px] sm:text-xs tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer uppercase shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> INSERT COIN
            </button>
          </div>
        </div>

        {/* Arcade Cabinet Side Panels & CRT Screen Frame */}
        <div className="relative flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Main CRT Gaming Monitor Screen */}
          <div className={`flex-grow relative border-8 border-[#2b273b] bg-black p-2.5 rounded-3xl shadow-inner shadow-black/80 flex flex-col ring-2 ring-black/40 min-h-[420px] md:min-h-[480px] ${
            isCurvedScreen ? 'crt-screen crt-glass' : ''
          } ${
            isFlickerOn ? 'crt-flicker-active' : ''
          } ${
            screenGlitch ? 'screen-glitch-active' : ''
          }`}>
            
            {/* Dynamic opacity scanline background */}
            <div 
              className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay"
              style={{ 
                backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)', 
                backgroundSize: '100% 3px',
                opacity: scanlineOpacity 
              }}
            />

            {/* Moving light bar simulation */}
            <div className="scanline-light"></div>
            
            {/* Inside Content Wrapper */}
            <div className="flex-grow w-full h-full relative rounded-2xl overflow-hidden bg-[#06050b] z-10 flex flex-col">
              {children}
            </div>
          </div>

          {/* Side Controls Cabin Compartment */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col justify-between gap-5 border border-white/5 bg-[#09080e]/80 p-4.5 rounded-2xl shadow-md backdrop-blur-md text-left">
            
            {/* Section A: Audio Output */}
            <div className="space-y-2">
              <span className="block font-mono text-[9px] font-bold text-zinc-500 tracking-wider uppercase border-b border-white/5 pb-1">
                SYSTEM INTERFACES
              </span>
              <div className="flex items-center justify-between bg-zinc-950/40 p-2 border border-white/5 rounded-xl">
                <span className="font-mono text-[10px] text-zinc-400">AUDIO MUTE</span>
                <button
                  onClick={toggleMute}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all active:scale-90 ${
                    isMuted 
                      ? 'bg-red-500/10 border border-red-500/25 text-red-400' 
                      : 'bg-arcade-purple/10 border border-arcade-purple/20 text-arcade-purple'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Chiptune loop soundtrack switch */}
              <div className="flex items-center justify-between bg-zinc-950/40 p-2 border border-white/5 rounded-xl">
                <span className="font-mono text-[10px] text-zinc-400">8-BIT MUSIC</span>
                <button
                  onClick={() => {
                    playRetroSound('rotate', isMuted, volume);
                    setIsMusicOn(!isMusicOn);
                  }}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all active:scale-90 font-mono text-[9px] font-bold uppercase ${
                    isMusicOn 
                      ? 'bg-arcade-neon/15 border border-arcade-neon/30 text-arcade-neon shadow-[0_0_8px_rgba(236,72,153,0.25)]' 
                      : 'bg-zinc-800/30 border border-white/5 text-zinc-500'
                  }`}
                >
                  {isMusicOn ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Section B: CRT Configurator Calibration Deck */}
            <div className="space-y-3">
              <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-zinc-500 tracking-wider uppercase border-b border-white/5 pb-1">
                <Sliders className="w-3.5 h-3.5 text-arcade-cyan" /> CRT DECK CALIBRATION
              </span>
              
              <div className="space-y-2.5 bg-zinc-950/40 p-3 border border-white/5 rounded-xl font-mono text-[11px]">
                {/* Scanline Opacity Slider */}
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>SCANLINES:</span>
                    <span className="text-arcade-cyan font-bold">{(scanlineOpacity * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="0.8" 
                    step="0.05"
                    value={scanlineOpacity} 
                    onChange={(e) => setScanlineOpacity(parseFloat(e.target.value))}
                    className="w-full accent-arcade-cyan cursor-pointer"
                  />
                </div>

                {/* Phosphorus Flicker toggle */}
                <button
                  onClick={() => setIsFlickerOn(!isFlickerOn)}
                  className="w-full flex items-center justify-between text-zinc-400 hover:text-white cursor-pointer py-1"
                >
                  <span>PHOSPHOR FLICKER:</span>
                  {isFlickerOn ? (
                    <CheckSquare className="w-4 h-4 text-arcade-cyan" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-600" />
                  )}
                </button>

                {/* Curved screen toggle */}
                <button
                  onClick={() => setIsCurvedScreen(!isCurvedScreen)}
                  className="w-full flex items-center justify-between text-zinc-400 hover:text-white cursor-pointer py-1"
                >
                  <span>CURVED REFLECTION:</span>
                  {isCurvedScreen ? (
                    <CheckSquare className="w-4 h-4 text-arcade-cyan" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Section C: Sound Board Launchpad Beatbox */}
            <div className="space-y-3">
              <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-zinc-500 tracking-wider uppercase border-b border-white/5 pb-1">
                <Music className="w-3.5 h-3.5 text-arcade-neon" /> SYNTH LAUNCHPAD
              </span>
              
              <div className="bg-zinc-950/40 p-3 border border-white/5 rounded-xl space-y-2.5 font-mono text-[10.5px]">
                {/* Frequency range */}
                <div className="space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>PITCH FREQ:</span>
                    <span className="text-arcade-neon font-bold">{synthFreq} Hz</span>
                  </div>
                  <input 
                    type="range" 
                    min="150" 
                    max="2000" 
                    step="25"
                    value={synthFreq} 
                    onChange={(e) => setSynthFreq(parseInt(e.target.value, 10))}
                    className="w-full accent-arcade-neon cursor-pointer"
                  />
                </div>

                {/* Synth Pads Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { type: 'sine', label: 'SINE' },
                    { type: 'square', label: 'SQR' },
                    { type: 'sawtooth', label: 'SAW' },
                    { type: 'triangle', label: 'TRI' }
                  ].map((pad) => (
                    <button
                      key={pad.type}
                      onClick={() => triggerCustomBeep(pad.type)}
                      className="py-1.5 border border-arcade-neon/30 bg-arcade-neon/5 hover:bg-arcade-neon hover:text-black hover:shadow-[0_0_8px_rgba(236,72,153,0.3)] text-arcade-neon text-[9px] font-bold uppercase rounded-lg active:scale-95 transition-all cursor-pointer text-center"
                    >
                      {pad.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section D: Secret Decryption Bypass */}
            <div className="space-y-3">
              <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-zinc-500 tracking-wider uppercase border-b border-white/5 pb-1">
                <Key className="w-3.5 h-3.5 text-arcade-cyan animate-pulse" /> SYSTEM BYPASS
              </span>
              <form onSubmit={handleCheatSubmit} className="flex gap-1">
                <input
                  type="text"
                  placeholder="ENTER BYPASS CODE"
                  value={cheatCodeText}
                  onChange={(e) => setCheatCodeText(e.target.value)}
                  className="flex-1 bg-zinc-950/60 border border-white/5 px-2 py-1.5 font-mono text-[9px] text-white rounded-lg outline-none focus:border-arcade-cyan uppercase"
                />
                <button
                  type="submit"
                  className="bg-arcade-cyan/10 border border-arcade-cyan/35 text-arcade-cyan hover:bg-arcade-cyan hover:text-black font-mono text-[9px] font-bold px-2 rounded-lg active:scale-95 transition-all cursor-pointer"
                >
                  DECRYPT
                </button>
              </form>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
export default ArcadeCabinet;
