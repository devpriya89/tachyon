import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { playSound } from '../utils/audio'

export function FaqSection({ isMuted, volume }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  // Custom cursor movement glow tracker coordinates script
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  const FAQ_DATA = [
    {
      question: 'Who is eligible to participate?',
      answer: 'Any student or individual under the age of 18 (born after August 2008) is welcome to register! Whether you are a builder, hacker, or designer, Tachyon is open to you.'
    },
    {
      question: 'Is it a team or solo event?',
      answer: 'You can participate solo or in teams of up to 4 members. If you do not have a team yet, you can match up in the Team Finder Lobby or on our Discord server right after registration closes.'
    },
    {
      question: 'What is the cost of attendance?',
      answer: 'Tachyon is 100% free! We cover event passes, workshops, meals, drinks, stickers, and swags for all offline finalists. You only need to handle your own travel to the Delhi venue.'
    },
    {
      question: 'How does the hybrid format work?',
      answer: 'Round 1 is completely online: you register, receive the prompt on July 24, build a project, and submit it before August 3. Round 2 is offline: the top 40 teams will meet in Delhi on August 23–24 for the grand showcase.'
    },
    {
      question: 'What technologies can I build with?',
      answer: 'You can build with any framework, language, or engine. From React and Next.js to Python scripts, Rust systems, Godot engines, or custom compilers—use the tools that let you craft the best version of your vision.'
    }
  ]

  return (
    <section id="faq" className="py-24 border-b border-white/5 bg-transparent text-white relative select-none max-w-[1400px] mx-auto w-full">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-16 select-none">
          <div className="inline-block border border-white/10 bg-white/5 text-zinc-300 font-mono text-[10px] font-bold uppercase px-3 py-1 shadow-md rounded-full mb-4">
            Get Answers // FAQ Cache
          </div>
          <h2 className="text-4xl sm:text-6xl font-syne font-black uppercase tracking-tight text-white">
            FREQUENT QUESTIONS
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                onMouseMove={handleMouseMove}
                className="bg-zinc-900/30 border border-white/5 overflow-hidden transition-all duration-300 rounded-2xl hover:border-white/12 hover:bg-zinc-900/40 relative cyber-glass-interactive"
              >
                <button
                  onClick={() => {
                    playSound('click', isMuted, volume)
                    setOpenFaqIndex(isOpen ? null : idx)
                  }}
                  className="w-full flex items-center justify-between px-6 py-5 font-mono font-bold text-xs sm:text-[13px] uppercase text-left text-white cursor-pointer hover:bg-white/5 transition-colors border-0 outline-none"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div className="border border-white/10 p-1.5 bg-zinc-950/60 shrink-0 rounded-xl shadow-md transition-transform duration-300">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-3 border-t border-white/5 text-xs sm:text-sm font-normal text-zinc-300 leading-relaxed bg-zinc-950/20 font-mono select-text">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
export default FaqSection

