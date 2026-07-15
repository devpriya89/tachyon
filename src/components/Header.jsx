import React, { useState, useEffect } from 'react'
import { 
  Volume2, 
  VolumeX, 
  Power, 
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
  isAdmin,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [hoveredSection, setHoveredSection] = useState(null)
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

  const themeStyles = {
    nebula: { bg: 'bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500', text: 'text-white', activeTab: 'bg-white/10 text-white', hex: '#d946ef' },
    amber: { bg: 'bg-gradient-to-r from-amber-400 to-yellow-400', text: 'text-black', activeTab: 'bg-white/10 text-white', hex: '#ffdf00' },
    crimson: { bg: 'bg-gradient-to-r from-red-600 to-red-500', text: 'text-white', activeTab: 'bg-white/10 text-white', hex: '#E00024' },
    acid: { bg: 'bg-gradient-to-r from-green-500 to-emerald-400', text: 'text-black', activeTab: 'bg-white/10 text-white', hex: '#22c55e' },
    void: { bg: 'bg-gradient-to-r from-purple-600 to-indigo-600', text: 'text-white', activeTab: 'bg-white/10 text-white', hex: '#9333ea' },
    cyberpunk: { bg: 'bg-gradient-to-r from-cyan-400 to-blue-500', text: 'text-black', activeTab: 'bg-white/10 text-white', hex: '#00f0ff' },
    dracula: { bg: 'bg-gradient-to-r from-pink-400 to-purple-500', text: 'text-black', activeTab: 'bg-white/10 text-white', hex: '#bd93f9' },
    custom: { bg: 'bg-[var(--color-custom-primary)]', text: 'text-[var(--color-custom-text)]', activeTab: 'bg-white/10 text-white', hex: 'var(--color-custom-primary)' }
  }

  const currentTheme = themeStyles[siteTheme] || themeStyles.nebula
  const themeColor = currentTheme.hex

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
    about: 'PHILOSOPHY // INFO',
    tracks: 'CHALLENGE TRACKS',
    timeline: 'ROADMAP MATRIX',
    teamfinder: 'MATCHMAKING LOBBY',
    partners: 'CREW & SPONSORS',
    faq: 'FAQ & COMPLIANCE'
  }

  return (
    <header 
      onMouseEnter={() => setIsSidebarCollapsed(false)}
      onMouseLeave={() => setIsSidebarCollapsed(true)}
      className={`sticky top-0 w-full flex justify-center py-4 bg-transparent select-none z-[80]
        lg:fixed lg:top-4 lg:left-4 lg:bottom-4 lg:h-[calc(100vh-2rem)] lg:flex lg:flex-col lg:justify-between lg:border lg:border-white/10 lg:rounded-2xl lg:shadow-2xl lg:bg-zinc-950/90 lg:backdrop-blur-md lg:overflow-hidden
        transition-all duration-500 ease-in-out
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
    >
      {/* Mobile Top Bar / Desktop Inner Container Wrapper */}
      <div className="w-full max-w-[1250px] mx-4 px-6 h-16 bg-zinc-900/60 border border-white/5 backdrop-blur-md text-white rounded-full flex items-center justify-between shadow-xl shadow-black/25
        lg:mx-0 lg:px-0 lg:h-full lg:flex-1 lg:flex-col lg:items-stretch lg:bg-transparent lg:border-none lg:backdrop-blur-none lg:rounded-none lg:shadow-none lg:justify-between lg:gap-4 lg:min-h-0 lg:overflow-y-auto lg:scrollbar-none lg:p-4 lg:py-5">
        
        {/* Logo Section */}
        <div 
          onClick={() => {
            playSound('click', isMuted, volume)
            setActiveSection('overview')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className={`flex items-center gap-3 cursor-pointer group shrink-0 lg:mb-2 lg:w-full lg:justify-center ${
            isSidebarCollapsed ? 'lg:gap-0 lg:px-0' : 'lg:gap-3 lg:px-5'
          }`}
        >
          <Logo theme={siteTheme} />
          <div className={`flex flex-col text-left transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
            isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-36 lg:opacity-100 lg:max-w-[150px]'
          }`}>
            <span className="font-mono font-bold text-xs tracking-wider group-hover:text-cyan-400 transition-colors">
              Tachyon <span className="text-[9px] text-[#6db349] font-mono font-bold">[{time}]</span>
            </span>
            <span className="font-mono text-[8px] text-white/30 tracking-widest">SYS:01</span>
          </div>
        </div>

        {/* Desktop Vertical Nav Matrix (Hidden on Mobile) */}
        <nav className="hidden lg:flex flex-col items-start gap-1.5 text-[10.5px] uppercase tracking-[0.15em] font-semibold font-mono w-full my-4">
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
                className={`relative w-full py-2.5 flex items-center transition-all duration-300 border-l-[3px] border-r-[3px] ${
                  isActive
                    ? 'bg-white/5 border-r-transparent'
                    : 'text-zinc-400 border-l-transparent border-r-transparent hover:text-white hover:bg-white/[0.02]'
                } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-5'}`}
                style={isActive ? { color: themeColor, borderLeftColor: themeColor } : {}}
                title={labelMap[section]}
              >
                <div className="flex items-center justify-center w-full lg:w-auto">
                  <IconComponent className="w-4 h-4 shrink-0 transition-transform duration-300" style={isActive ? { color: themeColor } : {}} />
                  <span className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap flex items-center gap-1 ${
                    isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-48 lg:opacity-100 lg:max-w-[200px] lg:pl-3'
                  }`}>
                    {labelMap[section]}
                    {isHovered && (
                      <span className="animate-ping ml-1 font-bold font-mono" style={{ color: themeColor }}>_</span>
                    )}
                  </span>
                </div>
              </a>
            )
          })}
        </nav>

        {/* Mobile Horizontal Nav (Hidden on Desktop) */}
        <nav className="hidden md:flex lg:hidden items-center gap-1.5 bg-white/5 border border-white/5 p-1 rounded-full font-mono text-[10.5px] uppercase font-bold shrink-0">
          {['overview', 'about', 'tracks', 'timeline', 'teamfinder', 'partners', 'faq'].map((section) => {
            const labelMapMobile = {
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
                className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                  activeSection === section ? 'bg-white/10 text-white font-extrabold' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {labelMapMobile[section]}
              </a>
            )
          })}
        </nav>

        {/* Accent Color Matrices Widget (Only shown when desktop sidebar is expanded) */}
        {!isSidebarCollapsed && (
          <div className="hidden lg:block w-[90%] mx-auto px-4 py-3 border border-zinc-800 bg-[#000000]/40 rounded-lg text-left select-none font-mono text-[9px] text-zinc-500 space-y-2 transition-all duration-300">
            <div className="text-white/60 tracking-wider font-bold">THEME PALETTES:</div>
            <div className="flex flex-wrap gap-2">
              {['nebula', 'cyberpunk', 'crimson', 'acid', 'void', 'amber', 'dracula', 'custom'].map((th) => {
                const thMap = {
                  nebula: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_5px_rgba(168,85,247,0.4)]',
                  cyberpunk: 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.3)]',
                  amber: 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.3)]',
                  crimson: 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.3)]',
                  acid: 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.3)]',
                  void: 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.3)]',
                  dracula: 'bg-pink-400 shadow-[0_0_5px_rgba(244,114,182,0.3)]',
                  custom: 'bg-[var(--color-custom-primary)] shadow-[0_0_5px_var(--color-custom-primary)]'
                }
                return (
                  <button
                    key={th}
                    onClick={() => changeTheme(th)}
                    className={`w-3.5 h-3.5 rounded-full cursor-pointer ${thMap[th]} ${
                      siteTheme === th ? 'scale-125 ring-1 ring-white' : 'opacity-40 hover:opacity-100'
                    } transition-all`}
                    title={`Switch to ${th}`}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Telemetry Fader & CRT power Widget (Only shown when desktop sidebar is expanded) */}
        {!isSidebarCollapsed && (
          <div className="hidden lg:block w-[90%] mx-auto px-4 py-3 border border-zinc-800 bg-[#000000]/40 rounded-lg text-left select-none font-mono text-[9px] text-zinc-500 space-y-2.5 transition-all duration-300">
            <div className="flex justify-between items-center text-white/60">
              <span className="font-bold">SYSTEM CONTROL:</span>
              <button
                onClick={toggleCrtPower}
                className="border border-white/10 hover:bg-white/5 p-1 rounded-full cursor-pointer transition-colors flex items-center justify-center"
                title="Toggle CRT monitor power"
              >
                <Power className="w-3 h-3 text-red-500 animate-pulse" />
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>AUDIO VOL:</span>
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
                  localStorage.setItem('Tachyon_volume', String(newVol))
                }}
                className="w-full accent-white cursor-pointer h-1 bg-white/10 outline-none rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Settings, Audio controls (Mobile View / Desktop collapsed view placeholder) */}
        <div className="flex lg:hidden items-center gap-2 md:gap-3 shrink-0">
          
          {/* Volume Knob */}
          <div className="relative flex items-center gap-1.5">
            {!isMuted && (
              <div className="hidden sm:flex items-end gap-[2px] h-3 px-1 select-none opacity-30">
                <span className="w-[1.2px] bg-white rounded-full animate-bounce [animation-duration:0.6s] h-2.5"></span>
                <span className="w-[1.2px] bg-white rounded-full animate-bounce [animation-duration:0.9s] h-3.5"></span>
                <span className="w-[1.2px] bg-white rounded-full animate-bounce [animation-duration:0.7s] h-2"></span>
              </div>
            )}
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-white rounded-full cursor-pointer transition-all flex items-center justify-center"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/50" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
            </button>
            {showVolumeSlider && (
              <div
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute right-0 top-12 bg-zinc-900/95 border border-white/10 p-3 rounded-xl shadow-2xl flex flex-col gap-1.5 z-50 w-32 text-white text-[9.5px] font-mono backdrop-blur-md"
              >
                <div className="flex justify-between items-center text-white">
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
                    localStorage.setItem('Tachyon_volume', String(newVol))
                  }}
                  className="w-full accent-white cursor-pointer h-1 bg-white/15 outline-none rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Theme Palette switch (Mobile top active dot indicator) */}
          <button
            onClick={() => {
              const ths = ['nebula', 'cyberpunk', 'crimson', 'acid', 'void', 'amber', 'dracula']
              const curIdx = ths.indexOf(siteTheme)
              const nextTh = ths[(curIdx + 1) % ths.length]
              changeTheme(nextTh)
            }}
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10"
            title="Next theme palette"
          >
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: themeColor }}></div>
          </button>

          {/* CRT Monitor switch */}
          <button
            onClick={toggleCrtPower}
            className="border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-white rounded-full cursor-pointer transition-all flex items-center justify-center"
            title="Toggle CRT power"
          >
            <Power className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          </button>
        </div>

        {/* Auth & CTAs Section — Desktop bottom / Mobile horizontal row */}
        <div className={`flex lg:flex-col items-center lg:items-center gap-4 shrink-0 lg:mt-auto w-auto lg:w-full ${
          isSidebarCollapsed ? 'lg:px-2' : 'lg:px-4'
        } px-0 transition-all duration-300`}>
          
          {/* User connection info */}
          {user ? (
            <div className={`flex lg:flex-col items-center gap-3 border-r lg:border-r-0 lg:border-b border-white/5 pr-4 lg:pr-0 lg:pb-3 w-full justify-center ${
              isSidebarCollapsed ? 'lg:items-center' : 'lg:items-start'
            }`}>
              <div className="flex items-center">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 border border-white/10 rounded-full select-none pointer-events-none shrink-0" 
                  />
                ) : (
                  <div className="w-8 h-8 bg-white/10 border border-white/20 flex items-center justify-center font-bold text-[11px] text-white rounded-full shrink-0">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap flex flex-col text-left pl-3 ${
                  isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0 lg:pl-0' : 'lg:w-36 lg:opacity-100 lg:max-w-[150px] lg:pl-3'
                }`}>
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
                className="text-[8px] text-zinc-400 hover:text-white uppercase tracking-widest cursor-pointer transition-colors border-0 p-0 bg-transparent outline-none font-bold lg:mt-1 flex items-center gap-1.5 justify-center lg:w-full"
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
              className={`text-[10px] uppercase tracking-wider text-zinc-300 hover:text-white border border-white/10 rounded-full lg:rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/5 font-semibold shrink-0 flex items-center justify-center px-3 py-1.5 sm:px-4 lg:px-0 lg:py-0 ${
                isSidebarCollapsed ? 'lg:gap-0 lg:w-10 lg:h-10 lg:p-0' : 'lg:gap-2 lg:w-full lg:py-2.5 lg:px-4'
              } gap-2`}
              title="Sign In"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              <span className={`hidden sm:inline lg:inline-block transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-auto lg:opacity-100'
              }`}>
                Sign In
              </span>
            </button>
          )}

          {/* Join / Pass / Admin Action Button */}
          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              if (isAdmin) {
                openAdminPanel()
              } else {
                setIsRegisterModalOpen(true)
              }
            }}
            className={`text-[10px] uppercase tracking-wider bg-white/5 text-white border border-white/15 rounded-full lg:rounded-lg cursor-pointer transition-all duration-300 font-bold flex items-center justify-center px-4 py-2 lg:px-0 lg:py-0 ${
              isSidebarCollapsed ? 'lg:gap-0 lg:w-10 lg:h-10 lg:p-0' : 'lg:gap-2 lg:w-full lg:py-2.5 lg:px-4'
            } gap-2`}
            style={{ 
              backgroundImage: currentTheme.bg.includes('gradient') ? currentTheme.bg.replace('bg-gradient', 'linear-gradient') : '',
              backgroundColor: !currentTheme.bg.includes('gradient') ? themeColor : '',
              color: currentTheme.text.includes('black') ? 'black' : 'white'
            }}
            title={isAdmin ? 'Admin Panel' : (ticketData ? 'Access Pass' : 'Register')}
          >
            {isAdmin ? (
              <>
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className={`hidden sm:inline lg:inline-block transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-auto lg:opacity-100'
                }`}>
                  Admin Panel
                </span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4 shrink-0" />
                <span className={`hidden sm:inline lg:inline-block transition-all duration-300 overflow-hidden whitespace-nowrap ${
                  isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:max-w-0' : 'lg:w-auto lg:opacity-100'
                }`}>
                  {ticketData ? 'Access Pass' : 'SYS_JOIN'}
                </span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Mobile view sub-nav links (Hidden on Desktop) */}
      <div className="lg:hidden flex overflow-x-auto gap-4 py-2 border border-white/5 rounded-full px-6 font-mono text-[9px] uppercase font-bold scrollbar-none bg-zinc-900/60 backdrop-blur-md select-none mx-4 w-full max-w-[600px] justify-between mt-2.5">
        {['overview', 'about', 'tracks', 'timeline', 'teamfinder', 'partners', 'faq'].map((section) => {
          const labelMapMobile = {
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
              {labelMapMobile[section] || section}
            </a>
          )
        })}
      </div>
    </header>
  )
}

export default Header
