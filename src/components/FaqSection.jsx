import React, { useState } from 'react'
import { playSound } from '../utils/audio'

export function FaqSection({ isMuted, volume, faqList = [] }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  return (
    <section id="faq" className="py-24 border-b border-white/5 bg-transparent relative select-none max-w-[1400px] mx-auto w-full">
      <div className="max-w-4xl mx-auto px-4 md:px-8">

        <div className="mb-16 select-none text-left">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 block mb-4">
            SYS:04 — FAQ CACHE
          </span>
          <h2 className="font-syne font-black text-2xl text-white uppercase">
            FREQUENT QUESTIONS
          </h2>
        </div>

        <div>
          {faqList.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="border-b border-white/5"
              >
                <button
                  onClick={() => {
                     playSound('click', isMuted, volume)
                     setOpenFaqIndex(isOpen ? null : idx)
                  }}
                  className="w-full flex items-center justify-between py-5 px-0 font-mono text-xs uppercase tracking-wider text-left text-white/60 cursor-pointer transition-colors duration-200 hover:text-white border-0 outline-none bg-transparent"
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className="font-mono text-sm text-white/20 shrink-0 select-none">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6 pt-1 font-mono text-xs text-white/30 leading-relaxed select-text text-left text-wrap break-words whitespace-pre-wrap">
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
