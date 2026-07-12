import React from 'react'
import { ArrowRight, ExternalLink, Clock } from 'lucide-react'
import { playSound } from '../utils/audio'

export function Hero({ timeLeft, siteTheme, isMuted, volume, ticketData, setIsRegisterModalOpen, whatsappLink }) {

  return (
    <section
      id="overview"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-20 px-4 md:px-8 border-b border-white/5 overflow-hidden bg-transparent"
    >
      {/* Background Watermark Indicators */}
      <div className="absolute top-6 left-6 font-mono text-[9px] text-white/15 tracking-[0.2em] z-20 select-none uppercase">
        SYS:00 // TACHYON-DL
      </div>
      <div className="absolute top-6 right-6 font-mono text-[9px] text-white/15 tracking-[0.2em] z-20 select-none uppercase">
        28°38′N 77°13′E
      </div>
      <div className="absolute font-syne font-bold text-white/[0.02] select-none pointer-events-none z-0 text-[180px] sm:text-[25vw] md:text-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        創
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Protocol Label */}
        <div className="inline-flex items-center gap-3 text-white/40 mb-10 select-none font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">
          <span>PROTOCOL: ACTIVE // DELHI // UNDER-18 // 2026</span>
        </div>

        {/* Flat Title with Glitch Animation */}
        <div className="mb-12 md:mb-16 select-none">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-syne font-black uppercase text-[#F8F7F4] tracking-tighter leading-none hover-glitch cursor-default">
            Tachyon
          </h1>
        </div>

        <p className="mt-2 text-xs max-w-2xl text-white/35 leading-relaxed select-none font-mono mb-8">
          A high-performance innovation-driven hackathon for builders under 18 in Delhi. Secure your pass, select your track, and start building.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              setIsRegisterModalOpen(true)
            }}
            className="group flex items-center justify-center gap-2 bg-[#F8F7F4] text-[#0A0A08] font-mono font-bold text-sm px-8 py-3.5 rounded-none active:scale-95 cursor-pointer transition-all uppercase tracking-widest hover-glitch border-0"
          >
            {ticketData ? 'ACCESS YOUR PASS' : 'INITIALIZE REGISTRY'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <a
            href={whatsappLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click', isMuted, volume)}
            className="flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white font-mono font-bold text-sm px-8 py-3.5 rounded-none active:scale-95 transition-all uppercase tracking-widest hover-glitch"
          >
            WHATSAPP COMMUNITY
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Timer Countdown */}
        <div className="mt-16 w-full max-w-xl border border-white/[0.06] bg-transparent p-0 relative select-none rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 select-none">
            <span className="font-mono text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.3em] flex items-center gap-1.5">
              timer_diagnostic_core <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C2452D] animate-pulse"></span>
            </span>
            <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
              <Clock className="w-3 h-3" />
              <span className="font-mono uppercase tracking-[0.2em]">July 24, 2026</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/25">
                NODE: COUNTDOWN // REGISTRATION LIVE
              </span>
            </div>

            {/* Time Gauges */}
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
                  <div key={label} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/[0.01] border border-white/5 rounded-none">
                    <span className="text-3xl sm:text-5xl font-mono font-light text-[#F8F7F4] select-all">
                      {val}
                    </span>
                    <span className="mt-2 text-[8px] text-white/25 tracking-[0.3em] font-bold">
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
