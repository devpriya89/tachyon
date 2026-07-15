import React from 'react'
import { ArrowRight, ExternalLink, Clock } from 'lucide-react'
import { playSound } from '../utils/audio'

export function Hero({ timeLeft, siteTheme, isMuted, volume, ticketData, setIsRegisterModalOpen, whatsappLink, isAdmin, openAdminPanel }) {

  return (
    <section
      id="overview"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-20 px-4 md:px-8 overflow-hidden bg-transparent"
    >
      {/* Background Watermark Indicators */}
      <div className="absolute top-6 left-6 text-[9px] text-zinc-600 tracking-widest z-20 select-none uppercase font-semibold">
        SYS:00 // TACHYON-DL
      </div>
      <div className="absolute top-6 right-6 text-[9px] text-zinc-600 tracking-widest z-20 select-none uppercase font-semibold">
        28°38′N 77°13′E
      </div>


      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Protocol Label */}
        <div className="inline-flex items-center gap-3 text-[#6db349] bg-[#6db349]/10 px-4 py-1.5 rounded-full mb-8 select-none text-[10px] md:text-xs uppercase tracking-widest font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6db349] animate-ping"></span>
          <span>Protocol: Active // Delhi // Open-to-All // 2026</span>
        </div>

        {/* Title with Gradient */}
        <div className="mb-8 select-none">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold uppercase bg-gradient-to-r from-white via-[#6db349] to-[#84cc16] bg-clip-text text-transparent tracking-tighter leading-none">
            Tachyon
          </h1>
        </div>

        <p className="mt-2 text-sm md:text-base max-w-2xl text-zinc-400 leading-relaxed select-none mb-10">
          A high-performance innovation-driven hackathon for builders in Delhi. Secure your pass, select your track, and start building.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4 mb-16">
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              if (isAdmin) {
                openAdminPanel()
              } else {
                setIsRegisterModalOpen(true)
              }
            }}
            className="group flex items-center justify-center gap-2 bg-[#6db349] hover:bg-[#6db349]/90 text-black font-bold text-sm px-8 py-3.5 rounded-full active:scale-95 cursor-pointer transition-all uppercase tracking-wider shadow-[0_0_20px_rgba(109,179,73,0.35)] hover:shadow-[0_0_30px_rgba(109,179,73,0.6)] duration-300 border-0"
          >
            {isAdmin ? 'Open Admin Panel' : (ticketData ? 'Access Your Pass' : 'Initialize Registry')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <a
            href={whatsappLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click', isMuted, volume)}
            className="flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold text-sm px-8 py-3.5 rounded-full active:scale-95 transition-all uppercase tracking-wider"
          >
            Whatsapp Community
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Timer Countdown */}
        <div className="w-full max-w-xl border border-zinc-800/80 bg-[#231f20]/40 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-0 relative select-none rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3 select-none">
            <span className="text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              timer_diagnostic_core <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#6db349] animate-pulse"></span>
            </span>
            <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-semibold">
              <Clock className="w-3 h-3" />
              <span className="uppercase tracking-wider">July 24, 2026</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-4 mb-6">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#6db349] font-bold">
                NODE: COUNTDOWN // REGISTRATION LIVE
              </span>
            </div>

            {/* Time Gauges */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
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
                  <div key={label} className="flex flex-col items-center justify-center p-3 sm:p-5 bg-black/35 border border-zinc-800/60 rounded-xl">
                    <span className="text-3xl sm:text-5xl font-bold text-white select-all">
                      {val}
                    </span>
                    <span className="mt-2 text-[8px] text-[#6db349] tracking-widest font-extrabold">
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
