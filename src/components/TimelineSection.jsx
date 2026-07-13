import React, { useState, useEffect } from 'react'
import { Calendar, Binary, CheckCircle, Terminal } from 'lucide-react'
import { downloadICS } from '../utils/icsGenerator'
import { playSound } from '../utils/audio'

export function TimelineSection({ siteTheme, isMuted, volume, timelineNodes, venueLocation }) {
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
      location: step.phase === '05' ? (venueLocation || 'New Delhi Central, Delhi, India') : 'Online Website'
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
        return 'text-[#6db349] border-[#6db349]/30 bg-[#6db349]/5'
      case 'UPCOMING':
        return 'text-zinc-500 border-zinc-800 bg-black/20'
      case 'COMPLETED':
        return 'text-zinc-600 border-zinc-900 bg-black/10'
      default:
        return 'text-zinc-500 border-zinc-800 bg-black/20'
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
    <section id="timeline" className="py-24 border-b border-zinc-800/80 bg-transparent max-w-[1400px] mx-auto w-full relative">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#6db349] font-extrabold block mb-4">
              SYS:03 — PHASE ROADMAP // SCHEDULING
            </span>
            <h2 className="text-3xl font-extrabold uppercase text-white">
              Event Scheduling
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-xs leading-relaxed text-left">
            Milestones along the way from registrations to the physical grand finals. Export dates directly to your device.
          </p>
        </div>

        {/* Stepper Progress Box - premium dashboard widget */}
        <div className="relative border border-zinc-800 bg-[#231f20]/40 backdrop-blur-sm p-6 md:p-8 mb-16 select-none rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="text-left">
              <span className="block text-[9px] tracking-wider text-zinc-500 uppercase font-bold">
                NODE: CURRENT STATUS
              </span>
              <div className="flex items-center gap-2 mt-1.5 font-semibold text-xs">
                <span className="w-2 h-2 rounded-full bg-[#6db349] animate-pulse"></span>
                <span className="uppercase text-[#6db349] font-bold">Phase 01: Active</span>
              </div>
            </div>

            <div className="text-left">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[9px] tracking-wider text-zinc-500 uppercase font-bold">
                  QUALIFIER COUNTDOWN
                </span>
                <span className="text-xs text-white font-bold">{timeLeft}</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 overflow-hidden rounded-full">
                <div className="bg-[#6db349] h-full transition-all duration-1000 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="lg:pl-6 lg:border-l lg:border-zinc-800/60 text-left">
              <span className="block text-[9px] tracking-wider text-zinc-500 uppercase font-bold">
                PROTOCOL: OFFLINE FINALS
              </span>
              <span className="text-xs text-zinc-300 block mt-1 tracking-wider uppercase font-bold">
                40 TEAMS ONLY (Delhi Showcase)
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Track Container */}
        <div className="relative max-w-4xl mx-auto pl-10 md:pl-0 mt-8">
          
          {/* Vertical Timeline Line — glowing brand line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#6db349] via-zinc-800 to-zinc-800 z-0"></div>

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
                  
                  {/* Center Node Marker — glowing circles */}
                  <div className="absolute left-[-32px] md:left-1/2 md:-translate-x-1/2 top-6 z-20 flex items-center justify-center">
                    {isActive ? (
                      <div className="w-4 h-4 rounded-full bg-[#231f20] border-2 border-[#6db349] shadow-[0_0_10px_rgba(109,179,73,0.6)] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6db349]"></span>
                      </div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-[#231f20] border-2 border-zinc-700"></div>
                    )}
                  </div>

                  {/* Card content panel */}
                  <div
                    onMouseEnter={() => setHoveredNodeIdx(idx)}
                    onMouseLeave={() => setHoveredNodeIdx(null)}
                    className="w-full md:w-[46%] bg-[#231f20]/35 border border-zinc-800/80 p-5 rounded-2xl text-left transition-all duration-300 relative z-10 group hover:border-[#6db349]/45 hover:bg-[#231f20]/45 hover:shadow-[0_10px_25px_rgba(109,179,73,0.06)]"
                  >
                    {/* Phase label */}
                    <div className="text-[10px] text-[#6db349] font-extrabold uppercase tracking-widest mb-2">
                      PHASE {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="flex flex-wrap justify-between items-center border-b border-zinc-800/60 pb-2.5 mb-3">
                      <h4 className="text-sm font-bold uppercase tracking-tight text-white leading-none">
                        {step.title}
                      </h4>
                      <div className="flex items-center gap-1.5 font-semibold text-xs select-none">
                        {/* Date */}
                        <span className="text-[10px] text-zinc-500 font-bold">
                          {step.date}
                        </span>
                        {/* Status badge */}
                        <span className={`border font-semibold px-2.5 py-0.5 text-[8px] uppercase tracking-wider rounded-full ${getStatusStyle(step.status)}`}>
                          {getStatusLabel(step.status)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Interactive Decryption box */}
                    {isDecrypted ? (
                      <div className="mt-4 border border-[#6db349]/20 bg-[#6db349]/5 p-4 rounded-xl font-mono text-left">
                        <div className="flex items-center gap-1.5 text-zinc-300 text-[9px] uppercase tracking-wider font-extrabold mb-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#6db349]" />
                          {easterEggData[idx]?.header}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-semibold">
                          {easterEggData[idx]?.content}
                        </p>
                      </div>
                    ) : (
                      isDecrypting && (
                        <div className="mt-4 border border-zinc-800 bg-black/40 p-4 rounded-xl font-mono text-left opacity-60">
                          <div className="flex items-center gap-2 text-zinc-400 text-[9px] uppercase tracking-wider font-bold">
                            <Binary className="w-3.5 h-3.5 animate-spin shrink-0 text-[#6db349]" />
                            RUNNING CORE DECRYPTOR SCANS...
                          </div>
                        </div>
                      )
                    )}

                    {/* Exporter & decrypt controls */}
                    <div className="mt-4 pt-2.5 border-t border-zinc-800/60 flex justify-between items-center gap-2">
                      
                      {/* Decryption trigger button */}
                      {!isDecrypted && !isDecrypting && (
                        <button
                          onClick={() => handleDecryptLogs(idx)}
                          className="flex items-center gap-1.5 border border-zinc-750 text-zinc-400 hover:text-white px-3 py-1.5 text-[9px] font-semibold uppercase rounded-full active:translate-y-[0.5px] transition-all cursor-pointer select-none"
                          title="Decrypt hidden regional operators files"
                        >
                          <Terminal className="w-3 h-3 text-zinc-500" /> Decrypt Logs
                        </button>
                      )}

                      {isDecrypted && (
                        <span className="text-[8px] text-[#6db349] uppercase tracking-widest select-none font-bold">
                          LOGS_DECRYPTED // OK
                        </span>
                      )}

                      {!isDecrypted && isDecrypting && <div className="w-1"></div>}

                      {/* ICS download button */}
                      <button
                        onClick={() => handleCalendarExport(step)}
                        className="flex items-center gap-1 border border-zinc-750 text-zinc-400 hover:text-white px-3 py-1.5 text-[9px] font-semibold uppercase rounded-full active:translate-y-[0.5px] transition-all cursor-pointer"
                        title={`Export ${step.title} schedule to calendar`}
                      >
                        <Calendar className="w-3 h-3 text-zinc-500" /> Export Node
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
