import React from 'react'
import { Github, Mail } from 'lucide-react'
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
    <footer className="border-t border-white/5 bg-[#0A0A08] text-[#F8F7F4] py-12 px-4 md:px-10 font-mono text-[9px] uppercase tracking-[0.2em] mt-auto w-full select-none">

      {/* Top corner labels */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 text-white/15">
        <span>TAKUMI PROTOCOL v1.0</span>
        <span>SYS:FOOTER // NODE:00</span>
      </div>

      {/* Main footer row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-white/5">

        {/* Left — Event name */}
        <div className="flex flex-col gap-1.5">
          <span className="text-white/40 text-[11px] tracking-[0.3em] font-normal">TACHYON // 2026</span>
          <span className="text-white/15 text-[8px] tracking-[0.25em]">CRAFT. CODE. CREATE.</span>
        </div>

        {/* Center — Synth pads + Social links */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-white/15 text-[8px] tracking-[0.25em]">PROTOCOL:SYNTH_PAD</span>
          <div className="flex border border-white/5 p-1.5 gap-1 select-none">
            {pianoKeys.map((key) => (
              <button
                key={key.label}
                onClick={() => playPianoNote(key.freq)}
                className="w-7 h-7 md:w-8 md:h-8 bg-white/[0.02] border border-white/5 text-white/20 hover:text-white/50 hover:bg-white/[0.05] flex items-center justify-center font-mono text-[8px] tracking-[0.15em] cursor-pointer transition-opacity duration-200 active:bg-white/[0.08] rounded-none"
              >
                {key.label[0]}
              </button>
            ))}
          </div>

          {/* Social links row */}
          <div className="flex items-center gap-4 text-white/20">
            <a
              href="https://github.com/Tachyon"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click', isMuted, volume)}
              className="hover:text-white/50 flex items-center gap-1.5 transition-opacity duration-200 text-[9px] tracking-[0.2em]"
            >
              <Github className="w-3 h-3" /> GITHUB
            </a>
            <span className="text-white/10">—</span>
            <a
              href="https://discord.gg/Tachyon"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click', isMuted, volume)}
              className="hover:text-white/50 flex items-center gap-1.5 transition-opacity duration-200 text-[9px] tracking-[0.2em]"
            >
              DISCORD
            </a>
            <span className="text-white/10">—</span>
            <a
              href="mailto:info@Tachyon.org"
              onClick={() => playSound('click', isMuted, volume)}
              className="hover:text-white/50 flex items-center gap-1.5 transition-opacity duration-200 text-[9px] tracking-[0.2em]"
            >
              <Mail className="w-3 h-3" /> CONTACT
            </a>
          </div>
        </div>

        {/* Right — Copyright + Admin */}
        <div className="flex flex-col items-end gap-3">
          <span className="text-white/15">© 2026 TACHYON</span>
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              const pw = prompt('ENTER SECURITY ACCESS PASSCODE:')
              if (pw === 'admin123' || pw === 'root') {
                playSound('success', isMuted, volume)
                if (openAdminPanel) openAdminPanel()
              } else if (pw !== null) {
                playSound('error', isMuted, volume)
                alert('ACCESS DENIED: INVALID PASSCODE.')
              }
            }}
            className="text-white/10 hover:text-[#F8F7F4] border border-white/5 bg-white/[0.02] px-3 py-1 rounded-none cursor-pointer transition-colors duration-200 text-[8px] tracking-[0.2em] hover-glitch"
            title="Open System Administration Console"
          >
            [SYS:ADMIN]
          </button>
        </div>

      </div>

      {/* Bottom row */}
      <div className="max-w-7xl mx-auto flex justify-between items-center pt-6 text-white/10">
        <span>ZERO-FLUFF PROTOCOL // BUILT BY BUILDERS UNDER 18</span>
        <span className="hidden md:inline">48.8566°N, 2.3522°E — SIGNAL:ACTIVE</span>
      </div>

    </footer>
  )
}

export default Footer
