import React, { useState } from 'react'
import { Cpu, Shield, Gamepad, Globe, Code, Download, CheckSquare, Square } from 'lucide-react'
import { playSound } from '../utils/audio'

export function TracksSection({ siteTheme: _siteTheme, isMuted, volume }) {
  const [selectedTrackTab, setSelectedTrackTab] = useState('ALL')
  const [cardName, setCardName] = useState('')
  const [selectedTechs, setSelectedTechs] = useState([])

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
          soundtrack: 'Built-in chiptune driver'
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

  const handleExportTechCard = () => {
    playSound('success', isMuted, volume)
    
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 250
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#0A0A08'
    ctx.fillRect(0, 0, 400, 250)

    ctx.strokeStyle = 'rgba(248, 247, 244, 0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(8, 8, 384, 234)

    ctx.fillStyle = 'rgba(248, 247, 244, 0.02)'
    ctx.fillRect(10, 10, 380, 50)
    ctx.strokeStyle = 'rgba(248, 247, 244, 0.05)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(10, 60)
    ctx.lineTo(390, 60)
    ctx.stroke()

    ctx.font = 'bold 11px monospace'
    ctx.fillStyle = '#F8F7F4'
    ctx.fillText('SYS:TECH_CORE // PROFILE', 24, 28)
    ctx.font = 'bold 8px monospace'
    ctx.fillStyle = 'rgba(248, 247, 244, 0.3)'
    ctx.fillText('DIAGNOSTIC STATUS // STACK_ACTIVE', 24, 42)

    ctx.font = 'bold 13px monospace'
    ctx.fillStyle = '#F8F7F4'
    ctx.fillText(`BUILDER: ${cardName ? cardName.toUpperCase() : 'GUEST_HACKER'}`, 25, 95)

    ctx.font = 'bold 9px monospace'
    ctx.fillStyle = 'rgba(248, 247, 244, 0.4)'
    ctx.fillText('LOADED TECHNOLOGY CORES:', 25, 128)

    const startX = 25
    let currentX = startX
    let currentY = 145
    const rowHeight = 32

    selectedTechs.forEach((tech) => {
      ctx.font = 'bold 9px monospace'
      const textWidth = ctx.measureText(tech).width
      const paddingX = 12
      const boxWidth = textWidth + paddingX * 2
      const boxHeight = 18

      if (currentX + boxWidth > 370) {
        currentX = startX
        currentY += rowHeight
      }

      ctx.fillStyle = 'rgba(248, 247, 244, 0.03)'
      ctx.fillRect(currentX, currentY, boxWidth, boxHeight)
      ctx.strokeStyle = 'rgba(248, 247, 244, 0.08)'
      ctx.lineWidth = 1
      ctx.strokeRect(currentX, currentY, boxWidth, boxHeight)

      ctx.fillStyle = '#F8F7F4'
      ctx.fillText(tech, currentX + paddingX, currentY + 12)

      currentX += boxWidth + 10
    })

    ctx.font = 'bold 7px monospace'
    ctx.fillStyle = 'rgba(248, 247, 244, 0.2)'
    ctx.fillText('VERIFICATION CODE: HL-STK-OK', 25, 222)

    const link = document.createElement('a')
    link.download = `tech_core_${cardName ? cardName.toLowerCase() : 'builder'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const activeTracksList = TRACKS_DATA[selectedTrackTab]

  const trackIndexMap = { ai: '01', cyber: '02', game: '03', web: '04' }

  // High-fidelity dynamic colors for each track
  const trackColors = {
    ai: {
      text: 'text-[#d946ef]',
      bgLight: 'bg-[#d946ef]/5',
      borderLight: 'border-[#d946ef]/20',
      badge: 'border-[#d946ef]/30 text-[#d946ef]',
      hoverBorder: 'hover:border-[#d946ef]/40'
    },
    cyber: {
      text: 'text-[#10b981]',
      bgLight: 'bg-[#10b981]/5',
      borderLight: 'border-[#10b981]/20',
      badge: 'border-[#10b981]/30 text-[#10b981]',
      hoverBorder: 'hover:border-[#10b981]/40'
    },
    game: {
      text: 'text-[#ff9f1c]',
      bgLight: 'bg-[#ff9f1c]/5',
      borderLight: 'border-[#ff9f1c]/20',
      badge: 'border-[#ff9f1c]/30 text-[#ff9f1c]',
      hoverBorder: 'hover:border-[#ff9f1c]/40'
    },
    web: {
      text: 'text-[#06b6d4]',
      bgLight: 'bg-[#06b6d4]/5',
      borderLight: 'border-[#06b6d4]/20',
      badge: 'border-[#06b6d4]/30 text-[#06b6d4]',
      hoverBorder: 'hover:border-[#06b6d4]/40'
    }
  }

  return (
    <section id="tracks" className="py-24 border-b border-white/5 bg-transparent relative max-w-[1400px] mx-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div className="text-left">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">
              SYS:03 — CORE CATEGORIES // TRACKS
            </div>
            <h2 className="text-2xl font-syne font-black uppercase text-[#F8F7F4]">
              TRACKS & PRIZES
            </h2>
            <p className="mt-3 font-mono text-[10px] text-white/30 max-w-md leading-relaxed">
              Explore the four core engineering tracks. Match your build ideas to the correct diagnostic domain.
            </p>
          </div>

          {/* Tab bar switcher */}
          <div className="flex items-center gap-0 border border-white/5 font-mono text-[9px] uppercase tracking-[0.2em] select-none">
            {['ALL', 'AI', 'CYBER', 'GAME', 'WEB'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setSelectedTrackTab(tab)
                }}
                className={`px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-200 cursor-pointer border-r border-white/5 last:border-r-0 ${
                  selectedTrackTab === tab 
                    ? 'bg-white/[0.06] text-[#F8F7F4]' 
                    : 'text-white/20 hover:text-white/40 hover:bg-white/[0.02]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        {selectedTrackTab === 'ALL' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-white/5 mb-20">
            {activeTracksList.map((track) => {
              const IconComp = track.icon
              const idx = trackIndexMap[track.id] || '00'
              const cMap = trackColors[track.id] || { text: 'text-white/20', bgLight: 'bg-white/[0.02]', borderLight: 'border-white/5', badge: 'border-white/8 text-white/30', hoverBorder: '' }
              
              return (
                <div
                  key={track.id}
                  className={`bg-[#0A0A08] p-6 md:p-8 flex flex-col justify-between text-left border border-transparent transition-all duration-300 ${cMap.hoverBorder}`}
                >
                  <div>
                    {/* Top tags */}
                    <div className="flex justify-between items-start mb-6 select-none">
                      <div className={cMap.text}>
                        <IconComp className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col items-end gap-1 font-mono text-right">
                        <span className={`border px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] ${cMap.badge}`}>
                          {track.prize}
                        </span>
                        <span className="text-[8px] text-white/15 tracking-[0.3em] mt-1">NODE:{idx}</span>
                      </div>
                    </div>

                    <h3 className="font-syne font-bold text-sm text-[#F8F7F4] uppercase mb-2">
                      {track.title}
                    </h3>
                    
                    <p className="font-mono text-[8px] text-white/20 uppercase mb-4 tracking-[0.2em]">
                      {track.tagLine}
                    </p>

                    <div className="border-t border-white/5 pt-4 mb-6">
                      <p className="font-mono text-[10px] text-white/30 leading-relaxed">
                        {track.details}
                      </p>
                    </div>
                  </div>

                  {/* Example ideas list */}
                  <div className={`p-4 mt-4 border ${cMap.bgLight} ${cMap.borderLight}`}>
                    <span className="block font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 mb-3">
                      PROTOCOL:BUILD_CONCEPTS
                    </span>
                    <ul className="space-y-2 font-mono text-[10px] text-white/30 leading-relaxed">
                      {track.ideas.map((idea, ideaIdx) => (
                        <li key={ideaIdx} className="flex gap-2">
                          <span className={`${cMap.text} shrink-0`}>—</span>
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Split detailed layout when a single track is selected */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-white/5 mb-20">
            
            {activeTracksList.map((track) => {
              const IconComp = track.icon
              const idx = trackIndexMap[track.id] || '00'
              const trackChecklist = blueprintChecklist[track.id] || {}
              const cMap = trackColors[track.id] || { text: 'text-white/20', bgLight: 'bg-white/[0.02]', borderLight: 'border-white/5', badge: 'border-white/8 text-white/30', hoverBorder: '' }

              return (
                <React.Fragment key={track.id}>
                  {/* Left Column */}
                  <div className="lg:col-span-5 bg-[#0A0A08] p-6 md:p-8 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex justify-between items-start mb-6 select-none">
                        <div className={cMap.text}>
                          <IconComp className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col items-end gap-1 font-mono text-right">
                          <span className={`border px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] ${cMap.badge}`}>
                            {track.prize}
                          </span>
                          <span className="text-[8px] text-white/15 tracking-[0.3em] mt-1">NODE:{idx}</span>
                        </div>
                      </div>

                      <h3 className="font-syne font-bold text-sm text-[#F8F7F4] uppercase mb-2">
                        {track.title}
                      </h3>
                      
                      <p className="font-mono text-[8px] text-white/20 uppercase mb-4 tracking-[0.2em]">
                        {track.tagLine}
                      </p>

                      <div className="border-t border-white/5 pt-4 mb-6">
                        <p className="font-mono text-[10px] text-white/30 leading-relaxed">
                          {track.details}
                        </p>
                      </div>
                    </div>

                    {/* Example ideas list */}
                    <div className={`p-4 mt-4 border ${cMap.bgLight} ${cMap.borderLight}`}>
                      <span className="block font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 mb-3">
                        PROTOCOL:BUILD_CONCEPTS
                      </span>
                      <ul className="space-y-2 font-mono text-[10px] text-white/30 leading-relaxed">
                        {track.ideas.map((idea, ideaIdx) => (
                          <li key={ideaIdx} className="flex gap-2">
                            <span className={`${cMap.text} shrink-0`}>—</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Extended Details */}
                  <div className="lg:col-span-7 bg-[#0A0A08] p-6 md:p-8 flex flex-col justify-between text-left">
                    
                    <div className="space-y-6">
                      
                      {/* Header bar */}
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20">
                          EXTENDED DIAGNOSTIC CONSOLE
                        </span>
                        <span className="font-mono text-[8px] text-white/15 tracking-[0.2em]">STATE:LOADED</span>
                      </div>

                      {/* Target technologies */}
                      <div>
                        <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3">
                          TARGET TECHNOLOGIES
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {track.techs && track.techs.map((tech) => (
                            <span
                              key={tech}
                              className={`px-2 py-1 border font-mono text-[8px] uppercase tracking-[0.15em] ${cMap.badge}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Judging details */}
                      <div className={`border p-4 ${cMap.bgLight} ${cMap.borderLight}`}>
                        <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-2">
                          EVALUATION CRITERIA
                        </span>
                        <p className="font-mono text-[10px] text-white/30 leading-relaxed">
                          Submission deliverables will be evaluated against: <strong className="text-[#F8F7F4]/60">{track.criteria}</strong> The core code repositories will be audited to verify working binaries and zero slide-deck marketing fluff.
                        </p>
                      </div>

                      {/* Interactive project blueprint tool */}
                      <div className="space-y-3">
                        <div>
                          <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-white/20">
                            PROJECT BLUEPRINT BUILDER
                          </span>
                          <span className="block font-mono text-[8px] text-white/15 mt-1 tracking-[0.15em]">
                            Toggle core nodes to construct a custom build blueprint.
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-white/5 select-none">
                          {Object.entries(track.blueprintSpecs).map(([key, label]) => {
                            const isChecked = trackChecklist[key]

                            return (
                              <div
                                key={key}
                                onClick={() => toggleBlueprintItem(track.id, key)}
                                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors duration-200 ${
                                  isChecked 
                                    ? 'bg-white/[0.04] text-[#F8F7F4]/60' 
                                    : 'bg-[#0A0A08] text-white/20 hover:bg-white/[0.02]'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${cMap.text}`} />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-white/15 shrink-0" />
                                )}
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em]">{label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Blueprint code verification status footer */}
                    <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center select-none font-mono text-[8px] tracking-[0.2em]">
                      <div className="text-white/20">
                        BLUEPRINT: <span className="text-[#F8F7F4]/50">HL-{track.id.toUpperCase()}-{
                          Object.values(trackChecklist).filter(Boolean).length
                        }/4</span>
                      </div>
                      <span className="text-white/10">ENCRYPTED // SHA-256</span>
                    </div>

                  </div>
                </React.Fragment>
              )
            })}

          </div>
        )}

        {/* Tech Configurator Widget */}
        <div className="border border-white/5 bg-white/[0.02] p-6 md:p-10 mt-12 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Form & Selection side */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-3">
                  SYS:CONFIGURATOR
                </span>
                <h3 className="text-2xl font-syne font-black uppercase text-[#F8F7F4]">
                  GENERATE TECH STACK BADGE
                </h3>
                <p className="font-mono text-[10px] text-white/30 mt-2 leading-relaxed">
                  Select up to 6 tools or languages you plan to write code with to download a diagnostic builder badge.
                </p>
              </div>

              {/* Input builder name */}
              <div className="flex flex-col">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-2 flex items-center gap-2 select-none">
                  <Code className="w-3.5 h-3.5 text-white/15" strokeWidth={1} /> BUILDER NICKNAME
                </label>
                <input
                  type="text"
                  maxLength="20"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. CORE_HACKER"
                  className="bg-white/[0.02] border border-white/5 p-3 font-mono text-[10px] outline-none focus:border-white/20 text-[#F8F7F4] uppercase transition-colors w-full placeholder:text-white/10"
                />
              </div>

              {/* Selection list */}
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3 select-none">
                  SELECT TOOLS ({selectedTechs.length}/6)
                </span>
                <div className="flex flex-wrap gap-1.5 select-none">
                  {TECH_STACK_OPTIONS.map((tech) => {
                    const isSelected = selectedTechs.includes(tech)
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] cursor-pointer transition-colors duration-200 border ${
                          isSelected
                            ? 'bg-white/[0.06] border-white/20 text-[#F8F7F4]/70'
                            : 'bg-white/[0.02] border-white/5 text-white/20 hover:text-white/40 hover:border-white/10'
                        }`}
                      >
                        {tech}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Card preview side */}
            <div className="lg:col-span-5 flex flex-col items-center w-full">
              <div className="w-full max-w-sm border border-white/8 bg-[#0A0A08] text-[#F8F7F4] p-5 font-mono text-xs select-none">

                <div className="border-b border-white/5 pb-3 mb-4 flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                    SYS:TECH_CORE // PROFILE
                  </span>
                  <span className="w-1.5 h-1.5 bg-[#C2452D] inline-block"></span>
                </div>

                <div className="border border-white/5 bg-white/[0.02] p-4 text-left mb-4">
                  <span className="block text-[8px] text-white/15 uppercase tracking-[0.3em] mb-1">BUILDER PROFILE</span>
                  <span className="text-[11px] text-[#F8F7F4] block tracking-[0.15em] uppercase select-all">
                    {cardName ? cardName : 'GUEST_HACKER'}
                  </span>
                </div>

                <div className="space-y-2 text-left mb-6">
                  <span className="block text-[8px] text-white/15 uppercase tracking-[0.3em]">LOADED CORES:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTechs.length === 0 ? (
                      <span className="text-white/10 text-[9px] tracking-[0.15em]">No technologies selected.</span>
                    ) : (
                      selectedTechs.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 border border-white/8 text-white/30 uppercase text-[8px] tracking-[0.15em]"
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
                    className="flex items-center gap-1.5 border border-white/20 bg-[#F8F7F4] text-[#0A0A08] font-mono text-[8px] uppercase tracking-[0.2em] px-3 py-1.5 active:scale-[0.98] cursor-pointer hover:bg-white/90 transition-colors"
                  >
                    <Download className="w-3 h-3" strokeWidth={1.5} /> EXPORT BADGE
                  </button>
                  <span className="text-[7px] text-white/10 uppercase tracking-[0.2em]">VERIFIED // OK</span>
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
