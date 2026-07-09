import React, { useState } from 'react'
import { Cpu, Shield, Gamepad, Globe, Code, Download, Sparkles, CheckSquare, Square } from 'lucide-react'
import { playSound } from '../utils/audio'

export function TracksSection({ siteTheme: _siteTheme, isMuted, volume }) {
  const [selectedTrackTab, setSelectedTrackTab] = useState('ALL')
  const [cardName, setCardName] = useState('')
  const [selectedTechs, setSelectedTechs] = useState([])
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  const [previewTilt, setPreviewTilt] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)', glareX: 0, glareY: 0 })
  const handlePreviewMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const degX = -(y / (rect.height / 2)) * 12
    const degY = (x / (rect.width / 2)) * 12
    const glareX = (x / (rect.width / 2)) * 40
    const glareY = (y / (rect.height / 2)) * 40
    setPreviewTilt({
      transform: `perspective(1000px) rotateX(${degX}deg) rotateY(${degY}deg)`,
      glareX,
      glareY,
      transition: 'transform 0.05s ease-out'
    })
  }
  const handlePreviewMouseLeave = () => {
    setPreviewTilt({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      glareX: 0,
      glareY: 0,
      transition: 'transform 0.35s ease-out'
    })
  }

  // Interactive Project Blueprint States
  const [blueprintChecklist, setBlueprintChecklist] = useState({
    ai: { memory: false, tools: false, fallback: false, ui: false },
    cyber: { interceptor: false, scanner: false, payload: false, ui: false },
    game: { controller: false, particles: false, score: false, soundtrack: false },
    web: { offline: false, peer: false, sync: false, logger: false }
  })

  const TRACKS_DATA = {
    ALL: [
      {
        id: 'ai',
        icon: Cpu,
        title: 'AI & Intelligent Agents',
        tagLine: 'BUILD AUTONOMOUS ENTITIES AND SMART WORKFLOWS',
        prize: '50,000 INR Pool',
        details: 'Create intelligent systems that go beyond simple chat interfaces. Build autonomous agents, LLM-powered tools, code generation scrapers, or sensory processing apps.',
        ideas: [
          'An AI agent that crawls GitHub repos, reads code, and opens PRs with unit test fixes.',
          'A local-first browser extension that synthesizes research papers as you read.',
          'An autonomous developer assistant that learns your keyboard shortcuts.'
        ]
      },
      {
        id: 'cyber',
        icon: Shield,
        title: 'Cybersecurity & Exploits',
        tagLine: 'OFFENSIVE SCRIPTS, DEFENSIVE SHIELDS, AND CTF TECH',
        prize: '40,000 INR Pool',
        details: 'Push the limits of digital systems. Build penetration testing automation, network analysis tools, cryptography visualizers, or custom system monitors.',
        ideas: [
          'A web-based visual network package mapper parsing Wireshark logs in real-time.',
          'A local open-port mapping tool equipped with clean diagnostic logs dashboard.',
          'An educational CTF platform modeling real hardware-level stack overflows.'
        ]
      },
      {
        id: 'game',
        icon: Gamepad,
        title: 'Retro & Immersive Game Dev',
        tagLine: 'ENGINES, KEYBOARD ARCADES, AND HARDWARE INTERFACES',
        prize: '30,000 INR Pool',
        details: 'Craft retro arcade games, physics sandbox simulations, or multiplayer keyboard arenas. Challenge standard engine frameworks and prioritize pure gameplay.',
        ideas: [
          'A local co-op arcade game with responsive custom keyboard mapping controls.',
          'A low-level retro canvas game engine written entirely in pure TypeScript.',
          'A space physics simulator charting real-time gravitational node pulls.'
        ]
      },
      {
        id: 'web',
        icon: Globe,
        title: 'Web & Forked Platforms',
        tagLine: 'OFFLINE-FIRST WEBS, LOCAL P2PS, AND SERVERLESS LOGS',
        prize: '30,000 INR Pool',
        details: 'Construct WebRTC P2P networks, decentralized chat systems, offline-first client tools, or high-performance browser databases.',
        ideas: [
          'A secure peer-to-peer browser chat platform functioning entirely client-side.',
          'A reactive offline-first builder tool featuring automatic local storage syncing.',
          'A dashboard widget monitoring system clock anomalies across multiple nodes.'
        ]
      }
    ],
    AI: [
      {
        id: 'ai',
        icon: Cpu,
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
      }
    ],
    CYBER: [
      {
        id: 'cyber',
        icon: Shield,
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
      }
    ],
    GAME: [
      {
        id: 'game',
        icon: Gamepad,
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
          soundtrack: 'Built-in synth chiptune driver'
        }
      }
    ],
    WEB: [
      {
        id: 'web',
        icon: Globe,
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
  }

  const TECH_STACK_OPTIONS = [
    'React', 'Rust', 'PyTorch', 'Go', 
    'Godot', 'Solidity', 'Docker', 'SQLite'
  ]

  const toggleTech = (tech) => {
    playSound('keypress', isMuted, volume)
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter(t => t !== tech))
    } else if (selectedTechs.length < 6) {
      setSelectedTechs([...selectedTechs, tech])
    }
  }

  const toggleBlueprintItem = (trackId, key) => {
    playSound('click', isMuted, volume)
    setBlueprintChecklist(prev => ({
      ...prev,
      [trackId]: {
        ...prev[trackId],
        [key]: !prev[trackId][key]
      }
    }))
  }

  // Export card profile badge canvas drawing
  const handleExportTechCard = () => {
    playSound('success', isMuted, volume)
    
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 250
    const ctx = canvas.getContext('2d')

    // Deep space-dark base
    ctx.fillStyle = '#030712'
    ctx.fillRect(0, 0, 400, 250)

    // Inner fine border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 2
    ctx.strokeRect(8, 8, 384, 234)

    // micro dots matrix
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    for (let x = 20; x < 400; x += 24) {
      for (let y = 20; y < 250; y += 24) {
        ctx.fillRect(x, y, 1.5, 1.5)
      }
    }

    // Header segment
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
    ctx.fillRect(10, 10, 380, 50)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(10, 60)
    ctx.lineTo(390, 60)
    ctx.stroke()

    // Header branding
    ctx.fillStyle = '#6366f1' // Indigo Glow
    ctx.fillRect(24, 20, 10, 10)
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.strokeRect(24, 20, 10, 10)

    ctx.font = 'bold 11px monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Tachyon TECH CORE PROFILE', 44, 28)
    ctx.font = 'bold 8.5px monospace'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillText('DIAGNOSTIC STATUS // STACK_ACTIVE', 44, 42)

    // Builder Name
    ctx.font = 'bold 13px monospace'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`BUILDER: ${cardName ? cardName.toUpperCase() : 'GUEST_HACKER'}`, 25, 95)

    // Selection tags
    ctx.font = 'bold 9.5px monospace'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillText('LOADED TECHNOLOGY CORES:', 25, 128)

    const startX = 25
    let currentX = startX
    let currentY = 145
    const rowHeight = 32

    selectedTechs.forEach((tech) => {
      ctx.font = 'bold 9.5px monospace'
      const textWidth = ctx.measureText(tech).width
      const paddingX = 12
      const boxWidth = textWidth + paddingX * 2
      const boxHeight = 18

      // Wrap check
      if (currentX + boxWidth > 370) {
        currentX = startX
        currentY += rowHeight
      }

      // Draw tag container
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.fillRect(currentX, currentY, boxWidth, boxHeight)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.strokeRect(currentX, currentY, boxWidth, boxHeight)

      // Draw text
      ctx.fillStyle = '#38bdf8' // cyan light
      ctx.fillText(tech, currentX + paddingX, currentY + 12)

      currentX += boxWidth + 10
    })

    // Footer signature
    ctx.font = 'bold 7.5px monospace'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.fillText('VERIFICATION CODE: HL-STK-OK', 25, 222)

    // Export image download trigger
    const link = document.createElement('a')
    link.download = `tech_core_${cardName ? cardName.toLowerCase() : 'builder'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const activeTracksList = TRACKS_DATA[selectedTrackTab]

  return (
    <section id="tracks" className="py-24 border-b border-white/5 bg-transparent relative max-w-[1400px] mx-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div className="text-left">
            <div className="inline-block border border-white/10 bg-white/5 text-zinc-300 font-mono text-[10px] font-bold uppercase px-3 py-1 shadow-md rounded-full mb-4">
              CORE CATEGORIES // TRACKS
            </div>
            <h2 className="text-4xl sm:text-6xl font-syne font-black uppercase tracking-tight text-white">
              TRACKS & PRIZES
            </h2>
            <p className="mt-3 text-sm font-bold text-zinc-500 max-w-md font-mono leading-relaxed">
              Explore the four core engineering tracks. Match your build ideas to the correct diagnostic domain.
            </p>
          </div>

          {/* Table Tab bar switcher */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 px-2.5 rounded-full font-mono text-[10.5px] uppercase font-bold select-none overflow-x-auto scrollbar-none max-w-full lg:min-w-[320px] justify-center">
            {['ALL', 'AI', 'CYBER', 'GAME', 'WEB'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setSelectedTrackTab(tab)
                }}
                className={`px-4.5 py-1.5 font-mono text-[10px] md:text-xs font-bold uppercase rounded-full transition-all cursor-pointer shrink-0 ${
                  selectedTrackTab === tab 
                    ? 'bg-white text-black font-extrabold shadow-md scale-[1.01]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid / Split Panel Detail Layout conditional renderer */}
        {selectedTrackTab === 'ALL' ? (
          /* ALL tracks grid (default column style) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-20">
            {activeTracksList.map((track) => {
              const IconComp = track.icon
              const trackThemeMap = {
                ai: { border: 'border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-[0_0_30px_rgba(234,179,8,0.08)]', text: 'text-yellow-400', bg: 'bg-yellow-500/5' },
                cyber: { border: 'border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]', text: 'text-red-400', bg: 'bg-red-500/5' },
                game: { border: 'border-green-500/20 hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(74,222,128,0.08)]', text: 'text-green-400', bg: 'bg-green-500/5' },
                web: { border: 'border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]', text: 'text-blue-400', bg: 'bg-blue-500/5' }
              }
              const currentTheme = trackThemeMap[track.id] || trackThemeMap.ai
              
              return (
                <div
                  key={track.id}
                  onMouseMove={handleMouseMove}
                  className={`relative bg-zinc-900/30 border p-6 md:p-8 flex flex-col justify-between transition-all duration-300 rounded-2xl group text-left overflow-hidden cyber-glass-interactive ${currentTheme.border}`}
                >
                  {/* Indigo Radial Glow Backdrop */}
                  <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-[50px] group-hover:scale-150 transition-transform duration-500 pointer-events-none z-0"></div>
                  <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/5 blur-[50px] group-hover:scale-150 transition-transform duration-500 pointer-events-none z-0"></div>

                  <div className="relative z-10">
                    {/* Top tags */}
                    <div className="flex justify-between items-start mb-6 select-none mt-2">
                      <div className={`p-3 border border-white/10 rounded-xl bg-white/5 text-white shadow-xl`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end gap-1 font-mono text-right">
                        <span className={`border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} px-2.5 py-0.5 text-[9.5px] font-black uppercase rounded-full shadow-lg`}>
                          {track.prize}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-500 tracking-wider mt-1">TRACK // {track.id.toUpperCase()}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-syne font-bold uppercase leading-none text-white mb-2 break-words">
                      {track.title}
                    </h3>
                    
                    <p className="font-mono text-xs font-bold text-zinc-400 uppercase mb-4 tracking-wider">
                      {track.tagLine}
                    </p>

                    <p className="text-sm font-normal text-zinc-300 leading-relaxed mb-6 border-t border-white/5 pt-4 font-mono">
                      {track.details}
                    </p>
                  </div>

                  {/* Example ideas list */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-xl mt-4 relative z-10">
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Example Build Concepts:
                    </span>
                    <ul className="space-y-2 text-[11px] font-normal text-zinc-400 list-disc pl-4 leading-normal font-mono">
                      {track.ideas.map((idea, idx) => (
                        <li key={idx} className="hover:text-white transition-colors">{idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Split detailed layout console when a single track is selected */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
            
            {/* Left Card: Track Core Info Card */}
            {activeTracksList.map((track) => {
              const IconComp = track.icon
              const trackThemeMap = {
                ai: { border: 'border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.05)]', text: 'text-yellow-400', bg: 'bg-yellow-500/5' },
                cyber: { border: 'border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]', text: 'text-red-400', bg: 'bg-red-500/5' },
                game: { border: 'border-green-500/20 shadow-[0_0_30px_rgba(74,222,128,0.05)]', text: 'text-green-400', bg: 'bg-green-500/5' },
                web: { border: 'border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]', text: 'text-blue-400', bg: 'bg-blue-500/5' }
              }
              const currentTheme = trackThemeMap[track.id] || trackThemeMap.ai
              const trackChecklist = blueprintChecklist[track.id] || {}

              return (
                <React.Fragment key={track.id}>
                  {/* Left Column container (col-span-5) */}
                   <div
                     onMouseMove={handleMouseMove}
                     className={`lg:col-span-5 relative bg-zinc-900/30 border p-6 md:p-8 flex flex-col justify-between rounded-2xl group text-left overflow-hidden cyber-glass-interactive ${currentTheme.border}`}
                   >
                    <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-[50px] pointer-events-none z-0"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/5 blur-[50px] pointer-events-none z-0"></div>

                    <div className="relative z-10">
                      {/* Top tags */}
                      <div className="flex justify-between items-start mb-6 select-none mt-2">
                        <div className={`p-3 border border-white/10 rounded-xl bg-white/5 text-white shadow-xl`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end gap-1 font-mono text-right">
                          <span className={`border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} px-2.5 py-0.5 text-[9.5px] font-black uppercase rounded-full shadow-lg`}>
                            {track.prize}
                          </span>
                          <span className="text-[9px] font-bold text-zinc-500 tracking-wider mt-1">TRACK // {track.id.toUpperCase()}</span>
                        </div>
                      </div>

                      <h3 className="text-3xl font-syne font-bold uppercase leading-tight text-white mb-2 break-words">
                        {track.title}
                      </h3>
                      
                      <p className="font-mono text-[10.5px] font-bold text-zinc-400 uppercase mb-4 tracking-wider">
                        {track.tagLine}
                      </p>

                      <p className="text-sm font-normal text-zinc-300 leading-relaxed mb-6 border-t border-white/5 pt-4 font-mono">
                        {track.details}
                      </p>
                    </div>

                    {/* Example ideas list */}
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl mt-4 relative z-10">
                      <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Example Build Concepts:
                      </span>
                      <ul className="space-y-2 text-[11px] font-normal text-zinc-400 list-disc pl-4 leading-normal font-mono">
                        {track.ideas.map((idea, idx) => (
                          <li key={idx} className="hover:text-white transition-colors">{idea}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column container (col-span-7) - MUCH MORE DETAILS */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className={`lg:col-span-7 bg-zinc-900/20 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col justify-between text-left backdrop-blur-md relative overflow-hidden cyber-glass-interactive`}
                  >
                    
                    {/* Corner backlighting glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-[50px] pointer-events-none z-0"></div>

                    <div className="space-y-6 relative z-10">
                      
                      {/* Header bar */}
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className={`w-4 h-4 ${currentTheme.text} animate-pulse`} />
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            Extended Core Diagnostic Console
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-zinc-650">STATE: LOADED</span>
                      </div>

                      {/* Targeted skills and tools */}
                      <div>
                        <span className="block font-mono text-[10.5px] font-bold text-zinc-400 uppercase mb-2.5">
                          🔧 Target Technologies & APIs:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {track.techs && track.techs.map((tech) => (
                            <span
                              key={tech}
                              className={`px-2.5 py-1 border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} font-mono text-[10px] font-bold uppercase rounded-lg shadow-sm`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Judging details */}
                      <div className="border border-white/5 bg-zinc-950/40 p-4.5 rounded-xl">
                        <span className="block font-mono text-[10.5px] font-bold text-zinc-400 uppercase mb-1.5">
                          🏆 Track Evaluation & Judging Criteria:
                        </span>
                        <p className="text-xs font-normal text-zinc-300 leading-relaxed font-mono">
                          Submission deliverables will be evaluated against: <strong className="text-white font-bold">{track.criteria}</strong> The core code repositories will be audited to verify working binaries and zero slide-deck marketing fluff.
                        </p>
                      </div>

                      {/* Interactive project blueprint tool */}
                      <div className="space-y-3">
                        <div>
                          <span className="block font-mono text-[10.5px] font-bold text-zinc-400 uppercase">
                            ⚙️ Interactive Project Blueprint builder:
                          </span>
                          <span className="block font-mono text-[9px] text-zinc-650 mt-0.5">
                            Toggle core nodes to construct a custom build blueprint.
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 select-none">
                          {Object.entries(track.blueprintSpecs).map(([key, label]) => {
                            const isChecked = trackChecklist[key]
                            
                            // Map toggle theme glow classes
                            const checkGlowMap = {
                              ai: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300',
                              cyber: 'border-red-500/30 bg-red-500/5 text-red-300',
                              game: 'border-green-500/30 bg-green-500/5 text-green-300',
                              web: 'border-blue-500/30 bg-blue-500/5 text-blue-300'
                            }
                            const checkGlow = checkGlowMap[track.id] || 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300'
                            const checkIconColor = isChecked ? (track.id === 'ai' ? 'text-yellow-400' : track.id === 'cyber' ? 'text-red-400' : track.id === 'game' ? 'text-green-400' : 'text-blue-400') : 'text-zinc-600'

                            return (
                              <div
                                key={key}
                                onClick={() => toggleBlueprintItem(track.id, key)}
                                className={`flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                  isChecked 
                                    ? `${checkGlow} shadow-md` 
                                    : 'border-white/5 bg-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/10'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className={`w-4 h-4 ${checkIconColor} shrink-0`} />
                                ) : (
                                  <Square className="w-4 h-4 text-zinc-600 shrink-0" />
                                )}
                                <span className="font-mono text-xs font-bold uppercase tracking-wider">{label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Blueprint code verification status footer */}
                    <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center select-none font-mono text-[10px]">
                      <div className="text-zinc-500">
                        BLUEPRINT CODE: <span className="text-zinc-300 font-bold">HL-{track.id.toUpperCase()}-{
                          Object.values(trackChecklist).filter(Boolean).length
                        }/4</span>
                      </div>
                      <span className="text-zinc-600">ENCRYPTED // SHA-256</span>
                    </div>

                  </div>
                </React.Fragment>
              )
            })}

          </div>
        )}

        {/* Tech Configurator Widget */}
        <div onMouseMove={handleMouseMove} className="bg-zinc-900/30 border border-white/5 p-6 md:p-10 shadow-2xl relative rounded-3xl mt-12 text-left backdrop-blur-md cyber-glass-interactive">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 items-center">
            
            {/* Form & Selection side */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block border border-white/10 bg-white/5 text-zinc-300 font-mono text-[10px] font-bold uppercase px-3 py-1 shadow-md rounded-full mb-3">
                  Interactive Stack Configurator
                </span>
                <h3 className="text-2xl md:text-3xl font-syne font-bold uppercase text-white">
                  GENERATE TECH STACK BADGE
                </h3>
                <p className="text-xs font-bold text-zinc-500 mt-1 font-mono">
                  Select up to 6 tools or languages you plan to write code with to download a high-fidelity diagnostic builder badge.
                </p>
              </div>

              {/* Input builder name */}
              <div className="flex flex-col">
                <label className="font-mono text-xs font-bold text-zinc-400 uppercase mb-2 flex items-center gap-1.5 select-none">
                  <Code className="w-4 h-4 text-zinc-400" /> Builder Nickname
                </label>
                <input
                  type="text"
                  maxLength="20"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. CORE_HACKER"
                  className="bg-zinc-950/60 border border-white/5 p-3 rounded-xl font-mono text-xs outline-none focus:border-white text-white uppercase transition-all shadow-inner w-full"
                />
              </div>

              {/* Selection list */}
              <div>
                <span className="block font-mono text-xs font-bold text-zinc-400 mb-2 select-none">
                  SELECT TOOLS ({selectedTechs.length}/6):
                </span>
                <div className="flex flex-wrap gap-2 select-none">
                  {TECH_STACK_OPTIONS.map((tech) => {
                    const isSelected = selectedTechs.includes(tech)
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3.5 py-2 font-mono text-xs font-bold cursor-pointer rounded-full transition-all border ${
                          isSelected
                            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)] scale-[1.02]'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        {tech}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Graphic card side */}
            <div className="lg:col-span-5 flex flex-col items-center w-full">
              <div
                onMouseMove={handlePreviewMouseMove}
                onMouseLeave={handlePreviewMouseLeave}
                style={{
                  transform: previewTilt.transform,
                  transition: previewTilt.transition
                }}
                className="w-full max-w-sm border border-white/10 bg-zinc-950/60 text-white p-5.5 font-mono text-xs rounded-2xl shadow-2xl relative select-none overflow-hidden transition-all duration-200"
              >
                {/* Holographic light reflection glare overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none z-20 mix-blend-overlay"
                  style={{
                    background: `radial-gradient(circle 200px at ${50 + (previewTilt.glareX || 0)}% ${50 + (previewTilt.glareY || 0)}%, rgba(255, 255, 255, 0.12), transparent 70%)`
                  }}
                />

                <div className="border-b border-white/5 pb-3 mb-4 flex justify-between items-center mt-1">
                  <span className="font-black text-indigo-400 uppercase tracking-wider text-[9.5px]">
                    Tachyon TECH CORE PROFILE
                  </span>
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                </div>

                <div className="border border-white/5 bg-white/5 p-4 rounded-xl text-left mb-4">
                  <span className="block text-[8px] text-zinc-500 font-bold uppercase mb-0.5">BUILDER PROFILE</span>
                  <span className="text-sm font-bold text-white block tracking-wide uppercase select-all">
                    {cardName ? cardName : 'GUEST_HACKER'}
                  </span>
                </div>

                <div className="space-y-2 text-left mb-6">
                  <span className="block text-[8.5px] text-zinc-500 font-bold uppercase">LOADED CORES:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTechs.length === 0 ? (
                      <span className="text-zinc-600 italic text-[10px]">No technologies selected.</span>
                    ) : (
                      selectedTechs.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 border border-white/10 bg-white/5 text-cyan-400 font-bold uppercase text-[8.5px] rounded-lg shadow-sm"
                        >
                          {tech}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center select-none">
                  <button
                    onClick={handleExportTechCard}
                    className="flex items-center gap-1.5 border border-white/10 bg-white text-black font-bold text-[9px] px-3.5 py-1.5 rounded-full active:scale-95 shadow-md cursor-pointer hover:bg-zinc-100 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> EXPORT BADGE
                  </button>
                  <span className="text-[8px] text-zinc-500 uppercase font-bold">SECURITY VERIFIED // OK</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
export default TracksSection

