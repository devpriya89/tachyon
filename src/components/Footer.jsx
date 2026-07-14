import React from 'react'
import { Github, Mail, Instagram, Twitter } from 'lucide-react'
import { playSound } from '../utils/audio'

export function Footer({ siteTheme, isMuted, volume, openAdminPanel, instagramLink, twitterLink, githubLink }) {

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
    <footer className="border-t border-zinc-800/80 bg-[#231f20]/50 backdrop-blur-sm text-zinc-400 py-12 px-4 md:px-10 text-[9px] uppercase tracking-wider mt-auto w-full select-none font-semibold">

      {/* Top corner labels */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 text-zinc-500">
        <span>Tachyon Protocol v1.0</span>
        <span>SYS:FOOTER // NODE:00</span>
      </div>

      {/* Main footer row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-zinc-800/80">

        {/* Left — Event name */}
        <div className="flex flex-col gap-1.5 text-left">
          <span className="text-zinc-300 text-[11px] tracking-wider font-bold">Tachyon // 2026</span>
          <span className="text-zinc-500 text-[8px] tracking-wider">CRAFT. CODE. CREATE.</span>
        </div>

        {/* Center — Synth pads + Social links */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-zinc-500 text-[8px] tracking-wider">PROTOCOL:SYNTH_PAD</span>
          <div className="flex border border-zinc-800 p-1.5 gap-1 select-none bg-black/40 rounded-xl">
            {pianoKeys.map((key) => (
              <button
                key={key.label}
                onClick={() => playPianoNote(key.freq)}
                className="w-7 h-7 md:w-8 md:h-8 bg-black/40 border border-zinc-850 text-zinc-500 hover:text-[#6db349] hover:bg-[#6db349]/10 flex items-center justify-center text-[8px] tracking-wider cursor-pointer transition-all active:bg-[#6db349]/20 rounded-lg"
              >
                {key.label[0]}
              </button>
            ))}
          </div>

          {/* Social links row */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400 font-bold">
            <a
              href={githubLink || 'https://github.com/Tachyon'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click', isMuted, volume)}
              className="hover:text-[#6db349] flex items-center gap-1.5 transition-colors duration-200 text-[10px] tracking-wider"
            >
              <Github className="w-3.5 h-3.5" /> Github
            </a>
            <span className="text-zinc-700">—</span>
            <a
              href={twitterLink || 'https://twitter.com/Tachyon'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click', isMuted, volume)}
              className="hover:text-[#6db349] flex items-center gap-1.5 transition-colors duration-200 text-[10px] tracking-wider"
            >
              <Twitter className="w-3.5 h-3.5" /> Twitter
            </a>
            <span className="text-zinc-700">—</span>
            <a
              href={instagramLink || 'https://instagram.com/Tachyon'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('click', isMuted, volume)}
              className="hover:text-[#6db349] flex items-center gap-1.5 transition-colors duration-200 text-[10px] tracking-wider"
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram
            </a>
            <span className="text-zinc-700">—</span>
            <a
              href="mailto:Help@tachyonindia.org"
              onClick={() => playSound('click', isMuted, volume)}
              className="hover:text-[#6db349] flex items-center gap-1.5 transition-colors duration-200 text-[10px] tracking-wider"
            >
              <Mail className="w-3.5 h-3.5" /> Contact
            </a>
          </div>
        </div>

        {/* Right — Copyright + Admin */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <span className="text-zinc-500">© 2026 Tachyon</span>
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              if (openAdminPanel) openAdminPanel()
            }}
            className="text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-650 bg-black/30 px-3.5 py-1 rounded-full cursor-pointer transition-all duration-200 text-[8px] tracking-wider"
            title="Open System Administration Console"
          >
            [SYS:ADMIN]
          </button>
        </div>

      </div>

      {/* Bottom row */}
      <div className="max-w-7xl mx-auto flex justify-between items-center pt-6 text-zinc-600 font-bold">
        <span>ZERO-FLUFF PROTOCOL // OPEN FOR ALL BUILDERS</span>
        <span className="hidden md:inline">48.8566°N, 2.3522°E — SIGNAL:ACTIVE</span>
      </div>

    </footer>
  )
}

export default Footer
