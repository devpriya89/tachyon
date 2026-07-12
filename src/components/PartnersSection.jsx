import React from 'react'
import { Mail, Instagram } from 'lucide-react'
import { playSound } from '../utils/audio'

export function PartnersSection({ siteTheme: _siteTheme, organizers = [], sponsors = [], isMuted, volume }) {

  // Helper to render organizer avatar or generated pixel block
  const renderOrgAvatar = (org) => {
    if (org.image && org.image.startsWith('http')) {
      return (
        <img
          src={org.image}
          alt={org.name}
          className="w-12 h-12 border border-white/5 rounded-none bg-white/[0.02] p-0.5 object-cover shrink-0"
        />
      )
    }

    // Default generated pixel visualizer — monochrome brutalist
    return (
      <svg className="w-12 h-12 border border-white/5 bg-white/[0.02] p-2 shrink-0 rounded-none" viewBox="0 0 14 14" fill="currentColor" style={{ color: 'rgba(255,255,255,0.1)' }}>
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
          className="max-h-7 max-w-[110px] object-contain opacity-40 group-hover:opacity-70 transition-opacity duration-300 filter invert brightness-200"
        />
      )
    }

    // Fallback label — clean monospaced
    return (
      <div className="font-mono text-xs font-normal uppercase text-white/40 tracking-widest flex items-center gap-2 select-none group-hover:text-white/60 transition-colors duration-300">
        <span className="text-white/15">▪</span>
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
    <section id="partners" className="py-28 border-b border-white/5 bg-transparent text-[#F8F7F4] relative max-w-[1400px] mx-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Title Section */}
        <div className="text-left max-w-2xl mb-20 select-none">
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">
            SYS:NETWORK — PARTNERS & CREW
          </div>
          <h2 className="font-syne font-black text-2xl uppercase text-white select-none">
            SUPPORTING CORES
          </h2>
          <div className="w-8 h-px bg-white/10 mt-4 mb-5" />
          <p className="text-[11px] text-white/30 max-w-md leading-relaxed font-mono uppercase tracking-wider">
            Powered by a network of local Delhi system operators, creators, and infrastructure hosts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left/Top: organizers list */}
          <div className="lg:col-span-6 space-y-8">
            <div className="border-b border-white/5 pb-4 select-none text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-2">
                SYS:OPERATORS
              </div>
              <h3 className="font-syne font-black text-xl uppercase text-white tracking-wider">
                PLATFORM OPERATORS
              </h3>
              <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest mt-2">
                CREW // DELHI SATELLITE OPERATORS
              </div>
            </div>

            {organizers.length === 0 ? (
              <div className="border border-white/5 border-dashed rounded-none p-12 text-center text-white/20 font-mono text-[10px] select-none uppercase tracking-wider">
                No active platform operators registered_
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {organizers.map((org) => (
                  <div
                    key={org.id}
                    className="bg-white/[0.02] p-4 flex items-center gap-4 border border-white/5 rounded-none transition-opacity duration-300 select-none relative overflow-hidden group min-h-[78px]"
                  >
                    {renderOrgAvatar(org)}
                    <div className="text-left font-mono">
                      <span className="block text-xs uppercase text-white/50 tracking-wider leading-none">{org.name}</span>
                      <span className="block text-[8px] text-white/20 uppercase tracking-widest mt-2">
                        {org.role}
                      </span>
                    </div>

                    {/* Hover overlay with contact details */}
                    <div className="absolute inset-0 bg-[#0A0A08]/95 border border-white/5 flex flex-col justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none p-3 text-center">
                      <a
                        href={`mailto:${org.email || 'info@Tachyon.org'}`}
                        onClick={(e) => {
                          playSound('click', isMuted, volume)
                          e.stopPropagation()
                        }}
                        className="text-white/40 font-mono text-[9px] hover:text-white/70 flex items-center gap-1.5 tracking-wider truncate max-w-full uppercase transition-colors duration-200"
                      >
                        <Mail className="w-3 h-3 shrink-0 text-white/20" /> {org.email || 'info@Tachyon.org'}
                      </a>
                      <a
                        href={`https://instagram.com/${org.instagram || 'Tachyon'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          playSound('click', isMuted, volume)
                          e.stopPropagation()
                        }}
                        className="text-white/40 font-mono text-[9px] hover:text-white/70 flex items-center gap-1.5 tracking-wider truncate max-w-full uppercase transition-colors duration-200"
                      >
                        <Instagram className="w-3 h-3 shrink-0 text-white/20" /> @{org.instagram || 'Tachyon'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right/Bottom: sponsors list */}
          <div className="lg:col-span-6 space-y-10">
            <div className="border-b border-white/5 pb-4 select-none text-left">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-2">
                SYS:SPONSORS
              </div>
              <h3 className="font-syne font-black text-xl uppercase text-white tracking-wider">
                MAINFRAME SPONSORS
              </h3>
              <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest mt-2">
                INFRASTRUCTURE // HARDWARE POWER GRID
              </div>
            </div>

            <div className="space-y-8">

              {/* Core Tier */}
              <div className="text-left">
                <span className="block font-mono text-[8px] text-white/20 uppercase mb-3 select-none tracking-[0.25em]">
                  NODE:TIER_0 — CORE PROCESSOR
                </span>
                {sponsorsByTier.core.length === 0 ? (
                  <span className="text-[10px] text-white/15 block mb-1 font-mono uppercase tracking-wider">Awaiting mainframe connections_</span>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sponsorsByTier.core.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/[0.02] p-5 border border-white/5 rounded-none flex items-center justify-center min-h-[56px] transition-opacity duration-300 group cursor-pointer hover:bg-white/[0.04]"
                      >
                        {renderSponsorLogo(sp)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-Processor Tier */}
              <div className="text-left">
                <span className="block font-mono text-[8px] text-white/20 uppercase mb-3 select-none tracking-[0.25em]">
                  NODE:TIER_1 — SUB-PROCESSOR
                </span>
                {sponsorsByTier.subprocessor.length === 0 ? (
                  <span className="text-[10px] text-white/15 block mb-1 font-mono uppercase tracking-wider">Awaiting secondary connections_</span>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sponsorsByTier.subprocessor.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/[0.02] p-4 border border-white/5 rounded-none flex items-center justify-center min-h-[48px] transition-opacity duration-300 group cursor-pointer hover:bg-white/[0.04]"
                      >
                        {renderSponsorLogo(sp)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Peripheral Tier */}
              <div className="text-left">
                <span className="block font-mono text-[8px] text-white/20 uppercase mb-3 select-none tracking-[0.25em]">
                  NODE:TIER_2 — PERIPHERAL
                </span>
                {sponsorsByTier.peripheral.length === 0 ? (
                  <span className="text-[10px] text-white/15 block mb-1 font-mono uppercase tracking-wider">Awaiting peripheral logs_</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sponsorsByTier.peripheral.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/5 bg-transparent px-3 py-1.5 font-mono text-[9px] uppercase rounded-none text-white/30 hover:text-white/50 hover:border-white/8 transition-colors duration-200 select-none cursor-pointer tracking-widest"
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
