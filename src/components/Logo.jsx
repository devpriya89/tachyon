import React from 'react'

export function Logo({ theme = 'nebula' }) {
  const colors = {
    nebula: '#d946ef',
    amber: '#ffdf00',
    crimson: '#E00024',
    acid: '#22c55e',
    void: '#9333ea',
    cyberpunk: '#00f0ff',
    dracula: '#bd93f9'
  }
  const primaryColor = colors[theme] || colors.nebula

  return (
    <div className="relative group select-none shrink-0">
      {/* Shifting background shadow */}
      <div className="absolute inset-0 bg-black translate-x-[2.5px] translate-y-[2.5px] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-transform"></div>
      
      {/* Main logo block */}
      <div className="relative border-2.5 border-black bg-zinc-950 p-[3px] flex items-center justify-center w-9 h-9 active:translate-x-[1px] active:translate-y-[1px] transition-transform">
        <div 
          className="w-full h-full flex items-center justify-center font-syne font-black text-base text-black transition-colors"
          style={{ backgroundColor: primaryColor }}
        >
          H
        </div>
      </div>
    </div>
  )
}
export default Logo

