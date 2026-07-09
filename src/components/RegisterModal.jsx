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
  setTicketColorTheme
}) {
  const [step, setStep] = useState(1) // 1: Core details, 2: Avatars & Skills, 3: Conduct & Submit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    github: '',
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
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'register',
        ticketId: newTicket.ticketId,
        name: newTicket.name,
        email: newTicket.email,
        github: newTicket.github,
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
    setStep(1)
    setFormData({
      name: '',
      email: '',
      github: '',
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

  // Theme styles helper
  const themeStyles = {
    nebula: { bg: 'bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500', text: 'text-white' },
    amber: { bg: 'bg-[#ffdf00]', text: 'text-black' },
    crimson: { bg: 'bg-[#ff3b30]', text: 'text-white' },
    acid: { bg: 'bg-[#34c759]', text: 'text-black' },
    void: { bg: 'bg-[#af52de]', text: 'text-white' },
    cyberpunk: { bg: 'bg-[#00f0ff]', text: 'text-black' },
    dracula: { bg: 'bg-[#ff79c6]', text: 'text-black' },
    custom: { bg: 'bg-[var(--color-custom-primary)]', text: 'text-[var(--color-custom-text)]' }
  }

  const currentTheme = themeStyles[siteTheme] || themeStyles.nebula

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto pt-6 sm:pt-12 select-none text-white">
      
      {/* Form Container */}
      <div className="relative w-full max-w-lg border border-white/10 bg-zinc-900/90 text-white p-6 md:p-8 shadow-2xl my-4 max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-lg">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click', isMuted, volume)
            setIsRegisterModalOpen(false)
          }}
          className="absolute top-4 right-4 border border-white/15 bg-white/5 p-1.5 rounded-lg text-white hover:bg-white/10 shadow-md active:translate-y-[0.5px] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Wizard Progress header */}
        {!ticketData && (
          <div className="flex items-center gap-2 mb-6 font-mono text-[9px] font-bold text-zinc-500 select-none">
            <span className={step === 1 ? 'text-indigo-400' : ''}>01 CORE DATA</span>
            <span>//</span>
            <span className={step === 2 ? 'text-indigo-400' : ''}>02 PROFILE BUILDER</span>
            <span>//</span>
            <span className={step === 3 ? 'text-indigo-400' : ''}>03 SUBMISSION GATE</span>
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
            <div className="pt-4 border-t border-white/5 flex justify-between gap-4 font-mono text-xs select-none">
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="flex-1 border border-white/10 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-bold shadow-md active:translate-y-[0.5px] transition-all cursor-pointer text-center"
              >
                CLOSE TERMINAL
              </button>
              <button
                onClick={handleDeregister}
                className="border border-white/10 bg-red-600/20 text-red-400 hover:bg-red-600/40 px-4 py-2.5 rounded-xl font-bold shadow-md active:translate-y-[0.5px] transition-all cursor-pointer"
              >
                REVOKE CARD
              </button>
            </div>
          </div>
        ) : (
          /* Main Register Form steps */
          <form onSubmit={handleRegisterSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-syne font-bold uppercase text-white leading-none">
                    REGISTRATION PORT
                  </h3>
                  <p className="text-xs font-bold text-zinc-500 mt-1 font-mono">
                    Identify your terminal interface node details.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-mono text-xs font-bold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 select-none">
                      <User className="w-3.5 h-3.5 text-zinc-400" /> Developer Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Arjun Sharma"
                      className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-mono text-xs font-bold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 select-none">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" /> Terminal Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="e.g. hacker@domain.com"
                      className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-mono text-xs font-bold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 select-none">
                        <Github className="w-3.5 h-3.5 text-zinc-400" /> Github Nickname *
                      </label>
                      <input
                        type="text"
                        name="github"
                        required
                        value={formData.github}
                        onChange={handleFormChange}
                        placeholder="e.g. sharma_arjun"
                        className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-xs font-bold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 select-none">
                        Team Name (Optional)
                      </label>
                      <input
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleFormChange}
                        placeholder="Leave blank for solo"
                        className="bg-zinc-950/60 border border-white/5 p-2.5 rounded-xl text-white font-mono text-xs outline-none focus:border-white transition-all shadow-inner w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-mono text-xs font-bold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 select-none">
                        <Layers className="w-3.5 h-3.5 text-zinc-400" /> Builder Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleFormChange}
                        className="bg-zinc-950/60 border border-white/10 text-white rounded-xl p-2.5 font-mono text-xs outline-none focus:border-white cursor-pointer shadow-md w-full"
                      >
                        <option value="developer">Developer // Architect</option>
                        <option value="designer">Designer // UI-UX Craft</option>
                        <option value="researcher">Researcher // Writer</option>
                        <option value="generalist">Generalist // Swiss Knife</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-mono text-xs font-bold uppercase text-zinc-400 mb-1.5 flex items-center gap-1.5 select-none">
                        <Compass className="w-3.5 h-3.5 text-zinc-400" /> Target Domain *
                      </label>
                      <select
                        name="track"
                        value={formData.track}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, track: e.target.value, skills: [] }))
                        }}
                        className="bg-zinc-950/60 border border-white/10 text-white rounded-xl p-2.5 font-mono text-xs outline-none focus:border-white cursor-pointer shadow-md w-full"
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
                    className={`border border-white/10 ${currentTheme.bg} ${currentTheme.text} font-mono font-bold text-xs px-5 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all flex items-center gap-1.5 cursor-pointer uppercase active:scale-95`}
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white leading-none">
                    CUSTOMIZE PROFILE CARD
                  </h3>
                  <p className="text-xs font-bold text-zinc-500 mt-1 font-mono">
                    Choose your avatar representation and verify your skills tags.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Avatars */}
                  <div>
                    <span className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                      Select Cyber Avatar:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {AVATARS_OPTIONS.map((av) => {
                        const thBorderMap = {
                          amber: 'border-yellow-400 bg-yellow-400/10 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.15)]',
                          crimson: 'border-red-500 bg-red-500/10 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
                          acid: 'border-green-400 bg-green-400/10 text-green-300 shadow-[0_0_12px_rgba(74,222,128,0.15)]',
                          void: 'border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
                          cyberpunk: 'border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.15)]',
                          dracula: 'border-pink-400 bg-pink-400/10 text-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.15)]',
                          custom: 'border-[var(--color-custom-primary)]/40 bg-[var(--color-custom-primary)]/10 text-white shadow-[0_0_12px_var(--color-custom-primary)]'
                        }
                        const isSelected = formData.avatar === av.id
                        const activeStyle = thBorderMap[siteTheme] || thBorderMap.amber
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              playSound('click', isMuted, volume)
                              setFormData(prev => ({ ...prev, avatar: av.id }))
                            }}
                            className={`border p-2.5 font-mono text-[9.5px] font-bold text-center cursor-pointer transition-all rounded-xl ${
                              isSelected
                                ? `${activeStyle} scale-[0.98]`
                                : 'border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
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
                    <span className="block font-mono text-xs font-bold text-zinc-400 uppercase mb-2">
                      Verify Skill Tags (Select multiple):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SKILLS[formData.track].map((skill) => {
                        const isSelected = formData.skills.includes(skill)
                        const skillSelectedStyle = {
                          amber: 'border-yellow-400 bg-yellow-400/10 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.15)]',
                          crimson: 'border-red-500 bg-red-500/10 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.15)]',
                          acid: 'border-green-400 bg-green-400/10 text-green-300 shadow-[0_0_10px_rgba(74,222,128,0.15)]',
                          void: 'border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]',
                          cyberpunk: 'border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.15)]',
                          dracula: 'border-pink-400 bg-pink-400/10 text-pink-300 shadow-[0_0_10px_rgba(244,114,182,0.15)]',
                          custom: 'border-[var(--color-custom-primary)]/40 bg-[var(--color-custom-primary)]/10 text-white shadow-[0_0_10px_var(--color-custom-primary)]'
                        }
                        const activeStyle = skillSelectedStyle[siteTheme] || skillSelectedStyle.amber
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 border font-mono text-xs font-bold cursor-pointer rounded-full transition-all ${
                              isSelected
                                ? `${activeStyle} scale-[0.98]`
                                : 'border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            {skill}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between font-mono">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className={`border border-white/10 ${currentTheme.bg} ${currentTheme.text} font-bold text-xs px-5 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all flex items-center gap-1.5 cursor-pointer uppercase active:scale-95`}
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-syne font-bold uppercase text-white leading-none">
                    BUILDERS CONDUCT GATE
                  </h3>
                  <p className="text-xs font-bold text-zinc-500 mt-1 font-mono">
                    Review rules of engagement before forking the mainframe.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Warning notice */}
                  <div className="border border-yellow-500/20 bg-yellow-500/5 p-4 rounded-xl text-yellow-300 font-mono text-xs leading-relaxed shadow-lg">
                    <span className="font-bold flex items-center gap-1.5 uppercase mb-1">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-yellow-400" /> Security Protocol
                    </span>
                    Slide presentations are strictly prohibited. Teams failing to deploy working binaries by the submission limit are automatically disqualified. Build core software.
                  </div>

                  <div className="border border-white/5 bg-white/5 p-4 rounded-xl font-mono text-xs text-zinc-300 space-y-2 shadow-md">
                    <p className="font-bold text-white border-b border-white/5 pb-1">RULES OF CONDUCT:</p>
                    <p>1. Open repositories must be updated throughout development cycles.</p>
                    <p>2. UI/UX styling must be customized - do not rely on standard templates.</p>
                    <p>3. Do not exploit third-party templates - write logic from scratch.</p>
                  </div>

                  <label className="flex items-start gap-2.5 font-mono text-xs text-zinc-400 font-bold cursor-pointer py-2">
                    <input
                      type="checkbox"
                      name="agree"
                      required
                      checked={formData.agree}
                      onChange={handleFormChange}
                      className="mt-1 cursor-pointer accent-indigo-500"
                    />
                    <span>I understand the terms and agree to deploy working code.</span>
                  </label>
                </div>

                <div className="mt-8 flex justify-between font-mono">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-1 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className={`border border-white/10 ${currentTheme.bg} ${currentTheme.text} font-bold text-xs px-5 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all cursor-pointer uppercase active:scale-95`}
                  >
                    TRANSMIT REGISTRATION
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

