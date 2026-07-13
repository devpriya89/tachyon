import React, { useState } from 'react'
import { X, User, Mail, Github, Layers, Compass, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react'
import TicketPass from './TicketPass'
import { playSound } from '../utils/audio'

export function RegisterModal({
  setIsRegisterModalOpen,
  ticketData,
  setTicketData,
  siteTheme,
  isMuted,
  volume,
  ticketColorTheme,
  setTicketColorTheme,
  user,
  setUser
}) {
  const [step, setStep] = useState(1) // 1: Core details, 2: Avatars & Skills, 3: Conduct & Submit
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    github: '',
    githubLink: '',
    role: 'developer',
    track: 'ai',
    teamName: '',
    avatar: 'cyber',
    skills: [],
    agree: false
  })

  const AVAILABLE_SKILLS = {
    ai: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'OpenAI API', 'HuggingFace'],
    cyber: ['Rust', 'Wireshark', 'Nmap', 'Penetration testing', 'Cryptography', 'Go'],
    game: ['Godot', 'HTML5 Canvas', 'WebGL', 'Aseprite', 'Unity', 'Chiptune Synth'],
    web: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'SQLite', 'Web Audio API']
  }

  const AVATARS_OPTIONS = [
    { id: 'cyber', name: 'CYBER DETECTIVE' },
    { id: 'agent', name: 'INTELLIGENT AGENT' },
    { id: 'wizard', name: 'DECRYPT WIZARD' },
    { id: 'glitch', name: 'SYSTEM GLITCH' }
  ]

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const toggleSkill = (skill) => {
    playSound('click', isMuted, volume)
    if (formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s !== skill)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    }
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!formData.agree) {
      playSound('error', isMuted, volume)
      alert('You must accept the builders Code of Conduct.')
      return
    }

    const ticketId = `HL-${Math.floor(100000 + Math.random() * 900000)}`
    const timestamp = new Date().toLocaleString()
    const seatNumber = Math.floor(10 + Math.random() * 89)
    const newTicket = {
      ...formData,
      ticketId,
      timestamp,
      seatNumber
    }

    playSound('success', isMuted, volume)
    setTicketData(newTicket)
    localStorage.setItem('Tachyon_ticket', JSON.stringify(newTicket))

    // Sync global registrations registry
    const registrationsStr = localStorage.getItem('Tachyon_registrations')
    let registrations = []
    if (registrationsStr) {
      try {
        registrations = JSON.parse(registrationsStr)
      } catch (e) {
        console.error(e)
      }
    }
    registrations.push(newTicket)
    localStorage.setItem('Tachyon_registrations', JSON.stringify(registrations))

    // Google Sheets Webhook Sync
    const googleSheetUrl = localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
    if (!localStorage.getItem('Tachyon_google_sheet_url')) {
      localStorage.setItem('Tachyon_google_sheet_url', 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec')
    }

    fetch(googleSheetUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        action: 'register',
        ticketId: newTicket.ticketId,
        name: newTicket.name,
        email: newTicket.email,
        github: newTicket.github,
        githubLink: newTicket.githubLink,
        role: newTicket.role,
        track: newTicket.track,
        seatNumber: newTicket.seatNumber
      })
    }).catch(err => console.error("Google sheets registration sync failed:", err))
  }

  const handleDeregister = () => {
    playSound('power-off', isMuted, volume)
    const confirmed = window.confirm('WARNING: Revoking your ticket will delete your local profile and registration. Proceed?')
    if (!confirmed) return

    // Google Sheets Webhook Sync (Deregister)
    if (ticketData) {
      const googleSheetUrl = localStorage.getItem('Tachyon_google_sheet_url') || 'https://script.google.com/macros/s/AKfycby40ehtUvqJPfnMCovD0XohcTSb5kaMcAqEsLwvvdzJvvhqazLJSkrZOn_pxgpepPLf/exec'
      fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({
          action: 'deregister',
          ticketId: ticketData.ticketId
        })
      }).catch(err => console.error("Google sheets deregistration sync failed:", err))
    }

    // Remove from global database key
    const registrationsStr = localStorage.getItem('Tachyon_registrations')
    if (registrationsStr && ticketData) {
      try {
        const registrations = JSON.parse(registrationsStr)
        const updated = registrations.filter(r => r.ticketId !== ticketData.ticketId)
        localStorage.setItem('Tachyon_registrations', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
    }

    setTicketData(null)
    localStorage.removeItem('Tachyon_ticket')
    localStorage.removeItem('tachyon_ticket')
    localStorage.removeItem('Tachyon_user')
    if (setUser) {
      setUser(null)
    }
    setIsRegisterModalOpen(false)
    setStep(1)
    setFormData({
      name: '',
      email: '',
      github: '',
      githubLink: '',
      role: 'developer',
      track: 'ai',
      teamName: '',
      avatar: 'cyber',
      skills: [],
      agree: false
    })
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        playSound('error', isMuted, volume)
        alert('Please fill in Name and Email.')
        return
      }
    }
    playSound('click', isMuted, volume)
    setStep(prev => prev + 1)
  }

  const prevStep = () => {
    playSound('click', isMuted, volume)
    setStep(prev => prev - 1)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto pt-6 sm:pt-12 select-none text-white">
      
      {/* Form Container */}
      <div className="relative w-full max-w-lg border border-zinc-800 bg-[#231f20]/95 text-white p-6 md:p-8 my-4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click', isMuted, volume)
            setIsRegisterModalOpen(false)
          }}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white text-base leading-none transition-colors cursor-pointer p-1"
        >
          ✕
        </button>

        {/* Wizard Progress header */}
        {!ticketData && (
          <div className="flex items-center gap-2 mb-6 text-[9px] text-zinc-500 select-none uppercase tracking-widest font-bold">
            <span className={step === 1 ? 'text-[#6db349]' : ''}>SYS:01 CORE</span>
            <span className="text-zinc-700">—</span>
            <span className={step === 2 ? 'text-[#6db349]' : ''}>SYS:02 PROFILE</span>
            <span className="text-zinc-700">—</span>
            <span className={step === 3 ? 'text-[#6db349]' : ''}>SYS:03 SUBMIT</span>
          </div>
        )}

        {/* Forms Render Switch */}
        {ticketData ? (
          /* View Generated VIP Pass Badge */
          <div className="space-y-6">
            <TicketPass
              ticketData={ticketData}
              ticketColorTheme={ticketColorTheme}
              setTicketColorTheme={setTicketColorTheme}
              isMuted={isMuted}
              volume={volume}
            />
            <div className="pt-4 border-t border-zinc-800/60 flex justify-between gap-4 text-xs select-none">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="flex-1 border border-zinc-800 hover:border-zinc-650 bg-black/25 text-zinc-400 hover:text-white px-4 py-2.5 rounded-full uppercase tracking-wider transition-colors cursor-pointer text-center font-bold"
              >
                Close
              </button>
              <button
                onClick={handleDeregister}
                className="border border-[#C2452D]/35 bg-[#C2452D]/5 text-[#C2452D] hover:bg-[#C2452D]/10 px-4 py-2.5 rounded-full uppercase tracking-wider transition-colors cursor-pointer font-bold"
              >
                Revoke Pass
              </button>
            </div>
          </div>
        ) : (
          /* Main Register Form steps */
          <form onSubmit={handleRegisterSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase text-white leading-none tracking-wide">
                    REGISTRATION PORT
                  </h3>
                  <p className="text-[9px] text-[#6db349] mt-2 font-bold uppercase tracking-widest">
                    NODE: Terminal interface identification
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase text-zinc-400 mb-2 flex items-center gap-1.5 select-none tracking-wider font-bold">
                      <User className="w-3 h-3 text-zinc-500" /> FIELD:NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={!!(user && user.name)}
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Arjun Sharma"
                      className={`bg-transparent border-b border-zinc-800 text-xs outline-none py-2 rounded-none w-full placeholder:text-zinc-700 ${(user && user.name) ? 'text-zinc-500 opacity-60 cursor-not-allowed' : 'text-zinc-300 focus:border-[#6db349]/50 transition-colors'}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase text-zinc-400 mb-2 flex items-center gap-1.5 select-none tracking-wider font-bold">
                      <Mail className="w-3 h-3 text-zinc-500" /> FIELD:EMAIL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="e.g. hacker@domain.com"
                      className="bg-transparent border-b border-zinc-800 text-zinc-500 text-xs outline-none py-2 rounded-none w-full placeholder:text-zinc-700 opacity-60 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase text-zinc-400 mb-2 flex items-center gap-1.5 select-none tracking-wider font-bold">
                        <Github className="w-3 h-3 text-zinc-500" /> FIELD:GITHUB *
                      </label>
                      <input
                        type="text"
                        name="github"
                        required
                        value={formData.github}
                        onChange={handleFormChange}
                        placeholder="e.g. sharma_arjun"
                        className="bg-transparent border-b border-zinc-800 text-zinc-300 text-xs outline-none focus:border-[#6db349]/50 transition-colors py-2 rounded-none w-full placeholder:text-zinc-700"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase text-zinc-400 mb-2 flex items-center gap-1.5 select-none tracking-wider font-bold">
                        <Github className="w-3 h-3 text-zinc-500" /> FIELD:GITHUB LINK (OPT)
                      </label>
                      <input
                        type="url"
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleFormChange}
                        placeholder="e.g. https://github.com/sharma_arjun"
                        className="bg-transparent border-b border-zinc-800 text-zinc-300 text-xs outline-none focus:border-[#6db349]/50 transition-colors py-2 rounded-none w-full placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase text-zinc-400 mb-2 flex items-center gap-1.5 select-none tracking-wider font-bold">
                      FIELD:TEAM (OPT)
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleFormChange}
                      placeholder="Leave blank for solo"
                      className="bg-transparent border-b border-zinc-800 text-zinc-300 text-xs outline-none focus:border-[#6db349]/50 transition-colors py-2 rounded-none w-full placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase text-zinc-400 mb-2 flex items-center gap-1.5 select-none tracking-wider font-bold">
                        <Layers className="w-3 h-3 text-zinc-500" /> FIELD:ROLE *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleFormChange}
                        className="bg-black/60 border-b border-zinc-800 text-zinc-300 rounded-lg py-2 text-xs outline-none focus:border-[#6db349]/50 cursor-pointer w-full appearance-none px-2"
                      >
                        <option value="developer">Developer // Architect</option>
                        <option value="designer">Designer // UI-UX Craft</option>
                        <option value="researcher">Researcher // Writer</option>
                        <option value="generalist">Generalist // Swiss Knife</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[9px] uppercase text-zinc-400 mb-2 flex items-center gap-1.5 select-none tracking-wider font-bold">
                        <Compass className="w-3 h-3 text-zinc-500" /> FIELD:DOMAIN *
                      </label>
                      <select
                        name="track"
                        value={formData.track}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, track: e.target.value, skills: [] }))
                        }}
                        className="bg-black/60 border-b border-zinc-800 text-zinc-300 rounded-lg py-2 text-xs outline-none focus:border-[#6db349]/50 cursor-pointer w-full appearance-none px-2"
                      >
                        <option value="ai">AI & Intelligent Agents</option>
                        <option value="cyber">Cybersecurity & Exploits</option>
                        <option value="game">Retro Game Development</option>
                        <option value="web">Web & Forked Platforms</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#6db349] hover:bg-[#6db349]/90 text-black font-bold text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(109,179,73,0.3)]"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase text-white leading-none tracking-wide">
                    PROFILE CONFIGURATION
                  </h3>
                  <p className="text-[9px] text-[#6db349] mt-2 font-bold uppercase tracking-widest">
                    NODE: Avatar selection & skill verification
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Avatars */}
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-400 mb-3 tracking-wider font-bold">
                      PROTOCOL: SELECT AVATAR
                    </span>
                    <div className="grid grid-cols-2 gap-2 select-none">
                      {AVATARS_OPTIONS.map((av) => {
                        const isSelected = formData.avatar === av.id
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              playSound('click', isMuted, volume)
                              setFormData(prev => ({ ...prev, avatar: av.id }))
                            }}
                            className={`p-3 text-[10px] text-center cursor-pointer transition-all rounded-xl uppercase tracking-wider font-bold border ${
                              isSelected
                                ? 'bg-[#6db349]/10 border-[#6db349] text-white shadow-[0_0_10px_rgba(109,179,73,0.15)]'
                                : 'bg-black/30 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            {av.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Skill Tags */}
                  <div>
                    <span className="block text-[9px] uppercase text-zinc-400 mb-3 tracking-wider font-bold">
                      PROTOCOL: VERIFY SKILLS
                    </span>
                    <div className="flex flex-wrap gap-1.5 select-none">
                      {AVAILABLE_SKILLS[formData.track].map((skill) => {
                        const isSelected = formData.skills.includes(skill)
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3.5 py-1.5 border text-[10px] cursor-pointer rounded-full transition-all uppercase tracking-wider font-semibold ${
                              isSelected
                                ? 'border-[#6db349] bg-[#6db349]/10 text-white'
                                : 'border-zinc-850 bg-black/35 text-zinc-500 hover:text-zinc-300 hover:border-zinc-750'
                            }`}
                          >
                            {skill}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between font-semibold">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 border border-zinc-800 hover:border-zinc-650 bg-black/25 text-zinc-400 hover:text-white text-xs px-4 py-2.5 rounded-full cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#6db349] hover:bg-[#6db349]/90 text-black font-bold text-xs px-5 py-2.5 rounded-full uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(109,179,73,0.3)]"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase text-white leading-none tracking-wide">
                    CONDUCT GATE
                  </h3>
                  <p className="text-[9px] text-[#6db349] mt-2 font-bold uppercase tracking-widest">
                    NODE: Review protocol before submission
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Warning notice */}
                  <div className="border border-[#C2452D]/25 bg-[#C2452D]/5 p-4 rounded-xl text-[10px] text-zinc-350 leading-relaxed">
                    <span className="font-bold flex items-center gap-1.5 uppercase mb-1.5 text-[#C2452D] tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Alert: Protocol
                    </span>
                    Slide presentations are strictly prohibited. Teams failing to deploy working binaries by the submission limit are automatically disqualified. Build core software.
                  </div>

                  <div className="border border-zinc-800 bg-black/30 p-4 rounded-xl text-[10px] text-zinc-500 space-y-2">
                    <p className="text-zinc-400 border-b border-zinc-800 pb-1.5 uppercase tracking-wider font-bold">RULES OF CONDUCT:</p>
                    <p>1. Open repositories must be updated throughout development cycles.</p>
                    <p>2. UI/UX styling must be customized — do not rely on standard templates.</p>
                    <p>3. Do not exploit third-party templates — write logic from scratch.</p>
                  </div>

                  <label className="flex items-start gap-2.5 text-[10px] text-zinc-400 cursor-pointer py-2 uppercase tracking-wider font-semibold">
                    <input
                      type="checkbox"
                      name="agree"
                      required
                      checked={formData.agree}
                      onChange={handleFormChange}
                      className="mt-0.5 cursor-pointer accent-[#6db349]"
                    />
                    <span>I understand the terms and agree to deploy working code.</span>
                  </label>
                </div>

                <div className="mt-8 flex justify-between font-semibold">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1.5 border border-zinc-800 hover:border-zinc-650 bg-black/25 text-zinc-400 hover:text-white text-xs px-4 py-2.5 rounded-full cursor-pointer transition-all uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6db349] hover:bg-[#6db349]/90 text-black font-bold text-xs px-6 py-2.5 rounded-full uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(109,179,73,0.3)]"
                  >
                    Transmit
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  )
}
export default RegisterModal
