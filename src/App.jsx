import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CreedSection from './components/CreedSection'
import TracksSection from './components/TracksSection'
import TimelineSection from './components/TimelineSection'
import TeamFinder from './components/TeamFinder'
import PartnersSection from './components/PartnersSection'
import FaqSection from './components/FaqSection'
import Footer from './components/Footer'
import RegisterModal from './components/RegisterModal'
import AdminPanel from './components/AdminPanel'
import { playSound } from './utils/audio'

export function App() {
  // Themes and Sound options
  const [siteTheme, setSiteTheme] = useState('nebula')
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.4) // default 40% volume
  const [crtPower, setCrtPower] = useState('ON') // ON, OFF, STANDBY

  // Navigation states
  const [activeSection, setActiveSection] = useState('overview')

  // Timer Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })

  // Registration Modal & Ticket states
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [ticketData, setTicketData] = useState(null)
  const [ticketColorTheme, setTicketColorTheme] = useState('nebula')

  // Lifted Administrative States
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [countdownDate, setCountdownDate] = useState(() => {
    return localStorage.getItem('Tachyon_countdown_date') || '2026-07-24T00:00:00+05:30'
  })

  const [timelineNodes, setTimelineNodes] = useState(() => {
    const saved = localStorage.getItem('Tachyon_timeline')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return [
      {
        phase: '01',
        title: 'Registration Launch',
        date: 'July 2, 2026',
        status: 'ACTIVE',
        desc: 'Registrations are officially open for builders worldwide! Teams can secure their spots and configure their profiles.',
        startDateStr: '2026-07-02T10:00:00+05:30',
        endDateStr: '2026-07-02T12:00:00+05:30'
      },
      {
        phase: '02',
        title: 'Qualifier Release',
        date: 'July 24, 2026',
        status: 'UPCOMING',
        desc: 'The online qualifier prompts go live. Teams have exactly 10 days to build, test, and submit their core ideas.',
        startDateStr: '2026-07-24T00:00:00+05:30',
        endDateStr: '2026-07-24T03:00:00+05:30'
      },
      {
        phase: '03',
        title: 'Submissions Close',
        date: 'August 3, 2026',
        status: 'UPCOMING',
        desc: 'The online submission window closes at midnight IST. Projects will undergo peer review and evaluation by judges.',
        startDateStr: '2026-08-03T23:59:00+05:30',
        endDateStr: '2026-08-04T01:00:00+05:30'
      },
      {
        phase: '04',
        title: 'Finalist Shortlist',
        date: 'August 15, 2026',
        status: 'UPCOMING',
        desc: 'The top 40 teams are announced and receive official invitations for the offline finals in New Delhi.',
        startDateStr: '2026-08-15T12:00:00+05:30',
        endDateStr: '2026-08-15T14:00:00+05:30'
      },
      {
        phase: '05',
        title: 'Offline Grand Finals',
        date: 'August 23-24, 2026',
        status: 'UPCOMING',
        desc: 'A high-intensity 24-hour sprint (12+12 hours) in Delhi featuring code mentorship, expert talks, and final pitches.',
        startDateStr: '2026-08-23T09:00:00+05:30',
        endDateStr: '2026-08-24T18:00:00+05:30'
      }
    ]
  })

  const [teamListings, setTeamListings] = useState(() => {
    const saved = localStorage.getItem('Tachyon_team_listings')
    let loaded = []
    if (saved) {
      try {
        loaded = JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    if (loaded.length === 0) {
      loaded = [
        {
          id: 'mock-1',
          teamName: "Arjun's AI Helpers",
          creatorGithub: 'arjun-sh',
          name: 'Arjun Sharma',
          role: 'developer',
          track: 'ai',
          skills: ['Python', 'PyTorch', 'React'],
          pitch: 'Building a local LLM helper extension. Need a UI designer to make a slick neobrutalist interface.',
          discord: 'arjun_sharma#1234',
          date: 'Just now',
          members: [
            { name: 'Arjun Sharma', github: 'arjun-sh', role: 'developer', email: 'arjun@gmail.com' }
          ]
        },
        {
          id: 'mock-2',
          teamName: 'Web RTC Chatters',
          creatorGithub: 'pri-ux',
          name: 'Priyanka Sen',
          role: 'designer',
          track: 'web',
          skills: ['Figma', 'CSS Grid', 'Tailwind'],
          pitch: 'UI/UX specialist. Looking for backend hackers to build a decentralized chat platform using WebRTC.',
          discord: 'pri_ux#8890',
          date: '10m ago',
          members: [
            { name: 'Priyanka Sen', github: 'pri-ux', role: 'designer', email: 'pri@gmail.com' }
          ]
        },
        {
          id: 'mock-3',
          teamName: 'Port Mappers',
          creatorGithub: 'k-dev',
          name: 'Kabir Dev',
          role: 'developer',
          track: 'cyber',
          skills: ['Rust', 'Wireshark', 'Bash'],
          pitch: 'Building open port mapper command tools. Need a researcher/writer for terminal help documentation.',
          discord: 'k_dev#5521',
          date: '1h ago',
          members: [
            { name: 'Kabir Dev', github: 'k-dev', role: 'developer', email: 'kabir@gmail.com' }
          ]
        },
        {
          id: 'mock-4',
          teamName: 'Co-op Arcade Craft',
          creatorGithub: 'tanya-pixel',
          name: 'Tanya Goel',
          role: 'generalist',
          track: 'game',
          skills: ['Godot', 'Aseprite', 'Chiptune'],
          pitch: 'Pixel artist and sound designer. Crafting a co-op keyboard arcade game. Need generalists or coders.',
          discord: 'tanya_pixel#0024',
          date: '2h ago',
          members: [
            { name: 'Tanya Goel', github: 'tanya-pixel', role: 'generalist', email: 'tanya@gmail.com' }
          ]
        }
      ]
    } else {
      loaded = loaded.map(item => ({
        ...item,
        teamName: item.teamName || `${item.name}'s Squad`,
        creatorGithub: item.creatorGithub || item.name.toLowerCase().replace(/\s+/g, '-'),
        members: item.members || [
          { name: item.name, github: item.creatorGithub || item.name.toLowerCase().replace(/\s+/g, '-'), role: item.role, email: 'mock@domain.com' }
        ]
      }))
    }
    return loaded
  })

  // Dynamic Organizers & Sponsors state lists
  const [organizers, setOrganizers] = useState(() => {
    const saved = localStorage.getItem('Tachyon_organizers')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return [
      { id: 'org-1', name: 'Kunal Dev', role: 'Core Architect', email: 'kunal@Tachyon.org', instagram: 'kunal_dev', image: '' },
      { id: 'org-2', name: 'Rhea Sen', role: 'Interface Craft', email: 'rhea@Tachyon.org', instagram: 'rhea_craft', image: '' },
      { id: 'org-3', name: 'Aman Goel', role: 'Mainframe Moderator', email: 'aman@Tachyon.org', instagram: 'aman_mainframe', image: '' }
    ]
  })

  const [sponsors, setSponsors] = useState(() => {
    const saved = localStorage.getItem('Tachyon_sponsors')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return [
      { id: 'sp-1', name: 'Vercel', tier: 'core', website: 'https://vercel.com', logo: '' },
      { id: 'sp-2', name: 'GitHub', tier: 'core', website: 'https://github.com', logo: '' },
      { id: 'sp-3', name: 'Delhi Tech Node', tier: 'subprocessor', website: 'https://delhitech.in', logo: '' },
      { id: 'sp-4', name: 'Replit', tier: 'subprocessor', website: 'https://replit.com', logo: '' },
      { id: 'sp-5', name: 'Oxlint', tier: 'peripheral', website: 'https://oxc.rs', logo: '' }
    ]
  })

  const [themeColors, setThemeColors] = useState(() => {
    const saved = localStorage.getItem('Tachyon_custom_colors')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return {
      '--color-yellow-neo': '#ffdf00',
      '--color-red-neo': '#E00024',
      '--color-cyber-cyan': '#00f0ff',
      '--color-drac-purple': '#bd93f9',
      '--color-ink': '#0C0C0B',
      '--color-paper': '#F8F7F4',
      '--color-custom-primary': '#ff00ff',
      '--color-custom-bg': '#121212',
      '--color-custom-text': '#ffffff'
    }
  })

  // Load ticket and settings from localStorage
  useEffect(() => {
    const savedTicket = localStorage.getItem('tachyon_ticket')
    if (savedTicket) {
      setTicketData(JSON.parse(savedTicket))
    }
    const savedMute = localStorage.getItem('tachyon_mute')
    if (savedMute) {
      setIsMuted(savedMute === 'true')
    }
    const savedVolume = localStorage.getItem('tachyon_volume')
    if (savedVolume) {
      setVolume(parseFloat(savedVolume))
    }
    const savedTheme = localStorage.getItem('tachyon_theme')
    if (savedTheme) {
      setSiteTheme(savedTheme)
      setTicketColorTheme(savedTheme)
    }
  }, [])

  // Sync admin state overrides
  useEffect(() => {
    localStorage.setItem('tachyon_countdown_date', countdownDate)
  }, [countdownDate])

  useEffect(() => {
    localStorage.setItem('tachyon_timeline', JSON.stringify(timelineNodes))
  }, [timelineNodes])

  useEffect(() => {
    localStorage.setItem('tachyon_team_listings', JSON.stringify(teamListings))
  }, [teamListings])

  useEffect(() => {
    localStorage.setItem('tachyon_organizers', JSON.stringify(organizers))
  }, [organizers])

  useEffect(() => {
    localStorage.setItem('tachyon_sponsors', JSON.stringify(sponsors))
  }, [sponsors])

  useEffect(() => {
    Object.entries(themeColors).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value)
    })
    localStorage.setItem('tachyon_custom_colors', JSON.stringify(themeColors))
  }, [themeColors])

  // Countdown timer logic using adjustable countdownDate
  useEffect(() => {
    const updateTimer = () => {
      const targetDate = new Date(countdownDate).getTime()
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        return
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24))
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({
        days: d < 10 ? `0${d}` : `${d}`,
        hours: h < 10 ? `0${h}` : `${h}`,
        minutes: m < 10 ? `0${m}` : `${m}`,
        seconds: s < 10 ? `0${s}` : `${s}`
      })
    }

    updateTimer()
    const timerInterval = setInterval(updateTimer, 1000)
    return () => clearInterval(timerInterval)
  }, [countdownDate])

  // Handle CRT Power Switch
  const toggleCrtPower = () => {
    if (crtPower === 'ON') {
      playSound('power-off', isMuted, volume)
      setCrtPower('OFF')
      setTimeout(() => {
        setCrtPower('STANDBY')
      }, 500)
    } else if (crtPower === 'STANDBY') {
      playSound('power-on', isMuted, volume)
      setCrtPower('ON')
    }
  }

  // Handle sound button toggle
  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    localStorage.setItem('tachyon_mute', String(nextMuted))
    if (!nextMuted) {
      playSound('click', false, volume)
    }
  }

  // Handle theme modification
  const changeTheme = (newTheme) => {
    setSiteTheme(newTheme)
    setTicketColorTheme(newTheme)
    localStorage.setItem('tachyon_theme', newTheme)
    playSound('click', isMuted, volume)
  }

  // Theme styling configurations
  const themeStyles = {
    nebula: { bg: 'bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]', tagText: 'text-white', primaryText: 'text-fuchsia-400' },
    amber: { bg: 'bg-yellow-neo shadow-[0_0_15px_rgba(255,223,0,0.15)]', tagText: 'text-ink', primaryText: 'text-yellow-neo' },
    crimson: { bg: 'bg-red-neo shadow-[0_0_15px_rgba(224,0,36,0.15)]', tagText: 'text-white', primaryText: 'text-red-neo' },
    acid: { bg: 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]', tagText: 'text-ink', primaryText: 'text-green-500' },
    void: { bg: 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.15)]', tagText: 'text-white', primaryText: 'text-purple-500' },
    cyberpunk: { bg: 'bg-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]', tagText: 'text-ink', primaryText: 'text-cyber-cyan' },
    dracula: { bg: 'bg-drac-purple shadow-[0_0_15px_rgba(189,147,249,0.15)]', tagText: 'text-ink', primaryText: 'text-drac-purple' },
    custom: { bg: 'bg-[var(--color-custom-primary)] shadow-[0_0_15px_var(--color-custom-primary)]', tagText: 'text-[var(--color-custom-text)]', primaryText: 'text-[var(--color-custom-primary)]' }
  }

  const currentTheme = themeStyles[siteTheme] || themeStyles.nebula

  return (
    <>
      {/* Standby screen display when CRT is powered off */}
      {crtPower === 'STANDBY' && (
        <div className="fixed inset-0 crt-standby flex flex-col items-center justify-center bg-black z-[9999] select-none">
          <div className="border-4 border-[#11ff11] p-8 text-center shadow-[0_0_15px_rgba(17,255,17,0.3)] bg-zinc-950 max-w-sm">
            <span className="block font-mono text-sm tracking-widest text-emerald-500 uppercase animate-pulse mb-6">
              [ MONITOR STANDBY ]
            </span>
            <button
              onClick={toggleCrtPower}
              className="border-2 border-[#11ff11] px-5 py-2 font-mono text-xs text-[#11ff11] font-black uppercase hover:bg-[#11ff11] hover:text-black active:translate-y-[2px] transition-colors cursor-pointer"
            >
              Flip Power Switch
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Container with power scaling animation */}
      <div
        className={`min-h-screen flex flex-col font-space bg-[#08090d] text-paper relative overflow-x-hidden selection:bg-yellow-neo selection:text-ink transition-opacity duration-300 ${
          crtPower === 'OFF' ? 'crt-power-off' : crtPower === 'ON' ? 'crt-power-on' : 'opacity-0'
        }`}
      >
        {/* Navigation Header */}
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          siteTheme={siteTheme}
          changeTheme={changeTheme}
          isMuted={isMuted}
          toggleMute={toggleMute}
          volume={volume}
          setVolume={setVolume}
          crtPower={crtPower}
          toggleCrtPower={toggleCrtPower}
          ticketData={ticketData}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
        />

        {/* Hero Section */}
        <Hero
          timeLeft={timeLeft}
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          ticketData={ticketData}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
        />

        {/* Dynamic Endless Marquee Banner */}
        <div className="overflow-hidden bg-[#0c0d12] border-y border-white/10 py-3.5 select-none flex">
          <div className={`animate-marquee whitespace-nowrap flex gap-12 font-mono font-bold text-xs md:text-sm uppercase ${currentTheme.primaryText} tracking-widest`}>
            <span>TACHYON V1.0 //</span>
            <span>1,50,000 INR TOTAL PRIZE POOL //</span>
            <span>UNDER-18 BUILDER SATELLITE HACKATHON //</span>
            <span>ONLINE QUALIFIER STARTS JULY 24 //</span>
            <span>FORK THE REALM //</span>
            <span>NO SLIDESHOWS - JUST CODE & DESIGN //</span>
            <span>TACHYON V1.0 //</span>
            <span>1,50,000 INR TOTAL PRIZE POOL //</span>
            <span>UNDER-18 BUILDER SATELLITE HACKATHON //</span>
            <span>ONLINE QUALIFIER STARTS JULY 24 //</span>
            <span>FORK THE REALM //</span>
            <span>NO SLIDESHOWS - JUST CODE & DESIGN //</span>
          </div>
        </div>

        {/* Creed Section & Interactive Console */}
        <CreedSection
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
          openAdminPanel={() => setIsAdminOpen(true)}
        />

        {/* Challenge Tracks & Configurator */}
        <TracksSection
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
        />

        {/* Roadmap Stepper & ICS Downloader */}
        <TimelineSection
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          timelineNodes={timelineNodes}
        />

        {/* Project/Teammate Match Lobby */}
        <TeamFinder
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          ticketData={ticketData}
          listings={teamListings}
          setListings={setTeamListings}
        />

        {/* Organizers and Sponsors Showcase */}
        <PartnersSection
          siteTheme={siteTheme}
          organizers={organizers}
          sponsors={sponsors}
        />

        {/* Accordion FAQ */}
        <FaqSection
          isMuted={isMuted}
          volume={volume}
        />

        {/* Footer & Synthesizer keyboard */}
        <Footer
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          openAdminPanel={() => setIsAdminOpen(true)}
        />

        {/* Registration multi-step Modal wizard */}
        {isRegisterModalOpen && (
          <RegisterModal
            isRegisterModalOpen={isRegisterModalOpen}
            setIsRegisterModalOpen={setIsRegisterModalOpen}
            ticketData={ticketData}
            setTicketData={setTicketData}
            siteTheme={siteTheme}
            isMuted={isMuted}
            volume={volume}
            ticketColorTheme={ticketColorTheme}
            setTicketColorTheme={setTicketColorTheme}
          />
        )}

        {/* Administrative Overlay Dashboard */}
        {isAdminOpen && (
          <AdminPanel
            setIsAdminOpen={setIsAdminOpen}
            isMuted={isMuted}
            volume={volume}
            countdownDate={countdownDate}
            setCountdownDate={setCountdownDate}
            timelineNodes={timelineNodes}
            setTimelineNodes={setTimelineNodes}
            teamListings={teamListings}
            setTeamListings={setTeamListings}
            themeColors={themeColors}
            setThemeColors={setThemeColors}
            organizers={organizers}
            setOrganizers={setOrganizers}
            sponsors={sponsors}
            setSponsors={setSponsors}
          />
        )}

      </div>
    </>
  )
}
export default App
 
