// Ticket SVG Exporter Utility

export const downloadSVG = (ticket, theme) => {
  const themeMap = {
    amber: { main: '#ffdf00', dark: '#0C0C0B', text: '#000000', border: '#ffdf00' },
    crimson: { main: '#E00024', dark: '#0C0C0B', text: '#ffffff', border: '#E00024' },
    acid: { main: '#22c55e', dark: '#0C0C0B', text: '#000000', border: '#22c55e' },
    void: { main: '#9333ea', dark: '#0C0C0B', text: '#ffffff', border: '#9333ea' },
    cyberpunk: { main: '#00f0ff', dark: '#0a0b10', text: '#000000', border: '#ff0055' },
    dracula: { main: '#bd93f9', dark: '#282a36', text: '#282a36', border: '#50fa7b' }
  }
  const color = themeMap[theme] || themeMap.amber

  const svgContent = `
    <svg width="600" height="350" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" style="background:${color.dark}; font-family:'Courier New', monospace;">
      <rect x="10" y="10" width="580" height="330" fill="${color.dark}" stroke="#000000" stroke-width="4"/>
      <rect x="15" y="15" width="570" height="320" fill="#ffffff" stroke="${color.border}" stroke-width="4"/>
      <path d="M 15,15 L 585,15 L 585,32 L 15,32 Z" fill="${color.main}" stroke="${color.border}" stroke-width="2"/>
      <line x1="45" y1="15" x2="45" y2="335" stroke="#cccccc" stroke-dasharray="6,6" stroke-width="2"/>
      <line x1="555" y1="15" x2="555" y2="335" stroke="#cccccc" stroke-dasharray="6,6" stroke-width="2"/>
      
      <text x="65" y="65" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="${color.dark}">Tachyon V1.0</text>
      <text x="65" y="85" font-size="10" font-weight="bold" fill="#777777">DELHI SATELLITE HACKATHON // U18</text>
      
      <rect x="420" y="45" width="120" height="24" fill="${color.main}" stroke="${color.border}" stroke-width="1.5"/>
      <text x="480" y="61" font-size="9" font-weight="bold" fill="${color.text}" text-anchor="middle">BUILDER PASS</text>
      <text x="480" y="85" font-size="14" font-weight="bold" fill="#E00024" text-anchor="middle">${ticket.ticketId}</text>
      
      <line x1="65" y1="102" x2="535" y2="102" stroke="#000000" stroke-width="3"/>
      
      <text x="65" y="125" font-size="8" fill="#888888">BUILDER NAME</text>
      <text x="65" y="142" font-size="14" font-weight="bold" fill="#000000">${ticket.name.toUpperCase()}</text>
      
      <text x="320" y="125" font-size="8" fill="#888888">EMAIL ADDRESS</text>
      <text x="320" y="142" font-size="11" font-weight="bold" fill="#000000">${ticket.email}</text>
      
      <text x="65" y="180" font-size="8" fill="#888888">SELECTED DOMAIN</text>
      <text x="65" y="196" font-size="11" font-weight="bold" fill="#000000">${ticket.track.toUpperCase()}</text>
      
      <text x="320" y="180" font-size="8" fill="#888888">DESIGNATION</text>
      <text x="320" y="196" font-size="11" font-weight="bold" fill="#000000">${ticket.role.toUpperCase()}</text>
      
      <text x="65" y="235" font-size="8" fill="#888888">GITHUB HANDLES</text>
      <text x="65" y="250" font-size="11" font-weight="bold" fill="#E00024">github.com/${ticket.github || 'none'}</text>
      
      <text x="320" y="235" font-size="8" fill="#888888">TEAM ASSIGNMENT</text>
      <text x="320" y="250" font-size="11" font-weight="bold" fill="#000000">${ticket.teamName ? ticket.teamName.toUpperCase() : 'SOLO BUILDER'}</text>
      
      <line x1="65" y1="270" x2="535" y2="270" stroke="#dddddd" stroke-width="1.5" stroke-dasharray="4,4"/>
      
      <text x="65" y="295" font-size="8" fill="#777777">📅 QUALIFIER: JULY 24, 2026 // 🏢 VENUE: NEW DELHI</text>
      <text x="65" y="310" font-size="7" fill="#aaaaaa">TIMESTAMP: ${ticket.timestamp}</text>
      
      <g transform="translate(420, 280)">
        <rect x="0" y="0" width="3" height="30" fill="${color.dark}" />
        <rect x="5" y="0" width="1" height="30" fill="${color.dark}" />
        <rect x="8" y="0" width="2" height="30" fill="${color.dark}" />
        <rect x="12" y="0" width="4" height="30" fill="${color.dark}" />
        <rect x="18" y="0" width="1" height="30" fill="${color.dark}" />
        <rect x="21" y="0" width="3" height="30" fill="${color.dark}" />
        <rect x="26" y="0" width="2" height="30" fill="${color.dark}" />
        <rect x="30" y="0" width="1" height="30" fill="${color.dark}" />
        <rect x="33" y="0" width="4" height="30" fill="${color.dark}" />
        <rect x="39" y="0" width="2" height="30" fill="${color.dark}" />
        <rect x="43" y="0" width="1" height="30" fill="${color.dark}" />
        <rect x="46" y="0" width="3" height="30" fill="${color.dark}" />
        <rect x="51" y="0" width="2" height="30" fill="${color.dark}" />
        <rect x="55" y="0" width="4" height="30" fill="${color.dark}" />
        <rect x="61" y="0" width="1" height="30" fill="${color.dark}" />
        <rect x="64" y="0" width="3" height="30" fill="${color.dark}" />
        <rect x="69" y="0" width="2" height="30" fill="${color.dark}" />
        <rect x="73" y="0" width="4" height="30" fill="${color.dark}" />
        <rect x="79" y="0" width="1" height="30" fill="${color.dark}" />
        <rect x="82" y="0" width="3" height="30" fill="${color.dark}" />
        <rect x="87" y="0" width="2" height="30" fill="${color.dark}" />
        <rect x="91" y="0" width="4" height="30" fill="${color.dark}" />
        <rect x="97" y="0" width="1" height="30" fill="${color.dark}" />
        <rect x="100" y="0" width="3" height="30" fill="${color.dark}" />
      </g>
    </svg>
  `

  const element = document.createElement('a')
  const file = new Blob([svgContent], { type: 'image/svg+xml' })
  element.href = URL.createObjectURL(file)
  element.download = `Tachyon-ticket-${ticket.ticketId}.svg`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

