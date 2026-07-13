import React, { useState, useEffect } from 'react'
import { Filter, Plus, MessageSquare, UserPlus, LogOut, Trash2 } from 'lucide-react'
import { playSound } from '../utils/audio'

export function TeamFinder({ siteTheme, isMuted, volume, ticketData, listings, setListings }) {
  const [filterTrack, setFilterTrack] = useState('ALL')
  const [filterRole, setFilterRole] = useState('ALL')
  
  // Custom posting form states
  const [showPostForm, setShowPostForm] = useState(false)
  const [postData, setPostData] = useState({
    teamName: '',
    name: '',
    role: 'developer',
    track: 'ai',
    skills: '',
    pitch: '',
    discord: '',
    githubLink: ''
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
        githubLink: ticketData.githubLink || '',
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
    const googleSheetUrl = localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
    if (!localStorage.getItem('Tachyon_google_sheet_url')) {
      localStorage.setItem('Tachyon_google_sheet_url', 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec')
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
      email: ticketData ? ticketData.email : 'guest@Tachyon.com'
    }

    const newListing = {
      id: newTeamId,
      teamName: postData.teamName,
      creatorGithub: creatorMember.github,
      creatorGithubLink: postData.githubLink || '',
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
    localStorage.setItem('Tachyon_team_listings', JSON.stringify(updated))
    
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
    localStorage.setItem('Tachyon_team_listings', JSON.stringify(updated))

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
    localStorage.setItem('Tachyon_team_listings', JSON.stringify(updated))
  }

  // Disband Team Handler
  const handleDisbandTeam = (teamId) => {
    if (!confirm('Are you sure you want to disband and delete your team pitch?')) return

    playSound('click', isMuted, volume)
    const updated = listings.filter(t => t.id !== teamId)
    setListings(updated)
    localStorage.setItem('Tachyon_team_listings', JSON.stringify(updated))
  }

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesTrack = filterTrack === 'ALL' || item.track === filterTrack.toLowerCase()
    const matchesRole = filterRole === 'ALL' || item.role === filterRole.toLowerCase()
    return matchesTrack && matchesRole
  })

  return (
    <section id="teamfinder" className="py-24 border-b border-zinc-800/80 bg-transparent relative max-w-[1400px] mx-auto w-full">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#6db349] font-extrabold mb-4">
              SYS:03 — MATCHMAKING PROTOCOL // LOBBY
            </div>
            <h2 className="text-3xl font-extrabold text-white uppercase">
              Team Finder
            </h2>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-md font-semibold">
              Find partners to form a team, browse diagnostic skills profiles, or post your project pitch to recruit hackers.
            </p>
          </div>

          {!userCurrentTeam ? (
            <button
              onClick={() => {
                playSound('click', isMuted, volume)
                setShowPostForm(!showPostForm)
              }}
              className={`flex items-center gap-2 border px-5 py-3 rounded-full text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all shrink-0 ${
                showPostForm 
                  ? 'border-[#C2452D]/35 bg-[#C2452D]/5 text-[#C2452D] hover:bg-[#C2452D]/10' 
                  : 'border-zinc-800 hover:border-zinc-650 bg-black/25 text-zinc-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> {showPostForm ? 'Close Creator' : 'Post Your Pitch'}
            </button>
          ) : (
            <div className="border border-zinc-850 bg-[#231f20]/40 text-zinc-400 p-3.5 rounded-xl flex flex-col items-start gap-1 select-none text-[9px] uppercase tracking-wider font-bold">
              <span>STATUS: ACTIVE MEMBER</span>
              <span className="text-[#6db349] font-extrabold">SQUAD: {userCurrentTeam.teamName || 'Your Team'}</span>
            </div>
          )}
        </div>

        {/* Post Pitch Creator form modal */}
        {showPostForm && !userCurrentTeam && (
          <form onSubmit={handlePostSubmit} className="bg-[#231f20]/30 border border-zinc-800/80 p-6 md:p-8 max-w-2xl mx-auto mb-12 space-y-4 rounded-2xl text-left shadow-2xl">
            <div className="border-b border-zinc-800/60 pb-3 flex justify-between items-center select-none font-bold text-[9px]">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                NODE: PITCH_TRANSMITTER // INPUT
              </span>
              <span className="w-1.5 h-1.5 bg-[#6db349] rounded-full inline-block animate-pulse"></span>
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Squad / Team Name *</label>
              <input
                type="text"
                required
                value={postData.teamName}
                onChange={(e) => setPostData({ ...postData, teamName: e.target.value })}
                placeholder="e.g. Cyber Sentinels"
                className="bg-transparent border border-zinc-800 p-2.5 rounded-xl text-zinc-350 text-xs outline-none focus:border-[#6db349]/50 transition-all placeholder:text-zinc-700 w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Builder Name *</label>
                <input
                  type="text"
                  required
                  value={postData.name}
                  onChange={(e) => setPostData({ ...postData, name: e.target.value })}
                  placeholder="e.g. Arjun Sharma"
                  className="bg-transparent border border-zinc-800 p-2.5 rounded-xl text-zinc-350 text-xs outline-none focus:border-[#6db349]/50 transition-all placeholder:text-zinc-700 w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Target Role *</label>
                <select
                  value={postData.role}
                  onChange={(e) => setPostData({ ...postData, role: e.target.value })}
                  className="bg-black/60 border border-zinc-800 text-zinc-350 rounded-xl p-2.5 text-xs outline-none focus:border-[#6db349]/50 cursor-pointer w-full appearance-none px-4"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="generalist">Generalist</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Chosen Track *</label>
                <select
                  value={postData.track}
                  onChange={(e) => setPostData({ ...postData, track: e.target.value })}
                  className="bg-black/60 border border-zinc-800 text-zinc-350 rounded-xl p-2.5 text-xs outline-none focus:border-[#6db349]/50 cursor-pointer w-full appearance-none px-4"
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
                <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Discord Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. user#1234"
                  value={postData.discord}
                  onChange={(e) => setPostData({ ...postData, discord: e.target.value })}
                  className="bg-transparent border border-zinc-800 p-2.5 rounded-xl text-zinc-350 text-xs outline-none focus:border-[#6db349]/50 transition-all placeholder:text-zinc-700 w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Key Skills (separated by commas)</label>
                <input
                  type="text"
                  placeholder="e.g. Figma, Rust, WebRTC"
                  value={postData.skills}
                  onChange={(e) => setPostData({ ...postData, skills: e.target.value })}
                  className="bg-transparent border border-zinc-800 p-2.5 rounded-xl text-zinc-350 text-xs outline-none focus:border-[#6db349]/50 transition-all placeholder:text-zinc-700 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">GitHub Repository / Profile Link (Optional)</label>
              <input
                type="url"
                value={postData.githubLink}
                onChange={(e) => setPostData({ ...postData, githubLink: e.target.value })}
                placeholder="e.g. https://github.com/sharma_arjun/project"
                className="bg-transparent border border-zinc-800 p-2.5 rounded-xl text-zinc-350 text-xs outline-none focus:border-[#6db349]/50 transition-all placeholder:text-zinc-700 w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Elevator Pitch (What are you building?) *</label>
              <textarea
                rows={3}
                required
                value={postData.pitch}
                onChange={(e) => setPostData({ ...postData, pitch: e.target.value })}
                placeholder="Brief summary of your project plan and what role you need filled..."
                className="bg-transparent border border-zinc-800 p-2.5 rounded-xl text-zinc-350 text-xs outline-none focus:border-[#6db349]/50 resize-none leading-relaxed transition-all placeholder:text-zinc-700 w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6db349] hover:bg-[#6db349]/90 text-black px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_12px_rgba(109,179,73,0.3)]"
            >
              Transmit Pitch To Lobby
            </button>
          </form>
        )}

        {/* Filter Controls */}
        <div className="border border-zinc-800 bg-[#231f20]/30 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between select-none rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 font-bold text-[9px] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-zinc-500" /> FILTER:
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial text-left">
              <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-bold">Track:</span>
              <select
                value={filterTrack}
                onChange={(e) => {
                  playSound('click', isMuted, volume)
                  setFilterTrack(e.target.value)
                }}
                className="bg-black/60 border border-zinc-850 text-zinc-350 rounded-xl p-2 text-[10px] uppercase outline-none focus:border-[#6db349]/50 cursor-pointer"
              >
                <option value="ALL">ALL TRACKS</option>
                <option value="AI">AI</option>
                <option value="CYBER">CYBER</option>
                <option value="GAME">GAME</option>
                <option value="WEB">WEB</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 md:flex-initial text-left">
              <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-bold">Role:</span>
              <select
                value={filterRole}
                onChange={(e) => {
                  playSound('click', isMuted, volume)
                  setFilterRole(e.target.value)
                }}
                className="bg-black/60 border border-zinc-850 text-zinc-350 rounded-xl p-2 text-[10px] uppercase outline-none focus:border-[#6db349]/50 cursor-pointer"
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
          <div className="border border-zinc-800 border-dashed rounded-2xl p-12 text-center text-zinc-500 text-[10px] uppercase tracking-wider select-none bg-black/10 font-bold">
            No active listings found matching the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {filteredListings.map((item) => {
              const teamMembers = item.members || []
              const hasJoinedThisTeam = ticketData && teamMembers.some(m => m.github && m.github.toLowerCase() === ticketData.github.toLowerCase())
              const isCreator = ticketData && item.creatorGithub && item.creatorGithub.toLowerCase() === ticketData.github.toLowerCase()

              return (
                <div
                  key={item.id}
                  className="bg-[#231f20]/30 border border-zinc-800/80 p-6 flex flex-col justify-between transition-all rounded-2xl text-left relative hover:border-[#6db349]/40 hover:bg-[#231f20]/45 hover:shadow-[0_10px_25px_rgba(109,179,73,0.06)]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-zinc-800/60 pb-3 mb-4 select-none">
                      <div>
                        <h4 className="font-bold uppercase text-sm text-white tracking-wide">
                          {item.teamName || `${item.name}'s Squad`}
                        </h4>
                        <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-bold">
                          POSTED BY {item.name.toUpperCase()} — {item.date}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 text-[8px] font-bold">
                        <span className="px-2.5 py-0.5 border border-zinc-800 text-zinc-500 uppercase rounded-full">
                          {item.role.toUpperCase()}
                        </span>
                        <span className="text-[#6db349] uppercase tracking-wider">{item.track.toUpperCase()}</span>
                      </div>
                    </div>

                    <p className="text-zinc-400 text-xs leading-relaxed mb-4">
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
                            className="px-2.5 py-0.5 border border-zinc-850 bg-black/35 text-[8px] uppercase rounded-full text-zinc-500 font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Members List */}
                    <div className="mb-4 border border-zinc-850 bg-black/25 p-3.5 rounded-xl">
                      <div className="flex justify-between items-center mb-2 text-[8px] uppercase tracking-wider text-zinc-500 border-b border-zinc-850 pb-1.5 font-bold">
                        <span>NODE: SQUAD_MEMBERS</span>
                        <span>{teamMembers.length} / 4</span>
                      </div>
                      <div className="space-y-1.5 text-[10px] text-zinc-400 font-semibold">
                        {teamMembers.length === 0 ? (
                          <span className="text-zinc-650">No members yet.</span>
                        ) : (
                          teamMembers.map((m, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span>
                                {m.name} {m.github && ticketData && m.github.toLowerCase() === ticketData.github.toLowerCase() && '(You)'}
                              </span>
                              <span className="px-2 py-0.5 border border-zinc-850 text-[8px] uppercase rounded-full text-zinc-500 font-bold">
                                {m.role}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Connect details */}
                    <div className="border-t border-zinc-800/60 pt-4 flex flex-col sm:flex-row gap-3 justify-between sm:items-center select-text text-[10px] text-zinc-400 font-bold">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="uppercase tracking-wider text-zinc-500">DISCORD:</span>
                          <span className="flex items-center justify-center gap-1 border border-zinc-850 bg-black/40 text-zinc-400 px-2.5 py-1 select-all cursor-copy rounded-full w-fit transition-colors text-[9px]">
                            <MessageSquare className="w-3 h-3 inline text-zinc-500" /> {item.discord}
                          </span>
                        </div>
                        {item.creatorGithubLink && (
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase tracking-wider text-zinc-500">GITHUB:</span>
                            <a
                              href={item.creatorGithubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 border border-zinc-850 bg-black/40 text-[#6db349] hover:text-[#6db349]/90 px-2.5 py-1 rounded-full w-fit transition-colors text-[9px] hover:bg-[#6db349]/10 font-bold"
                            >
                              Link ↗
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Join / Leave / Disband Actions */}
                      <div className="flex items-center select-none">
                        {isCreator ? (
                          <button
                            onClick={() => handleDisbandTeam(item.id)}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black/20 text-zinc-400 hover:text-white px-3.5 py-1.5 text-[9px] uppercase tracking-wider transition-colors cursor-pointer rounded-full font-bold"
                          >
                            <Trash2 className="w-3 h-3" /> Disband
                          </button>
                        ) : hasJoinedThisTeam ? (
                          <button
                            onClick={() => handleLeaveTeam(item.id)}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black/20 text-zinc-400 hover:text-white px-3.5 py-1.5 text-[9px] uppercase tracking-wider transition-colors cursor-pointer rounded-full font-bold"
                          >
                            <LogOut className="w-3 h-3" /> Leave Squad
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinTeam(item.id)}
                            disabled={!!userCurrentTeam || teamMembers.length >= 4}
                            className={`flex items-center gap-1 px-3.5 py-1.5 text-[9px] uppercase tracking-wider rounded-full transition-all font-bold ${
                              teamMembers.length >= 4
                                ? 'border border-zinc-850 text-zinc-650 cursor-not-allowed bg-black/10'
                                : userCurrentTeam
                                ? 'border border-zinc-850 text-zinc-650 cursor-not-allowed bg-black/10'
                                : 'bg-[#6db349] hover:bg-[#6db349]/90 text-black cursor-pointer shadow-md'
                            }`}
                          >
                            <UserPlus className="w-3 h-3" />
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
