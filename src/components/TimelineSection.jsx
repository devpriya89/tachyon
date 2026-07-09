import React, { useState, useEffect } from 'react'
import { Calendar, Binary, CheckCircle, Terminal } from 'lucide-react'
import { downloadICS } from '../utils/icsGenerator'
import { playSound } from '../utils/audio'

export function TimelineSection({ siteTheme, isMuted, volume, timelineNodes }) {
  const [hoveredNodeIdx, setHoveredNodeIdx] = useState(null)
  const [decryptingIdx, setDecryptingIdx] = useState(null)
  const [decryptedIndices, setDecryptedIndices] = useState([])
  const [timeLeft, setTimeLeft] = useState('22D 05H 12M 00S')

  // Theme styling configurations
  const themeStyles = {
    nebula: { bg: 'bg-violet-500', border: 'border-violet-500/20', text: 'text-violet-400' },
    amber: { bg: 'bg-yellow-400', border: 'border-yellow-400/20', text: 'text-yellow-400' },
    crimson: { bg: 'bg-red-500', border: 'border-red-500/20', text: 'text-red-400' },
    acid: { bg: 'bg-green-400', border: 'border-green-400/20', text: 'text-green-400' },
    void: { bg: 'bg-purple-600', border: 'border-purple-500/20', text: 'text-purple-400' },
    cyberpunk: { bg: 'bg-cyan-400', border: 'border-cyan-400/20', text: 'text-cyan-400' },
    dracula: { bg: 'bg-pink-400', border: 'border-pink-400/20', text: 'text-pink-400' },
    custom: { bg: 'bg-[var(--color-custom-primary)]', border: 'border-[var(--color-custom-primary)]/20', text: 'text-[var(--color-custom-primary)]' }
  }

  const currentTheme = themeStyles[siteTheme] || themeStyles.nebula

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  // Live ticking countdown targeting July 25, 2026
  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date('2026-07-25T00:00:00')
      const now = new Date()
      const diff = target - now
      
      if (diff <= 0) {
        setTimeLeft('QUALIFIERS ONLINE')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const mins = Math.floor((diff / 1000 / 60) % 60)
      const secs = Math.floor((diff / 1000) % 60)

      const pad = (num) => String(num).padStart(2, '0')
      setTimeLeft(`${days}D ${pad(hours)}H ${pad(mins)}M ${pad(secs)}S`)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCalendarExport = (step) => {
    playSound('coin', isMuted, volume)
    const event = {
      title: `Tachyon: ${step.title}`,
      description: step.desc,
      startDateStr: step.startDateStr,
      endDateStr: step.endDateStr,
      location: step.phase === '05' ? 'New Delhi Central, Delhi, India' : 'Online Website'
    }
    downloadICS(event)
  }

  // Simulating custom key decryption challenge visualizer
  const handleDecryptLogs = (idx) => {
    playSound('keypress', isMuted, volume)
    setDecryptingIdx(idx)

    setTimeout(() => {
      playSound('success', isMuted, volume)
      setDecryptingIdx(null)
      setDecryptedIndices([...decryptedIndices, idx])
    }, 900)
  }

  const easterEggData = {
    0: { header: 'EASTER EGG DETECTED // SECRET CODE', content: "Use registration promo key 'HACK-THE-MAINFRAME' to claim a custom sticker pack at Delhi Showcase!" },
    1: { header: 'QUALIFIER PARAMETERS // DECRYPTED', content: "Target stack: build and launch a working app or agent. Repository commits will be monitored via webhook integration." },
    2: { header: 'SUBMISSION LOCK SYSTEM // ENCRYPTED', content: "Final code push window closes exactly at 23:59:59 IST. Server clock logs override local Git metadata timestamp." },
    3: { header: 'SQUAD SELECTION SCRIPTER // STATUS', content: "Automatic repository scans compile and sort teams based on testing coverage, functionality, and clean design logs." },
    4: { header: 'OFFLINE FINALS CORE // DETAILS', content: "IIIT Delhi. Showcase grids, custom mechanical keyboard giveaways, high-performance router nodes, and infinite tea/coffee await." }
  }

  return (
    <section id="timeline" className="py-24 border-b border-white/5 bg-transparent max-w-[1400px] mx-auto w-full relative">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div>
            <div className="inline-block border border-white/10 bg-white/5 text-zinc-300 font-mono text-[10px] font-bold uppercase px-3 py-1 shadow-md rounded-full mb-4">
              Phase roadmap // scheduling
            </div>
            <h2 className="text-4xl sm:text-6xl font-syne font-black uppercase tracking-tight text-white">
              EVENT SCHEDULING
            </h2>
          </div>
          <p className="text-sm sm:text-base font-bold text-zinc-500 max-w-sm leading-relaxed font-mono text-left">
            Milestones along the way from registrations to the physical grand finals. Export dates directly to your device.
          </p>
        </div>

        {/* Stepper Progress Box */}
        <div className="relative border border-white/10 bg-zinc-900/40 p-6 md:p-8 shadow-2xl mb-16 select-none rounded-2xl backdrop-blur-md">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="text-left">
              <span className="block font-mono text-[9px] md:text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                Current Milestone Status
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                <span className="text-sm font-mono font-bold uppercase text-white tracking-wider">Phase 01: ACTIVE</span>
              </div>
            </div>

            <div className="text-left">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-mono text-[9px] md:text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  online qualifier countdown
                </span>
                <span className="font-mono text-[10px] font-bold text-indigo-400 tracking-wider animate-pulse">{timeLeft}</span>
              </div>
              <div className="h-4 w-full border border-white/5 bg-zinc-950/60 p-[2px] overflow-hidden rounded-full">
                <div className={`${currentTheme.bg} h-full rounded-full transition-all duration-1000`} style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="lg:pl-6 lg:border-l lg:border-white/5 text-left">
              <span className="block font-mono text-[9px] md:text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                OFFLINE FINALS LIMIT
              </span>
              <span className="text-sm font-mono font-bold text-zinc-300 block mt-1 tracking-wider uppercase">
                40 TEAMS ONLY (Delhi Showcase)
              </span>
            </div>
          </div>
        </div>

        {/* Pulsing Fiber-Optic Milestone Track Container */}
        <div className="relative max-w-4xl mx-auto pl-10 md:pl-0 mt-8">
          
          {/* Vertical Laser Line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] z-0 timeline-laser-line shadow-[0_0_8px_rgba(99,102,241,0.2)]"></div>

          {/* Node items */}
          <div className="relative space-y-12">
            {timelineNodes.map((step, idx) => {
              const isActive = step.status === 'ACTIVE'
              const isEven = idx % 2 === 0
              const isHovered = hoveredNodeIdx === idx
              const isDecrypted = decryptedIndices.includes(idx)
              const isDecrypting = decryptingIdx === idx

              // Node Dot Styling based on active / hover connection
              let dotStyles = 'bg-zinc-700 w-3.5 h-3.5'
              if (isHovered) {
                dotStyles = 'bg-indigo-400 shadow-[0_0_15px_#6366f1] scale-[1.6]'
              } else if (isActive) {
                dotStyles = 'bg-green-400 shadow-[0_0_10px_#4ade80] scale-125 animate-pulse'
              }
              
              return (
                <div 
                  key={idx} 
                  className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full transition-all duration-300 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  
                  {/* Center Dot Indicator */}
                  <div className={`absolute left-[-29px] md:left-1/2 md:-translate-x-1/2 top-6 rounded-full border-2 border-zinc-950 z-20 transition-all duration-300 ${dotStyles}`}></div>

                  {/* Glass Card content panel */}
                  <div
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setHoveredNodeIdx(idx)}
                    onMouseLeave={() => setHoveredNodeIdx(null)}
                    className="w-full md:w-[46%] bg-zinc-900/30 border border-white/5 p-5 shadow-2xl rounded-2xl text-left transition-all duration-300 relative z-10 cyber-glass-interactive group"
                  >
                    <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-2.5 mb-3">
                      <h4 className="text-base sm:text-lg font-syne font-bold uppercase tracking-tight text-white leading-none">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-1.5 font-mono text-xs select-none">
                        <span className="font-bold border border-white/10 bg-white/5 px-2 py-0.5 rounded-lg text-[9px] text-zinc-400 shadow-sm">
                          {step.date}
                        </span>
                        {isActive && (
                          <span className="bg-green-500/10 text-green-400 border border-green-500/20 font-bold px-2 py-0.5 rounded-lg text-[8.5px] shadow-sm animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-[11px] sm:text-xs font-normal text-zinc-400 leading-relaxed font-mono">
                      {step.desc}
                    </p>

                    {/* Interactive Decryption box */}
                    {isDecrypted ? (
                      <div className="mt-4 border border-indigo-500/25 bg-indigo-500/5 p-3 rounded-xl select-none font-mono text-left animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-indigo-400 text-[9px] font-bold uppercase mb-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {easterEggData[idx]?.header}
                        </div>
                        <p className="text-[10px] text-zinc-300 leading-relaxed">
                          {easterEggData[idx]?.content}
                        </p>
                      </div>
                    ) : (
                      isDecrypting && (
                        <div className="mt-4 border border-yellow-500/25 bg-yellow-500/5 p-3 rounded-xl select-none font-mono text-left animate-pulse">
                          <div className="flex items-center gap-2 text-yellow-400 text-[9.5px] font-bold uppercase">
                            <Binary className="w-4 h-4 animate-spin shrink-0" />
                            RUNNING CORE DECRYPTOR SCANS...
                          </div>
                        </div>
                      )
                    )}

                    {/* Exporter & decrypt controls */}
                    <div className="mt-4 pt-2.5 border-t border-white/5 flex justify-between items-center gap-2">
                      
                      {/* Decryption trigger button */}
                      {!isDecrypted && !isDecrypting && (
                        <button
                          onClick={() => handleDecryptLogs(idx)}
                          className="flex items-center gap-1.5 border border-indigo-500/30 hover:border-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 px-3 py-1.5 text-[8.5px] font-mono font-bold uppercase rounded-lg shadow-md active:translate-y-[0.5px] transition-all cursor-pointer select-none"
                          title="Decrypt hidden regional operators files"
                        >
                          <Terminal className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Decrypt logs
                        </button>
                      )}

                      {isDecrypted && (
                        <span className="font-mono text-[8px] text-zinc-600 uppercase font-black tracking-widest select-none">
                          LOGS_DECRYPTED // OK
                        </span>
                      )}

                      {!isDecrypted && isDecrypting && <div className="w-1"></div>}

                      <button
                        onClick={() => handleCalendarExport(step)}
                        className="flex items-center gap-1 border border-white/10 bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg shadow-md active:translate-y-[0.5px] transition-all cursor-pointer"
                        title={`Export ${step.title} schedule to calendar`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-zinc-300" /> export node
                      </button>
                    </div>

                  </div>

                  {/* Empty side space spacer for desktop staggering */}
                  <div className="hidden md:block w-[46%]"></div>

                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
export default TimelineSection

