import React, { useState } from 'react'
import { playSound } from '../utils/audio'

export function FaqSection({ isMuted, volume, faqList = [] }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  return (
    <section id="faq" className="py-24 border-b border-zinc-800/80 bg-transparent relative select-none max-w-[1400px] mx-auto w-full">
      <div className="max-w-4xl mx-auto px-4 md:px-8">

        <div className="mb-16 select-none text-left">
          <span className="text-[10px] uppercase tracking-widest text-[#6db349] font-extrabold block mb-4">
            SYS:04 — FAQ CACHE
          </span>
          <h2 className="text-3xl font-extrabold text-white uppercase">
            Frequent Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqList.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="border border-zinc-800 bg-[#231f20]/30 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all"
              >
                <button
                  onClick={() => {
                     playSound('click', isMuted, volume)
                     setOpenFaqIndex(isOpen ? null : idx)
                  }}
                  className="w-full flex items-center justify-between py-5 px-6 text-sm font-semibold tracking-wide text-left text-zinc-300 cursor-pointer transition-all duration-200 hover:text-white border-0 outline-none bg-transparent"
                >
                  <span className="pr-4 font-bold">{faq.question}</span>
                  <span className={`text-base font-bold shrink-0 select-none ${isOpen ? 'text-[#6db349]' : 'text-zinc-600'}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6 pt-1 px-6 text-zinc-400 text-xs leading-relaxed select-text text-left text-wrap break-words whitespace-pre-wrap">
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
