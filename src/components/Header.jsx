import React, { useState, useEffect } from 'react'
import Logo from './Logo'
import { playSound } from '../utils/audio'
import { 
  Terminal, 
  Info, 
  Code2, 
  GitCommit, 
  Users, 
  Award, 
  HelpCircle,
  LogOut,
  LogIn,
  Ticket,
  ShieldAlert
} from 'lucide-react'

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
  isAdmin,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}) {
  const [time, setTime] = useState('')
  const [hoveredSection, setHoveredSection] = useState(null)
  const [metrics, setMetrics] = useState({ ping: 21, load: 9 })

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

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        ping: Math.floor(Math.random() * 12) + 14,
        load: Math.floor(Math.random() * 6) + 7
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const iconMap = {
    overview: Terminal,
    about: Info,
    tracks: Code2,
    timeline: GitCommit,
    teamfinder: Users,
    partners: Award,
    faq: HelpCircle
  }

  const labelMap = {
    overview: 'HUD // OVERVIEW',
    about: 'ABOUT // INFO',
    tracks: 'CHALLENGE TRACKS',
    timeline: 'TIMELINE MATRIX',
    teamfinder: 'MATCHMAKING LOBBY',
    partners: 'CREW & SPONSORS',
    faq: 'FAQ & COMPLIANCE'
  }

  return (
    <header 
      onMouseEnter={() => setIsSidebarCollapsed(false)}
      onMouseLeave={() => setIsSidebarCollapsed(true)}
      className={`sticky top-0 lg:fixed lg:top-4 lg:left-4 lg:bottom-4 lg:h-[calc(100vh-2rem)] ${
        isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
      } lg:border lg:border-white/10 lg:rounded-2xl z-[80] w-full select-none bg-[#231f20]/95 backdrop-blur-md border-b border-zinc-800/80 flex flex-col lg:justify-between lg:py-5 lg:px-0 transition-all duration-500 ease-in-out lg:shadow-[0_8px_32px_rgba(0,0,0,0.5)] lg:overflow-y-auto lg:scrollbar-none`}
    >
      {/* Main bar container (mobile row / desktop column) */}
      <div className="w-full flex lg:flex-col items-center lg:items-stretch justify-between h-14 lg:h-auto lg:flex-1 lg:min-h-0 lg:gap-4 px-6 lg:px-0">
        
        {/* Logo — top/left */}
        <div
          onClick={() => {
            playSound('click', isMuted, volume)
            setActiveSection('overview')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className={`flex items-center cursor-pointer group shrink-0 lg:mb-2 lg:w-full lg:justify-center ${
            isSidebarCollapsed ? 'lg:gap-0 lg:px-0' : 'lg:gap-3 lg:px-4'
          } gap-3`}
        >
          <div className="flex items-center justify-center shrink-0">
            <Logo theme={siteTheme} />
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap flex flex-col text-left ${
            isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-36 lg:opacity-100 lg:max-w-[150px]'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-wider uppercase text-white group-hover:text-[#6db349] transition-colors duration-300">
                Tachyon
              </span>
              <span className="text-[9px] text-[#6db349] font-mono tracking-wider flex items-center select-none font-bold">
                [{time}]
              </span>
            </div>
            <span className="text-[8px] text-zinc-500 tracking-[0.25em] uppercase">
              SYS:01
            </span>
          </div>
        </div>

        {/* Nav Links — desktop sidebar vertical stack */}
        <nav className="hidden lg:flex flex-col items-start gap-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold w-full my-4">
          {['overview', 'about', 'tracks', 'timeline', 'teamfinder', 'partners', 'faq'].map((section) => {
            const IconComponent = iconMap[section] || Terminal
            const isActive = activeSection === section
            const isHovered = hoveredSection === section

            return (
              <a
                key={section}
                href={`#${section}`}
                onMouseEnter={() => setHoveredSection(section)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={(e) => {
                  e.preventDefault()
                  playSound('click', isMuted, volume)
                  setActiveSection(section)
                  const targetEl = document.getElementById(section)
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className={`relative w-full py-3 flex items-center transition-all duration-300 border-l-[3px] border-r-[3px] ${
                  isActive
                    ? 'text-[#6db349] border-l-[#6db349] border-r-transparent bg-[#6db349]/5'
                    : 'text-zinc-400 border-l-transparent border-r-transparent hover:text-white hover:bg-white/[0.02]'
                } ${isSidebarCollapsed ? 'lg:justify-center lg:px-0' : 'lg:px-5'} justify-start px-0`}
                title={labelMap[section]}
              >
                <div className="flex items-center justify-center w-full lg:w-auto">
                  <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? 'text-[#6db349]' : 'text-zinc-400'} ${isHovered ? 'scale-110' : ''}`} />
                  <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap flex items-center gap-1 ${
                    isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-48 lg:opacity-100 lg:max-w-[200px] lg:pl-3'
                  } pl-0`}>
                    {labelMap[section]}
                    {isHovered && (
                      <span className="animate-ping ml-1 text-[#6db349] font-bold">_</span>
                    )}
                  </span>
                </div>
              </a>
            )
          })}
        </nav>

        {/* Live Metrics Widget (Only when expanded) */}
        {!isSidebarCollapsed && (
          <div className="hidden lg:block w-[90%] mx-auto px-4 py-3 border border-zinc-800/80 bg-[#000000]/40 font-mono text-[8.5px] text-zinc-500 space-y-1.5 select-none transition-all duration-300 rounded-lg">
            <div className="flex justify-between items-center">
              <span>LATENCY METRICS:</span>
              <span className="text-[#6db349] font-bold">{metrics.ping}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span>CPU LOAD LEVEL:</span>
              <span className="text-[#6db349] font-bold">{metrics.load}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>FIREWALL STATE:</span>
              <span className="text-emerald-500 font-bold">SECURE</span>
            </div>
          </div>
        )}

        {/* Auth & CTAs — desktop bottom / mobile right */}
        <div className={`flex lg:flex-col items-center lg:items-center gap-4 shrink-0 lg:mt-auto w-auto lg:w-full ${
          isSidebarCollapsed ? 'lg:px-2' : 'lg:px-4'
        } px-0 transition-all duration-300`}>
          {user ? (
            <div className={`flex lg:flex-col items-center gap-3 border-r lg:border-r-0 lg:border-b border-zinc-800/80 pr-4 lg:pr-0 lg:pb-4 w-full justify-center ${
              isSidebarCollapsed ? 'lg:items-center' : 'lg:items-start'
            }`}>
              <div className="flex items-center">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 border border-zinc-800 rounded-full select-none pointer-events-none shrink-0" 
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#6db349]/10 border border-[#6db349]/20 flex items-center justify-center font-bold text-[11px] text-[#6db349] rounded-full shrink-0">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap flex flex-col text-left ${
                  isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-36 lg:opacity-100 lg:max-w-[150px] lg:pl-3'
                } pl-3`}>
                  <span className="text-[9px] font-semibold text-zinc-300 tracking-wider truncate">
                    {user.name ? user.name.split(' ')[0] : 'Builder'}
                  </span>
                  <span className="text-[7.5px] text-zinc-500 uppercase tracking-widest">
                    Verified Node
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-[8px] text-[#6db349]/60 hover:text-[#6db349] uppercase tracking-widest cursor-pointer transition-colors border-0 p-0 bg-transparent outline-none font-bold lg:mt-1 flex items-center gap-1.5 justify-center lg:w-full"
                title="Logout Account"
              >
                <LogOut className="w-3.5 h-3.5 lg:w-3 lg:h-3 shrink-0" />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-auto lg:opacity-100'
                }`}>
                  Logout
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                playSound('click', isMuted, volume)
                setIsAuthModalOpen(true)
              }}
              className={`text-[10px] uppercase tracking-wider text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-full lg:rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/5 font-semibold shrink-0 flex items-center justify-center px-4 py-1.5 lg:px-0 lg:py-0 ${
                isSidebarCollapsed ? 'lg:gap-0 lg:w-10 lg:h-10 lg:p-0' : 'lg:gap-2 lg:w-full lg:py-2.5 lg:px-4'
              } gap-2`}
              title="Sign In"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-auto lg:opacity-100'
              }`}>
                Sign In
              </span>
            </button>
          )}

          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              if (isAdmin) {
                openAdminPanel()
              } else {
                setIsRegisterModalOpen(true)
              }
            }}
            className={`text-[10px] uppercase tracking-wider bg-[#6db349] hover:bg-[#6db349]/90 text-black rounded-full lg:rounded-lg cursor-pointer transition-all duration-300 font-bold shadow-[0_0_12px_rgba(109,179,73,0.3)] hover:shadow-[0_0_18px_rgba(109,179,73,0.45)] flex items-center justify-center px-5 py-1.5 lg:px-0 lg:py-0 ${
              isSidebarCollapsed ? 'lg:gap-0 lg:w-10 lg:h-10 lg:p-0' : 'lg:gap-2 lg:w-full lg:py-2.5 lg:px-4'
            } gap-2`}
            title={isAdmin ? 'Admin Panel' : (ticketData ? 'Access Pass' : 'Register')}
          >
            {isAdmin ? (
              <>
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-auto lg:opacity-100'
                }`}>
                  Admin Panel
                </span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4 shrink-0" />
                <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-auto lg:opacity-100'
                }`}>
                  {ticketData ? 'Access Pass' : 'Register'}
                </span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Mobile horizontal nav (hidden on desktop sidebar) */}
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
