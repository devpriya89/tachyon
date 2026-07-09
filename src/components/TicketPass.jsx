import React, { useState } from 'react'
import { Printer, Download, Check } from 'lucide-react'
import { downloadSVG } from '../utils/ticketExport'
import { playSound } from '../utils/audio'

export function TicketPass({ ticketData, ticketColorTheme = 'cyberpunk', setTicketColorTheme, isMuted, volume }) {
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' })

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Scale rotation to max 12 degrees
    const degX = -(y / (rect.height / 2)) * 12
    const degY = (x / (rect.width / 2)) * 12
    
    // Calculate holographic light glare coordinates
    const glareX = (x / (rect.width / 2)) * 40
    const glareY = (y / (rect.height / 2)) * 40
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${degX}deg) rotateY(${degY}deg)`,
      glareX,
      glareY,
      transition: 'transform 0.05s ease-out'
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      glareX: 0,
      glareY: 0,
      transition: 'transform 0.35s ease-out'
    })
  }

  const handlePrintTicket = () => {
    playSound('click', isMuted, volume)
    window.print()
  }

  // Render pixelated avatar generator
  const renderAvatar = (avatarId) => {
    const colors = {
      nebula: '#d946ef',
      amber: '#f59e0b',
      crimson: '#ef4444',
      acid: '#10b981',
      void: '#8b5cf6',
      cyberpunk: '#06b6d4',
      dracula: '#ec4899',
      custom: 'var(--color-custom-primary)'
    }
    const c = colors[ticketColorTheme] || colors.nebula

    // Standard retro grid drawings for avatars
    const avatars = {
      cyber: 'M2,2 H6 V4 H2 Z M8,2 H12 V4 H8 Z M2,6 H12 V8 H2 Z M4,10 H10 V12 H4 Z',
      agent: 'M4,2 H10 V4 H4 Z M2,4 H12 V8 H2 Z M4,8 H10 V10 H4 Z M5,10 H9 V12 H5 Z',
      wizard: 'M6,1 H8 V4 H6 Z M4,4 H10 V6 H4 Z M2,6 H12 V9 H2 Z M4,9 H10 V12 H4 Z',
      glitch: 'M2,2 H12 V4 H2 Z M4,4 H10 V6 H4 Z M2,8 H12 V10 H2 Z M6,10 H12 V12 H6 Z'
    }

    const path = avatars[avatarId] || avatars.cyber

    return (
      <svg className="w-12 h-12 border border-white/10 bg-white/5 p-1.5 shrink-0 rounded-2xl shadow-lg" viewBox="0 0 14 14" fill={c}>
        <path d={path} />
      </svg>
    )
  }

  return (
    <div className="mt-4 text-white w-full">
      <div className="text-center mb-6 print:hidden">
        <div className="inline-flex items-center justify-center p-3 border border-white/10 bg-green-500/10 text-green-400 shadow-xl rounded-2xl mb-4">
          <Check className="w-6 h-6 font-bold animate-pulse" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white tracking-wider">
          PLATFORM REGISTRY SYNCED!
        </h3>
        
        {/* Ticket custom color theme selector */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase mr-1">PASS HOLOGRAPH:</span>
          {['nebula', 'cyberpunk', 'crimson', 'acid', 'void', 'amber', 'dracula', 'custom'].map((th) => {
            const bgColors = {
              nebula: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_5px_rgba(168,85,247,0.4)]',
              cyberpunk: 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.3)]',
              amber: 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.3)]',
              crimson: 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.3)]',
              acid: 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.3)]',
              void: 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.3)]',
              dracula: 'bg-pink-400 shadow-[0_0_5px_rgba(244,114,182,0.3)]',
              custom: 'bg-[var(--color-custom-primary)] shadow-[0_0_5px_var(--color-custom-primary)]'
            }
            return (
              <button
                key={th}
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setTicketColorTheme(th)
                }}
                className={`w-5 h-5 rounded-full border border-white/10 cursor-pointer ${bgColors[th]} ${
                  ticketColorTheme === th ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : 'opacity-65 hover:scale-105 hover:opacity-100'
                } transition-all`}
                title={`Change pass theme to ${th}`}
              />
            )
          })}
        </div>
      </div>

      {/* Fluid container */}
      <div className="w-full flex justify-center perspective-1000 print:p-0">
        
        {/* VIP Holographic visa pass card */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="mt-6 w-full max-w-[420px] border border-white/10 bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 text-white p-5 md:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative font-mono text-left select-none overflow-hidden transform-style-3d scanline-card backdrop-blur-lg"
        >
          {/* Holographic Light Glare Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none z-20 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 200px at ${50 + (tiltStyle.glareX || 0)}% ${50 + (tiltStyle.glareY || 0)}%, rgba(255, 255, 255, 0.12), transparent 70%)`
            }}
          />

          {/* Top header strip */}
          <div className="border-b border-white/5 pb-4 mb-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Tachyon // TICKET SYSTEM
              </span>
              <span className="text-[7.5px] text-white/30 block mt-0.5">LAUNCH KEY // SECURITY LEVEL 1</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse shadow-[0_0_6px_#22c55e]"></span>
              <span className="text-[8px] font-bold text-zinc-300">ACTIVE</span>
            </div>
          </div>

          {/* Badge Profile section */}
          <div className="border border-white/10 bg-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 mb-5 shadow-md">
            <div className="flex items-center gap-3">
              {renderAvatar(ticketData.avatar || 'cyber')}
              <div>
                <span className="text-[8.5px] text-zinc-500 block leading-none font-bold uppercase">BUILDER IDENTIFIER</span>
                <span className="text-sm font-bold text-white block uppercase truncate tracking-wider mt-1.5">
                  {ticketData.name || 'Anonymous'}
                </span>
                <span className="text-[8px] border border-white/10 bg-white/5 px-2 py-0.5 rounded-lg text-zinc-300 inline-block mt-1 font-bold shadow-sm">
                  {ticketData.role ? ticketData.role.toUpperCase() : 'DEVELOPER'}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-[7.5px] text-zinc-500 block font-bold uppercase">TICKET ID</span>
              <span className="text-xs font-bold text-zinc-300 block tracking-widest mt-1 select-text">
                {ticketData.ticketId || '#0000'}
              </span>
            </div>
          </div>

          {/* Dynamic properties table */}
          <div className="border border-white/10 bg-zinc-900/40 rounded-2xl p-4 space-y-3 shadow-md">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px]">
              <span className="text-[8px] text-zinc-500 font-bold uppercase">Builder Handle</span>
              <span className="text-zinc-300 font-bold uppercase select-all">@{ticketData.github || 'none'}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px]">
              <span className="text-[8px] text-zinc-500 font-bold uppercase">Assigned Core Domain</span>
              <span className="text-zinc-300 font-bold uppercase">{ticketData.track ? ticketData.track.toUpperCase() : 'AI'}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px]">
              <span className="text-[8px] text-zinc-500 font-bold uppercase">Assigned Seat Slot</span>
              <span className="text-indigo-400 font-bold tracking-widest uppercase">SLOT-{ticketData.seatNumber || '00'}</span>
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[8px] text-zinc-500 font-bold uppercase">Visitor Email</span>
              <span className="text-zinc-400 font-normal select-all break-all text-right max-w-[200px] truncate leading-none">
                {ticketData.email || 'guest@domain.com'}
              </span>
            </div>

          </div>

          {/* Bottom barcode segment */}
          <div className="border-t border-white/5 pt-4 mt-5 flex justify-between items-center">
            {/* Holographic barcode stamp */}
            <div className="flex items-center gap-[2.5px] opacity-40 select-none">
              {[4, 12, 6, 16, 2, 10, 4, 14, 2, 8, 4, 16, 8, 2, 12].map((height, idx) => (
                <span key={idx} className="w-[1.5px] bg-white block" style={{ height: `${height}px` }}></span>
              ))}
            </div>
            
            <div className="text-right">
              <span className="text-[7.5px] text-zinc-500 block uppercase font-bold">SECURE GATEPASS</span>
              <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Tachyon. DELHI. 2026</span>
            </div>
          </div>

        </div>

      </div>

      {/* Pass Actions Controls */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 print:hidden select-none">
        
        <button
          onClick={handlePrintTicket}
          className="flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-zinc-300" /> Print VIP Card
        </button>

        <button
          onClick={() => {
            playSound('click', isMuted, volume)
            downloadSVG(ticketData, ticketColorTheme)
          }}
          className="flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-zinc-300" /> Download SVG Badge
        </button>

      </div>
    </div>
  )
}
export default TicketPass

