import React from 'react'
import { Github, Mail, Heart, Sparkles } from 'lucide-react'
import Logo from './Logo'
import { playSound } from '../utils/audio'

export function Footer({ siteTheme, isMuted, volume, openAdminPanel }) {
  
  // Custom synth triggers for footer Launchpad audio pads
  const pianoKeys = [
    { label: 'C', freq: 261.63 },
    { label: 'D', freq: 293.66 },
    { label: 'E', freq: 329.63 },
    { label: 'F', freq: 349.23 },
    { label: 'G', freq: 392.00 },
    { label: 'A', freq: 440.00 },
    { label: 'B', freq: 493.88 },
    { label: 'C5', freq: 523.25 }
  ]

  const playPianoNote = (freq) => {
    if (isMuted) return
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      
      const val = 0.08 * (volume * 2)
      gain.gain.setValueAtTime(val, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <footer className="border-t border-white/5 bg-zinc-950/20 text-zinc-400 py-16 px-4 md:px-10 font-mono text-xs mt-auto max-w-[1400px] mx-auto w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/5 pb-10 mb-8">
        
        {/* Branding */}
        <div className="flex items-center gap-3">
          <Logo theme={siteTheme} />
          <div className="flex flex-col text-left select-none">
            <span className="font-bold text-sm tracking-wider text-white">HACKLABIFY // 2026</span>
            <span className="text-[10px] text-zinc-500">Craft. Code. Create.</span>
          </div>
        </div>

        {/* Interactive Launchpad Synthesizer */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase select-none">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 animate-pulse" /> Launchpad Synth Pads
          </div>
          <div className="flex bg-zinc-950/40 border border-white/10 p-2 shadow-2xl rounded-2xl gap-1.5 select-none backdrop-blur-md">
            {pianoKeys.map((key, idx) => {
              // Map pads to beautiful pastel glow borders
              const glowBorders = [
                'hover:border-yellow-400/50 hover:shadow-[0_0_8px_rgba(234,179,8,0.2)]',
                'hover:border-red-400/50 hover:shadow-[0_0_8px_rgba(239,68,68,0.2)]',
                'hover:border-green-400/50 hover:shadow-[0_0_8px_rgba(74,222,128,0.2)]',
                'hover:border-purple-400/50 hover:shadow-[0_0_8px_rgba(168,85,247,0.2)]',
                'hover:border-cyan-400/50 hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]',
                'hover:border-pink-400/50 hover:shadow-[0_0_8px_rgba(244,114,182,0.2)]',
                'hover:border-blue-400/50 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]',
                'hover:border-emerald-400/50 hover:shadow-[0_0_8px_rgba(16,185,129,0.2)]'
              ]
              return (
                <button
                  key={key.label}
                  onClick={() => {
                    playPianoNote(key.freq)
                  }}
                  className={`w-8 h-8 md:w-9 md:h-9 bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer transition-all select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] active:scale-90 ${glowBorders[idx % glowBorders.length]}`}
                >
                  {key.label[0]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-4 text-zinc-500 font-mono text-xs">
          <a
            href="https://github.com/hacklabify"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click', isMuted, volume)}
            className="hover:text-white flex items-center gap-1 transition-colors font-bold uppercase text-[10px]"
          >
            <Github className="w-3.5 h-3.5" /> github
          </a>
          <span className="select-none text-zinc-700">//</span>
          <a
            href="https://discord.gg/hacklabify"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click', isMuted, volume)}
            className="hover:text-white flex items-center gap-1 transition-colors font-bold uppercase text-[10px]"
          >
            discord
          </a>
          <span className="select-none text-zinc-700">//</span>
          <a
            href="mailto:info@hacklabify.org"
            onClick={() => playSound('click', isMuted, volume)}
            className="hover:text-white flex items-center gap-1 transition-colors font-bold uppercase text-[10px]"
          >
            <Mail className="w-3.5 h-3.5" /> contact
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-zinc-500 text-[10px] gap-4 text-left">
        <span className="font-bold">Built by builders under 18. Strict enforcement of zero-fluff policies.</span>
        <div className="flex items-center gap-3 select-none">
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              const pw = prompt('ENTER SECURITY ACCESS PASSCODE:')
              if (pw === 'admin123' || pw === 'root') {
                playSound('success', isMuted, volume)
                if (openAdminPanel) openAdminPanel()
              } else if (pw !== null) {
                playSound('error', isMuted, volume)
                alert('🚫 ACCESS DENIED: INVALID PASSCODE.')
              }
            }}
            className="hover:text-white cursor-pointer flex items-center gap-1.5 text-[9px] uppercase font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300 transition-all shadow-md hover:bg-white/10"
            title="Open System Administration Console"
          >
            🔒 ADMIN CORE
          </button>
          <span className="text-zinc-700 select-none">//</span>
          <div className="flex items-center gap-1.5">
            <span>Crafted with love</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
