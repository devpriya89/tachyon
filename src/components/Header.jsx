import React, { useState } from 'react'
import { Volume2, VolumeX, Power } from 'lucide-react'
import Logo from './Logo'
import { playSound } from '../utils/audio'

export function Header({
  activeSection,
  setActiveSection,
  siteTheme,
  changeTheme,
  isMuted,
  toggleMute,
  volume,
  setVolume,
  toggleCrtPower,
  ticketData,
  setIsRegisterModalOpen
}) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // theme classes helper
  const themeStyles = {
    amber: { bg: 'bg-gradient-to-r from-amber-400 to-yellow-400', text: 'text-black', activeTab: 'bg-white/10 text-white' },
    crimson: { bg: 'bg-gradient-to-r from-red-600 to-red-500', text: 'text-white', activeTab: 'bg-white/10 text-white' },
    acid: { bg: 'bg-gradient-to-r from-green-500 to-emerald-400', text: 'text-black', activeTab: 'bg-white/10 text-white' },
    void: { bg: 'bg-gradient-to-r from-purple-600 to-indigo-600', text: 'text-white', activeTab: 'bg-white/10 text-white' },
    cyberpunk: { bg: 'bg-gradient-to-r from-cyan-400 to-blue-500', text: 'text-black', activeTab: 'bg-white/10 text-white' },
    dracula: { bg: 'bg-gradient-to-r from-pink-400 to-purple-500', text: 'text-black', activeTab: 'bg-white/10 text-white' },
    custom: { bg: 'bg-[var(--color-custom-primary)]', text: 'text-[var(--color-custom-text)]', activeTab: 'bg-white/10 text-white' }
  }

  const currentTheme = themeStyles[siteTheme] || themeStyles.amber

  return (
    <header className="sticky top-0 z-[80] w-full flex justify-center py-4 bg-transparent select-none">
      <div className="w-full max-w-[1250px] mx-4 px-6 h-16 bg-zinc-900/60 border border-white/5 backdrop-blur-md text-white rounded-full flex items-center justify-between shadow-xl shadow-black/25">
        
        {/* Logo */}
        <div 
          onClick={() => {
            playSound('click', isMuted, volume)
            setActiveSection('overview')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0 mr-4"
        >
          <Logo theme={siteTheme} />
          <div className="flex flex-col text-left">
            <span className="font-mono font-bold text-xs tracking-wider group-hover:text-cyan-400 transition-colors">HACKLABIFY</span>
            <span className="font-mono text-[8px] text-white/30 tracking-widest hidden sm:inline-block">V1.0</span>
          </div>
        </div>

        {/* Nav Items (Desktop Glass Capsule Deck - Shortened for spacious layout) */}
        <nav className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/5 p-1 rounded-full font-mono text-[11px] xl:text-[12px] uppercase font-bold shrink-0">
          {['overview', 'about', 'tracks', 'timeline', 'teamfinder', 'partners', 'faq'].map((section) => {
            const labelMap = {
              overview: 'HUD',
              about: 'Philosophy',
              tracks: 'Tracks',
              timeline: 'Roadmap',
              teamfinder: 'Lobby',
              partners: 'Crew',
              faq: 'FAQ'
            }
            return (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => {
                  e.preventDefault()
                  playSound('click', isMuted, volume)
                  setActiveSection(section)
                  const targetEl = document.getElementById(section)
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  activeSection === section ? 'bg-white/10 text-white font-extrabold shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{labelMap[section]}</span>
              </a>
            )
          })}
        </nav>

        {/* Settings, Audio and CRT Control */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          
          {/* Audio volume & mute interface */}
          <div className="relative flex items-center gap-1.5">
            {!isMuted && (
              <div className="hidden lg:flex items-end gap-[2px] h-3 px-1 select-none opacity-30">
                <span className="w-[1.2px] bg-white rounded-full animate-bounce [animation-duration:0.6s] h-2.5"></span>
                <span className="w-[1.2px] bg-white rounded-full animate-bounce [animation-duration:0.9s] h-3.5"></span>
                <span className="w-[1.2px] bg-white rounded-full animate-bounce [animation-duration:0.7s] h-2"></span>
              </div>
            )}

            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-white rounded-full cursor-pointer transition-all flex items-center justify-center shadow-md"
              title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/50" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
            </button>

            {/* Fader Slider Popup */}
            {showVolumeSlider && (
              <div
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute right-0 top-12 bg-zinc-900/95 border border-white/10 p-3 rounded-xl shadow-2xl flex flex-col gap-1.5 z-50 w-32 text-white text-[9.5px] font-mono backdrop-blur-md"
              >
                <div className="flex justify-between items-center mb-0.5 text-white">
                  <span>VOL:</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value)
                    setVolume(newVol)
                    localStorage.setItem('hacklabify_volume', String(newVol))
                  }}
                  className="w-full accent-white cursor-pointer h-1 bg-white/15 outline-none rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Theme selector */}
          <div className="hidden xl:flex border border-white/5 bg-zinc-950/40 p-1.5 items-center gap-1.5 rounded-full shadow-md">
            {['amber', 'crimson', 'acid', 'void', 'cyberpunk', 'dracula', 'custom'].map((th) => {
              const thMap = {
                amber: 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.3)]',
                crimson: 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.3)]',
                acid: 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.3)]',
                void: 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.3)]',
                cyberpunk: 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.3)]',
                dracula: 'bg-pink-400 shadow-[0_0_5px_rgba(244,114,182,0.3)]',
                custom: 'bg-[var(--color-custom-primary)] shadow-[0_0_5px_var(--color-custom-primary)]'
              }
              return (
                <button
                  key={th}
                  onClick={() => changeTheme(th)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${thMap[th]} ${
                    siteTheme === th ? 'scale-125 ring-1 ring-white' : 'opacity-50 hover:opacity-100 hover:scale-105'
                  } transition-all`}
                  title={`Switch to ${th} theme`}
                />
              )
            })}
          </div>

          {/* CRT Power switch button */}
          <button
            onClick={toggleCrtPower}
            className="border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-white rounded-full cursor-pointer transition-all flex items-center justify-center shadow-md"
            title="Flip CRT monitor screen power"
          >
            <Power className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          </button>

          {/* Register */}
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              setIsRegisterModalOpen(true)
            }}
            className={`border border-white/10 ${currentTheme.bg} ${currentTheme.text} px-5 py-2 rounded-full text-xs font-bold uppercase hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer transition-all`}
          >
            {ticketData ? 'Access Pass' : 'SYS_JOIN'}
          </button>
        </div>

      </div>

      {/* Mobile horizontal navigation links bar */}
      <div className="lg:hidden flex overflow-x-auto gap-4 py-2 border border-white/5 rounded-full px-6 font-mono text-[9px] uppercase font-bold scrollbar-none bg-zinc-900/60 backdrop-blur-md select-none mx-4 w-full max-w-[600px] justify-between">
        {['overview', 'about', 'tracks', 'timeline', 'teamfinder', 'partners', 'faq'].map((section) => {
          const labelMap = {
            overview: 'HUD',
            about: 'Philosophy',
            tracks: 'Tracks',
            timeline: 'Roadmap',
            teamfinder: 'Lobby',
            partners: 'Crew',
            faq: 'FAQ'
          }
          return (
            <a
              key={section}
              href={`#${section}`}
              onClick={(e) => {
                e.preventDefault()
                playSound('click', isMuted, volume)
                setActiveSection(section)
                const targetEl = document.getElementById(section)
                if (targetEl) {
                  targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className={`shrink-0 transition-colors ${
                activeSection === section ? 'text-white font-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {labelMap[section] || section}
            </a>
          )
        })}
      </div>
    </header>
  )
}
export default Header
