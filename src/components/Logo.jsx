import React from 'react'

export function Logo({ theme = 'takumi' }) {
  return (
    <div className="relative select-none shrink-0">
      {/* Main logo block — brutalist flat */}
      <div className="relative border border-white/10 bg-transparent p-[2px] flex items-center justify-center w-8 h-8">
        <div 
          className="w-full h-full flex items-center justify-center font-extrabold text-sm text-[#F8F7F4] select-none font-mono"
        >
          T
        </div>
      </div>
    </div>
  )
}
export default Logo
