import React, { useState, useEffect, useRef } from 'react'
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
  const [siteTheme, setSiteTheme] = useState(() => {
    return localStorage.getItem('tachyon_theme') || 'takumi'
  })
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.4) // default 40% volume
  const [crtPower, setCrtPower] = useState('ON') // ON, OFF, STANDBY

  // Custom loader state
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaderFading, setIsLoaderFading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadLogs, setLoadLogs] = useState([])
  const [sysDetails, setSysDetails] = useState({ cpu: 4, platform: 'Unknown', browser: 'Browser Engine' })

  // Cursor Refs for Spring Interpolation
  const mouseRef = useRef({ x: 0, y: 0 })
  const trailRef = useRef({ x: 0, y: 0 })
  const isHoveringRef = useRef(false)

  // Navigation states
  const [activeSection, setActiveSection] = useState('overview')
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })

  // Registration Modal & Ticket states
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [ticketData, setTicketData] = useState(null)
  const [ticketColorTheme, setTicketColorTheme] = useState('nebula')

  // WhatsApp Community Link State
  const [whatsappLink, setWhatsappLink] = useState(() => {
    return localStorage.getItem('Tachyon_whatsapp_link') || 'https://chat.whatsapp.com/mock-link'
  })

  // Social Links States
  const [instagramLink, setInstagramLink] = useState(() => {
    return localStorage.getItem('Tachyon_instagram_link') || 'https://instagram.com/Tachyon'
  })
  const [twitterLink, setTwitterLink] = useState(() => {
    return localStorage.getItem('Tachyon_twitter_link') || 'https://twitter.com/Tachyon'
  })

  // Dynamic User Authentication States
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('Tachyon_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return null
  })
  const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState('signin') // signin or signup
  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem('Tachyon_google_client_id') || ''
  })
  const [adminEmails, setAdminEmails] = useState(() => {
    const defaultAdmins = ['devpriya@tachyonindia.org', 'pranjal@tachyonindia.org', 'yugam@tachyonindia.org', 'help@tachyonindia.org', 'admin@tachyonindia.org']
    const saved = localStorage.getItem('Tachyon_admin_emails')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return Array.from(new Set([...defaultAdmins, ...parsed]))
        }
      } catch (e) {
        console.error(e)
      }
    }
    return defaultAdmins
  })
  // Tracks Configurations list state
  const [tracksList, setTracksList] = useState(() => {
    const saved = localStorage.getItem('Tachyon_tracks')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return [
      {
        id: 'ai',
        title: 'AI & Intelligent Agents',
        tagLine: 'BUILD AUTONOMOUS ENTITIES AND SMART WORKFLOWS',
        prize: '50,000 INR Pool',
        details: 'Create intelligent systems that go beyond simple chat interfaces. Build autonomous agents, LLM-powered tools, code generation scrapers, or sensory processing apps.',
        ideas: [
          'An AI agent that crawls GitHub repos, reads code, and opens PRs with unit test fixes.',
          'A local-first browser extension that synthesizes research papers as you read.',
          'An autonomous developer assistant that learns your keyboard shortcuts.'
        ],
        techs: ['Python', 'HuggingFace', 'PyTorch', 'LangChain', 'OpenAI API', 'VectorDBs'],
        criteria: 'Autonomy, latency optimization, safety bounds, and practical API orchestration.',
        blueprintSpecs: {
          memory: 'Context memory buffer state',
          tools: 'Autonomous tools executor agent',
          fallback: 'Offline local-first processing',
          ui: 'Diagnostic telemetry dashboard'
        }
      },
      {
        id: 'cyber',
        title: 'Cybersecurity & Exploits',
        tagLine: 'OFFENSIVE SCRIPTS, DEFENSIVE SHIELDS, AND CTF TECH',
        prize: '40,000 INR Pool',
        details: 'Push the limits of digital systems. Build penetration testing automation, network analysis tools, cryptography visualizers, or custom system monitors.',
        ideas: [
          'A web-based visual network package mapper parsing Wireshark logs in real-time.',
          'A local open-port mapping tool equipped with clean diagnostic logs dashboard.',
          'An educational CTF platform modeling real hardware-level stack overflows.'
        ],
        techs: ['Rust', 'Go', 'Python', 'Wireshark API', 'Scapy', 'CTF Cryptography'],
        criteria: 'Exploit accuracy, security defense resilience, log visual diagnostics, and script speed.',
        blueprintSpecs: {
          interceptor: 'Network packets logs collector',
          scanner: 'Diagnostic port mapper engine',
          payload: 'Custom hex-payload compiler',
          ui: 'Security telemetry board'
        }
      },
      {
        id: 'game',
        title: 'Retro & Immersive Game Dev',
        tagLine: 'ENGINES, KEYBOARD ARCADES, AND HARDWARE INTERFACES',
        prize: '30,000 INR Pool',
        details: 'Craft retro arcade games, physics sandbox simulations, or multiplayer keyboard arenas. Challenge standard engine frameworks and prioritize pure gameplay.',
        ideas: [
          'A local co-op arcade game with responsive custom keyboard mapping controls.',
          'A low-level retro canvas game engine written entirely in pure TypeScript.',
          'A space physics simulator charting real-time gravitational node pulls.'
        ],
        techs: ['Phaser.js', 'Godot Engine', 'TypeScript', 'Aseprite Pixel Art', 'Chiptune Synthesizer'],
        criteria: 'Input response speed, physics consistency, retro art design, and pure gameplay fun factor.',
        blueprintSpecs: {
          controller: 'Custom keyboard mapper controls',
          particles: 'Pixel particle emitter sandbox',
          score: 'High-score local storage registry',
          soundtrack: 'Built-in chiptune driver'
        }
      },
      {
        id: 'web',
        title: 'Web & Forked Platforms',
        tagLine: 'OFFLINE-FIRST WEBS, LOCAL P2PS, AND SERVERLESS LOGS',
        prize: '30,000 INR Pool',
        details: 'Construct WebRTC P2P networks, decentralized chat systems, offline-first client tools, or high-performance browser databases.',
        ideas: [
          'A secure peer-to-peer browser chat platform functioning entirely client-side.',
          'A reactive offline-first builder tool featuring automatic local storage syncing.',
          'A dashboard widget monitoring system clock anomalies across multiple nodes.'
        ],
        techs: ['WebRTC', 'IndexedDB', 'SQLite WASM', 'Next.js', 'WebSockets', 'Service Workers'],
        criteria: 'Offline resilience, peer signalling stability, speed indexing metrics, and sync reliability.',
        blueprintSpecs: {
          offline: 'Service Workers local cache core',
          peer: 'P2P WebRTC signalling gateway',
          sync: 'Automatic local-to-sheets database sync',
          logger: 'Fader volume/system state logger'
        }
      }
    ]
  })

  // FAQ list state
  const [faqList, setFaqList] = useState(() => {
    const saved = localStorage.getItem('Tachyon_faqs')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error(e)
      }
    }
    return [
      {
        question: 'Who is eligible to participate?',
        answer: 'Any student or individual under the age of 18 (born after August 2008) is welcome to register! Whether you are a builder, hacker, or designer, Tachyon is open to you.'
      },
      {
        question: 'Is it a team or solo event?',
        answer: 'You can participate solo or in teams of up to 4 members. If you do not have a team yet, you can match up in the Team Finder Lobby or on our Discord server right after registration closes.'
      },
      {
        question: 'What is the cost of attendance?',
        answer: 'Tachyon is 100% free! We cover event passes, workshops, meals, drinks, stickers, and swags for all showcase teams. You only need to handle your own travel to the Delhi venue.'
      },
      {
        question: 'How does the entry and format work?',
        answer: 'Tachyon is a direct-entry hackathon. There are no prior qualification filters or pre-selection cuts. As soon as you complete registration, you gain direct entry to the competition. The official prompt drops on July 24, and everyone starts coding immediately.'
      },
      {
        question: 'What technologies can I build with?',
        answer: 'You can build with any framework, language, or engine. From React and Next.js to Python scripts, Rust systems, Godot engines, or custom compilers—use the tools that let you craft the best version of your vision.'
      },
      {
        question: 'What is the submission format for the hackathon?',
        answer: 'You must submit a link to a public GitHub repository containing your project code and a short 2-minute video demonstrating the working build. Marketing slide decks are explicitly banned from the grading criteria.'
      },
      {
        question: 'Can I submit a project I built before the hackathon?',
        answer: 'Absolutely not. All projects must be built entirely within the competition window starting on July 24, 2026. Codebase histories will be audited to verify clean repository timelines.'
      },
      {
        question: 'Will travel reimbursement be provided?',
        answer: 'We offer travel grants of up to 5,000 INR for verified high-quality teams traveling to the Delhi venue from long distances. Applications for grants open along with the showcase shortlist announcement.'
      },
      {
        question: 'What are the judging criteria for submissions?',
        answer: 'Submissions are judged on engineering craftsmanship (code quality, speed, structural design), utility (practical usefulness), and compliance (meeting track specifications). Hype and venture-capital buzzwords are ignored.'
      },
      {
        question: 'Where will the offline showcase take place?',
        answer: 'The grand showcase will take place at a dedicated tech facility in New Delhi. The exact venue location and check-in timeline will be sent to the top 40 teams invited for the showcase.'
      }
    ]
  })

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
        desc: 'Registrations open worldwide. Secure your builder pass to obtain direct, guaranteed entry to the hackathon arena.',
        startDateStr: '2026-07-02T10:00:00+05:30',
        endDateStr: '2026-07-02T12:00:00+05:30'
      },
      {
        phase: '02',
        title: 'Hackathon Commences',
        date: 'July 24, 2026',
        status: 'UPCOMING',
        desc: 'The official build prompt goes live. All registered participants directly enter the arena and begin coding.',
        startDateStr: '2026-07-24T00:00:00+05:30',
        endDateStr: '2026-07-24T03:00:00+05:30'
      },
      {
        phase: '03',
        title: 'Submissions Close',
        date: 'August 3, 2026',
        status: 'UPCOMING',
        desc: 'The hackathon submission window closes. Projects undergo peer review and evaluation by our expert judges.',
        startDateStr: '2026-08-03T23:59:00+05:30',
        endDateStr: '2026-08-04T01:00:00+05:30'
      },
      {
        phase: '04',
        title: 'Showcase Shortlist',
        date: 'August 15, 2026',
        status: 'UPCOMING',
        desc: 'The top 40 teams are announced for the offline grand showcase and receive invitations for the Delhi venue.',
        startDateStr: '2026-08-15T12:00:00+05:30',
        endDateStr: '2026-08-15T14:00:00+05:30'
      },
      {
        phase: '05',
        title: 'Offline Grand Showcase',
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
      '--color-yellow-neo': '#E65A4B',
      '--color-red-neo': '#d91429',
      '--color-cyber-cyan': '#EAEAE6',
      '--color-drac-purple': '#bd93f9',
      '--color-ink': '#1A1A18',
      '--color-paper': '#EAEAE6',
      '--color-custom-primary': '#E65A4B',
      '--color-custom-bg': '#1A1A18',
      '--color-custom-text': '#EAEAE6'
    }
  })

  const [venueLocation, setVenueLocation] = useState(() => {
    return localStorage.getItem('Tachyon_venue_location') || 'New Delhi Central, Delhi, India'
  })

  useEffect(() => {
    localStorage.setItem('Tachyon_venue_location', venueLocation)
  }, [venueLocation])

  // Detect environment specs on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cores = navigator.hardwareConcurrency || 4
      const plat = navigator.platform || 'Linux/Win'
      const isChrome = navigator.userAgent.includes('Chrome')
      setSysDetails({
        cpu: cores,
        platform: plat,
        browser: isChrome ? 'CHROME_ENGINE' : 'V8_RUNTIME'
      })
    }
  }, [])

  // 1. Loading sequence simulation
  useEffect(() => {
    const logsList = [
      'SYS: INITIATING COLD BOOT SEQUENCE...',
      `SYS: CPU CORES DETECTED -> ${sysDetails.cpu || 4} MODULE THREADS`,
      `SYS: HOST INTERFACE PLATFORM -> ${sysDetails.platform}`,
      `SYS: ENGINE CORE ACTIVE -> ${sysDetails.browser}`,
      'NODE: SYNCING DELHI COORDINATES [28°38′N 77°13′E]... [OK]',
      'STACK: CONFIGURING MODULAR COGNITIVE ARCHITECTURE... [OK]',
      'SECURE: INJECTING REGISTRATION VERIFIER KEYS... [OK]',
      'AUDIO: LOADING FOOTER SYNTH PIANO PAD OSCILLATORS... [READY]',
      'FIREWALL: ESTABLISHING INTEGRITY SYSTEM HL-2026... [OK]',
      'SYSTEM ONLINE. CORE STACK READY.'
    ]
    let currentLogIdx = 0
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const nextProgress = prev + Math.floor(Math.random() * 5) + 3
        const targetProgress = Math.min(nextProgress, 100)
        
        const targetLogIdx = Math.floor((targetProgress / 100) * logsList.length)
        if (targetLogIdx > currentLogIdx && targetLogIdx < logsList.length) {
          setLoadLogs(logs => [...logs, logsList[currentLogIdx]])
          currentLogIdx = targetLogIdx
        }
        if (targetProgress === 100) {
          setLoadLogs(logs => [...logs, logsList[logsList.length - 1]])
        }
        return targetProgress
      })
    }, 60)
    return () => clearInterval(interval)
  }, [sysDetails])

  // 2. Custom lagging spring cursor physics — Rendered OUTSIDE React VDOM to avoid clock ticks wipes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Create elements dynamically on document.body
    const dot = document.createElement('div')
    dot.style.position = 'fixed'
    dot.style.pointerEvents = 'none'
    dot.style.zIndex = '10000'
    dot.style.width = '5px'
    dot.style.height = '5px'
    dot.style.backgroundColor = '#C2452D'
    dot.style.opacity = '0'
    dot.style.transform = 'translate(-50%, -50%)'
    
    const box = document.createElement('div')
    box.style.position = 'fixed'
    box.style.pointerEvents = 'none'
    box.style.zIndex = '9999'
    box.style.width = '24px'
    box.style.height = '24px'
    box.style.border = '1px solid rgba(194, 69, 45, 0.35)'
    box.style.opacity = '0'
    box.style.transform = 'translate(-50%, -50%)'
    box.style.transition = 'transform 0.15s ease-out, border-color 0.15s ease-out, background-color 0.15s ease-out'

    // Add corner ticks to the casing box
    const ticks = [
      { top: '-1px', left: '-1px', borderTop: '1.5px solid #C2452D', borderLeft: '1.5px solid #C2452D' },
      { top: '-1px', right: '-1px', borderTop: '1.5px solid #C2452D', borderRight: '1.5px solid #C2452D' },
      { bottom: '-1px', left: '-1px', borderBottom: '1.5px solid #C2452D', borderLeft: '1.5px solid #C2452D' },
      { bottom: '-1px', right: '-1px', borderBottom: '1.5px solid #C2452D', borderRight: '1.5px solid #C2452D' }
    ]
    ticks.forEach(tSpec => {
      const tick = document.createElement('span')
      tick.style.position = 'absolute'
      tick.style.width = '5px'
      tick.style.height = '5px'
      if (tSpec.top) tick.style.top = tSpec.top
      if (tSpec.bottom) tick.style.bottom = tSpec.bottom
      if (tSpec.left) tick.style.left = tSpec.left
      if (tSpec.right) tick.style.right = tSpec.right
      if (tSpec.borderTop) tick.style.borderTop = tSpec.borderTop
      if (tSpec.borderBottom) tick.style.borderBottom = tSpec.borderBottom
      if (tSpec.borderLeft) tick.style.borderLeft = tSpec.borderLeft
      if (tSpec.borderRight) tick.style.borderRight = tSpec.borderRight
      box.appendChild(tick)
    })

    document.body.appendChild(dot)
    document.body.appendChild(box)

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      dot.style.left = `${e.clientX}px`
      dot.style.top = `${e.clientY}px`
      dot.style.transform = 'translate(-50%, -50%)'
      dot.style.opacity = '1'
      box.style.opacity = '1'
    }

    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest('a, button, input, select, textarea, [role="button"]')
      isHoveringRef.current = !!isInteractive
      
      if (isHoveringRef.current) {
        box.style.transform = 'translate(-50%, -50%) scale(1.4) rotate(45deg)'
        box.style.borderColor = '#C2452D'
        box.style.backgroundColor = 'rgba(194, 69, 45, 0.08)'
      } else {
        box.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)'
        box.style.borderColor = 'rgba(194, 69, 45, 0.35)'
        box.style.backgroundColor = 'transparent'
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)

    let animId
    const updateTrail = () => {
      // Spring interpolation lag
      const dx = mouseRef.current.x - trailRef.current.x
      const dy = mouseRef.current.y - trailRef.current.y
      
      trailRef.current.x += dx * 0.16
      trailRef.current.y += dy * 0.16

      box.style.left = `${trailRef.current.x}px`
      box.style.top = `${trailRef.current.y}px`
      
      animId = requestAnimationFrame(updateTrail)
    }
    animId = requestAnimationFrame(updateTrail)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animId)
      if (document.body.contains(dot)) document.body.removeChild(dot)
      if (document.body.contains(box)) document.body.removeChild(box)
    }
  }, [])

  // Google GSI Sign-In Client Listener setup
  useEffect(() => {
    if (googleClientId && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false
        })
      } catch (e) {
        console.error('Google Sign-In initialization failed:', e)
      }
    }
  }, [googleClientId])

  // Google dynamic button rendering trigger
  useEffect(() => {
    if (isUserAuthModalOpen && googleClientId && window.google) {
      setTimeout(() => {
        const btnEl = document.getElementById("google-signin-btn-container")
        if (btnEl) {
          try {
            window.google.accounts.id.renderButton(btnEl, {
              theme: "outline",
              size: "large",
              text: "signin_with",
              shape: "rectangular"
            })
          } catch (e) {
            console.error('Error rendering Google button:', e)
          }
        }
      }, 100)
    }
  }, [isUserAuthModalOpen, googleClientId, authTab])

  // Load settings from localStorage
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
    localStorage.setItem('Tachyon_whatsapp_link', whatsappLink)
  }, [whatsappLink])

  useEffect(() => {
    localStorage.setItem('Tachyon_instagram_link', instagramLink)
  }, [instagramLink])

  useEffect(() => {
    localStorage.setItem('Tachyon_twitter_link', twitterLink)
  }, [twitterLink])

  useEffect(() => {
    localStorage.setItem('Tachyon_faqs', JSON.stringify(faqList))
  }, [faqList])

  useEffect(() => {
    localStorage.setItem('Tachyon_tracks', JSON.stringify(tracksList))
  }, [tracksList])

  useEffect(() => {
    localStorage.setItem('Tachyon_admin_emails', JSON.stringify(adminEmails))
  }, [adminEmails])

  useEffect(() => {
    Object.entries(themeColors).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value)
    })
    localStorage.setItem('tachyon_custom_colors', JSON.stringify(themeColors))
  }, [themeColors])

  // Countdown timer logic targeting countdownDate
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

  // Handle Google Login Credential responses
  const handleGoogleCredentialResponse = async (response) => {
    try {
      const jwt = response.credential
      const base64Url = jwt.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      const payload = JSON.parse(jsonPayload)
      const authUser = {
        name: payload.name,
        email: payload.email.toLowerCase(),
        picture: payload.picture,
        authMethod: 'google'
      }

      setLocalUserSession(authUser)
      setIsUserAuthModalOpen(false)
    } catch (e) {
      console.error('Failed to parse Google JWT response:', e)
    }
  }

  // Fallback trigger if OAuth isn't configured in client
  const triggerGoogleLogin = () => {
    if (!googleClientId) {
      alert("Google OAuth Client ID is not configured! Please configure it in the Admin Console under 'Milestones & Dates' first, or register a custom email/password account.")
      return
    }
    if (window.google) {
      try {
        window.google.accounts.id.prompt()
      } catch (e) {
        console.error(e)
      }
    } else {
      alert("Google Auth SDK is still loading. Please wait a moment.")
    }
  }

  // Set user session helper
  const setLocalUserSession = (authUser) => {
    setUser(authUser)
    localStorage.setItem('Tachyon_user', JSON.stringify(authUser))
    playSound('success', isMuted, volume)
    
    // Retrieve associated registrations if they exist in the sheet
    retrieveUserTicket(authUser.email)
  }

  // Retrieve user ticket by email lookup from Google Sheets
  const retrieveUserTicket = async (email) => {
    try {
      const webhookUrl = localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
      const res = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getTicket',
          email: email
        })
      })
      const data = await res.json()
      if (data.status === 'success' && data.ticket) {
        setTicketData(data.ticket)
        localStorage.setItem('tachyon_ticket', JSON.stringify(data.ticket))
      }
    } catch (e) {
      console.error('Failed to auto-sync registration cache:', e)
    }
  }
  // Custom credentials Auth operations
  const handleCustomSignUp = async (name, email, password, pin) => {
    try {
      const webhookUrl = localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
      
      const msgBuffer = new TextEncoder().encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      const res = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'signUp',
          name,
          email,
          password: hashedPassword,
          pin
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        const authUser = {
          name: name,
          email: email.toLowerCase(),
          authMethod: 'email'
        }
        setLocalUserSession(authUser)
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Email already registered.' }
      }
    } catch (e) {
      console.error(e)
      return { success: false, message: 'Server communication error.' }
    }
  }

  const handleCustomResetPassword = async (email, pin, newPassword) => {
    try {
      const webhookUrl = localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
      
      const msgBuffer = new TextEncoder().encode(newPassword)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      const res = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'resetPassword',
          email,
          pin,
          password: hashedPassword
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        playSound('success', isMuted, volume)
        alert('🔑 PASSWORD RESET SUCCESSFUL! Please sign in with your new password.')
        setAuthTab('signin')
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Reset failed.' }
      }
    } catch (e) {
      console.error(e)
      return { success: false, message: 'Server communication error.' }
    }
  }
  const handleCustomSignIn = async (email, password) => {
    try {
      const lowerEmail = email.toLowerCase()
      
      const msgBuffer = new TextEncoder().encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      // Administrative Fail-safe Bypass: Allow specified accounts to login using the master passcode Tach@2026
      const defaultAdmins = ['devpriya@tachyonindia.org', 'pranjal@tachyonindia.org', 'yugam@tachyonindia.org', 'help@tachyonindia.org', 'admin@tachyonindia.org']
      const isAllowedAdmin = defaultAdmins.includes(lowerEmail)
      const isMasterPasscode = hashedPassword === 'd0deffc7d5f4c089f56e0b3eaa29ff3f4a6c9c49f111824577cc032cd4f342cd' // Tach@2026 hash

      if (isAllowedAdmin && isMasterPasscode) {
        const authUser = {
          name: lowerEmail.split('@')[0].toUpperCase(),
          email: lowerEmail,
          authMethod: 'email'
        }
        setLocalUserSession(authUser)
        return { success: true }
      }

      const webhookUrl = localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
      const res = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'login',
          email,
          password: hashedPassword
        })
      })
      const data = await res.json()
      if (data.status === 'success' && data.user) {
        const authUser = {
          name: data.user.name,
          email: email.toLowerCase(),
          authMethod: 'email'
        }
        setLocalUserSession(authUser)
        return { success: true }
      } else {
        return { success: false, message: data.message || 'Incorrect credentials.' }
      }
    } catch (e) {
      console.error(e)
      return { success: false, message: 'Server connection error.' }
    }
  }

  // Logout session wipe helper
  const handleLogout = () => {
    playSound('power-off', isMuted, volume)
    setUser(null)
    setTicketData(null)
    localStorage.removeItem('Tachyon_user')
    localStorage.removeItem('tachyon_ticket')
  }

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

  const changeTheme = (newTheme) => {
    setSiteTheme(newTheme)
    setTicketColorTheme(newTheme)
    localStorage.setItem('tachyon_theme', newTheme)
    playSound('click', isMuted, volume)
  }

  // Handle entering the website with a smooth transition and scrolling to top
  const handleEnterSystem = () => {
    playSound('power-on', isMuted, volume)
    setIsLoaderFading(true)
    
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 700)
  }

  // Assert user login status and email authorized bounds
  const handleOpenAdminSecurely = () => {
    if (!user) {
      playSound('error', isMuted, volume)
      setAuthTab('signin')
      setIsUserAuthModalOpen(true)
      alert("🔒 ACCESS DENIED: Please sign in with an authorized Google or custom account first.")
      return
    }

    const email = user.email.toLowerCase()
    const isAuthorized = adminEmails.map(e => e.toLowerCase()).includes(email)
    
    if (isAuthorized) {
      playSound('success', isMuted, volume)
      setIsAdminOpen(true)
    } else {
      playSound('error', isMuted, volume)
      alert(`🚫 ACCESS DENIED: User email '${user.email}' is not authorized to access system configurations.`)
    }
  }

  const handleOpenRegisterModalSecurely = () => {
    if (!user) {
      playSound('error', isMuted, volume)
      setAuthTab('signin')
      setIsUserAuthModalOpen(true)
      alert("🔒 LOGIN REQUIRED: You must create an account or sign in to secure a hackathon ticket.")
    } else {
      playSound('click', isMuted, volume)
      setIsRegisterModalOpen(true)
    }
  }

  return (
    <>
      {/* 1. Custom Technical BIOS Loader Screen with Smooth transitions */}
      {isLoading && (
        <div 
          className={`fixed inset-0 bg-[#0A0A08] z-[10000] flex flex-col justify-center items-center p-6 select-none font-mono transition-opacity duration-700 ease-in-out ${
            isLoaderFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Faint CRT flickering effect scanlines inside loader */}
          <div className="absolute inset-0 bg-transparent pointer-events-none opacity-[0.03] bg-gradient-to-b from-[#F8F7F4]/0 to-[#F8F7F4]/20 bg-[size:100%_4px] z-20"></div>
          
          <div className="w-full max-w-lg border border-white/6 p-8 space-y-6 relative bg-[#0A0A08] z-10 text-left">
            {/* Corner Indicators */}
            <div className="absolute top-2.5 left-2.5 text-[7px] text-white/20 tracking-widest uppercase">TACHYON // BOOT_GRID</div>
            <div className="absolute top-2.5 right-2.5 text-[7px] text-white/20 tracking-widest uppercase">NODE: 28°38′N 77°13′E</div>

            {/* Kanji Branding */}
            <div className="text-center select-none pt-4 flex flex-col items-center">
              <span className="font-syne font-black text-white/[0.02] text-[80px] leading-none select-none block">創</span>
              
              {/* ASCII Logo Banner */}
              <pre className="text-[7px] leading-none text-[#10b981] font-mono select-none my-2 font-bold max-w-full overflow-hidden text-center block">
{`┌────────────────────────────────────────┐
│  _____  _    ____ _  ____   ______  _  │
│ |_   _|/ \\  / ___| |/ \\ \\ / /  _ \\| \\ │
│   | | / _ \\| |   | ' / \\ V /| |_) | | │
│   | |/ ___ \\ |___| . \\  | | |  __/|_| │
│   |_/_/   \\_\\____|_|\\_\\ |_| |_|   (_) │
└────────────────────────────────────────┘`}
              </pre>

              <span className="block font-syne font-black text-xs uppercase text-[#F8F7F4] tracking-[0.3em] mt-3">TACHYON SYSTEM BOOT</span>
              <div className="w-6 h-px bg-[#C2452D] mt-2 select-none"></div>
            </div>

            {/* Output console log stream with active type blocks */}
            <div className="border border-white/5 bg-white/[0.01] p-4.5 h-44 overflow-y-auto text-left space-y-2 scrollbar-none">
              {loadLogs.map((log, i) => (
                <div key={i} className="text-[9.5px] text-[#10b981] font-mono leading-none tracking-wide flex items-center gap-2">
                  <span className="text-[#10b981]/40 select-none">▪</span>
                  <span>{log}</span>
                </div>
              ))}
              {loadingProgress < 100 ? (
                <div className="text-[9.5px] text-white/30 font-mono flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-3 bg-white/40 animate-pulse select-none"></span>
                  <span>EXECUTING DIAGNOSIS PROCESS...</span>
                </div>
              ) : (
                <div className="text-[9.5px] text-[#10b981] font-bold font-mono">
                  &gt; STATUS: OK. PRESS ENTER TO ACCESS ENVIRONMENT.
                </div>
              )}
            </div>

            {/* Stepper bar with smooth transition */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[9px] text-white/40 tracking-wider font-mono">
                <span>VERIFYING SYSTEM COMPLIANCE</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="h-1 w-full bg-white/[0.04] overflow-hidden">
                <div 
                  className="bg-[#C2452D] h-full transition-all duration-300 ease-out" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Security Warning Footnote */}
            <div className="text-[7.5px] text-[#C2452D]/60 tracking-wider leading-relaxed text-center font-mono max-w-sm mx-auto select-none uppercase">
              WARNING: UNAUTHORIZED CONNECTIONS WILL BE LOGGED AND BLOCKED BY FIREWALL PROTOCOL HL-2026.
            </div>

            {/* Enter Realm button */}
            {loadingProgress === 100 && (
              <button
                onClick={handleEnterSystem}
                className="w-full bg-[#F8F7F4] text-[#0A0A08] font-mono text-[10px] font-bold uppercase tracking-[0.3em] py-3.5 cursor-pointer hover:bg-white/90 active:scale-[0.99] transition-all hover-glitch border-0"
              >
                [ ENTER SYSTEM ]
              </button>
            )}
          </div>
        </div>
      )}

      {/* Standby screen display when CRT is powered off */}
      {crtPower === 'STANDBY' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0A08] z-[9999] select-none">
          <div className="text-center max-w-sm space-y-8">
            <div className="font-syne font-bold text-white/[0.03] text-[120px] select-none pointer-events-none">創</div>
            <span className="block font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">
              SYSTEM STANDBY
            </span>
            <button
              onClick={toggleCrtPower}
              className="border border-white/10 px-6 py-2.5 font-mono text-[9px] text-white/40 uppercase tracking-[0.2em] hover:text-white hover:border-white/20 transition-colors cursor-pointer"
            >
              Resume Session
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div
        className={`min-h-screen flex flex-col font-mono bg-[#0A0A08] text-[#F8F7F4] relative overflow-x-hidden selection:bg-[#C2452D]/30 selection:text-[#F8F7F4] transition-opacity duration-300 ${
          crtPower === 'OFF' ? 'opacity-0' : crtPower === 'ON' ? 'opacity-100' : 'opacity-0'
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
          setIsRegisterModalOpen={handleOpenRegisterModalSecurely}
          user={user}
          setIsAuthModalOpen={setIsUserAuthModalOpen}
          handleLogout={handleLogout}
        />

        {/* Hero Section */}
        <Hero
          timeLeft={timeLeft}
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          ticketData={ticketData}
          setIsRegisterModalOpen={handleOpenRegisterModalSecurely}
          whatsappLink={whatsappLink}
        />

        {/* Marquee Tape */}
        <div className="overflow-hidden border-y border-white/[0.04] py-3 select-none flex bg-transparent">
          <div className="animate-marquee whitespace-nowrap flex gap-16 font-mono text-[9px] uppercase text-white/15 tracking-[0.3em]">
            <span>TACHYON V1.0</span>
            <span>·</span>
            <span>DELHI SATELLITE HACKATHON</span>
            <span>·</span>
            <span>UNDER-18 BUILDERS</span>
            <span>·</span>
            <span>PRECISION OVER HYPE</span>
            <span>·</span>
            <span>CRAFT. CODE. CREATE.</span>
            <span>·</span>
            <span>TACHYON V1.0</span>
            <span>·</span>
            <span>DELHI SATELLITE HACKATHON</span>
            <span>·</span>
            <span>UNDER-18 BUILDERS</span>
            <span>·</span>
            <span>PRECISION OVER HYPE</span>
            <span>·</span>
            <span>CRAFT. CODE. CREATE.</span>
          </div>
        </div>

        {/* Creed Section & Interactive Console */}
        <CreedSection
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          setIsRegisterModalOpen={handleOpenRegisterModalSecurely}
          openAdminPanel={handleOpenAdminSecurely}
        />

        {/* Challenge Tracks & Configurator */}
        <TracksSection
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          tracksList={tracksList}
        />

        {/* Roadmap Stepper & ICS Downloader */}
        <TimelineSection
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          timelineNodes={timelineNodes}
          venueLocation={venueLocation}
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
          faqList={faqList}
        />

        {/* Footer & Synthesizer keyboard */}
        <Footer
          siteTheme={siteTheme}
          isMuted={isMuted}
          volume={volume}
          openAdminPanel={handleOpenAdminSecurely}
          instagramLink={instagramLink}
          twitterLink={twitterLink}
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
            user={user}
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
            whatsappLink={whatsappLink}
            setWhatsappLink={setWhatsappLink}
            faqList={faqList}
            setFaqList={setFaqList}
            instagramLink={instagramLink}
            setInstagramLink={setInstagramLink}
            twitterLink={twitterLink}
            setTwitterLink={setTwitterLink}
            tracksList={tracksList}
            setTracksList={setTracksList}
            adminEmails={adminEmails}
            setAdminEmails={setAdminEmails}
            googleClientId={googleClientId}
            setGoogleClientId={setGoogleClientId}
            venueLocation={venueLocation}
            setVenueLocation={setVenueLocation}
          />
        )}

        {/* User Authentication Modal (Sign In / Sign Up) */}
        {isUserAuthModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 font-mono select-none">
            <div className="w-full max-w-sm border border-white/8 bg-[#0A0A08] p-6 relative rounded-none text-left">
              
              {/* Close button */}
              <button
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setIsUserAuthModalOpen(false)
                }}
                className="absolute top-4 right-4 text-white/20 hover:text-white/50 font-mono text-base leading-none transition-colors cursor-pointer p-1"
              >
                ✕
              </button>
              <span className="font-mono text-[8px] text-white/20 tracking-[0.3em] block mb-2">SECURE PORTAL // USER_AUTH</span>
              
              {/* Tabs */}
              <div className="flex border-b border-white/5 pb-3 mb-6 select-none font-bold">
                {['signin', 'signup', ...(authTab === 'reset' ? ['reset'] : [])].map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      playSound('click', isMuted, volume)
                      setAuthTab(tab)
                    }}
                    className={`flex-1 text-center py-1.5 uppercase font-mono text-[10px] tracking-[0.15em] transition-all cursor-pointer ${
                      authTab === tab 
                        ? 'text-[#F8F7F4] border-b border-white' 
                        : 'text-white/25 hover:text-white/50'
                    }`}
                  >
                    {tab === 'signin' ? 'Sign In' : tab === 'signup' ? 'Sign Up' : 'Reset'}
                  </button>
                ))}
              </div>

              {/* TAB contents */}
              {authTab === 'signin' ? (
                /* SIGN IN FORM */
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const email = e.target.elements.signInEmail.value.trim()
                  const password = e.target.elements.signInPassword.value

                  if (!email || !password) {
                    playSound('error', isMuted, volume)
                    alert('Please enter both Email and Password.')
                    return
                  }

                  const result = await handleCustomSignIn(email, password)
                  if (result.success) {
                    setIsUserAuthModalOpen(false)
                  } else {
                    playSound('error', isMuted, volume)
                    alert(`🚫 SIGN IN FAILED: ${result.message}`)
                  }
                }} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:EMAIL</label>
                    <input
                      name="signInEmail"
                      type="email"
                      required
                      placeholder="Enter account email"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:PASSWORD</label>
                    <input
                      name="signInPassword"
                      type="password"
                      required
                      placeholder="Enter account password"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                    <div className="flex justify-between items-center text-[9px] mt-1.5 font-mono">
                      <span />
                      <button
                        type="button"
                        onClick={() => {
                          playSound('click', isMuted, volume)
                          setAuthTab('reset')
                        }}
                        className="text-white/30 hover:text-white/60 uppercase tracking-widest cursor-pointer border-0 bg-transparent p-0 outline-none"
                      >
                        [ Forgot Password? ]
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#F8F7F4] hover:bg-white text-[#0A0A08] py-2.5 font-mono text-[10px] font-bold uppercase rounded-none transition-colors cursor-pointer"
                  >
                    SIGN IN
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-3 text-white/15 text-[8px] tracking-[0.2em]">OR SIGN IN WITH</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* Google Sign-in button */}
                  {googleClientId ? (
                    <div id="google-signin-btn-container" className="w-full flex justify-center bg-transparent py-1 select-none"></div>
                  ) : (
                    <button
                      type="button"
                      onClick={triggerGoogleLogin}
                      className="w-full border border-white/10 hover:border-white/20 bg-white/5 text-[#F8F7F4]/70 hover:text-white py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="font-bold text-[#E65A4B]">G</span> Google Auth (Unconfigured)
                    </button>
                  )}
                </form>
              ) : authTab === 'signup' ? (
                /* SIGN UP FORM */
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const name = e.target.elements.signUpName.value.trim()
                  const email = e.target.elements.signUpEmail.value.trim()
                  const password = e.target.elements.signUpPassword.value
                  const pin = e.target.elements.signUpPin.value.trim()

                  if (!name || !email || !password || !pin) {
                    playSound('error', isMuted, volume)
                    alert('All fields are required!')
                    return
                  }

                  if (pin.length !== 4 || isNaN(pin)) {
                    playSound('error', isMuted, volume)
                    alert('Security PIN must be exactly a 4-digit number!')
                    return
                  }

                  const result = await handleCustomSignUp(name, email, password, pin)
                  if (result.success) {
                    setIsUserAuthModalOpen(false)
                  } else {
                    playSound('error', isMuted, volume)
                    alert(`🚫 REGISTRATION FAILED: ${result.message}`)
                  }
                }} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:FULL_NAME</label>
                    <input
                      name="signUpName"
                      type="text"
                      required
                      placeholder="e.g. Kunal Dev"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:EMAIL</label>
                    <input
                      name="signUpEmail"
                      type="email"
                      required
                      placeholder="e.g. kunal@domain.com"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:PASSWORD</label>
                    <input
                      name="signUpPassword"
                      type="password"
                      required
                      placeholder="Create security password"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:SECURITY_PIN (4-DIGIT CODE FOR RECOVERY)</label>
                    <input
                      name="signUpPin"
                      type="text"
                      maxLength="4"
                      required
                      placeholder="e.g. 8839"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#F8F7F4] hover:bg-white text-[#0A0A08] py-2.5 font-mono text-[10px] font-bold uppercase rounded-none transition-colors cursor-pointer"
                  >
                    CREATE USER PROFILE
                  </button>
                </form>
              ) : (
                /* RESET PASSWORD FORM */
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const email = e.target.elements.resetEmail.value.trim()
                  const pin = e.target.elements.resetPin.value.trim()
                  const newPassword = e.target.elements.resetNewPassword.value

                  if (!email || !pin || !newPassword) {
                    playSound('error', isMuted, volume)
                    alert('All fields are required!')
                    return
                  }

                  if (pin.length !== 4 || isNaN(pin)) {
                    playSound('error', isMuted, volume)
                    alert('Security PIN must be a 4-digit number!')
                    return
                  }

                  const result = await handleCustomResetPassword(email, pin, newPassword)
                  if (result.success) {
                    setIsUserAuthModalOpen(false)
                  } else {
                    playSound('error', isMuted, volume)
                    alert(`🚫 PASSWORD RESET FAILED: ${result.message}`)
                  }
                }} className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:EMAIL</label>
                    <input
                      name="resetEmail"
                      type="email"
                      required
                      placeholder="Enter registered email"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:SECURITY_PIN</label>
                    <input
                      name="resetPin"
                      type="text"
                      maxLength="4"
                      required
                      placeholder="Enter 4-digit security PIN"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1">FIELD:NEW_PASSWORD</label>
                    <input
                      name="resetNewPassword"
                      type="password"
                      required
                      placeholder="Create new password"
                      className="bg-transparent border-b border-white/8 text-white font-mono text-xs p-2 rounded-none outline-none focus:border-white w-full placeholder:text-white/10"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#F8F7F4] hover:bg-white text-[#0A0A08] py-2.5 font-mono text-[10px] font-bold uppercase rounded-none transition-colors cursor-pointer"
                  >
                    RESET PASSWORD
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
export default App
