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
  setIsRegisterModalOpen,
  user,
  setIsAuthModalOpen,
  handleLogout,
  openAdminPanel,
  isAdmin
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
    <header className="sticky top-0 z-[80] w-full select-none bg-[#231f20]/80 backdrop-blur-md border-b border-zinc-800/80">
      {/* Main bar */}
      <div className="relative w-full max-w-[1250px] mx-auto px-6 h-14 flex items-center justify-between">

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
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-wider uppercase text-white group-hover:text-[#6db349] transition-colors duration-300">
                Tachyon
              </span>
              <span className="text-[9px] text-[#6db349] font-mono tracking-wider flex items-center select-none font-bold">
                [{time}]
              </span>
            </div>
            <span className="text-[8px] text-zinc-500 tracking-[0.25em] uppercase hidden sm:inline-block">
              SYS:01
            </span>
          </div>
        </div>

        {/* Nav — center (desktop) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold">
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
                    ? 'text-[#6db349]'
                    : 'text-zinc-400 hover:text-[#6db349]'
                }`}
              >
                <span>{labelMap[section]}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#6db349] rounded-full" />
                )}
              </a>
            )
          })}
        </nav>

        {/* Dynamic Uptime clock, Auth actions & Register Button */}
        <div className="flex items-center gap-4 shrink-0">


          {/* Authentication Status Section */}
          {user ? (
            <div className="flex items-center gap-3 border-r border-zinc-800/80 pr-4">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-7 h-7 border border-zinc-800 rounded-full select-none pointer-events-none" 
                />
              ) : (
                <div className="w-7 h-7 bg-[#6db349]/10 border border-[#6db349]/20 flex items-center justify-center font-bold text-[10px] text-[#6db349] rounded-full">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden sm:flex items-center gap-2 select-none">
                <span className="text-[9px] font-semibold text-zinc-300 tracking-wider truncate max-w-[90px]">
                  {user.name ? user.name.split(' ')[0] : 'Builder'}
                </span>
                <span className="text-zinc-700 text-[9px] select-none">|</span>
                <button
                  onClick={handleLogout}
                  className="text-[8px] text-[#6db349]/60 hover:text-[#6db349] uppercase tracking-widest cursor-pointer transition-colors border-0 p-0 bg-transparent outline-none font-bold"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                playSound('click', isMuted, volume)
                setIsAuthModalOpen(true)
              }}
              className="text-[10px] uppercase tracking-wider text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-1.5 rounded-full cursor-pointer transition-all hover:bg-white/5 font-semibold shrink-0"
            >
              Sign In
            </button>
          )}

          {/* Registration / Admin Panel button */}
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              if (isAdmin) {
                openAdminPanel()
              } else {
                setIsRegisterModalOpen(true)
              }
            }}
            className="text-[10px] uppercase tracking-wider bg-[#6db349] hover:bg-[#6db349]/90 text-black px-5 py-1.5 rounded-full cursor-pointer transition-all duration-200 shrink-0 font-bold shadow-[0_0_12px_rgba(109,179,73,0.3)] hover:shadow-[0_0_18px_rgba(109,179,73,0.45)]"
          >
            {isAdmin ? 'Admin Panel' : (ticketData ? 'Access Pass' : 'Register')}
          </button>
        </div>
      </div>

      {/* Mobile horizontal nav */}
      <div className="lg:hidden flex overflow-x-auto gap-5 py-2.5 px-6 text-[9px] uppercase tracking-wider scrollbar-none select-none border-t border-zinc-800/80 bg-[#231f20]/95 font-semibold">
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
              className={`transition-colors duration-200 ${
                isActive ? 'text-[#6db349]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {labelMap[section]}
            </a>
          )
        })}
      </div>

    </header>
  )
}

export default Header
