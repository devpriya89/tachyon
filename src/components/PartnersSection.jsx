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
          className="w-12 h-12 border border-zinc-800 rounded-full bg-black/40 p-0.5 object-cover shrink-0"
        />
      )
    }

    // Default generated pixel visualizer — rounded-full bg
    return (
      <svg className="w-12 h-12 border border-zinc-800 bg-black/40 p-2 shrink-0 rounded-full" viewBox="0 0 14 14" fill="currentColor" style={{ color: 'rgba(109, 179, 73, 0.4)' }}>
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
          className="max-h-7 max-w-[110px] object-contain opacity-40 group-hover:opacity-75 transition-opacity duration-300 filter invert brightness-200"
        />
      )
    }

    // Fallback label — clean monospaced
    return (
      <div className="text-xs font-semibold uppercase text-zinc-500 tracking-wider flex items-center gap-2 select-none group-hover:text-zinc-300 transition-colors duration-300">
        <span className="text-[#6db349] font-bold">▪</span>
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
    <section id="partners" className="py-28 border-b border-zinc-800/80 bg-transparent text-white relative max-w-[1400px] mx-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Title Section */}
        <div className="text-left max-w-2xl mb-20 select-none">
          <div className="text-[10px] uppercase tracking-widest text-[#6db349] font-extrabold mb-4">
            SYS:NETWORK — PARTNERS & CREW
          </div>
          <h2 className="text-3xl font-extrabold uppercase text-white select-none">
            Supporting Cores
          </h2>
          <p className="text-sm text-zinc-400 mt-4 max-w-md leading-relaxed font-semibold">
            Powered by a network of local Delhi system operators, creators, and infrastructure hosts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left/Top: organizers list */}
          <div className="lg:col-span-6 space-y-8">
            <div className="border-b border-zinc-800/60 pb-4 select-none text-left">
              <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
                SYS:OPERATORS
              </div>
              <h3 className="text-xl font-extrabold uppercase text-white tracking-wider">
                Platform Operators
              </h3>
              <div className="text-[8px] text-[#6db349] uppercase tracking-wider mt-2 font-bold">
                CREW // DELHI SATELLITE OPERATORS
              </div>
            </div>

            {organizers.length === 0 ? (
              <div className="border border-zinc-800 border-dashed rounded-2xl p-12 text-center text-zinc-650 text-[10px] select-none uppercase tracking-wider font-semibold">
                No active platform operators registered_
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {organizers.map((org) => (
                  <div
                    key={org.id}
                    className="bg-[#231f20]/30 p-4 flex items-center gap-4 border border-zinc-800/80 rounded-2xl transition-all duration-300 select-none relative overflow-hidden group min-h-[78px] hover:border-[#6db349]/40 hover:bg-[#231f20]/45 hover:shadow-[0_10px_25px_rgba(109,179,73,0.06)]"
                  >
                    {renderOrgAvatar(org)}
                    <div className="text-left">
                      <span className="block text-xs uppercase text-zinc-300 tracking-wider leading-none font-bold">{org.name}</span>
                      <span className="block text-[8px] text-[#6db349] uppercase tracking-widest mt-2 font-extrabold">
                        {org.role}
                      </span>
                    </div>

                    {/* Hover overlay with contact details */}
                    <div className="absolute inset-0 bg-black/95 border border-[#6db349]/20 flex flex-col justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl p-3 text-center">
                      <a
                        href={`mailto:${org.email || 'info@Tachyon.org'}`}
                        onClick={(e) => {
                          playSound('click', isMuted, volume)
                          e.stopPropagation()
                        }}
                        className="text-zinc-400 text-[9px] hover:text-white flex items-center gap-1.5 tracking-wider truncate max-w-full uppercase transition-colors duration-200 font-semibold"
                      >
                        <Mail className="w-3 h-3 shrink-0 text-zinc-500" /> {org.email || 'info@Tachyon.org'}
                      </a>
                      <a
                        href={`https://instagram.com/${org.instagram || 'Tachyon'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          playSound('click', isMuted, volume)
                          e.stopPropagation()
                        }}
                        className="text-zinc-400 text-[9px] hover:text-white flex items-center gap-1.5 tracking-wider truncate max-w-full uppercase transition-colors duration-200 font-semibold"
                      >
                        <Instagram className="w-3 h-3 shrink-0 text-zinc-500" /> @{org.instagram || 'Tachyon'}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right/Bottom: sponsors list */}
          <div className="lg:col-span-6 space-y-10">
            <div className="border-b border-zinc-800/60 pb-4 select-none text-left">
              <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-2">
                SYS:SPONSORS
              </div>
              <h3 className="text-xl font-extrabold uppercase text-white tracking-wider">
                Mainframe Sponsors
              </h3>
              <div className="text-[8px] text-[#6db349] uppercase tracking-wider mt-2 font-bold">
                INFRASTRUCTURE // HARDWARE POWER GRID
              </div>
            </div>

            <div className="space-y-8">

              {/* Core Tier */}
              <div className="text-left">
                <span className="block text-[8px] text-zinc-500 uppercase mb-3 select-none tracking-widest font-bold">
                  NODE:TIER_0 — CORE PROCESSOR
                </span>
                {sponsorsByTier.core.length === 0 ? (
                  <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-wider font-semibold">Awaiting mainframe connections_</span>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sponsorsByTier.core.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#231f20]/30 p-5 border border-zinc-800/80 rounded-2xl flex items-center justify-center min-h-[56px] transition-all duration-300 group cursor-pointer hover:border-[#6db349]/40 hover:bg-[#231f20]/45 hover:shadow-[0_10px_25px_rgba(109,179,73,0.06)]"
                      >
                        {renderSponsorLogo(sp)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-Processor Tier */}
              <div className="text-left">
                <span className="block text-[8px] text-zinc-500 uppercase mb-3 select-none tracking-widest font-bold">
                  NODE:TIER_1 — SUB-PROCESSOR
                </span>
                {sponsorsByTier.subprocessor.length === 0 ? (
                  <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-wider font-semibold">Awaiting secondary connections_</span>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {sponsorsByTier.subprocessor.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#231f20]/30 p-4 border border-zinc-800/80 rounded-2xl flex items-center justify-center min-h-[48px] transition-all duration-300 group cursor-pointer hover:border-[#6db349]/40 hover:bg-[#231f20]/45 hover:shadow-[0_10px_25px_rgba(109,179,73,0.06)]"
                      >
                        {renderSponsorLogo(sp)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Peripheral Tier */}
              <div className="text-left">
                <span className="block text-[8px] text-zinc-500 uppercase mb-3 select-none tracking-widest font-bold">
                  NODE:TIER_2 — PERIPHERAL
                </span>
                {sponsorsByTier.peripheral.length === 0 ? (
                  <span className="text-[10px] text-zinc-600 block mb-1 uppercase tracking-wider font-semibold">Awaiting peripheral logs_</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {sponsorsByTier.peripheral.map((sp) => (
                      <a
                        key={sp.id}
                        href={sp.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-zinc-800 bg-black/35 hover:border-zinc-650 hover:text-white px-3.5 py-1.5 text-[9px] uppercase rounded-full text-zinc-400 hover:shadow-[0_0_10px_rgba(109,179,73,0.15)] transition-all duration-200 select-none cursor-pointer tracking-wider font-semibold"
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
