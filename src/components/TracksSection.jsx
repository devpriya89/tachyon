import React, { useState } from 'react'
import { Cpu, Shield, Gamepad, Globe, Code, Download, CheckSquare, Square } from 'lucide-react'
import { playSound } from '../utils/audio'

export function TracksSection({ siteTheme: _siteTheme, isMuted, volume, tracksList = [] }) {
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

  // Derive TRACKS_DATA from the dynamic tracksList props
  const TRACKS_DATA = {
    ALL: tracksList,
    AI: tracksList.filter(t => t.id === 'ai'),
    CYBER: tracksList.filter(t => t.id === 'cyber'),
    GAME: tracksList.filter(t => t.id === 'game'),
    WEB: tracksList.filter(t => t.id === 'web')
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

    // Background color: NIDAR dark black
    ctx.fillStyle = '#1e1a1b'
    ctx.fillRect(0, 0, 400, 250)

    // Border: NIDAR brand green
    ctx.strokeStyle = 'rgba(109, 179, 73, 0.2)'
    ctx.lineWidth = 1
    ctx.strokeRect(8, 8, 384, 234)

    // Header bar: semi-transparent green
    ctx.fillStyle = 'rgba(109, 179, 73, 0.05)'
    ctx.fillRect(10, 10, 380, 50)
    ctx.strokeStyle = 'rgba(109, 179, 73, 0.1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(10, 60)
    ctx.lineTo(390, 60)
    ctx.stroke()

    ctx.font = 'bold 11px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('SYS:TECH_CORE // PROFILE', 24, 28)
    ctx.font = 'bold 8px sans-serif'
    ctx.fillStyle = '#6db349'
    ctx.fillText('DIAGNOSTIC STATUS // STACK_ACTIVE', 24, 42)

    ctx.font = 'bold 13px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`BUILDER: ${cardName ? cardName.toUpperCase() : 'GUEST_HACKER'}`, 25, 95)

    ctx.font = 'bold 9px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillText('LOADED TECHNOLOGY CORES:', 25, 128)

    const startX = 25
    let currentX = startX
    let currentY = 145
    const rowHeight = 32

    selectedTechs.forEach((tech) => {
      ctx.font = 'bold 9px sans-serif'
      const textWidth = ctx.measureText(tech).width
      const paddingX = 12
      const boxWidth = textWidth + paddingX * 2
      const boxHeight = 18

      if (currentX + boxWidth > 370) {
        currentX = startX
        currentY += rowHeight
      }

      ctx.fillStyle = 'rgba(109, 179, 73, 0.08)'
      ctx.fillRect(currentX, currentY, boxWidth, boxHeight)
      ctx.strokeStyle = 'rgba(109, 179, 73, 0.2)'
      ctx.lineWidth = 1
      ctx.strokeRect(currentX, currentY, boxWidth, boxHeight)

      ctx.fillStyle = '#6db349'
      ctx.fillText(tech, currentX + paddingX, currentY + 12)

      currentX += boxWidth + 10
    })

    ctx.font = 'bold 7px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillText('VERIFICATION CODE: HL-STK-OK', 25, 222)

    const link = document.createElement('a')
    link.download = `tech_core_${cardName ? cardName.toLowerCase() : 'builder'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const getIcon = (id) => {
    switch (id) {
      case 'ai': return Cpu
      case 'cyber': return Shield
      case 'game': return Gamepad
      case 'web': return Globe
      default: return Code
    }
  }

  const activeTracksList = TRACKS_DATA[selectedTrackTab] || []

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
    <section id="tracks" className="py-24 border-b border-zinc-800/80 bg-transparent relative max-w-[1400px] mx-auto w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-widest text-[#6db349] font-extrabold mb-4">
              SYS:03 — CORE CATEGORIES // TRACKS
            </div>
            <h2 className="text-3xl font-extrabold uppercase text-white">
              Tracks & Prizes
            </h2>
            <p className="mt-3 text-sm text-zinc-400 max-w-md leading-relaxed">
              Explore the four core engineering tracks. Match your build ideas to the correct diagnostic domain.
            </p>
          </div>

          {/* Tab bar switcher - rounded pills */}
          <div className="flex items-center gap-1 border border-zinc-800 bg-[#231f20]/60 p-1 rounded-full text-[9px] uppercase tracking-wider select-none font-semibold">
            {['ALL', 'AI', 'CYBER', 'GAME', 'WEB'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setSelectedTrackTab(tab)
                }}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  selectedTrackTab === tab 
                    ? 'bg-[#6db349] text-black font-bold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        {selectedTrackTab === 'ALL' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {activeTracksList.map((track) => {
              const IconComp = getIcon(track.id)
              const idx = trackIndexMap[track.id] || '00'
              const cMap = trackColors[track.id] || { text: 'text-white/20', bgLight: 'bg-white/[0.02]', borderLight: 'border-white/5', badge: 'border-white/8 text-white/30', hoverBorder: '' }
              
              return (
                <div
                  key={track.id}
                  className={`bg-[#231f20]/30 p-6 md:p-8 flex flex-col justify-between text-left rounded-2xl border border-zinc-800/80 hover:border-[#6db349]/40 hover:shadow-[0_10px_35px_rgba(109,179,73,0.08)] transition-all duration-300`}
                >
                  <div>
                    {/* Top tags */}
                    <div className="flex justify-between items-start mb-6 select-none">
                      <div className="w-10 h-10 rounded-full bg-[#6db349]/10 text-[#6db349] flex items-center justify-center">
                        <IconComp className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col items-end gap-1 text-right">
                        <span className="border border-[#6db349]/30 bg-[#6db349]/5 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#6db349] tracking-wider">
                          {track.prize}
                        </span>
                        <span className="text-[8px] text-zinc-500 tracking-wider mt-1.5 font-bold">NODE:{idx}</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-lg text-white uppercase mb-2">
                       {track.title}
                    </h3>
                    
                    <p className="text-[9px] text-[#6db349] uppercase mb-4 tracking-widest font-bold">
                      {track.tagLine}
                    </p>

                    <div className="border-t border-zinc-800/60 pt-4 mb-6">
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        {track.details}
                      </p>
                    </div>
                  </div>

                  {/* Example ideas list */}
                  <div className="p-4 mt-4 border border-zinc-800/60 bg-black/20 rounded-xl">
                    <span className="block text-[8px] uppercase tracking-widest text-[#6db349] font-extrabold mb-3">
                      PROTOCOL: BUILD_CONCEPTS
                    </span>
                    <ul className="space-y-2 text-zinc-400 text-xs leading-relaxed">
                      {track.ideas && track.ideas.map((idea, ideaIdx) => (
                        <li key={ideaIdx} className="flex gap-2">
                          <span className="text-[#6db349] shrink-0 font-bold">—</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 items-stretch">
            {activeTracksList.map((track) => {
              const IconComp = getIcon(track.id)
              const idx = trackIndexMap[track.id] || '00'
              const trackChecklist = blueprintChecklist[track.id] || {}
              const cMap = trackColors[track.id] || { text: 'text-white/20', bgLight: 'bg-white/[0.02]', borderLight: 'border-white/5', badge: 'border-white/8 text-white/30', hoverBorder: '' }

              return (
                <React.Fragment key={track.id}>
                  {/* Left Column */}
                  <div className="lg:col-span-5 bg-[#231f20]/30 p-6 md:p-8 flex flex-col justify-between text-left rounded-2xl border border-zinc-800/80">
                    <div>
                      <div className="flex justify-between items-start mb-6 select-none">
                        <div className="w-10 h-10 rounded-full bg-[#6db349]/10 text-[#6db349] flex items-center justify-center">
                          <IconComp className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col items-end gap-1 text-right">
                          <span className="border border-[#6db349]/30 bg-[#6db349]/5 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#6db349] tracking-wider">
                            {track.prize}
                          </span>
                          <span className="text-[8px] text-zinc-500 tracking-wider mt-1.5 font-bold">NODE:{idx}</span>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-lg text-white uppercase mb-2">
                        {track.title}
                      </h3>
                      
                      <p className="text-[9px] text-[#6db349] uppercase mb-4 tracking-widest font-bold">
                        {track.tagLine}
                      </p>

                      <div className="border-t border-zinc-800/60 pt-4 mb-6">
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          {track.details}
                        </p>
                      </div>
                    </div>

                    {/* Example ideas list */}
                    <div className="p-4 mt-4 border border-zinc-800/60 bg-black/20 rounded-xl">
                      <span className="block text-[8px] uppercase tracking-widest text-[#6db349] font-extrabold mb-3">
                        PROTOCOL: BUILD_CONCEPTS
                      </span>
                      <ul className="space-y-2 text-zinc-400 text-xs leading-relaxed">
                        {track.ideas && track.ideas.map((idea, ideaIdx) => (
                          <li key={ideaIdx} className="flex gap-2">
                            <span className="text-[#6db349] shrink-0 font-bold">—</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Extended Details */}
                  <div className="lg:col-span-7 bg-[#231f20]/30 p-6 md:p-8 flex flex-col justify-between text-left rounded-2xl border border-zinc-800/80">
                    
                    <div className="space-y-6">
                      
                      {/* Header bar */}
                      <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                          EXTENDED DIAGNOSTIC CONSOLE
                        </span>
                        <span className="text-[8px] text-[#6db349] tracking-wider font-extrabold">STATE: LOADED</span>
                      </div>

                      {/* Target technologies */}
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest text-zinc-400 font-bold mb-3">
                          TARGET TECHNOLOGIES
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {track.techs && track.techs.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 border border-zinc-850 bg-black/45 text-zinc-400 uppercase text-[9px] tracking-wider rounded-md font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Judging details */}
                      <div className="border border-zinc-800 bg-[#6db349]/5 p-5 rounded-xl">
                        <span className="block text-[9px] uppercase tracking-widest text-[#6db349] font-extrabold mb-2">
                          EVALUATION CRITERIA
                        </span>
                        <p className="text-zinc-300 text-xs leading-relaxed">
                          Submission deliverables will be evaluated against: <strong className="text-white">{track.criteria}</strong> The core code repositories will be audited to verify working binaries and zero slide-deck marketing fluff.
                        </p>
                      </div>

                      {/* Interactive project blueprint tool */}
                      <div className="space-y-3">
                        <div>
                          <span className="block text-[9px] uppercase tracking-widest text-zinc-400 font-bold">
                            PROJECT BLUEPRINT BUILDER
                          </span>
                          <span className="block text-[8px] text-zinc-500 mt-1 tracking-wider font-semibold">
                            Toggle core nodes to construct a custom build blueprint.
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 select-none">
                          {track.blueprintSpecs && Object.entries(track.blueprintSpecs).map(([key, label]) => {
                            const isChecked = trackChecklist[key]

                            return (
                              <div
                                key={key}
                                onClick={() => toggleBlueprintItem(track.id, key)}
                                className={`flex items-center gap-3 p-3.5 cursor-pointer rounded-xl border transition-all ${
                                  isChecked 
                                    ? 'bg-[#6db349]/10 border-[#6db349]/40 text-white' 
                                    : 'bg-black/30 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 shrink-0 text-[#6db349]" />
                                ) : (
                                  <Square className="w-4 h-4 text-zinc-800 shrink-0" />
                                )}
                                <span className="text-[9px] uppercase tracking-wider font-bold">{label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Blueprint code verification status footer */}
                    <div className="border-t border-zinc-800/60 pt-4 mt-6 flex justify-between items-center select-none text-[8px] tracking-wider font-semibold text-zinc-500">
                      <div>
                        BLUEPRINT: <span className="text-[#6db349] font-bold">HL-{track.id.toUpperCase()}-{
                          Object.values(trackChecklist).filter(Boolean).length
                        }/4</span>
                      </div>
                      <span>ENCRYPTED // SHA-256</span>
                    </div>

                  </div>
                </React.Fragment>
              )
            })}
          </div>
        )}

        {/* Tech Configurator Widget */}
        <div className="border border-zinc-800 bg-[#231f20]/30 rounded-3xl p-6 md:p-10 mt-16 shadow-[0_10px_35px_rgba(0,0,0,0.3)] text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Form & Selection side */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#6db349] font-extrabold block mb-3">
                  SYS:CONFIGURATOR
                </span>
                <h3 className="text-2xl font-extrabold uppercase text-white">
                  Generate Tech Stack Badge
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Select up to 6 tools or languages you plan to write code with to download a diagnostic builder badge.
                </p>
              </div>

              {/* Input builder name */}
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold mb-2 flex items-center gap-2 select-none">
                  <Code className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} /> BUILDER NICKNAME
                </label>
                <input
                  type="text"
                  maxLength="20"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. CORE_HACKER"
                  className="bg-black/45 border border-zinc-800 p-3 rounded-xl text-xs outline-none focus:border-[#6db349]/50 text-white uppercase transition-colors w-full placeholder:text-zinc-700 font-semibold"
                />
              </div>

              {/* Selection list */}
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-zinc-400 font-bold mb-3 select-none">
                  SELECT TOOLS ({selectedTechs.length}/6)
                </span>
                <div className="flex flex-wrap gap-1.5 select-none">
                  {TECH_STACK_OPTIONS.map((tech) => {
                    const isSelected = selectedTechs.includes(tech)
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6db349] border-[#6db349] text-black font-bold'
                            : 'bg-black/30 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
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
              <div className="w-full max-w-sm border border-zinc-800 bg-black/60 text-white p-6 rounded-2xl shadow-2xl relative">

                <div className="border-b border-zinc-800/60 pb-3 mb-4 flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                    SYS:TECH_CORE // PROFILE
                  </span>
                  <span className="w-1.5 h-1.5 bg-[#6db349] inline-block animate-pulse"></span>
                </div>

                <div className="border border-zinc-800 bg-black/40 p-4 rounded-xl text-left mb-4">
                  <span className="block text-[8px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">BUILDER PROFILE</span>
                  <span className="text-[11px] text-white block tracking-wider uppercase font-bold select-all">
                    {cardName ? cardName : 'GUEST_HACKER'}
                  </span>
                </div>

                <div className="space-y-2 text-left mb-6">
                  <span className="block text-[8px] text-zinc-500 uppercase tracking-wider font-bold">LOADED CORES:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTechs.length === 0 ? (
                      <span className="text-zinc-650 text-[9px] tracking-wider">No technologies selected.</span>
                    ) : (
                      selectedTechs.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 border border-[#6db349]/35 bg-[#6db349]/5 text-[#6db349] uppercase text-[8px] tracking-wider rounded-md font-bold"
                        >
                          {tech}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-zinc-800/60 pt-4 mt-4 flex justify-between items-center select-none">
                  <button
                    onClick={handleExportTechCard}
                    className="flex items-center gap-1.5 bg-[#6db349] hover:bg-[#6db349]/90 text-black font-bold text-[9px] uppercase tracking-wider px-4 py-2 rounded-full cursor-pointer transition-all shadow-[0_0_12px_rgba(109,179,73,0.3)] hover:shadow-[0_0_18px_rgba(109,179,73,0.45)]"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={2} /> Export Badge
                  </button>
                  <span className="text-[7px] text-zinc-500 uppercase tracking-wider font-semibold">VERIFIED // OK</span>
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
