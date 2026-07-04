import React from 'react'
import { Sparkles, Cpu, Layers, Mail, Instagram } from 'lucide-react'
import { playSound } from '../utils/audio'

export function PartnersSection({ siteTheme: _siteTheme, organizers = [], sponsors = [], isMuted, volume }) {
  
  // Custom cursor movement glow tracker coordinates script
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  // Helper to render organizer avatar or generated pixel block
  const renderOrgAvatar = (org) => {
    if (org.image && org.image.startsWith('http')) {
      return (
        <img
          src={org.image}
          alt={org.name}
          className="w-14 h-14 border border-white/10 rounded-xl bg-white/5 p-0.5 object-cover shrink-0 shadow-lg"
        />
      )
    }

    // Default generated pixel visualizer based on name
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#a855f7', '#06b6d4', '#ec4899', '#22c55e']
    const colorIndex = Math.abs(org.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length
    const c = colors[colorIndex]

    // Cool generic retro pathways svg
    return (
      <svg className="w-14 h-14 border border-white/10 bg-zinc-950/60 p-2.5 shrink-0 rounded-xl shadow-lg" viewBox="0 0 14 14" fill={c}>
        <path d="M2,2 H6 V4 H2 Z M8,2 H12 V4 H8 Z M4,6 H10 V8 H4 Z M2,10 H12 V12 H2 Z" />
      </svg>
    )
  }

  // Helper to render sponsor logo or fallback text-badge
  const renderSponsorLogo = (sponsor) => {
    if (sponsor.logo && sponsor.logo.startsWith('http')) {
      return (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className="max-h-8 max-w-[120px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-[1.03] transition-all filter invert brightness-200"
        />
      )
    }

    // High tech fallback label badge
    return (
      <div className="font-mono text-xs font-bold uppercase text-zinc-300 tracking-widest flex items-center gap-2 select-none group-hover:text-white transition-colors">
        <Cpu className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 group-hover:animate-pulse transition-all" />
        <span>{sponsor.name}</span>
      </div>
    )
  }

  // Tiers layout structure
  const sponsorsByTier = {
    core: sponsors.filter(s => s.tier === 'core'),
    subprocessor: sponsors.filter(s => s.tier === 'subprocessor'),
    peripheral: sponsors.filter(s => s.tier === 'peripheral')
  }

  return (
    <section id="partners" className="py-24 border-b border-white/5 bg-transparent text-white relative max-w-[1400px] mx-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 select-none">
          <div className="inline-block border border-white/10 bg-white/5 text-zinc-300 font-mono text-[10px] font-bold uppercase px-3 py-1 shadow-md rounded-full mb-4">
            Partners & Crew // mainframe
          </div>
          <h2 className="text-4xl sm:text-6xl font-syne font-black uppercase tracking-tight text-white select-none">
            SUPPORTING CORES
          </h2>
          <p className="mt-4 text-sm font-bold text-zinc-500 max-w-md mx-auto leading-relaxed font-mono">
            Hacklabify is powered by a network of local Delhi system moderators, creators, and technology infrastructure hosts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left/Top: organizers list */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border-b border-white/5 pb-4 select-none text-left">
              <h3 className="font-syne font-black text-xl sm:text-2xl uppercase text-white tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> PLATFORM OPERATORS
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase font-bold">Crew // Delhi Satellite Operators</p>
            </div>

            {organizers.length === 0 ? (
              <div className="border border-white/5 border-dashed rounded-2xl p-12 text-center text-zinc-500 font-mono text-xs select-none bg-zinc-900/10 shadow-2xl">
                No active platform operators registered.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {organizers.map((org) => (
                  <div
                    key={org.id}
                    onMouseMove={handleMouseMove}
                    className="bg-zinc-900/30 p-4 flex items-center gap-4 border border-white/5 shadow-xl transition-all duration-300 select-none relative overflow-hidden group min-h-[82px] rounded-2xl cyber-glass-interactive"
                  >
                    {renderOrgAvatar(org)}
                    <div className="text-left font-mono">
                      <span className="block font-black text-xs uppercase text-white tracking-wide leading-none">{org.name}</span>
                      <span className="block text-[8px] border border-white/10 bg-white/5 px-2 py-0.5 rounded-lg text-zinc-300 inline-block mt-2.5 font-bold uppercase tracking-wider">
                        {org.role}
                      </span>
                    </div>

                    {/* Hover overlay with dynamic contact details */}
                    <div className="absolute inset-0 bg-zinc-950/90 border border-white/10 flex flex-col justify-center items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl p-2.5 text-center backdrop-blur-md">
                      <a
                        href={`mailto:${org.email || 'info@hacklabify.org'}`}
                        onClick={(e) => {
                          playSound('click', isMuted, volume)
                          e.stopPropagation()
                        }}
                        className="text-zinc-300 font-mono text-[9.5px] font-bold hover:text-cyan-400 flex items-center gap-1.5 tracking-wider truncate max-w-full"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0 text-zinc-400 hover:text-cyan-450" /> {org.email || 'info@hacklabify.org'}
                      </a>
                      <a
                        href={`https://instagram.com/${org.instagram || 'hacklabify'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          playSound('click', isMuted, volume)
                          e.stopPropagation()
                        }}
                        className="text-zinc-300 font-mono text-[9.5px] font-bold hover:text-indigo-400 flex items-center gap-1.5 tracking-wider truncate max-w-full"
                      >
                        <Instagram className="w-3.5 h-3.5 shrink-0 text-zinc-400 hover:text-indigo-455" /> @{org.instagram || 'hacklabify'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right/Bottom: sponsors list */}
          <div className="lg:col-span-6 space-y-8">
            <div className="border-b border-white/5 pb-4 select-none text-left">
              <h3 className="font-syne font-black text-xl sm:text-2xl uppercase text-white tracking-wider flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" /> MAINFRAME SPONSORS
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase font-bold">Infrastructure // Hardware Power Grid</p>
            </div>

            <div className="space-y-6">
              
              {/* Core Tier */}
              <div className="text-left">
                <span className="block font-mono text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase mb-3 select-none">
                  [ CORE PROCESSOR SPONSORS ]
                </span>
                {sponsorsByTier.core.length === 0 ? (
                  <span className="text-[10px] italic text-zinc-650 block mb-1">Awaiting mainframe connections...</span>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sponsorsByTier.core.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseMove={handleMouseMove}
                        className="bg-zinc-900/30 p-5 border border-white/5 shadow-xl flex items-center justify-center min-h-[58px] transition-all rounded-2xl group cursor-pointer cyber-glass-interactive"
                      >
                        {renderSponsorLogo(sp)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-Processor Tier */}
              <div className="text-left">
                <span className="block font-mono text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase mb-3 select-none">
                  [ SUB-PROCESSOR SPONSORS ]
                </span>
                {sponsorsByTier.subprocessor.length === 0 ? (
                  <span className="text-[10px] italic text-zinc-650 block mb-1">Awaiting secondary connections...</span>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sponsorsByTier.subprocessor.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseMove={handleMouseMove}
                        className="bg-zinc-900/30 p-4 border border-white/5 shadow-lg flex items-center justify-center min-h-[52px] transition-all rounded-xl group cursor-pointer cyber-glass-interactive"
                      >
                        {renderSponsorLogo(sp)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Peripheral Tier */}
              <div className="text-left">
                <span className="block font-mono text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase mb-3 select-none">
                  [ PERIPHERAL NODES ]
                </span>
                {sponsorsByTier.peripheral.length === 0 ? (
                  <span className="text-[10px] italic text-zinc-650 block mb-1">Awaiting peripheral logs...</span>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {sponsorsByTier.peripheral.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase rounded-lg text-zinc-300 shadow-sm hover:bg-white/10 hover:text-white transition-all select-none cursor-pointer"
                      >
                        {sp.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
export default PartnersSection
