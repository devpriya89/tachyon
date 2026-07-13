import React from 'react'
import TerminalCLI from './TerminalCLI'

export function CreedSection({ siteTheme, isMuted, volume, setIsRegisterModalOpen, openAdminPanel }) {

  return (
    <section id="about" className="py-28 px-4 md:px-10 bg-transparent border-b border-zinc-800/80 max-w-[1400px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">

        {/* Creed Column */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left select-none">

          {/* SYS label */}
          <span className="text-[10px] uppercase tracking-widest text-[#6db349] font-extrabold mb-6 block">
            SYS:01 — MANIFESTO // PHILOSOPHY
          </span>

          <h2 className="font-extrabold text-3xl md:text-4xl uppercase text-white leading-tight mb-8">
            CREATIVE CRAFT.<br/>
            MODULAR LOGIC.<br/>
            ZERO FLUFF.
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mb-6">
            Mainstream hackathons have become slideshow presentations. Teams win on marketing slides instead of working software. We prioritize code.
          </p>

          {/* Blockquote — premium green card */}
          <div className="border-l-4 border-[#6db349] pl-5 py-4 my-6 bg-[#6db349]/5 rounded-r-xl">
            <p className="text-zinc-300 text-xs italic leading-relaxed">
              "We believe the true test of a developer is the code they execute and the interfaces they refine. We reward clean repositories, offline resilience, and bold aesthetics."
            </p>
          </div>

          <p className="text-zinc-500 text-xs leading-relaxed mt-4 max-w-lg">
            Execute commands on the interactive shell to discover diagnostic logs and arcade files. Type{' '}
            <code className="text-[#6db349] bg-[#6db349]/10 px-1.5 py-0.5 border border-[#6db349]/20 rounded-md font-semibold text-[10px]">help</code>{' '}
            to list instructions. Try{' '}
            <code className="text-[#6db349] bg-[#6db349]/10 px-1.5 py-0.5 border border-[#6db349]/20 rounded-md font-semibold text-[10px]">snake</code>{' '}
            or{' '}
            <code className="text-[#6db349] bg-[#6db349]/10 px-1.5 py-0.5 border border-[#6db349]/20 rounded-md font-semibold text-[10px]">game</code>
          </p>
        </div>

        {/* Interactive CLI Console */}
        <div className="lg:col-span-7 flex flex-col border border-zinc-800/80 bg-transparent rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.55)]">
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


