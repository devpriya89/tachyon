import React from 'react'
import TerminalCLI from './TerminalCLI'

export function CreedSection({ siteTheme, isMuted, volume, setIsRegisterModalOpen, openAdminPanel }) {

  return (
    <section id="about" className="py-28 px-4 md:px-10 bg-transparent border-b border-white/5 max-w-[1400px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">

        {/* Creed Column */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left select-none">

          {/* SYS label */}
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-6 block">
            SYS:01 — MANIFESTO // PHILOSOPHY
          </span>

          <h2 className="font-syne font-black text-3xl uppercase text-[#F8F7F4] leading-tight mb-8">
            CREATIVE CRAFT.<br/>
            MODULAR LOGIC.<br/>
            ZERO FLUFF.
          </h2>

          <p className="font-mono text-xs text-white/35 leading-relaxed max-w-lg mb-8">
            Mainstream hackathons have become slideshow presentations. Teams win on marketing slides instead of working software. We prioritize code.
          </p>

          {/* Blockquote — flat, borderless brutalist card */}
          <div className="border-l border-white/8 pl-5 py-4 my-6 bg-white/[0.02] rounded-none">
            <p className="font-mono text-xs text-white/30 leading-relaxed">
              "We believe the true test of a developer is the code they execute and the interfaces they refine. We reward clean repositories, offline resilience, and bold aesthetics."
            </p>
          </div>

          <p className="font-mono text-xs text-white/25 leading-relaxed mt-4 max-w-lg">
            Execute commands on the interactive shell to discover diagnostic logs and arcade files. Type{' '}
            <code className="text-[#F8F7F4]/50 bg-white/[0.03] px-1.5 py-0.5 border border-white/5 rounded-none font-mono text-[10px]">help</code>{' '}
            to list instructions. Try{' '}
            <code className="text-[#F8F7F4]/50 bg-white/[0.03] px-1.5 py-0.5 border border-white/5 rounded-none font-mono text-[10px]">snake</code>{' '}
            or{' '}
            <code className="text-[#F8F7F4]/50 bg-white/[0.03] px-1.5 py-0.5 border border-white/5 rounded-none font-mono text-[10px]">game</code>
          </p>
        </div>

        {/* Interactive CLI Console */}
        <div className="lg:col-span-7 flex flex-col border border-white/6 bg-transparent rounded-none">
          <TerminalCLI
            siteTheme={siteTheme}
            isMuted={isMuted}
            volume={volume}
            setIsRegisterModalOpen={setIsRegisterModalOpen}
            openAdminPanel={openAdminPanel}
          />
        </div>

      </div>
    </section>
  )
}
export default CreedSection


