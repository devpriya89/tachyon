import React, { useState, useEffect } from 'react'
import { Filter, Plus, MessageSquare, UserPlus, LogOut, Trash2 } from 'lucide-react'
import { playSound } from '../utils/audio'

export function TeamFinder({ siteTheme, isMuted, volume, ticketData, listings, setListings }) {
  const [filterTrack, setFilterTrack] = useState('ALL')
  const [filterRole, setFilterRole] = useState('ALL')
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }
  
  // Custom posting form states
  const [showPostForm, setShowPostForm] = useState(false)
  const [postData, setPostData] = useState({
    teamName: '',
    name: '',
    role: 'developer',
    track: 'ai',
    skills: '',
    pitch: '',
    discord: ''
  })

  // Auto fill form if ticket exists
  useEffect(() => {
    if (ticketData) {
      setPostData(prev => ({
        ...prev,
        name: ticketData.name || '',
        role: ticketData.role || 'developer',
        track: ticketData.track || 'ai',
        skills: ticketData.skills ? ticketData.skills.join(', ') : '',
        discord: ticketData.github ? `${ticketData.github}#0000` : '',
        teamName: ticketData.name ? `${ticketData.name}'s Squad` : ''
      }))
    }
  }, [ticketData])

  // Helper: check if a user is currently in any team
  const getUserTeam = () => {
    if (!ticketData || !ticketData.github) return null
    return listings.find(listing => 
      listing.members && listing.members.some(member => 
        member.github && member.github.toLowerCase() === ticketData.github.toLowerCase()
      )
    )
  }

  const userCurrentTeam = getUserTeam()

  // Google Sheets Webhook Sync Helper
  const syncJoinToGoogleSheet = async (teamId, memberName, memberEmail, memberRole, memberTrack) => {
    const googleSheetUrl = localStorage.getItem('hacklabify_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
    if (!localStorage.getItem('hacklabify_google_sheet_url')) {
      localStorage.setItem('hacklabify_google_sheet_url', 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec')
    }
    
    try {
      await fetch(googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "join_team",
          teamId: teamId,
          name: memberName,
          email: memberEmail,
          role: memberRole,
          track: memberTrack
        })
      })
      console.log("Matchmaking sheets sync complete!")
    } catch (err) {
      console.error("Matchmaking sheets sync failed:", err)
    }
  }

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (!postData.name || !postData.pitch || !postData.discord || !postData.teamName) {
      playSound('error', isMuted, volume)
      alert('Please fill in all required fields (Team Name, Builder Name, Pitch, Discord).')
      return
    }

    if (userCurrentTeam) {
      playSound('error', isMuted, volume)
      alert('You are already in a team! Leave or disband your current team before creating a new one.')
      return
    }

    playSound('success', isMuted, volume)
    const newTeamId = 'team-' + Date.now()
    
    // Creator is added as first member
    const creatorMember = {
      name: postData.name,
      github: ticketData ? ticketData.github : 'guest-' + Date.now(),
      role: postData.role,
      email: ticketData ? ticketData.email : 'guest@hacklabify.com'
    }

    const newListing = {
      id: newTeamId,
      teamName: postData.teamName,
      creatorGithub: creatorMember.github,
      name: postData.name,
      role: postData.role,
      track: postData.track,
      skills: postData.skills ? postData.skills.split(',').map(s => s.trim()) : [],
      pitch: postData.pitch,
      discord: postData.discord,
      date: 'Just now',
      members: [creatorMember]
    }

    const updated = [newListing, ...listings]
    setListings(updated)
    localStorage.setItem('hacklabify_team_listings', JSON.stringify(updated))
    
    // Sync creation to google sheets
    syncJoinToGoogleSheet(newTeamId, creatorMember.name, creatorMember.email, creatorMember.role, postData.track)

    // Reset form
    setShowPostForm(false)
    setPostData(prev => ({
      ...prev,
      pitch: ''
    }))
  }

  // Join Team Handler
  const handleJoinTeam = (teamId) => {
    if (!ticketData) {
      playSound('error', isMuted, volume)
      alert('Please register and secure your builder pass before joining a team!')
      return
    }

    if (userCurrentTeam) {
      playSound('error', isMuted, volume)
      alert('You are already in a team! You must leave your current team first.')
      return
    }

    const team = listings.find(t => t.id === teamId)
    if (!team) return

    const currentMembers = team.members || []
    if (currentMembers.length >= 4) {
      playSound('error', isMuted, volume)
      alert('This squad is already full (maximum 4 members)!')
      return
    }

    playSound('success', isMuted, volume)
    const newMember = {
      name: ticketData.name,
      github: ticketData.github,
      role: ticketData.role,
      email: ticketData.email
    }

    const updated = listings.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          members: [...currentMembers, newMember]
        }
      }
      return t
    })

    setListings(updated)
    localStorage.setItem('hacklabify_team_listings', JSON.stringify(updated))

    // Sync member join to google sheets
    syncJoinToGoogleSheet(teamId, newMember.name, newMember.email, newMember.role, team.track)
  }

  // Leave Team Handler
  const handleLeaveTeam = (teamId) => {
    if (!ticketData || !ticketData.github) return

    playSound('click', isMuted, volume)
    const team = listings.find(t => t.id === teamId)
    if (!team) return

    if (team.creatorGithub && team.creatorGithub.toLowerCase() === ticketData.github.toLowerCase()) {
      handleDisbandTeam(teamId)
      return
    }

    const updated = listings.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          members: (t.members || []).filter(m => m.github.toLowerCase() !== ticketData.github.toLowerCase())
        }
      }
      return t
    })

    setListings(updated)
    localStorage.setItem('hacklabify_team_listings', JSON.stringify(updated))
  }

  // Disband Team Handler
  const handleDisbandTeam = (teamId) => {
    if (!confirm('Are you sure you want to disband and delete your team pitch?')) return

    playSound('click', isMuted, volume)
    const updated = listings.filter(t => t.id !== teamId)
    setListings(updated)
    localStorage.setItem('hacklabify_team_listings', JSON.stringify(updated))
  }

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesTrack = filterTrack === 'ALL' || item.track === filterTrack.toLowerCase()
    const matchesRole = filterRole === 'ALL' || item.role === filterRole.toLowerCase()
    return matchesTrack && matchesRole
  })

  // Theme designs mappings
  const themeStyles = {
    amber: { bg: 'bg-yellow-400', text: 'text-black' },
    crimson: { bg: 'bg-red-500', text: 'text-white' },
    acid: { bg: 'bg-green-400', text: 'text-black' },
    void: { bg: 'bg-purple-600', text: 'text-white' },
    cyberpunk: { bg: 'bg-cyan-400', text: 'text-black' },
    dracula: { bg: 'bg-pink-400', text: 'text-black' },
    custom: { bg: 'bg-[var(--color-custom-primary)]', text: 'text-[var(--color-custom-text)]' }
  }

  const currentTheme = themeStyles[siteTheme] || themeStyles.amber

  return (
    <section id="teamfinder" className="py-24 border-b border-white/5 bg-transparent relative max-w-[1400px] mx-auto w-full">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div>
            <div className="inline-block border border-white/10 bg-white/5 text-zinc-300 font-mono text-[10px] font-bold uppercase px-3 py-1 shadow-md rounded-full mb-4">
              Matchmaking console // Lobby
            </div>
            <h2 className="text-4xl sm:text-6xl font-syne font-black uppercase tracking-tight text-white">
              TEAM FINDER LOBBY
            </h2>
            <p className="mt-3 text-sm font-bold text-zinc-500 max-w-md font-mono leading-relaxed">
              Find partners to form a team, browse diagnostic skills profiles, or post your project pitch to recruit hackers.
            </p>
          </div>

          {!userCurrentTeam ? (
            <button
              onClick={() => {
                playSound('click', isMuted, volume)
                setShowPostForm(!showPostForm)
              }}
              className="flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-full font-mono text-xs font-bold text-white cursor-pointer transition-all shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4 text-white" /> {showPostForm ? 'CLOSE CREATOR' : 'POST YOUR PITCH'}
            </button>
          ) : (
            <div className="border border-red-500/20 bg-red-500/5 text-red-400 font-mono text-[10.5px] font-bold uppercase p-3.5 shadow-xl rounded-2xl flex flex-col items-start gap-1 select-none">
              <span>🛡️ STATUS: ACTIVE MEMBER</span>
              <span>SQUAD: {userCurrentTeam.teamName || 'Your Team'}</span>
            </div>
          )}
        </div>

        {/* Post Pitch Creator form modal */}
        {showPostForm && !userCurrentTeam && (
          <form onSubmit={handlePostSubmit} className="bg-zinc-900/40 border border-white/5 p-6 md:p-8 shadow-2xl max-w-2xl mx-auto mb-12 space-y-4 rounded-2xl text-left backdrop-blur-md">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center select-none font-mono">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-red-400">
                Inbound lobby transmitter // pitch form
              </span>
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[10px] text-zinc-400 uppercase mb-1">Squad / Team Name *</label>
              <input
                type="text"
                required
                value={postData.teamName}
                onChange={(e) => setPostData({ ...postData, teamName: e.target.value })}
                placeholder="e.g. Cyber Sentinels"
                className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="font-mono text-[10px] text-zinc-400 uppercase mb-1">Builder Name *</label>
                <input
                  type="text"
                  required
                  value={postData.name}
                  onChange={(e) => setPostData({ ...postData, name: e.target.value })}
                  placeholder="e.g. Arjun Sharma"
                  className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[10px] text-zinc-400 uppercase mb-1">Target Role *</label>
                <select
                  value={postData.role}
                  onChange={(e) => setPostData({ ...postData, role: e.target.value })}
                  className="bg-zinc-950/60 border border-white/10 text-white rounded-xl p-2.5 font-mono text-xs outline-none focus:border-white cursor-pointer shadow-md w-full"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="generalist">Generalist</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[10px] text-zinc-400 uppercase mb-1">Chosen Track *</label>
                <select
                  value={postData.track}
                  onChange={(e) => setPostData({ ...postData, track: e.target.value })}
                  className="bg-zinc-950/60 border border-white/10 text-white rounded-xl p-2.5 font-mono text-xs outline-none focus:border-white cursor-pointer shadow-md w-full"
                >
                  <option value="ai">AI</option>
                  <option value="cyber">CYBER</option>
                  <option value="game">GAME</option>
                  <option value="web">WEB</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-mono text-[10px] text-zinc-400 uppercase mb-1">Discord Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. user#1234"
                  value={postData.discord}
                  onChange={(e) => setPostData({ ...postData, discord: e.target.value })}
                  className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[10px] text-zinc-400 uppercase mb-1">Key Skills (separated by commas)</label>
                <input
                  type="text"
                  placeholder="e.g. Figma, Rust, WebRTC"
                  value={postData.skills}
                  onChange={(e) => setPostData({ ...postData, skills: e.target.value })}
                  className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[10px] text-zinc-400 uppercase mb-1">Elevator Pitch (What are you building?) *</label>
              <textarea
                rows={3}
                required
                value={postData.pitch}
                onChange={(e) => setPostData({ ...postData, pitch: e.target.value })}
                placeholder="Brief summary of your project plan and what role you need filled..."
                className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white resize-none leading-relaxed transition-all shadow-inner w-full"
              />
            </div>

            <button
              type="submit"
              className={`w-full border border-white/10 ${currentTheme.bg} ${currentTheme.text} px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase cursor-pointer shadow-lg active:scale-95 transition-all`}
            >
              TRANSMIT PITCH TO LOBBY
            </button>
          </form>
        )}

        {/* Filter Controls HUD */}
        <div className="border border-white/5 bg-zinc-900/40 p-4 shadow-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between select-none rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs font-bold">
            <Filter className="w-4 h-4 text-zinc-400" /> FILTER BY ATTRIBUTES:
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial text-left">
              <span className="font-mono text-[9px] text-zinc-500 uppercase">Track:</span>
              <select
                value={filterTrack}
                onChange={(e) => {
                  playSound('click', isMuted, volume)
                  setFilterTrack(e.target.value)
                }}
                className="bg-zinc-950/60 border border-white/10 text-white rounded-lg p-2 font-mono text-[10px] font-bold uppercase outline-none focus:border-white cursor-pointer shadow-md"
              >
                <option value="ALL">ALL TRACKS</option>
                <option value="AI">AI</option>
                <option value="CYBER">CYBER</option>
                <option value="GAME">GAME</option>
                <option value="WEB">WEB</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 md:flex-initial text-left">
              <span className="font-mono text-[9px] text-zinc-500 uppercase">Role:</span>
              <select
                value={filterRole}
                onChange={(e) => {
                  playSound('click', isMuted, volume)
                  setFilterRole(e.target.value)
                }}
                className="bg-zinc-950/60 border border-white/10 text-white rounded-lg p-2 font-mono text-[10px] font-bold uppercase outline-none focus:border-white cursor-pointer shadow-md"
              >
                <option value="ALL">ALL ROLES</option>
                <option value="DEVELOPER">DEVELOPERS</option>
                <option value="DESIGNER">DESIGNERS</option>
                <option value="RESEARCHER">RESEARCHERS</option>
                <option value="GENERALIST">GENERALISTS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Board Grid */}
        {filteredListings.length === 0 ? (
          <div className="border border-white/5 border-dashed rounded-xl p-12 text-center text-zinc-500 font-mono text-xs select-none bg-zinc-900/10 shadow-2xl">
            No active listings found matching the select filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {filteredListings.map((item) => {
              const teamMembers = item.members || []
              const hasJoinedThisTeam = ticketData && teamMembers.some(m => m.github && m.github.toLowerCase() === ticketData.github.toLowerCase())
              const isCreator = ticketData && item.creatorGithub && item.creatorGithub.toLowerCase() === ticketData.github.toLowerCase()
              
              const trackThemeMap = {
                ai: 'bg-yellow-500 text-yellow-400',
                cyber: 'bg-red-500 text-red-400',
                game: 'bg-green-500 text-green-400',
                web: 'bg-blue-500 text-blue-400'
              }
              const trackColor = trackThemeMap[item.track.toLowerCase()] || 'bg-yellow-500 text-yellow-400'

              return (
                <div
                  key={item.id}
                  onMouseMove={handleMouseMove}
                  className="bg-zinc-900/30 border border-white/5 p-6 pl-8 flex flex-col justify-between hover:border-white/10 hover:bg-zinc-900/45 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-300 rounded-2xl text-left relative overflow-hidden cyber-glass-interactive"
                >
                  {/* Left-edge color marker */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${trackColor.split(' ')[0]}`}></div>

                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4 select-none">
                      <div>
                        <h4 className="font-syne font-bold uppercase text-base text-white">
                          {item.teamName || `${item.name}'s Squad`}
                        </h4>
                        <span className="font-mono text-[9px] font-bold text-zinc-500">POSTED BY {item.name.toUpperCase()} // {item.date}</span>
                      </div>

                      <div className="flex flex-col items-end gap-1 font-mono text-[9px]">
                        <span className="px-2.5 py-0.5 border border-white/10 bg-white/5 text-zinc-300 font-bold uppercase block rounded-lg shadow-sm">
                          {item.role.toUpperCase()}
                        </span>
                        <span className={`font-bold uppercase block tracking-wider mt-1 ${trackColor.split(' ')[1]}`}>{item.track.toUpperCase()}</span>
                      </div>
                    </div>

                    <p className="text-xs font-normal text-zinc-400 leading-relaxed font-mono mb-4">
                      {item.pitch}
                    </p>
                  </div>

                  <div>
                    {/* Skill tags */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4 select-none">
                        {item.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 border border-white/5 bg-white/5 font-mono text-[9px] font-bold uppercase rounded-lg text-sky-400 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Members List */}
                    <div className="mb-4 border border-white/5 bg-zinc-950/40 p-3.5 rounded-xl">
                      <div className="flex justify-between items-center mb-2 font-mono text-[9.5px] font-bold uppercase text-zinc-500 border-b border-white/5 pb-1">
                        <span>👥 Squad Members</span>
                        <span>{teamMembers.length} / 4</span>
                      </div>
                      <div className="space-y-1.5 font-mono text-[10px] text-zinc-300">
                        {teamMembers.length === 0 ? (
                          <span className="text-zinc-600 italic">No members yet.</span>
                        ) : (
                          teamMembers.map((m, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="font-bold">
                                {m.name} {m.github && ticketData && m.github.toLowerCase() === ticketData.github.toLowerCase() && '(You)'}
                              </span>
                              <span className="px-1.5 border border-white/5 bg-white/5 text-[8px] font-bold uppercase rounded-lg">
                                {m.role}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Connect details */}
                    <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row gap-3 justify-between sm:items-center select-text font-mono text-[10px] text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold uppercase tracking-wider text-zinc-400">DISCORD:</span>
                        <span className="flex items-center justify-center gap-1 bg-white/5 border border-white/10 text-white font-bold px-2.5 py-0.5 select-all cursor-copy rounded-lg w-fit hover:bg-white/10 transition-colors text-[9px] shadow-sm">
                          <MessageSquare className="w-3 h-3 inline text-white" /> {item.discord}
                        </span>
                      </div>

                      {/* Join / Leave / Disband Actions */}
                      <div className="flex items-center select-none">
                        {isCreator ? (
                          <button
                            onClick={() => handleDisbandTeam(item.id)}
                            className="flex items-center gap-1 border border-white/10 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold px-3.5 py-1.5 text-[9.5px] uppercase shadow-md active:translate-y-[0.5px] transition-all cursor-pointer rounded-full"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Disband Squad
                          </button>
                        ) : hasJoinedThisTeam ? (
                          <button
                            onClick={() => handleLeaveTeam(item.id)}
                            className="flex items-center gap-1 border border-white/10 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold px-3.5 py-1.5 text-[9.5px] uppercase shadow-md active:translate-y-[0.5px] transition-all cursor-pointer rounded-full"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Leave Squad
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinTeam(item.id)}
                            disabled={!!userCurrentTeam || teamMembers.length >= 4}
                            className={`flex items-center gap-1 border border-white/10 px-3.5 py-1.5 text-[9.5px] uppercase font-bold rounded-full transition-all ${
                              teamMembers.length >= 4
                                ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                                : userCurrentTeam
                                ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                                : 'bg-white hover:bg-zinc-100 text-black shadow-md cursor-pointer active:scale-95'
                            }`}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            {teamMembers.length >= 4 ? 'Squad Full' : userCurrentTeam ? 'In Another Squad' : 'Join Squad'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
export default TeamFinder
