import React, { useState, useEffect } from 'react'
import { X, Calendar, Users, Sliders, FileText, Trash2, MessageSquare, Sparkles } from 'lucide-react'
import { playSound } from '../utils/audio'

export function AdminPanel({
  setIsAdminOpen,
  isMuted,
  volume,
  countdownDate,
  setCountdownDate,
  timelineNodes,
  setTimelineNodes,
  teamListings,
  setTeamListings,
  themeColors,
  setThemeColors,
  organizers,
  setOrganizers,
  sponsors,
  setSponsors
}) {
  const [activeTab, setActiveTab] = useState('milestones')
  
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    return localStorage.getItem('Tachyon_google_sheet_url') || ''
  })
  
  // Registration list state
  const [registrations, setRegistrations] = useState([])
  
  // Custom team form input states
  const [newTeam, setNewTeam] = useState({
    name: '',
    role: 'developer',
    track: 'ai',
    skills: '',
    pitch: '',
    discord: ''
  })

  // Custom organizer input states
  const [newOrg, setNewOrg] = useState({
    name: '',
    role: '',
    email: '',
    instagram: '',
    image: ''
  })

  // Custom sponsor input states
  const [newSponsor, setNewSponsor] = useState({
    name: '',
    tier: 'core',
    website: '',
    logo: ''
  })

  // Load registrations on mount
  useEffect(() => {
    const saved = localStorage.getItem('Tachyon_registrations')
    if (saved) {
      try {
        setRegistrations(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Delete a listing
  const handleDeleteListing = (id) => {
    playSound('error', isMuted, volume)
    const updated = teamListings.filter(item => item.id !== id)
    setTeamListings(updated)
    localStorage.setItem('Tachyon_team_listings', JSON.stringify(updated))
  }

  // Add custom team listing
  const handleAddListingSubmit = (e) => {
    e.preventDefault()
    if (!newTeam.name || !newTeam.pitch || !newTeam.discord) {
      playSound('error', isMuted, volume)
      alert('Fill in all required fields!')
      return
    }

    playSound('success', isMuted, volume)
    const item = {
      id: 'admin-' + Date.now(),
      name: newTeam.name,
      role: newTeam.role,
      track: newTeam.track,
      skills: newTeam.skills ? newTeam.skills.split(',').map(s => s.trim()) : [],
      pitch: newTeam.pitch,
      discord: newTeam.discord,
      date: 'Admin Inject'
    }

    const updated = [item, ...teamListings]
    setTeamListings(updated)
    localStorage.setItem('Tachyon_team_listings', JSON.stringify(updated))

    setNewTeam({
      name: '',
      role: 'developer',
      track: 'ai',
      skills: '',
      pitch: '',
      discord: ''
    })
  }

  // Revoke ticket registration pass
  const handleRevokePass = (ticketId) => {
    playSound('power-off', isMuted, volume)
    const updated = registrations.filter(r => r.ticketId !== ticketId)
    setRegistrations(updated)
    localStorage.setItem('Tachyon_registrations', JSON.stringify(updated))

    // If the revoked ticket matches the active visitor's ticket, clear it
    const activeTicket = localStorage.getItem('Tachyon_ticket')
    if (activeTicket) {
      const parsed = JSON.parse(activeTicket)
      if (parsed.ticketId === ticketId) {
        localStorage.removeItem('Tachyon_ticket')
        window.location.reload()
      }
    }
  }

  // Update specific color variable
  const handleColorChange = (variable, hexValue) => {
    const updated = { ...themeColors, [variable]: hexValue }
    setThemeColors(updated)
  }

  // Reset colors to factory values
  const resetColors = () => {
    playSound('click', isMuted, volume)
    const defaults = {
      '--color-yellow-neo': '#ffd000',
      '--color-red-neo': '#d91429',
      '--color-cyber-cyan': '#06b6d4',
      '--color-drac-purple': '#bd93f9',
      '--color-ink': '#030712',
      '--color-paper': '#f3f4f6',
      '--color-custom-primary': '#ff00ff',
      '--color-custom-bg': '#121212',
      '--color-custom-text': '#ffffff'
    }
    setThemeColors(defaults)
  }

  // Add Custom Organizer Handler
  const handleAddOrgSubmit = (e) => {
    e.preventDefault()
    if (!newOrg.name || !newOrg.role) {
      playSound('error', isMuted, volume)
      alert('Name and Role are required fields.')
      return
    }
    playSound('success', isMuted, volume)
    const updated = [...organizers, { id: 'org-' + Date.now(), ...newOrg }]
    setOrganizers(updated)
    localStorage.setItem('Tachyon_organizers', JSON.stringify(updated))
    setNewOrg({ name: '', role: '', email: '', instagram: '', image: '' })
  }

  // Delete Organizer Handler
  const handleDeleteOrg = (id) => {
    playSound('error', isMuted, volume)
    const updated = organizers.filter(org => org.id !== id)
    setOrganizers(updated)
    localStorage.setItem('Tachyon_organizers', JSON.stringify(updated))
  }

  // Add Custom Sponsor Handler
  const handleAddSponsorSubmit = (e) => {
    e.preventDefault()
    if (!newSponsor.name) {
      playSound('error', isMuted, volume)
      alert('Sponsor Company Name is required.')
      return
    }
    playSound('success', isMuted, volume)
    const updated = [...sponsors, { id: 'sp-' + Date.now(), ...newSponsor }]
    setSponsors(updated)
    localStorage.setItem('Tachyon_sponsors', JSON.stringify(updated))
    setNewSponsor({ name: '', tier: 'core', website: '', logo: '' })
  }

  // Delete Sponsor Handler
  const handleDeleteSponsor = (id) => {
    playSound('error', isMuted, volume)
    const updated = sponsors.filter(sp => sp.id !== id)
    setSponsors(updated)
    localStorage.setItem('Tachyon_sponsors', JSON.stringify(updated))
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto pt-6 sm:pt-10 select-none text-white">
      
      {/* Admin Panel container */}
      <div className="relative w-full max-w-4xl border border-white/10 bg-zinc-950/90 text-white p-6 md:p-8 shadow-2xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-xl">
        
        {/* Panel Header */}
        <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-4 mb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md select-none">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full inline-block animate-pulse"></span>
              SECURE ADMIN SESSION // LEVEL 0
            </div>
            <h2 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white mt-1.5 font-mono">
              CONTROL CONSOLE
            </h2>
          </div>

          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              setIsAdminOpen(false)
            }}
            className="border border-white/10 bg-white/5 p-2 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 rounded-lg cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6 font-mono text-xs font-bold uppercase select-none">
          {[
            { id: 'milestones', label: 'Milestones & Dates', icon: Calendar },
            { id: 'teammates', label: 'Matchmaking Lobby', icon: Users },
            { id: 'crewsponsors', label: 'Crews & Sponsors', icon: Sparkles },
            { id: 'themes', label: 'Theme Editor', icon: Sliders },
            { id: 'registrants', label: 'Registrant Registry', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setActiveTab(tab.id)
                }}
                className={`flex items-center gap-1.5 border px-3 py-2 transition-all cursor-pointer rounded-xl font-mono font-bold ${
                  activeTab === tab.id 
                    ? 'bg-white text-black border-white shadow-md scale-[1.01]' 
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Contents */}
        <div className="relative z-10 font-mono text-xs text-white">
          
          {/* TAB 1: MILESTONES & DATES */}
          {activeTab === 'milestones' && (
            <div className="space-y-6">
              <div className="border border-white/5 bg-white/5 p-5 rounded-2xl text-left">
                <span className="block font-bold text-white uppercase mb-1">⏰ CountDown Target Milestone</span>
                <p className="text-[10px] text-zinc-400 mb-3">Adjust the date for the Hero Section digital countdown clocks.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={countdownDate}
                    onChange={(e) => setCountdownDate(e.target.value)}
                    placeholder="e.g. 2026-07-24T00:00:00+05:30"
                    className="flex-1 bg-zinc-950/60 border border-white/5 px-3 py-2 font-mono text-xs text-white rounded-xl outline-none focus:border-white transition-all shadow-inner"
                  />
                  <button
                    onClick={() => {
                      playSound('success', isMuted, volume)
                      alert('Target date updated successfully!')
                    }}
                    className="border border-white/10 bg-white hover:bg-zinc-150 text-black px-4 py-2 font-bold uppercase rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    SYNC TIMER
                  </button>
                </div>
              </div>

              <div className="border border-white/5 bg-white/5 p-5 rounded-2xl text-left">
                <span className="block font-bold text-white uppercase mb-1">📊 Google Sheets Sync Webhook URL</span>
                <p className="text-[10px] text-zinc-400 mb-3">Paste your Google Apps Script Web App URL to sync registration and matchmaking data in real time.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={googleSheetUrl}
                    onChange={(e) => {
                      setGoogleSheetUrl(e.target.value)
                      localStorage.setItem('Tachyon_google_sheet_url', e.target.value)
                    }}
                    placeholder="https://script.google.com/macros/s/XXXXX/exec"
                    className="flex-1 bg-zinc-950/60 border border-white/5 px-3 py-2 font-mono text-xs text-white rounded-xl outline-none focus:border-white transition-all shadow-inner"
                  />
                  <button
                    onClick={() => {
                      playSound('success', isMuted, volume)
                      alert('Google Sheets webhook URL updated and saved!')
                    }}
                    className="border border-white/10 bg-white hover:bg-zinc-150 text-black px-4 py-2 font-bold uppercase rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    SAVE URL
                  </button>
                </div>
              </div>

              <div>
                <span className="block font-bold text-white uppercase mb-3 text-left">📅 Schedule Nodes Settings</span>
                <div className="space-y-4">
                  {timelineNodes.map((node, index) => (
                    <div key={index} className="border border-white/5 bg-zinc-900/30 p-4.5 rounded-2xl space-y-3 text-left">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-bold text-indigo-400">Phase {node.phase}</span>
                        <select
                          value={node.status}
                          onChange={(e) => {
                            const updated = [...timelineNodes]
                            updated[index].status = e.target.value
                            setTimelineNodes(updated)
                          }}
                          className="bg-zinc-950/60 border border-white/5 px-2 py-0.5 text-[10px] font-bold uppercase outline-none text-white rounded-lg cursor-pointer"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="UPCOMING">UPCOMING</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Milestone Title</label>
                          <input
                            type="text"
                            value={node.title}
                            onChange={(e) => {
                              const updated = [...timelineNodes]
                              updated[index].title = e.target.value
                              setTimelineNodes(updated)
                            }}
                            className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Date Display Label</label>
                          <input
                            type="text"
                            value={node.date}
                            onChange={(e) => {
                              const updated = [...timelineNodes]
                              updated[index].date = e.target.value
                              setTimelineNodes(updated)
                            }}
                            className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Milestone Description</label>
                        <textarea
                          rows={2}
                          value={node.desc}
                          onChange={(e) => {
                            const updated = [...timelineNodes]
                            updated[index].desc = e.target.value
                            setTimelineNodes(updated)
                          }}
                          className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none text-[10px] leading-tight resize-none rounded-lg text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEAMMATCHMAKING BOARD MODERATOR */}
          {activeTab === 'teammates' && (
            <div className="space-y-6">
              
              {/* Insert Team Listing */}
              <form onSubmit={handleAddListingSubmit} className="border border-white/5 bg-white/5 p-5 rounded-2xl space-y-3 text-left">
                <span className="block font-bold text-white uppercase mb-1">➕ Inject Mock Builder Listing</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Target Role *</label>
                    <select
                      value={newTeam.role}
                      onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                      className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white cursor-pointer"
                    >
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="generalist">Generalist</option>
                      <option value="researcher">Researcher</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Target Track *</label>
                    <select
                      value={newTeam.track}
                      onChange={(e) => setNewTeam({ ...newTeam, track: e.target.value })}
                      className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white cursor-pointer"
                    >
                      <option value="ai">AI</option>
                      <option value="cyber">CYBER</option>
                      <option value="game">GAME</option>
                      <option value="web">WEB</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Discord Handle *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. user#1234"
                      value={newTeam.discord}
                      onChange={(e) => setNewTeam({ ...newTeam, discord: e.target.value })}
                      className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Skills (separated by commas)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Rust, Go"
                      value={newTeam.skills}
                      onChange={(e) => setNewTeam({ ...newTeam, skills: e.target.value })}
                      className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Builder Pitch *</label>
                  <textarea
                    rows={2}
                    required
                    value={newTeam.pitch}
                    onChange={(e) => setNewTeam({ ...newTeam, pitch: e.target.value })}
                    className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none text-[10px] resize-none rounded-lg text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full border border-white/10 bg-white hover:bg-zinc-150 text-black px-4 py-2 font-bold uppercase rounded-lg active:scale-95 transition-all cursor-pointer"
                >
                  ADD BUILDER TO MATCHMAKING LOBBY
                </button>
              </form>

              {/* Active Listings Moderator */}
              <div className="text-left">
                <span className="block font-bold text-white uppercase mb-2">📋 Active Listings Moderator ({teamListings.length})</span>
                <div className="max-h-60 overflow-y-auto space-y-2 border border-white/5 p-2 bg-zinc-950/40 rounded-2xl scrollbar-none">
                  {teamListings.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border border-white/5 p-3.5 bg-zinc-900/30 hover:bg-zinc-900/40 rounded-xl transition-colors">
                      <div className="space-y-1 select-text">
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-white">{item.name}</span>
                          <span className="text-[8px] px-1 border border-white/10 bg-white/5 rounded text-zinc-350">{item.role.toUpperCase()}</span>
                          <span className="text-[8px] font-bold text-indigo-400">{item.track.toUpperCase()}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 leading-tight">{item.pitch}</div>
                        <div className="text-[9px] text-zinc-500 font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-zinc-550" /> Discord: {item.discord}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="border border-red-500/10 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 cursor-pointer rounded-xl active:scale-90 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CREWS & SPONSORS */}
          {activeTab === 'crewsponsors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
              
              {/* Operators Moderator */}
              <div className="space-y-4">
                <div className="border border-white/5 bg-white/5 p-4.5 rounded-2xl space-y-3">
                  <span className="block font-bold text-white uppercase mb-1">👤 Inject Platform Operator</span>
                  <form onSubmit={handleAddOrgSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newOrg.name}
                        onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                        placeholder="e.g. Kunal Dev"
                        className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Operator Role *</label>
                      <input
                        type="text"
                        required
                        value={newOrg.role}
                        onChange={(e) => setNewOrg({ ...newOrg, role: e.target.value })}
                        placeholder="e.g. Core Architect"
                        className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          value={newOrg.email}
                          onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                          placeholder="e.g. kunal@domain.com"
                          className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-mono outline-none rounded-lg text-[10px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Instagram ID</label>
                        <input
                          type="text"
                          value={newOrg.instagram}
                          onChange={(e) => setNewOrg({ ...newOrg, instagram: e.target.value })}
                          placeholder="e.g. kunal_dev"
                          className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-mono outline-none rounded-lg text-[10px] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Picture Link (Optional URL)</label>
                      <input
                        type="text"
                        value={newOrg.image}
                        onChange={(e) => setNewOrg({ ...newOrg, image: e.target.value })}
                        placeholder="e.g. https://domain.com/pic.jpg"
                        className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-mono outline-none rounded-lg text-[10px] text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full border border-white/10 bg-white hover:bg-zinc-150 text-black px-4 py-2 font-bold uppercase rounded-lg active:scale-95 transition-all cursor-pointer"
                    >
                      ADD OPERATOR
                    </button>
                  </form>
                </div>

                <div className="space-y-2">
                  <span className="block font-bold text-white uppercase">[ Crew List ({organizers.length}) ]</span>
                  <div className="max-h-60 overflow-y-auto space-y-2 border border-white/5 p-2 bg-zinc-950/40 rounded-2xl scrollbar-none">
                    {organizers.map((org) => (
                      <div key={org.id} className="flex justify-between items-center border border-white/5 p-2.5 bg-zinc-900/30 hover:bg-zinc-900/40 rounded-xl transition-colors">
                        <div className="font-mono text-left">
                          <span className="block font-bold text-white">{org.name}</span>
                          <span className="block text-[8px] font-bold text-indigo-400 uppercase mt-0.5">{org.role}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteOrg(org.id)}
                          className="border border-red-500/10 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 cursor-pointer rounded-lg active:scale-90 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sponsors Moderator */}
              <div className="space-y-4">
                <div className="border border-white/5 bg-white/5 p-4.5 rounded-2xl space-y-3">
                  <span className="block font-bold text-white uppercase mb-1">🏢 Inject Mainframe Sponsor</span>
                  <form onSubmit={handleAddSponsorSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={newSponsor.name}
                        onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                        placeholder="e.g. Vercel"
                        className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Sponsorship Tier *</label>
                      <select
                        value={newSponsor.tier}
                        onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                        className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-bold outline-none rounded-lg text-white cursor-pointer"
                      >
                        <option value="core">Core Processor (Gold)</option>
                        <option value="subprocessor">Sub-Processor (Silver)</option>
                        <option value="peripheral">Peripheral Node (Bronze)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Website URL</label>
                      <input
                        type="text"
                        value={newSponsor.website}
                        onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
                        placeholder="e.g. https://vercel.com"
                        className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-mono outline-none rounded-lg text-[10px] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Logo Link (Optional URL)</label>
                      <input
                        type="text"
                        value={newSponsor.logo}
                        onChange={(e) => setNewSponsor({ ...newSponsor, logo: e.target.value })}
                        placeholder="e.g. https://logo.com/logo.png"
                        className="w-full bg-zinc-950/60 border border-white/5 p-1.5 font-mono outline-none rounded-lg text-[10px] text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full border border-white/10 bg-white hover:bg-zinc-150 text-black px-4 py-2 font-bold uppercase rounded-lg active:scale-95 transition-all cursor-pointer"
                    >
                      ADD SPONSOR
                    </button>
                  </form>
                </div>

                <div className="space-y-2">
                  <span className="block font-bold text-white uppercase">[ Sponsors List ({sponsors.length}) ]</span>
                  <div className="max-h-60 overflow-y-auto space-y-2 border border-white/5 p-2 bg-zinc-950/40 rounded-2xl scrollbar-none">
                    {sponsors.map((sp) => (
                      <div key={sp.id} className="flex justify-between items-center border border-white/5 p-2.5 bg-zinc-900/30 hover:bg-zinc-900/40 rounded-xl transition-colors">
                        <div className="font-mono text-left">
                          <span className="block font-bold text-white">{sp.name}</span>
                          <span className="block text-[8px] font-bold text-cyan-400 uppercase mt-0.5">{sp.tier}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSponsor(sp.id)}
                          className="border border-red-500/10 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 cursor-pointer rounded-lg active:scale-90 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: THEME EDITOR & COLOR BUILDERS */}
          {activeTab === 'themes' && (
            <div className="space-y-6 text-left">
              
              <div className="border border-white/5 bg-white/5 p-5 rounded-2xl space-y-4">
                <span className="block font-bold text-white uppercase mb-1">🎨 Customize Palette Variables</span>
                <p className="text-[10px] text-zinc-400 mb-2">Adjust the Hex color values dynamically inside your active session.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Amber primary */}
                  <div className="flex items-center gap-3 bg-zinc-950/40 p-3 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-yellow-neo'] || '#ffd000'}
                      onChange={(e) => handleColorChange('--color-yellow-neo', e.target.value)}
                      className="w-10 h-10 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">AMBER ACCENT</span>
                      <span className="font-bold text-[10px] uppercase text-white">{themeColors['--color-yellow-neo']}</span>
                    </div>
                  </div>

                  {/* Crimson primary */}
                  <div className="flex items-center gap-3 bg-zinc-950/40 p-3 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-red-neo'] || '#d91429'}
                      onChange={(e) => handleColorChange('--color-red-neo', e.target.value)}
                      className="w-10 h-10 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">CRIMSON ACCENT</span>
                      <span className="font-bold text-[10px] uppercase text-white">{themeColors['--color-red-neo']}</span>
                    </div>
                  </div>

                  {/* Cyber-Cyan */}
                  <div className="flex items-center gap-3 bg-zinc-950/40 p-3 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-cyber-cyan'] || '#06b6d4'}
                      onChange={(e) => handleColorChange('--color-cyber-cyan', e.target.value)}
                      className="w-10 h-10 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">CYBER CYAN</span>
                      <span className="font-bold text-[10px] uppercase text-white">{themeColors['--color-cyber-cyan']}</span>
                    </div>
                  </div>

                  {/* Dracula Purple */}
                  <div className="flex items-center gap-3 bg-zinc-950/40 p-3 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-drac-purple'] || '#bd93f9'}
                      onChange={(e) => handleColorChange('--color-drac-purple', e.target.value)}
                      className="w-10 h-10 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">DRACULA PURPLE</span>
                      <span className="font-bold text-[10px] uppercase text-white">{themeColors['--color-drac-purple']}</span>
                    </div>
                  </div>

                  {/* Global Dark (Ink) */}
                  <div className="flex items-center gap-3 bg-zinc-950/40 p-3 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-ink'] || '#030712'}
                      onChange={(e) => handleColorChange('--color-ink', e.target.value)}
                      className="w-10 h-10 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">GLOBAL DARK (INK)</span>
                      <span className="font-bold text-[10px] uppercase text-white">{themeColors['--color-ink']}</span>
                    </div>
                  </div>

                  {/* Global Light (Paper) */}
                  <div className="flex items-center gap-3 bg-zinc-950/40 p-3 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-paper'] || '#f3f4f6'}
                      onChange={(e) => handleColorChange('--color-paper', e.target.value)}
                      className="w-10 h-10 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">GLOBAL LIGHT (PAPER)</span>
                      <span className="font-bold text-[10px] uppercase text-white">{themeColors['--color-paper']}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Theme Tab */}
              <div className="border border-white/5 bg-indigo-500/5 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-1">
                  <span className="block font-bold text-white uppercase">🛠️ Configure Slot: CUSTOM Theme</span>
                  <span className="text-[9px] font-bold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded">
                    SLOT 07
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mb-2">Edits to this slot take effect instantly when the "custom" theme is selected in the navbar.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2.5 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-custom-primary'] || '#ff00ff'}
                      onChange={(e) => handleColorChange('--color-custom-primary', e.target.value)}
                      className="w-8 h-8 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">PRIMARY</span>
                      <span className="font-bold text-[9px] uppercase text-white">{themeColors['--color-custom-primary']}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2.5 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-custom-bg'] || '#121212'}
                      onChange={(e) => handleColorChange('--color-custom-bg', e.target.value)}
                      className="w-8 h-8 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">BACKGROUND</span>
                      <span className="font-bold text-[9px] uppercase text-white">{themeColors['--color-custom-bg']}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-zinc-950/40 p-2.5 border border-white/5 rounded-xl">
                    <input
                      type="color"
                      value={themeColors['--color-custom-text'] || '#ffffff'}
                      onChange={(e) => handleColorChange('--color-custom-text', e.target.value)}
                      className="w-8 h-8 border border-white/10 cursor-pointer bg-transparent outline-none rounded-lg"
                    />
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-500">TEXT COLOR</span>
                      <span className="font-bold text-[9px] uppercase text-white">{themeColors['--color-custom-text']}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={resetColors}
                  className="border border-white/10 bg-white hover:bg-zinc-150 text-black px-4 py-2 font-bold uppercase rounded-xl active:scale-95 transition-all cursor-pointer"
                >
                  RESET COLORS
                </button>
              </div>

            </div>
          )}

          {/* TAB 5: REGISTRANTS */}
          {activeTab === 'registrants' && (
            <div className="space-y-6 text-left">
              
              <div>
                <span className="block font-bold text-white uppercase mb-2">🎫 Registration Pass Registry ({registrations.length})</span>
                <p className="text-[10px] text-zinc-400 mb-3">All generated tickets are logged below. Revoking a pass will clear the registration record.</p>
                
                <div className="max-h-96 overflow-x-auto border border-white/5 bg-zinc-950/40 rounded-2xl scrollbar-none">
                  <table className="w-full text-left font-mono text-[10px] min-w-[700px]">
                    <thead>
                      <tr className="bg-zinc-900/60 text-zinc-300 border-b border-white/5 uppercase font-bold text-[9px]">
                        <th className="p-3.5">Ticket ID</th>
                        <th className="p-3.5">Avatar</th>
                        <th className="p-3.5">Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Domain</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Github</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 select-text">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-6 text-center text-zinc-500 font-bold uppercase select-none">
                            No passes have been generated in the registration registry.
                          </td>
                        </tr>
                      ) : (
                        registrations.map((user) => (
                          <tr key={user.ticketId} className="hover:bg-white/5 transition-colors text-zinc-300 font-bold">
                            <td className="p-3.5 text-indigo-400 tracking-wider font-mono">{user.ticketId}</td>
                            <td className="p-3.5 uppercase">{user.avatar}</td>
                            <td className="p-3.5 uppercase">{user.name}</td>
                            <td className="p-3.5 break-all">{user.email}</td>
                            <td className="p-3.5"><span className="px-2 py-0.5 border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-[8px] font-bold rounded-lg">{user.track.toUpperCase()}</span></td>
                            <td className="p-3.5 uppercase">{user.role}</td>
                            <td className="p-3.5 font-bold text-zinc-400">@{user.github || 'none'}</td>
                            <td className="p-3.5 text-right select-none">
                              <button
                                onClick={() => handleRevokePass(user.ticketId)}
                                className="border border-red-500/10 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-red-400 cursor-pointer rounded-lg active:scale-95 transition-colors"
                              >
                                REVOKE
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}
export default AdminPanel

