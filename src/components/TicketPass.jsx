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
    
    const degX = -(y / (rect.height / 2)) * 4
    const degY = (x / (rect.width / 2)) * 4
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${degX}deg) rotateY(${degY}deg)`,
      transition: 'transform 0.05s ease-out'
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.35s ease-out'
    })
  }

  const handlePrintTicket = () => {
    playSound('click', isMuted, volume)
    window.print()
  }

  // Render pixelated avatar generator
  const renderAvatar = (avatarId) => {
    const avatars = {
      cyber: 'M2,2 H6 V4 H2 Z M8,2 H12 V4 H8 Z M2,6 H12 V8 H2 Z M4,10 H10 V12 H4 Z',
      agent: 'M4,2 H10 V4 H4 Z M2,4 H12 V8 H2 Z M4,8 H10 V10 H4 Z M5,10 H9 V12 H5 Z',
      wizard: 'M6,1 H8 V4 H6 Z M4,4 H10 V6 H4 Z M2,6 H12 V9 H2 Z M4,9 H10 V12 H4 Z',
      glitch: 'M2,2 H12 V4 H2 Z M4,4 H10 V6 H4 Z M2,8 H12 V10 H2 Z M6,10 H12 V12 H6 Z'
    }

    const path = avatars[avatarId] || avatars.cyber

    return (
      <svg className="w-11 h-11 border border-white/5 bg-white/[0.02] p-1.5 shrink-0 rounded-none" viewBox="0 0 14 14" fill="#F8F7F4" fillOpacity="0.3">
        <path d={path} />
      </svg>
    )
  }

  return (
    <div className="mt-4 text-[#F8F7F4] w-full">
      <div className="text-center mb-6 print:hidden">
        <div className="inline-flex items-center justify-center p-3 border border-white/8 bg-white/[0.02] text-[#F8F7F4] rounded-none mb-4">
          <Check className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-syne font-black uppercase text-white tracking-widest">
          SYS: REGISTRY SYNCED
        </h3>
        <span className="font-mono text-[8px] text-white/20 tracking-[0.3em] mt-1 block">NODE:VERIFIED — PROTOCOL ACTIVE</span>
        
        {/* Ticket custom color theme selector */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mr-1">PASS_THEME:</span>
          {['nebula', 'cyberpunk', 'crimson', 'acid', 'void', 'amber', 'dracula', 'custom'].map((th) => {
            const bgColors = {
              nebula: 'bg-white/20',
              cyberpunk: 'bg-white/25',
              amber: 'bg-white/20',
              crimson: 'bg-white/20',
              acid: 'bg-white/20',
              void: 'bg-white/20',
              dracula: 'bg-white/20',
              custom: 'bg-white/15'
            }
            return (
              <button
                key={th}
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setTicketColorTheme(th)
                }}
                className={`w-4 h-4 rounded-none border cursor-pointer ${bgColors[th]} ${
                  ticketColorTheme === th ? 'border-white/40 scale-110' : 'border-white/8 opacity-50 hover:opacity-80'
                } transition-opacity`}
                title={`Change pass theme to ${th}`}
              />
            )
          })}
        </div>
      </div>

      {/* Fluid container */}
      <div className="w-full flex justify-center print:p-0">
        
        {/* Pass card — brutalist flat */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="mt-4 w-full max-w-[420px] border border-white/8 bg-[#0A0A08] text-[#F8F7F4] p-5 md:p-6 rounded-none relative font-mono text-left select-none overflow-hidden"
        >

          {/* Top header strip */}
          <div className="border-b border-white/5 pb-4 mb-5 flex justify-between items-center">
            <div>
              <span className="text-sm font-syne font-black text-white uppercase tracking-widest block">
                PASS:001
              </span>
              <span className="font-mono text-[9px] text-white/35 uppercase tracking-[0.15em] block mt-1">TACHYON // TICKET SYSTEM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 bg-white/30 rounded-none inline-block"></span>
              <span className="font-mono text-[8px] text-white/35 uppercase tracking-[0.15em]">ACTIVE</span>
            </div>
          </div>

          {/* Badge Profile section */}
          <div className="border border-white/5 bg-white/[0.02] rounded-none p-4 flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              {renderAvatar(ticketData.avatar || 'cyber')}
              <div>
                <span className="font-mono text-[9px] text-white/35 block leading-none uppercase tracking-[0.15em]">BUILDER IDENTIFIER</span>
                <span className="font-mono text-sm text-white/80 block uppercase truncate tracking-wider mt-1.5">
                  {ticketData.name || 'Anonymous'}
                </span>
                <span className="font-mono text-[8px] border border-white/8 bg-white/[0.03] px-2 py-0.5 rounded-none text-white/40 inline-block mt-1 uppercase tracking-[0.15em]">
                  {ticketData.role ? ticketData.role.toUpperCase() : 'DEVELOPER'}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="font-mono text-[9px] text-white/35 block uppercase tracking-[0.15em]">TICKET ID</span>
              <span className="font-mono text-[8px] text-white/15 block tracking-[0.3em] mt-1 select-text">
                {ticketData.ticketId || '#0000'}
              </span>
            </div>
          </div>

          {/* Dynamic properties table */}
          <div className="border border-white/5 bg-white/[0.02] rounded-none p-4 space-y-3">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-white/35 uppercase tracking-[0.15em]">Builder Handle</span>
              <span className="font-mono text-[9px] text-white/50 uppercase select-all">@{ticketData.github || 'none'}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-white/35 uppercase tracking-[0.15em]">Core Domain</span>
              <span className="font-mono text-[9px] text-white/50 uppercase">{ticketData.track ? ticketData.track.toUpperCase() : 'AI'}</span>
            </div>

            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-white/35 uppercase tracking-[0.15em]">Seat Slot</span>
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest">SLOT-{ticketData.seatNumber || '00'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] text-white/35 uppercase tracking-[0.15em]">Visitor Email</span>
              <span className="font-mono text-[9px] text-white/40 select-all break-all text-right max-w-[200px] truncate leading-none">
                {ticketData.email || 'guest@domain.com'}
              </span>
            </div>

          </div>

          {/* Bottom barcode segment */}
          <div className="border-t border-white/5 pt-4 mt-5 flex justify-between items-center">
            {/* Barcode stamp */}
            <div className="flex items-center gap-[2.5px] opacity-20 select-none">
              {[4, 12, 6, 16, 2, 10, 4, 14, 2, 8, 4, 16, 8, 2, 12].map((height, idx) => (
                <span key={idx} className="w-[1.5px] bg-white/40 block" style={{ height: `${height}px` }}></span>
              ))}
            </div>
            
            <div className="text-right">
              <span className="font-mono text-[8px] text-white/15 block uppercase tracking-[0.3em]">NODE:VERIFIED</span>
              <span className="font-mono text-[9px] text-white/25 tracking-[0.15em]">TACHYON. DELHI. 2026</span>
            </div>
          </div>

        </div>

      </div>

      {/* Pass Actions Controls */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 print:hidden select-none">
        
        <button
          onClick={handlePrintTicket}
          className="flex items-center gap-1.5 border border-white/8 bg-transparent hover:bg-white/[0.03] text-white/30 font-mono text-[9px] uppercase tracking-[0.15em] px-4 py-2.5 rounded-none active:scale-95 transition-opacity cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-white/25" /> PRINT PASS
        </button>

        <button
          onClick={() => {
            playSound('click', isMuted, volume)
            downloadSVG(ticketData, ticketColorTheme)
          }}
          className="flex items-center gap-1.5 border border-white/8 bg-transparent hover:bg-white/[0.03] text-white/30 font-mono text-[9px] uppercase tracking-[0.15em] px-4 py-2.5 rounded-none active:scale-95 transition-opacity cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-white/25" /> DOWNLOAD SVG
        </button>

      </div>
    </div>
  )
}
export default TicketPass
