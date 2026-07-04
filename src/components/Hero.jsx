import React from 'react'
import { ArrowRight, ExternalLink, Clock } from 'lucide-react'
import { playSound } from '../utils/audio'

export function Hero({ timeLeft, siteTheme, isMuted, volume, ticketData, setIsRegisterModalOpen }) {
  
  // theme configs
  const themeStyles = {
    amber: {
      bg: 'bg-yellow-400 text-black',
      text: 'text-black',
      timerBorder: 'border-white/10',
      accentHex: '#ffd000',
      textAccent: 'text-amber-400',
      hoverBg: 'hover:bg-amber-400 hover:text-black',
      hoverNumber: 'group-hover:text-black'
    },
    crimson: {
      bg: 'bg-red-500 text-white',
      text: 'text-white',
      timerBorder: 'border-white/10',
      accentHex: '#d91429',
      textAccent: 'text-red-400',
      hoverBg: 'hover:bg-red-500 hover:text-white',
      hoverNumber: 'group-hover:text-white'
    },
    acid: {
      bg: 'bg-green-400 text-black',
      text: 'text-black',
      timerBorder: 'border-white/10',
      accentHex: '#34c759',
      textAccent: 'text-green-400',
      hoverBg: 'hover:bg-green-400 hover:text-black',
      hoverNumber: 'group-hover:text-black'
    },
    void: {
      bg: 'bg-purple-600 text-white',
      text: 'text-white',
      timerBorder: 'border-white/10',
      accentHex: '#af52de',
      textAccent: 'text-purple-400',
      hoverBg: 'hover:bg-purple-600 hover:text-white',
      hoverNumber: 'group-hover:text-white'
    },
    cyberpunk: {
      bg: 'bg-cyan-400 text-black',
      text: 'text-black',
      timerBorder: 'border-white/10',
      accentHex: '#00f0ff',
      textAccent: 'text-cyan-400',
      hoverBg: 'hover:bg-cyan-400 hover:text-black',
      hoverNumber: 'group-hover:text-black'
    },
    dracula: {
      bg: 'bg-pink-400 text-black',
      text: 'text-black',
      timerBorder: 'border-white/10',
      accentHex: '#ff79c6',
      textAccent: 'text-pink-400',
      hoverBg: 'hover:bg-pink-400 hover:text-black',
      hoverNumber: 'group-hover:text-black'
    },
    custom: {
      bg: 'bg-[var(--color-custom-primary)]',
      text: 'text-[var(--color-custom-text)]',
      timerBorder: 'border-white/10',
      accentHex: 'var(--color-custom-primary)',
      textAccent: 'text-[var(--color-custom-primary)]',
      hoverBg: 'hover:bg-[var(--color-custom-primary)] hover:text-[var(--color-custom-text)]',
      hoverNumber: 'group-hover:text-[var(--color-custom-text)]'
    }
  }

  const currentTheme = themeStyles[siteTheme] || themeStyles.amber

  return (
    <section
      id="overview"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-20 px-4 md:px-8 border-b border-white/5 overflow-hidden bg-transparent"
    >
      {/* Aurora Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0 animate-float-slow"></div>
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none z-0 animate-float-medium"></div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Pulsing Tag */}
        <div className="inline-flex items-center gap-2.5 border border-white/10 bg-zinc-900/60 text-zinc-300 px-5 py-2.5 shadow-xl rounded-full mb-10 select-none font-mono text-[10px] md:text-xs uppercase">
          <span className="w-2 h-2 bg-green-500 inline-block rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          <span>DELHI // SATELLITE HACKATHON // BUILDER GUILD // UNDER 18</span>
        </div>

        {/* Chrome Gradient Title */}
        <div className="mb-12 md:mb-16 relative select-none">
          {/* Neon Glow text backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl sm:text-8xl md:text-9xl font-syne font-black uppercase text-white/5 blur-sm pointer-events-none select-none tracking-tighter leading-none w-full">
            HACKLABIFY
          </div>
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-syne font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 tracking-tighter leading-none relative z-10">
            HACKLABIFY
          </h1>
          <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/15 px-5 py-1.5 md:px-6 md:py-2 rotate-[-2deg] z-20 shadow-2xl rounded-full hover:rotate-[2deg] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
            <span className="text-xs sm:text-sm md:text-base font-mono font-bold uppercase leading-none tracking-widest text-zinc-300">
              V1.0
            </span>
          </div>
        </div>

        <p className="mt-8 text-sm sm:text-base md:text-lg font-normal max-w-2xl text-zinc-400 leading-relaxed select-none font-mono">
          A high-performance innovation-driven hackathon for <span className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 px-3 py-1 inline-flex items-center gap-1.5 font-bold mx-1 rounded-full text-xs md:text-sm shadow-[0_0_12px_rgba(234,179,8,0.1)]">builders under 18</span> in <span className="bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 inline-flex items-center gap-1.5 font-bold mx-1 rounded-full text-xs md:text-sm shadow-[0_0_12px_rgba(239,68,68,0.1)]">Delhi</span>. Secure your pass, select your track, and start building.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              setIsRegisterModalOpen(true)
            }}
            className={`group flex items-center justify-center gap-2 border border-white/10 ${currentTheme.bg} ${currentTheme.text} font-mono font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer transition-all`}
          >
            {ticketData ? 'ACCESS YOUR PASS' : 'INITIALIZE REGISTRY'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <a
            href="https://discord.gg/hacklabify"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click', isMuted, volume)}
            className="flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-sm px-8 py-3.5 rounded-full shadow-lg active:scale-95 transition-all"
          >
            DISCORD SERVER
            <ExternalLink className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* Timer CPU Core Diagnostic HUD Program Window */}
        <div className="mt-16 w-full max-w-xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-0 shadow-2xl relative select-none rounded-2xl">
          {/* OS Window header banner */}
          <div className="flex items-center justify-between border-b border-white/5 bg-zinc-950/50 px-4 py-2.5 select-none rounded-t-2xl">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/5 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/5 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/5 inline-block"></span>
            </div>
            <span className="font-mono text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">
              timer_diagnostic_core
            </span>
            <span className="font-mono text-[9px] text-white/40">■</span>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-ping"></span>
                <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  round 1 countdown // registration live
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-xs">
                <Clock className="w-4 h-4 text-zinc-300" />
                <span className="font-mono uppercase tracking-widest">July 24, 2026</span>
              </div>
            </div>

            {/* Time CPU Gauges grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 font-mono">
              {[
                ['days', timeLeft.days],
                ['hours', timeLeft.hours],
                ['mins', timeLeft.minutes],
                ['secs', timeLeft.seconds]
              ].map(([label, val]) => {
                const unitMap = {
                  days: 'DAYS',
                  hours: 'HOURS',
                  mins: 'MINS',
                  secs: 'SECS'
                }
                return (
                  <div
                    key={label}
                    className={`relative flex flex-col items-center bg-zinc-950/45 border border-white/5 p-4 rounded-xl shadow-xl transition-all duration-200 group overflow-hidden ${currentTheme.hoverBg}`}
                  >
                    <span className={`countdown-number text-2xl sm:text-4xl md:text-5xl font-mono font-black tracking-tight relative z-10 transition-colors duration-200 text-white ${currentTheme.hoverNumber}`}>
                      {val}
                    </span>
                    <span className="text-[8px] md:text-[9.5px] text-zinc-500 font-bold uppercase mt-2 tracking-wider relative z-10 transition-colors duration-200">
                      {unitMap[label]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
export default Hero
