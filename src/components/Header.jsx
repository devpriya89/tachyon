import React, { useState, useEffect } from 'react'
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
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      setTime(`${hh}:${mm}:${ss}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-[80] w-full select-none bg-[#0A0A08]/95 border-b border-white/5">
      {/* Main bar */}
      <div className="w-full max-w-[1250px] mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo — left */}
        <div
          onClick={() => {
            playSound('click', isMuted, volume)
            setActiveSection('overview')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <Logo theme={siteTheme} />
          <div className="flex flex-col text-left">
            <span className="font-mono font-bold text-[11px] tracking-[0.15em] uppercase text-[#F8F7F4] group-hover:text-[#C2452D] transition-colors duration-300">
              Tachyon
            </span>
            <span className="font-mono text-[8px] text-white/20 tracking-[0.25em] uppercase hidden sm:inline-block">
              SYS:01
            </span>
          </div>
        </div>

        {/* Nav — center (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] shrink-0">
          {['overview', 'about', 'tracks', 'timeline', 'teamfinder', 'partners', 'faq'].map((section) => {
            const labelMap = {
              overview: 'HUD',
              about: 'About',
              tracks: 'Tracks',
              timeline: 'Timeline',
              teamfinder: 'Lobby',
              partners: 'Crew',
              faq: 'FAQ'
            }
            const isActive = activeSection === section
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
                className={`relative px-3 py-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#F8F7F4]'
                    : 'text-white/30 hover:text-[#F8F7F4]'
                }`}
              >
                <span>{labelMap[section]}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-[#F8F7F4]" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Dynamic Uptime clock and Register Button */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-mono text-[8px] text-white/20 tracking-[0.2em] uppercase hidden md:flex items-center gap-1.5 select-none">
            SYS_CLOCK: {time} <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C2452D] animate-pulse"></span>
          </span>
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              setIsRegisterModalOpen(true)
            }}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#F8F7F4] border border-white/8 px-4 py-2 rounded-none cursor-pointer transition-colors duration-200 shrink-0 hover-glitch"
          >
            {ticketData ? 'ACCESS_PASS' : 'REGISTER'}
          </button>
        </div>
      </div>

      {/* Mobile horizontal nav */}
      <div className="lg:hidden flex overflow-x-auto gap-5 py-2.5 px-6 font-mono text-[9px] uppercase tracking-[0.15em] scrollbar-none select-none border-t border-white/5">
        {['overview', 'about', 'tracks', 'timeline', 'teamfinder', 'partners', 'faq'].map((section) => {
          const labelMap = {
            overview: 'HUD',
            about: 'About',
            tracks: 'Tracks',
            timeline: 'Timeline',
            teamfinder: 'Lobby',
            partners: 'Crew',
            faq: 'FAQ'
          }
          const isActive = activeSection === section
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
              className={`shrink-0 pb-1 transition-colors duration-200 ${
                isActive
                  ? 'text-[#F8F7F4] border-b border-[#F8F7F4]'
                  : 'text-white/25 hover:text-white/60'
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
