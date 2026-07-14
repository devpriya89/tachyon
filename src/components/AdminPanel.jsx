import React, { useState, useEffect } from 'react'
import { X, Calendar, Users, Sliders, FileText, Trash2, MessageSquare, Sparkles, Code, Cpu } from 'lucide-react'
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
  setSponsors,
  whatsappLink,
  setWhatsappLink,
  faqList,
  setFaqList,
  instagramLink,
  setInstagramLink,
  twitterLink,
  setTwitterLink,
  tracksList,
  setTracksList,
  adminEmails,
  setAdminEmails,
  googleClientId,
  setGoogleClientId,
  venueLocation,
  setVenueLocation,
  githubLink,
  setGithubLink,
  websiteLink,
  setWebsiteLink
}) {
  const [activeTab, setActiveTab] = useState('milestones')
  
  const [googleSheetUrl, setGoogleSheetUrl] = useState(() => {
    return localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
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

  // FAQ Manager helper states
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })
  const [editingFaqIdx, setEditingFaqIdx] = useState(null)
  const [editFaqData, setEditFaqData] = useState({ question: '', answer: '' })

  // Tracks Editor active track selection
  const [selectedTrackId, setSelectedTrackId] = useState('ai')
  const [trackEditForm, setTrackEditForm] = useState({
    title: '',
    tagLine: '',
    prize: '',
    details: '',
    criteria: '',
    techs: '',
    ideas: '',
    blueprintSpecs: {}
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

  // Sync track edits form state when active selection changes
  useEffect(() => {
    const currentTrack = tracksList.find(t => t.id === selectedTrackId)
    if (currentTrack) {
      setTrackEditForm({
        title: currentTrack.title || '',
        tagLine: currentTrack.tagLine || '',
        prize: currentTrack.prize || '',
        details: currentTrack.details || '',
        criteria: currentTrack.criteria || '',
        techs: currentTrack.techs ? currentTrack.techs.join(', ') : '',
        ideas: currentTrack.ideas ? currentTrack.ideas.join('\n') : '',
        blueprintSpecs: currentTrack.blueprintSpecs || {}
      })
    }
  }, [selectedTrackId, tracksList])

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
    setNewTeam({ name: '', role: 'developer', track: 'ai', skills: '', pitch: '', discord: '' })
  }

  // Add Custom Organizer Handler
  const handleAddOrgSubmit = (e) => {
    e.preventDefault()
    if (!newOrg.name || !newOrg.role || !newOrg.email) {
      playSound('error', isMuted, volume)
      alert('Fill in Organizer Name, Role, and Email.')
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

  // Add FAQ handler
  const handleAddFaqSubmit = (e) => {
    e.preventDefault()
    if (!newFaq.question || !newFaq.answer) {
      playSound('error', isMuted, volume)
      alert('Fill in both the Question and the Answer fields.')
      return
    }
    playSound('success', isMuted, volume)
    const updated = [...faqList, newFaq]
    setFaqList(updated)
    setNewFaq({ question: '', answer: '' })
  }

  // Delete FAQ handler
  const handleDeleteFaq = (idx) => {
    if (window.confirm('Delete this FAQ permanently?')) {
      playSound('error', isMuted, volume)
      const updated = faqList.filter((_, i) => i !== idx)
      setFaqList(updated)
    }
  }

  // Save edited FAQ handler
  const handleSaveEditFaq = (idx) => {
    if (!editFaqData.question || !editFaqData.answer) {
      playSound('error', isMuted, volume)
      alert('Question and Answer cannot be blank.')
      return
    }
    playSound('success', isMuted, volume)
    const updated = [...faqList]
    updated[idx] = editFaqData
    setFaqList(updated)
    setEditingFaqIdx(null)
  }

  // Save edited track handler
  const handleSaveTrackEdit = (e) => {
    e.preventDefault()
    if (!trackEditForm.title || !trackEditForm.prize || !trackEditForm.details) {
      playSound('error', isMuted, volume)
      alert('Title, Prize Pool, and Details are required!')
      return
    }

    playSound('success', isMuted, volume)
    const updated = tracksList.map(t => {
      if (t.id === selectedTrackId) {
        return {
          ...t,
          title: trackEditForm.title,
          tagLine: trackEditForm.tagLine,
          prize: trackEditForm.prize,
          details: trackEditForm.details,
          criteria: trackEditForm.criteria,
          techs: trackEditForm.techs.split(',').map(s => s.trim()).filter(Boolean),
          ideas: trackEditForm.ideas.split('\n').map(s => s.trim()).filter(Boolean),
          blueprintSpecs: {
            ...t.blueprintSpecs,
            ...trackEditForm.blueprintSpecs
          }
        }
      }
      return t
    })
    setTracksList(updated)
    alert(`Track '${selectedTrackId.toUpperCase()}' configurations synchronized successfully!`)
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto pt-6 sm:pt-10 select-none text-white">
      
      {/* Admin Panel container */}
      <div className="relative w-full max-w-4xl border border-zinc-800 bg-[#231f20]/95 text-white p-6 md:p-8 shadow-2xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto rounded-2xl">
        
        {/* Panel Header */}
        <div className="relative z-10 flex justify-between items-center border-b border-zinc-800/60 pb-4 mb-6">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 border border-[#6db349]/20 bg-[#6db349]/5 text-[#6db349] px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full select-none">
              <span className="w-1.5 h-1.5 bg-[#6db349] rounded-full inline-block animate-pulse"></span>
              SECURE ADMIN SESSION // LEVEL 0
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white mt-1.5">
              Control Console
            </h2>
          </div>

          <button
            onClick={() => {
              playSound('click', isMuted, volume)
              setIsAdminOpen(false)
            }}
            className="border border-zinc-800 hover:border-zinc-650 bg-black/25 text-zinc-400 hover:text-white p-2 rounded-full cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800/60 pb-4 mb-6 text-xs font-bold uppercase select-none">
          {[
            { id: 'milestones', label: 'Milestones & Dates', icon: Calendar },
            { id: 'teammates', label: 'Matchmaking Lobby', icon: Users },
            { id: 'tracks', label: 'Track Configs', icon: Code },
            { id: 'crewsponsors', label: 'Crews & Sponsors', icon: Sparkles },
            { id: 'faqs', label: 'FAQ Manager', icon: MessageSquare },
            { id: 'themes', label: 'Theme Editor', icon: Sliders },
            { id: 'registrants', label: 'Registrant Registry', icon: FileText },
            { id: 'authsettings', label: 'Auth Settings', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click', isMuted, volume)
                  setActiveTab(tab.id)
                }}
                className={`flex items-center gap-1.5 border px-3.5 py-2 transition-all cursor-pointer rounded-full font-bold ${
                  activeTab === tab.id 
                    ? 'bg-[#6db349] text-black border-[#6db349] shadow-[0_0_12px_rgba(109,179,73,0.3)]' 
                    : 'bg-black/25 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-black/45'
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
              <div className="border border-zinc-800 bg-black/25 p-5 rounded-xl text-left">
                <span className="block font-bold text-white uppercase mb-1">⏰ CountDown Target Milestone</span>
                <p className="text-[10px] text-zinc-400 mb-3">Adjust the date for the Hero Section digital countdown clocks.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={countdownDate}
                    onChange={(e) => setCountdownDate(e.target.value)}
                    placeholder="e.g. 2026-07-24T00:00:00+05:30"
                    className="flex-1 bg-black/40 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all shadow-none"
                  />
                  <button
                    onClick={() => {
                      playSound('success', isMuted, volume)
                      alert('Target date updated successfully!')
                    }}
                    className="bg-[#6db349] hover:bg-[#6db349]/90 text-black px-4.5 py-2 font-bold uppercase rounded-full active:scale-95 transition-all cursor-pointer"
                  >
                    SYNC TIMER
                  </button>
                </div>
              </div>

              {/* WhatsApp Community Link Setting Block */}
              <div className="border border-zinc-800 bg-black/25 p-5 rounded-xl text-left">
                <span className="block font-bold text-white uppercase mb-1">💬 WhatsApp Community Link</span>
                <p className="text-[10px] text-zinc-400 mb-3">Paste your WhatsApp Community link for the main landing page button.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={whatsappLink}
                    onChange={(e) => {
                      setWhatsappLink(e.target.value)
                    }}
                    placeholder="https://chat.whatsapp.com/XXXXX"
                    className="flex-1 bg-black/40 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all shadow-none"
                  />
                  <button
                    onClick={() => {
                      playSound('success', isMuted, volume)
                      alert('WhatsApp Community URL updated and saved!')
                    }}
                    className="bg-[#6db349] hover:bg-[#6db349]/90 text-black px-4.5 py-2 font-bold uppercase rounded-full active:scale-95 transition-all cursor-pointer"
                  >
                    SAVE LINK
                  </button>
                </div>
              </div>

              {/* Social Links Setting Block */}
              <div className="border border-zinc-800 bg-black/25 p-5 rounded-xl text-left space-y-4">
                <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">🌐 Social Media & Platform Links</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Instagram Profile URL</label>
                    <input
                      type="text"
                      value={instagramLink}
                      onChange={(e) => setInstagramLink(e.target.value)}
                      placeholder="https://instagram.com/XXXXX"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Twitter / X Profile URL</label>
                    <input
                      type="text"
                      value={twitterLink}
                      onChange={(e) => setTwitterLink(e.target.value)}
                      placeholder="https://twitter.com/XXXXX"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">GitHub Organization / Link</label>
                    <input
                      type="text"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/XXXXX"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Official Website URL</label>
                    <input
                      type="text"
                      value={websiteLink}
                      onChange={(e) => setWebsiteLink(e.target.value)}
                      placeholder="https://www.tachyonindia.org/"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound('success', isMuted, volume)
                    alert('Social media and official platform URLs updated and saved!')
                  }}
                  className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-xs"
                >
                  SYNC PLATFORM LINKS
                </button>
              </div>

              <div className="border border-zinc-800 bg-black/25 p-5 rounded-xl text-left">
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
                    className="flex-1 bg-black/40 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all shadow-none"
                  />
                  <button
                    onClick={() => {
                      playSound('success', isMuted, volume)
                      alert('Google Sheets webhook URL updated and saved!')
                    }}
                    className="bg-[#6db349] hover:bg-[#6db349]/90 text-black px-4.5 py-2 font-bold uppercase rounded-full active:scale-95 transition-all cursor-pointer"
                  >
                    SAVE URL
                  </button>
                </div>
              </div>

              <div>
                <span className="block font-bold text-white uppercase mb-3 text-left">📅 Schedule Nodes Settings</span>
                <div className="space-y-4">
                  {timelineNodes.map((node, index) => (
                    <div key={index} className="border border-zinc-800 bg-black/25 p-5 rounded-xl space-y-3 text-left">
                      <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                        <span className="font-bold text-[#6db349]">Phase {node.phase}</span>
                        <select
                          value={node.status}
                          onChange={(e) => {
                            const updated = [...timelineNodes]
                            updated[index].status = e.target.value
                            setTimelineNodes(updated)
                          }}
                          className="bg-black/60 border border-zinc-800 px-3 py-1 text-[10px] font-bold uppercase outline-none text-zinc-300 rounded-full cursor-pointer"
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
                            className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Milestone Date Info</label>
                          <input
                            type="text"
                            value={node.date}
                            onChange={(e) => {
                              const updated = [...timelineNodes]
                              updated[index].date = e.target.value
                              setTimelineNodes(updated)
                            }}
                            className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Detailed Description</label>
                        <textarea
                          rows="2"
                          value={node.desc}
                          onChange={(e) => {
                            const updated = [...timelineNodes]
                            updated[index].desc = e.target.value
                            setTimelineNodes(updated)
                          }}
                          className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    playSound('success', isMuted, volume)
                    localStorage.setItem('Tachyon_timeline', JSON.stringify(timelineNodes))
                    alert('Event schedule timeline updated and saved successfully!')
                  }}
                  className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-xs mt-4"
                >
                  SYNC SCHEDULE NODES
                </button>
              </div>

              {/* Reset Factory Defaults Block */}
              <div className="border border-red-500/25 bg-red-500/5 p-5 rounded-xl text-left space-y-3">
                <span className="block font-bold text-red-400 uppercase border-b border-red-500/20 pb-2">⚠️ System Restore</span>
                <p className="text-[10px] text-zinc-400">Reset all database configuration values (tracks, FAQs, milestones, sponsors, crew) back to system source defaults.</p>
                <button
                  onClick={() => {
                    if (window.confirm('Reset all website configuration parameters back to code defaults? This will overwrite your custom modifications.')) {
                      playSound('error', isMuted, volume)
                      localStorage.removeItem('Tachyon_tracks')
                      localStorage.removeItem('Tachyon_faqs')
                      localStorage.removeItem('Tachyon_timeline')
                      localStorage.removeItem('Tachyon_organizers')
                      localStorage.removeItem('Tachyon_sponsors')
                      alert('Local configuration cache flushed! Please reload the page to apply defaults.')
                      window.location.reload()
                    }
                  }}
                  className="bg-red-500/20 hover:bg-red-500/35 text-red-400 border border-red-500/35 px-4.5 py-2 font-bold uppercase rounded-full active:scale-95 transition-all cursor-pointer text-xs"
                >
                  RESTORE FACTORY DEFAULTS
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TEAM LISTINGS */}
          {activeTab === 'teammates' && (
            <div className="space-y-6">
               {/* Form to insert custom matchmaking listing */}
              <form onSubmit={handleAddListingSubmit} className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl space-y-4 text-left">
                <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">➕ Add Custom Teammate Listing</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Creator Name (Required)</label>
                    <input
                      type="text"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="e.g. Priyanshu Sen"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Primary Role</label>
                    <select
                      value={newTeam.role}
                      onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 cursor-pointer"
                    >
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="generalist">Generalist</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Track Target</label>
                    <select
                      value={newTeam.track}
                      onChange={(e) => setNewTeam({ ...newTeam, track: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 cursor-pointer"
                    >
                      <option value="ai">AI Track</option>
                      <option value="cyber">Cyber Track</option>
                      <option value="game">Game Track</option>
                      <option value="web">Web Track</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Skills (Comma separated)</label>
                    <input
                      type="text"
                      value={newTeam.skills}
                      onChange={(e) => setNewTeam({ ...newTeam, skills: e.target.value })}
                      placeholder="e.g. React, Rust, Go"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Discord Tag (Required)</label>
                    <input
                      type="text"
                      value={newTeam.discord}
                      onChange={(e) => setNewTeam({ ...newTeam, discord: e.target.value })}
                      placeholder="e.g. name#1234"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Pitch / Idea summary (Required)</label>
                    <input
                      type="text"
                      value={newTeam.pitch}
                      onChange={(e) => setNewTeam({ ...newTeam, pitch: e.target.value })}
                      placeholder="What are you building?"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-xs"
                >
                  ADD TEAM CONSOLE ENTRY
                </button>
              </form>

              {/* Team list table */}
              <div className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl text-left">
                <span className="block font-bold text-white uppercase mb-4 border-b border-zinc-800/60 pb-2">📂 Matchmaking Lobby Database ({teamListings.length} listings)</span>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {teamListings.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border border-zinc-850 bg-black/40 p-4 rounded-xl">
                      <div>
                        <span className="font-bold text-zinc-200 block text-xs">{item.teamName || `${item.name}'s Squad`} ({item.track.toUpperCase()})</span>
                        <span className="text-[10px] text-zinc-500 block truncate max-w-lg">Pitch: {item.pitch}</span>
                        <span className="text-[9px] text-[#6db349] block mt-1">Creator: {item.name} | discord: {item.discord}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 border border-red-500/20 rounded-lg transition-colors duration-150 active:scale-95 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRACK CONFIGS */}
          {activeTab === 'tracks' && (
            <div className="space-y-6 text-left">
              <div className="border border-zinc-800 bg-black/25 p-5 rounded-xl">
                <span className="block font-bold text-white uppercase mb-3">📂 Select Track to Edit</span>
                <div className="flex flex-wrap gap-2">
                  {['ai', 'cyber', 'game', 'web'].map(tId => (
                    <button
                      key={tId}
                      onClick={() => {
                        playSound('click', isMuted, volume)
                        setSelectedTrackId(tId)
                      }}
                      className={`px-4 py-2 border font-bold uppercase transition-all rounded-full cursor-pointer ${
                        selectedTrackId === tId
                          ? 'bg-[#6db349] text-black border-[#6db349] shadow-md'
                          : 'bg-black/25 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-black/40'
                      }`}
                    >
                      {tId.toUpperCase()} TRACK
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit Track configurations form */}
              <form onSubmit={handleSaveTrackEdit} className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl space-y-4">
                <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">
                  📝 Edit Parameters: {selectedTrackId.toUpperCase()}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Track Title</label>
                    <input
                      type="text"
                      value={trackEditForm.title}
                      onChange={(e) => setTrackEditForm({ ...trackEditForm, title: e.target.value })}
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Prize Pool label</label>
                    <input
                      type="text"
                      value={trackEditForm.prize}
                      onChange={(e) => setTrackEditForm({ ...trackEditForm, prize: e.target.value })}
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Tagline banner</label>
                  <input
                    type="text"
                    value={trackEditForm.tagLine}
                    onChange={(e) => setTrackEditForm({ ...trackEditForm, tagLine: e.target.value })}
                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Details description</label>
                  <textarea
                    rows="3"
                    value={trackEditForm.details}
                    onChange={(e) => setTrackEditForm({ ...trackEditForm, details: e.target.value })}
                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Evaluation Criteria details</label>
                  <input
                    type="text"
                    value={trackEditForm.criteria}
                    onChange={(e) => setTrackEditForm({ ...trackEditForm, criteria: e.target.value })}
                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Target technologies (Comma separated)</label>
                    <input
                      type="text"
                      value={trackEditForm.techs}
                      onChange={(e) => setTrackEditForm({ ...trackEditForm, techs: e.target.value })}
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Build Concept Ideas (One per line)</label>
                    <textarea
                      rows="3"
                      value={trackEditForm.ideas}
                      onChange={(e) => setTrackEditForm({ ...trackEditForm, ideas: e.target.value })}
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Blueprint builder checklist items */}
                <div className="border border-zinc-800 bg-black/25 p-4 rounded-xl space-y-4">
                  <span className="block font-bold text-white uppercase text-[9px] border-b border-zinc-800/60 pb-2">
                    🛠️ Blueprint Checklist Spec Items (Labels)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.keys(trackEditForm.blueprintSpecs).map((specKey) => (
                      <div key={specKey}>
                        <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">
                          Node spec: {specKey.toUpperCase()}
                        </label>
                        <input
                          type="text"
                          value={trackEditForm.blueprintSpecs[specKey] || ''}
                          onChange={(e) => {
                            const updatedSpecs = {
                              ...trackEditForm.blueprintSpecs,
                              [specKey]: e.target.value
                            }
                            setTrackEditForm({ ...trackEditForm, blueprintSpecs: updatedSpecs })
                          }}
                          className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-xs"
                >
                  SAVE TRACK OVERRIDES
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CREWS & SPONSORS */}
          {activeTab === 'crewsponsors' && (
            <div className="space-y-6">
              {/* Organizers section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Add organizer form */}
                <form onSubmit={handleAddOrgSubmit} className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl space-y-4 text-left">
                  <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">➕ Add Custom Crew Organizer</span>
                  
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newOrg.name}
                      onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                      placeholder="e.g. Aman Sharma"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Operational Role</label>
                    <input
                      type="text"
                      value={newOrg.role}
                      onChange={(e) => setNewOrg({ ...newOrg, role: e.target.value })}
                      placeholder="e.g. Mainframe Moderator"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Email Coordinates</label>
                    <input
                      type="email"
                      value={newOrg.email}
                      onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                      placeholder="e.g. aman@Tachyon.org"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Instagram handle</label>
                    <input
                      type="text"
                      value={newOrg.instagram}
                      onChange={(e) => setNewOrg({ ...newOrg, instagram: e.target.value })}
                      placeholder="e.g. aman_mainframe"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-xs"
                  >
                    ADD CREW MEMBER
                  </button>
                </form>

                {/* Organizer list */}
                <div className="border border-zinc-800 bg-black/25 p-5 rounded-2xl text-left flex flex-col justify-between">
                  <div>
                    <span className="block font-bold text-white uppercase mb-4 border-b border-zinc-800/60 pb-2">📂 Active Crew Directory ({organizers.length})</span>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {organizers.map((org) => (
                        <div key={org.id} className="flex justify-between items-center border border-zinc-850 bg-black/40 p-3.5 rounded-xl">
                          <div>
                            <span className="font-bold text-zinc-200 block text-xs">{org.name}</span>
                            <span className="text-[9.5px] text-[#6db349] block">{org.role} | {org.email}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteOrg(org.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 border border-red-500/20 rounded-lg transition-colors duration-150 active:scale-95 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Sponsors Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-800/60 pt-6">
                
                {/* Add Sponsor Form */}
                <form onSubmit={handleAddSponsorSubmit} className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl space-y-4 text-left">
                  <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">➕ Add Custom Sponsor Core</span>
                  
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Company name</label>
                    <input
                      type="text"
                      value={newSponsor.name}
                      onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                      placeholder="e.g. AWS Delhi Node"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Sponsorship tier</label>
                    <select
                      value={newSponsor.tier}
                      onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                      className="w-full bg-black/60 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 cursor-pointer"
                    >
                      <option value="core">Core Sponsor</option>
                      <option value="subprocessor">Subprocessor Node</option>
                      <option value="peripheral">Peripheral Sponsor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Website URL</label>
                    <input
                      type="text"
                      value={newSponsor.website}
                      onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
                      placeholder="https://aws.amazon.com"
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-xs"
                  >
                    ADD SPONSOR ENTRY
                  </button>
                </form>

                {/* Sponsor list */}
                <div className="border border-zinc-800 bg-black/25 p-5 rounded-2xl text-left flex flex-col justify-between">
                  <div>
                    <span className="block font-bold text-white uppercase mb-4 border-b border-zinc-800/60 pb-2">📂 Active Sponsor Core Nodes ({sponsors.length})</span>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {sponsors.map((sp) => (
                        <div key={sp.id} className="flex justify-between items-center border border-zinc-850 bg-black/40 p-3.5 rounded-xl">
                          <div>
                            <span className="font-bold text-zinc-200 block text-xs">{sp.name}</span>
                            <span className="text-[9px] text-[#6db349] uppercase block">{sp.tier} | {sp.website}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSponsor(sp.id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 border border-red-500/20 rounded-lg transition-colors duration-150 active:scale-95 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: FAQ MANAGER */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 text-left">
                      <form onSubmit={handleAddFaqSubmit} className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl space-y-4">
                <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">➕ Add New FAQ Entry</span>
                
                <div>
                  <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Question Text</label>
                  <input
                    type="text"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    placeholder="e.g. Can I use AI tools in my submissions?"
                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Answer Text</label>
                  <textarea
                    rows="3"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    placeholder="Write detailed answer explanation..."
                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-xs"
                >
                  ADD FAQ ENTRY
                </button>
              </form>

              {/* FAQ List manager */}
              <div className="border border-zinc-800 bg-black/25 p-5 rounded-2xl">
                <span className="block font-bold text-white uppercase mb-4 border-b border-zinc-800/60 pb-2">📂 Active FAQ Database ({faqList.length} items)</span>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                  {faqList.map((faq, idx) => {
                    const isEditing = editingFaqIdx === idx
                    return (
                      <div key={idx} className="border border-zinc-850 bg-black/40 p-4.5 rounded-xl space-y-3">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[8px] font-bold text-zinc-500 uppercase mb-1">Edit Question</label>
                              <input
                                type="text"
                                value={editFaqData.question}
                                onChange={(e) => setEditFaqData({ ...editFaqData, question: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-zinc-500 uppercase mb-1">Edit Answer</label>
                              <textarea
                                rows="3"
                                value={editFaqData.answer}
                                onChange={(e) => setEditFaqData({ ...editFaqData, answer: e.target.value })}
                                className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveEditFaq(idx)}
                                className="bg-[#10b981] hover:bg-[#10b981]/90 text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer"
                              >
                                SAVE CHANGES
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingFaqIdx(null)}
                                className="bg-white/5 hover:bg-white/10 text-zinc-400 px-4 py-1.5 border border-zinc-800 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer"
                              >
                                CANCEL
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-1">
                              <strong className="text-zinc-200 block text-xs font-mono select-all">Q: {faq.question}</strong>
                              <p className="text-[10.5px] text-zinc-500 leading-relaxed font-mono select-all">A: {faq.answer}</p>
                            </div>
                            <div className="flex gap-2 shrink-0 select-none">
                              <button
                                onClick={() => handleStartEditFaq(idx)}
                                className="border border-zinc-800 hover:border-zinc-700 bg-white/5 text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                              >
                                EDIT
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(idx)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 border border-red-500/20 rounded-lg transition-colors duration-150 active:scale-95 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: THEME EDITOR */}
          {activeTab === 'themes' && (
            <div className="space-y-6 text-left">
              <div className="border border-zinc-800 bg-[#231f20]/45 p-6 rounded-2xl space-y-4">
                <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">🎨 Custom Colors override</span>
                <p className="text-[10px] text-zinc-400">
                  Override CSS variables to tweak the Takumi Delhi theme accents globally.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Ink Color (Dark background)</label>
                    <input
                      type="text"
                      value={themeColors['--color-ink']}
                      onChange={(e) => {
                        const updated = { ...themeColors, '--color-ink': e.target.value }
                        setThemeColors(updated)
                      }}
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Paper Color (Light Text & Primary CTAs)</label>
                    <input
                      type="text"
                      value={themeColors['--color-paper']}
                      onChange={(e) => {
                        const updated = { ...themeColors, '--color-paper': e.target.value }
                        setThemeColors(updated)
                      }}
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Terracotta Accent Color</label>
                    <input
                      type="text"
                      value={themeColors['--color-yellow-neo']}
                      onChange={(e) => {
                        const updated = {
                          ...themeColors,
                          '--color-yellow-neo': e.target.value,
                          '--color-custom-primary': e.target.value
                        }
                        setThemeColors(updated)
                      }}
                      className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        playSound('success', isMuted, volume)
                        const defaults = {
                          '--color-yellow-neo': '#F8F7F4',
                          '--color-red-neo': '#C2452D',
                          '--color-cyber-cyan': '#F8F7F4',
                          '--color-drac-purple': '#bd93f9',
                          '--color-ink': '#0A0A08',
                          '--color-paper': '#F8F7F4',
                          '--color-custom-primary': '#F8F7F4',
                          '--color-custom-bg': '#0A0A08',
                          '--color-custom-text': '#F8F7F4'
                        }
                        setThemeColors(defaults)
                      }}
                      className="w-full border border-zinc-800 hover:border-zinc-700 bg-white/5 text-zinc-300 py-2.5 font-bold uppercase rounded-full active:scale-[0.99] transition-all cursor-pointer text-[10px]"
                    >
                      RESET SYSTEM DEFAULT TAKUMI ACCENTS
                    </button>
                  </div>
                </div>
              </div>

              {/* Venue Location Section */}
              <div className="border border-zinc-800 bg-[#231f20]/45 p-6 rounded-2xl space-y-4">
                <span className="block font-bold text-white uppercase border-b border-zinc-800/60 pb-2">📍 Venue Location configuration</span>
                <p className="text-[10px] text-zinc-400">
                  Set the physical venue location for the Offline Grand Showcase. This affects ICS calendar exports and system telemetry badges.
                </p>
                <div>
                  <label className="block text-[8.5px] font-bold text-zinc-500 uppercase mb-1">Physical Venue Location</label>
                  <input
                    type="text"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    placeholder="e.g. New Delhi Central, Delhi, India"
                    className="w-full bg-black/40 border border-zinc-800 p-2.5 text-xs text-zinc-300 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REGISTRANTS DATABASE */}
          {activeTab === 'registrants' && (
            <div className="space-y-6 text-left">
              <div className="border border-zinc-800 bg-black/25 p-5 rounded-2xl">
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3 mb-4">
                  <span className="font-bold text-white uppercase">📋 Registered builder registry ({registrations.length} profiles)</span>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete all registrations permanently?')) {
                        playSound('error', isMuted, volume)
                        setRegistrations([])
                        localStorage.removeItem('Tachyon_registrations')
                      }
                    }}
                    className="text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3.5 py-1.5 border border-red-500/20 rounded-full text-[9px] font-bold uppercase transition-colors cursor-pointer"
                  >
                    WIPE DATABASE
                  </button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                  {registrations.length === 0 ? (
                    <span className="text-zinc-500 text-[10px]">No builders registered yet. Sync webhook is active.</span>
                  ) : (
                    registrations.map((reg, index) => (
                      <div key={index} className="border border-zinc-800 bg-black/40 p-4 rounded-xl relative space-y-2.5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                          <div>
                            <span className="text-zinc-500 block uppercase text-[8px] font-bold">Name</span>
                            <span className="text-zinc-200 font-bold">{reg.fullName || reg.name || 'Anonymous'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block uppercase text-[8px] font-bold">Email</span>
                            <span className="text-zinc-200 select-all truncate block">{reg.email}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block uppercase text-[8px] font-bold">Discord / Team</span>
                            <span className="text-zinc-200 select-all truncate block">{reg.discord || reg.teamName || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block uppercase text-[8px] font-bold">Pass type / Role</span>
                            <span className="text-[#6db349] font-bold uppercase tracking-wider">{reg.passType || reg.role || 'DEVELOPER'}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-zinc-850 text-[9px] text-zinc-500 flex flex-wrap gap-4 font-bold">
                          <span>GITHUB: <strong className="text-zinc-400 select-all">{reg.githubUsername || reg.github || 'N/A'}</strong></span>
                          {reg.githubLink && (
                            <span>LINK: <a href={reg.githubLink} target="_blank" rel="noopener noreferrer" className="text-[#6db349] hover:underline">{reg.githubLink}</a></span>
                          )}
                          <span>CITY: <strong className="text-zinc-400 uppercase">{reg.city || 'Delhi'}</strong></span>
                          {reg.track && <span>TRACK: <strong className="text-zinc-400 uppercase">{reg.track}</strong></span>}
                          {reg.seatNumber && <span>SEAT: <strong className="text-zinc-400 uppercase">SLOT-{reg.seatNumber}</strong></span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AUTH CONFIGURATIONS */}
          {activeTab === 'authsettings' && (
            <div className="space-y-6 text-left">
              {/* Google Client ID Form */}
              <div className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl">
                <span className="block font-bold text-white uppercase mb-1">🔑 Google OAuth Client ID</span>
                <p className="text-[10px] text-zinc-400 mb-3">Configure this key to activate Google One Tap Sign-In and Google Sign-in Buttons.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={googleClientId}
                    onChange={(e) => {
                      const val = e.target.value.trim()
                      setGoogleClientId(val)
                      localStorage.setItem('Tachyon_google_client_id', val)
                    }}
                    placeholder="e.g. xxxxxxxx.apps.googleusercontent.com"
                    className="flex-1 bg-black/40 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-350 rounded-xl outline-none focus:border-[#6db349]/50 transition-all shadow-none"
                  />
                </div>
              </div>

              {/* Admin Emails List Form */}
              <div className="border border-zinc-800 bg-[#231f20]/45 p-5 rounded-2xl">
                <span className="block font-bold text-white uppercase mb-1">🛡️ Authorized Administrator Emails</span>
                <p className="text-[10px] text-zinc-400 mb-3">Add or remove email addresses that are permitted to view this Control Console.</p>
                
                {/* Add Admin Email */}
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const emailInput = e.target.elements.newAdminEmail.value.trim().toLowerCase()
                  if (!emailInput) return
                  if (adminEmails.includes(emailInput)) {
                    alert('Email is already in the administrators list.')
                    return
                  }
                  playSound('success', isMuted, volume)
                  const updated = [...adminEmails, emailInput]
                  setAdminEmails(updated)
                  e.target.reset()
                }} className="flex gap-3 mb-4">
                  <input
                    name="newAdminEmail"
                    type="email"
                    required
                    placeholder="e.g. admin@tachyonindia.org"
                    className="flex-1 bg-black/40 border border-zinc-800 px-3.5 py-2 text-xs text-zinc-350 rounded-xl outline-none focus:border-[#6db349]/50 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-[#6db349] hover:bg-[#6db349]/90 text-black px-4.5 py-2 font-bold uppercase rounded-full transition-all cursor-pointer"
                  >
                    ADD ADMIN
                  </button>
                </form>

                {/* Admins Table */}
                <div className="border border-zinc-850 bg-black/40 max-h-[220px] overflow-y-auto rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-850 bg-black/25">
                        <th className="p-3 text-zinc-500 font-bold uppercase text-[9px]">Admin Email</th>
                        <th className="p-3 text-zinc-500 font-bold uppercase text-[9px] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminEmails.map((email) => (
                        <tr key={email} className="border-b border-zinc-850 hover:bg-black/15">
                          <td className="p-3 text-zinc-200 select-all font-bold">{email}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (adminEmails.length <= 1) {
                                  alert('Cannot delete the last remaining administrator!')
                                  return
                                }
                                if (window.confirm(`Revoke administrator permissions for '${email}'?`)) {
                                  playSound('error', isMuted, volume)
                                  const updated = adminEmails.filter(e => e !== email)
                                  setAdminEmails(updated)
                                }
                              }}
                              className="text-red-400 hover:text-red-300 font-bold uppercase text-[9px] transition-colors border border-red-500/20 hover:border-red-500/35 bg-red-500/10 px-3.5 py-1 rounded-full cursor-pointer"
                            >
                              REVOKE
                            </button>
                          </td>
                        </tr>
                      ))}
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
