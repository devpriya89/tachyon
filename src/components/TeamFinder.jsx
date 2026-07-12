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
    <section id="teamfinder" className="py-24 border-b border-white/5 bg-transparent relative max-w-[1400px] mx-auto w-full">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none text-left">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-4">
              SYS:03 — MATCHMAKING PROTOCOL // LOBBY
            </div>
            <h2 className="font-syne font-black text-2xl text-white uppercase">
              TEAM FINDER
            </h2>
            <p className="mt-3 font-mono text-[10px] text-white/25 leading-relaxed max-w-md">
              Find partners to form a team, browse diagnostic skills profiles, or post your project pitch to recruit hackers.
            </p>
          </div>

          {!userCurrentTeam ? (
            <button
              onClick={() => {
                playSound('click', isMuted, volume)
                setShowPostForm(!showPostForm)
              }}
              className="flex items-center gap-2 border border-white/8 bg-transparent hover:bg-white/[0.03] px-5 py-3 rounded-none font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 cursor-pointer transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-white/30" /> {showPostForm ? 'CLOSE CREATOR' : 'POST YOUR PITCH'}
            </button>
          ) : (
            <div className="border border-white/8 bg-white/[0.02] text-white/40 font-mono text-[9px] uppercase tracking-[0.2em] p-3.5 rounded-none flex flex-col items-start gap-1 select-none">
              <span>STATUS: ACTIVE MEMBER</span>
              <span className="text-white/20">SQUAD: {userCurrentTeam.teamName || 'Your Team'}</span>
            </div>
          )}
        </div>

        {/* Post Pitch Creator form modal */}
        {showPostForm && !userCurrentTeam && (
          <form onSubmit={handlePostSubmit} className="bg-white/[0.02] border border-white/5 p-6 md:p-8 max-w-2xl mx-auto mb-12 space-y-4 rounded-none text-left">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center select-none font-mono">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                NODE: PITCH_TRANSMITTER // INPUT
              </span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-none inline-block animate-pulse"></span>
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5">Squad / Team Name *</label>
              <input
                type="text"
                required
                value={postData.teamName}
                onChange={(e) => setPostData({ ...postData, teamName: e.target.value })}
                placeholder="e.g. Cyber Sentinels"
                className="bg-transparent border border-white/8 p-2.5 rounded-none text-white/60 font-mono text-xs outline-none focus:border-white/20 transition-colors placeholder:text-white/15 w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5">Builder Name *</label>
                <input
                  type="text"
                  required
                  value={postData.name}
                  onChange={(e) => setPostData({ ...postData, name: e.target.value })}
                  placeholder="e.g. Arjun Sharma"
                  className="bg-transparent border border-white/8 p-2.5 rounded-none text-white/60 font-mono text-xs outline-none focus:border-white/20 transition-colors placeholder:text-white/15 w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5">Target Role *</label>
                <select
                  value={postData.role}
                  onChange={(e) => setPostData({ ...postData, role: e.target.value })}
                  className="bg-[#0A0A08] border border-white/8 text-white/60 rounded-none p-2.5 font-mono text-xs outline-none focus:border-white/20 cursor-pointer w-full"
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="generalist">Generalist</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5">Chosen Track *</label>
                <select
                  value={postData.track}
                  onChange={(e) => setPostData({ ...postData, track: e.target.value })}
                  className="bg-[#0A0A08] border border-white/8 text-white/60 rounded-none p-2.5 font-mono text-xs outline-none focus:border-white/20 cursor-pointer w-full"
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
                <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5">Discord Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. user#1234"
                  value={postData.discord}
                  onChange={(e) => setPostData({ ...postData, discord: e.target.value })}
                  className="bg-transparent border border-white/8 p-2.5 rounded-none text-white/60 font-mono text-xs outline-none focus:border-white/20 transition-colors placeholder:text-white/15 w-full"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5">Key Skills (separated by commas)</label>
                <input
                  type="text"
                  placeholder="e.g. Figma, Rust, WebRTC"
                  value={postData.skills}
                  onChange={(e) => setPostData({ ...postData, skills: e.target.value })}
                  className="bg-transparent border border-white/8 p-2.5 rounded-none text-white/60 font-mono text-xs outline-none focus:border-white/20 transition-colors placeholder:text-white/15 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1.5">Elevator Pitch (What are you building?) *</label>
              <textarea
                rows={3}
                required
                value={postData.pitch}
                onChange={(e) => setPostData({ ...postData, pitch: e.target.value })}
                placeholder="Brief summary of your project plan and what role you need filled..."
                className="bg-transparent border border-white/8 p-2.5 rounded-none text-white/60 font-mono text-xs outline-none focus:border-white/20 resize-none leading-relaxed transition-colors placeholder:text-white/15 w-full"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F8F7F4] text-[#0A0A08] px-5 py-3 rounded-none font-mono font-bold text-xs uppercase tracking-[0.15em] cursor-pointer transition-opacity hover:opacity-90 active:opacity-75"
            >
              TRANSMIT PITCH TO LOBBY
            </button>
          </form>
        )}

        {/* Filter Controls */}
        <div className="border border-white/5 bg-white/[0.02] p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between select-none rounded-none">
          <div className="flex items-center gap-2 text-white/30 font-mono text-[9px] uppercase tracking-[0.2em]">
            <Filter className="w-3.5 h-3.5 text-white/20" /> FILTER:
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial text-left">
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.2em]">Track:</span>
              <select
                value={filterTrack}
                onChange={(e) => {
                  playSound('click', isMuted, volume)
                  setFilterTrack(e.target.value)
                }}
                className="bg-[#0A0A08] border border-white/8 text-white/60 rounded-none p-2 font-mono text-[10px] uppercase outline-none focus:border-white/20 cursor-pointer"
              >
                <option value="ALL">ALL TRACKS</option>
                <option value="AI">AI</option>
                <option value="CYBER">CYBER</option>
                <option value="GAME">GAME</option>
                <option value="WEB">WEB</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1 md:flex-initial text-left">
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.2em]">Role:</span>
              <select
                value={filterRole}
                onChange={(e) => {
                  playSound('click', isMuted, volume)
                  setFilterRole(e.target.value)
                }}
                className="bg-[#0A0A08] border border-white/8 text-white/60 rounded-none p-2 font-mono text-[10px] uppercase outline-none focus:border-white/20 cursor-pointer"
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
          <div className="border border-white/5 border-dashed rounded-none p-12 text-center text-white/20 font-mono text-[10px] uppercase tracking-[0.2em] select-none bg-white/[0.01]">
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
                  className="bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-between transition-colors rounded-none text-left relative"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4 select-none">
                      <div>
                        <h4 className="font-syne font-black uppercase text-sm text-white tracking-wide">
                          {item.teamName || `${item.name}'s Squad`}
                        </h4>
                        <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.2em]">
                          POSTED BY {item.name.toUpperCase()} — {item.date}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 font-mono text-[8px]">
                        <span className="px-2 py-0.5 border border-white/8 text-white/25 uppercase rounded-none">
                          {item.role.toUpperCase()}
                        </span>
                        <span className="text-white/30 uppercase tracking-[0.2em]">{item.track.toUpperCase()}</span>
                      </div>
                    </div>

                    <p className="font-mono text-[10px] text-white/25 leading-relaxed mb-4">
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
                            className="px-2 py-0.5 border border-white/8 font-mono text-[8px] uppercase rounded-none text-white/25"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Members List */}
                    <div className="mb-4 border border-white/5 bg-white/[0.01] p-3.5 rounded-none">
                      <div className="flex justify-between items-center mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/20 border-b border-white/5 pb-1.5">
                        <span>NODE: SQUAD_MEMBERS</span>
                        <span>{teamMembers.length} / 4</span>
                      </div>
                      <div className="space-y-1.5 font-mono text-[10px] text-white/40">
                        {teamMembers.length === 0 ? (
                          <span className="text-white/15">No members yet.</span>
                        ) : (
                          teamMembers.map((m, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span>
                                {m.name} {m.github && ticketData && m.github.toLowerCase() === ticketData.github.toLowerCase() && '(You)'}
                              </span>
                              <span className="px-1.5 py-0.5 border border-white/8 text-[8px] uppercase rounded-none text-white/25">
                                {m.role}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Connect details */}
                    <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row gap-3 justify-between sm:items-center select-text font-mono text-[10px] text-white/20">
                      <div className="flex items-center gap-1.5">
                        <span className="uppercase tracking-[0.15em] text-white/25">DISCORD:</span>
                        <span className="flex items-center justify-center gap-1 border border-white/8 text-white/40 px-2.5 py-0.5 select-all cursor-copy rounded-none w-fit transition-colors text-[9px]">
                          <MessageSquare className="w-3 h-3 inline text-white/25" /> {item.discord}
                        </span>
                      </div>

                      {/* Join / Leave / Disband Actions */}
                      <div className="flex items-center select-none">
                        {isCreator ? (
                          <button
                            onClick={() => handleDisbandTeam(item.id)}
                            className="flex items-center gap-1 border border-white/8 bg-transparent hover:bg-white/[0.03] text-white/30 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.1em] transition-colors cursor-pointer rounded-none font-mono"
                          >
                            <Trash2 className="w-3 h-3" /> Disband
                          </button>
                        ) : hasJoinedThisTeam ? (
                          <button
                            onClick={() => handleLeaveTeam(item.id)}
                            className="flex items-center gap-1 border border-white/8 bg-transparent hover:bg-white/[0.03] text-white/30 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.1em] transition-colors cursor-pointer rounded-none font-mono"
                          >
                            <LogOut className="w-3 h-3" /> Leave Squad
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinTeam(item.id)}
                            disabled={!!userCurrentTeam || teamMembers.length >= 4}
                            className={`flex items-center gap-1 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.1em] rounded-none transition-colors font-mono ${
                              teamMembers.length >= 4
                                ? 'border border-white/5 text-white/15 cursor-not-allowed'
                                : userCurrentTeam
                                ? 'border border-white/5 text-white/15 cursor-not-allowed'
                                : 'bg-[#F8F7F4] text-[#0A0A08] cursor-pointer hover:opacity-90'
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
