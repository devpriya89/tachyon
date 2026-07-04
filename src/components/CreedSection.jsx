import React from 'react'
import TerminalCLI from './TerminalCLI'

export function CreedSection({ siteTheme, isMuted, volume, setIsRegisterModalOpen, openAdminPanel }) {
  
  // Theme highlights mapping for glass quotes
  const themeStyles = {
    amber: { accent: 'border-yellow-400 bg-yellow-400/5 text-zinc-200' },
    crimson: { accent: 'border-red-500 bg-red-500/5 text-zinc-200' },
    acid: { accent: 'border-green-400 bg-green-400/5 text-zinc-200' },
    void: { accent: 'border-purple-500 bg-purple-500/5 text-zinc-200' },
    cyberpunk: { accent: 'border-cyan-400 bg-cyan-400/5 text-zinc-200' },
    dracula: { accent: 'border-pink-400 bg-pink-400/5 text-zinc-200' },
    custom: { accent: 'border-[var(--color-custom-primary)] bg-[var(--color-custom-primary)]/5 text-zinc-200' }
  }

  const activeStyle = themeStyles[siteTheme] || themeStyles.amber

  return (
    <section id="about" className="py-24 px-4 md:px-10 bg-transparent border-b border-white/5 max-w-[1400px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Creed Column */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left select-none">
          <div className="inline-block border border-white/10 bg-white/5 text-zinc-300 font-mono text-[10px] font-bold uppercase px-3 py-1 w-fit rounded-full mb-5">
            System Manifesto // Philosophy
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-syne font-black uppercase tracking-tight text-white leading-none mb-6">
            CREATIVE CRAFT.<br/>
            MODULAR LOGIC.<br/>
            ZERO FLUFF.
          </h2>
          
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6 font-mono">
            Mainstream hackathons have become slideshow presentations. Teams win on marketing slides instead of working software. We prioritize code.
          </p>
          
          <div className={`border-l-4 ${activeStyle.accent} pl-5 py-4 pr-4 my-6 font-mono text-xs sm:text-sm leading-relaxed border border-white/5 bg-zinc-950/40 rounded-2xl shadow-lg`}>
            "We believe the true test of a developer is the code they execute and the interfaces they refine. We reward clean repositories, offline resilience, and bold aesthetics."
          </div>

          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-mono">
            Execute commands on the interactive shell on the right to discover diagnostic logs and arcade files. Type <code className="text-indigo-400 bg-white/5 px-2.5 py-0.5 border border-white/10 rounded-lg font-bold font-mono">help</code> to list instructions. Try <code className="text-indigo-400 bg-white/5 px-2.5 py-0.5 border border-white/10 rounded-lg font-bold font-mono">snake</code> or <code className="text-indigo-400 bg-white/5 px-2.5 py-0.5 border border-white/10 rounded-lg font-bold font-mono">game</code>!
          </p>
        </div>

        {/* Interactive CLI Console */}
        <div className="lg:col-span-7 flex flex-col">
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
