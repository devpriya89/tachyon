import React, { useState, useEffect } from 'react'
import { Calendar, Binary, CheckCircle, Terminal } from 'lucide-react'
import { downloadICS } from '../utils/icsGenerator'
import { playSound } from '../utils/audio'

export function TimelineSection({ siteTheme, isMuted, volume, timelineNodes }) {
  const [hoveredNodeIdx, setHoveredNodeIdx] = useState(null)
  const [decryptingIdx, setDecryptingIdx] = useState(null)
  const [decryptedIndices, setDecryptedIndices] = useState([])
  const [timeLeft, setTimeLeft] = useState('22D 05H 12M 00S')

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

  // Status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-[#C2452D] border-[#C2452D]/30 bg-[#C2452D]/5'
      case 'UPCOMING':
        return 'text-white/20 border-white/5'
      case 'COMPLETED':
        return 'text-white/10 border-white/5'
      default:
        return 'text-white/20 border-white/5'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'LIVE'
      case 'UPCOMING':
        return 'UPCOMING'
      case 'COMPLETED':
        return 'COMPLETED'
      default:
        return status
    }
  }

  return (
    <section id="timeline" className="py-24 border-b border-white/5 bg-transparent max-w-[1400px] mx-auto w-full relative">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-4">
              SYS:03 — PHASE ROADMAP // SCHEDULING
            </span>
            <h2 className="text-2xl font-syne font-black uppercase text-white">
              EVENT SCHEDULING
            </h2>
          </div>
          <p className="font-mono text-[10px] text-white/25 max-w-xs leading-relaxed text-left">
            Milestones along the way from registrations to the physical grand finals. Export dates directly to your device.
          </p>
        </div>

        {/* Stepper Progress Box */}
        <div className="relative border border-white/5 bg-white/[0.02] p-6 md:p-8 mb-16 select-none rounded-none">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="text-left">
              <span className="block font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase">
                NODE: CURRENT STATUS
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-mono text-[10px] text-[#C2452D]">■</span>
                <span className="font-mono text-[10px] uppercase text-white/50 tracking-wider">Phase 01: ACTIVE</span>
              </div>
            </div>

            <div className="text-left">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase">
                  QUALIFIER COUNTDOWN
                </span>
                <span className="font-mono text-[10px] text-white/40 tracking-wider">{timeLeft}</span>
              </div>
              <div className="h-[3px] w-full bg-white/[0.03] overflow-hidden rounded-none">
                <div className="bg-[#C2452D]/60 h-full transition-all duration-1000" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="lg:pl-6 lg:border-l lg:border-white/5 text-left">
              <span className="block font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase">
                PROTOCOL: OFFLINE FINALS
              </span>
              <span className="font-mono text-[10px] text-white/40 block mt-1 tracking-wider uppercase">
                40 TEAMS ONLY (Delhi Showcase)
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Track Container */}
        <div className="relative max-w-4xl mx-auto pl-10 md:pl-0 mt-8">
          
          {/* Vertical Timeline Line — single thin line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-px bg-white/5 z-0"></div>

          {/* Node items */}
          <div className="relative space-y-12">
            {timelineNodes.map((step, idx) => {
              const isActive = step.status === 'ACTIVE'
              const isEven = idx % 2 === 0
              const isDecrypted = decryptedIndices.includes(idx)
              const isDecrypting = decryptingIdx === idx

              return (
                <div 
                  key={idx} 
                  className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full transition-opacity duration-300 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  
                  {/* Center Node Marker — simple dash */}
                  <div className="absolute left-[-29px] md:left-1/2 md:-translate-x-1/2 top-6 z-20 font-mono text-[10px] text-white/15 select-none leading-none">
                    —
                  </div>

                  {/* Card content panel */}
                  <div
                    onMouseEnter={() => setHoveredNodeIdx(idx)}
                    onMouseLeave={() => setHoveredNodeIdx(null)}
                    className="w-full md:w-[46%] bg-white/[0.02] border border-white/5 p-5 rounded-none text-left transition-opacity duration-300 relative z-10 group hover:bg-white/[0.03]"
                  >
                    {/* Phase label */}
                    <div className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] mb-2">
                      PHASE {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-2.5 mb-3">
                      <h4 className="text-sm font-syne font-black uppercase tracking-tight text-white leading-none">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-1.5 font-mono text-xs select-none">
                        {/* Date */}
                        <span className="font-mono text-[10px] text-white/40">
                          {step.date}
                        </span>
                        {/* Status badge */}
                        <span className={`border font-mono px-2 py-0.5 text-[8px] uppercase tracking-widest ${getStatusStyle(step.status)}`}>
                          {getStatusLabel(step.status)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="font-mono text-[10px] text-white/25 leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Interactive Decryption box */}
                    {isDecrypted ? (
                      <div className="mt-4 border border-white/5 bg-white/[0.02] p-3 rounded-none select-none font-mono text-left">
                        <div className="flex items-center gap-1.5 text-white/30 text-[9px] uppercase tracking-widest mb-1">
                          <CheckCircle className="w-3 h-3 text-[#C2452D]" />
                          {easterEggData[idx]?.header}
                        </div>
                        <p className="text-[10px] text-white/25 leading-relaxed">
                          {easterEggData[idx]?.content}
                        </p>
                      </div>
                    ) : (
                      isDecrypting && (
                        <div className="mt-4 border border-white/5 bg-white/[0.02] p-3 rounded-none select-none font-mono text-left opacity-60">
                          <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase tracking-widest">
                            <Binary className="w-3.5 h-3.5 animate-spin shrink-0 text-[#C2452D]" />
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
                          className="flex items-center gap-1.5 border border-white/8 text-white/30 px-3 py-1.5 text-[9px] font-mono uppercase rounded-none active:translate-y-[0.5px] transition-opacity cursor-pointer select-none hover:text-white/50 hover:border-white/15"
                          title="Decrypt hidden regional operators files"
                        >
                          <Terminal className="w-3 h-3 text-white/20" /> DECRYPT LOGS
                        </button>
                      )}

                      {isDecrypted && (
                        <span className="font-mono text-[8px] text-white/15 uppercase tracking-widest select-none">
                          LOGS_DECRYPTED // OK
                        </span>
                      )}

                      {!isDecrypted && isDecrypting && <div className="w-1"></div>}

                      {/* ICS download button */}
                      <button
                        onClick={() => handleCalendarExport(step)}
                        className="flex items-center gap-1 border border-white/8 text-white/30 px-3 py-1.5 text-[9px] font-mono uppercase rounded-none active:translate-y-[0.5px] transition-opacity cursor-pointer hover:text-white/50 hover:border-white/15"
                        title={`Export ${step.title} schedule to calendar`}
                      >
                        <Calendar className="w-3 h-3 text-white/20" /> EXPORT NODE
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
