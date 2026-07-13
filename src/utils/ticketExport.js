// Ticket SVG Exporter Utility

export const downloadSVG = (ticket, theme) => {
  const themeMap = {
    neutral: { main: '#F8F7F4', dark: '#0D0D0B', text: '#0D0D0B', border: 'rgba(248,247,244,0.1)' },
    nebula: { main: '#C2452D', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' },
    cyberpunk: { main: '#C2452D', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' },
    amber: { main: '#D97706', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' },
    crimson: { main: '#C2452D', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' },
    acid: { main: '#16A34A', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' },
    void: { main: '#7C3AED', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' },
    dracula: { main: '#BD93F9', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' },
    custom: { main: '#C2452D', dark: '#0D0D0B', text: '#F8F7F4', border: 'rgba(248,247,244,0.1)' }
  }
  const color = themeMap[theme] || themeMap.cyberpunk

  const svgContent = `
    <svg width="600" height="350" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" style="background:#0D0D0B; font-family:'Courier New', monospace;">
      <!-- Main dark background card -->
      <rect x="0" y="0" width="600" height="350" fill="#0D0D0B" />
      
      <!-- Inner border -->
      <rect x="15" y="15" width="570" height="320" fill="transparent" stroke="rgba(248, 247, 244, 0.08)" stroke-width="1.5"/>
      
      <!-- Subtle corner ticks using the main accent color -->
      <!-- Top Left -->
      <path d="M 14,14 L 24,14 M 14,14 L 14,24" stroke="${color.main}" stroke-width="2" fill="none" />
      <!-- Top Right -->
      <path d="M 586,14 L 576,14 M 586,14 L 586,24" stroke="${color.main}" stroke-width="2" fill="none" />
      <!-- Bottom Left -->
      <path d="M 14,336 L 24,336 M 14,336 L 14,326" stroke="${color.main}" stroke-width="2" fill="none" />
      <!-- Bottom Right -->
      <path d="M 586,336 L 576,336 M 586,336 L 586,326" stroke="${color.main}" stroke-width="2" fill="none" />

      <!-- Top title and tag -->
      <text x="35" y="45" font-family="'Courier New', monospace" font-weight="900" font-size="16" fill="#F8F7F4" letter-spacing="2">PASS:001</text>
      <text x="35" y="62" font-family="'Courier New', monospace" font-size="9" fill="#8C8B86" letter-spacing="1">TACHYON // DELHI SATELLITE HACKATHON</text>
      
      <!-- Status pill -->
      <rect x="445" y="32" width="120" height="20" fill="rgba(248,247,244,0.02)" stroke="rgba(248,247,244,0.1)" stroke-width="1" />
      <text x="505" y="44" font-family="'Courier New', monospace" font-size="8" font-weight="bold" fill="#8C8B86" letter-spacing="1" text-anchor="middle">PROTOCOL: ACTIVE</text>
      
      <!-- Separation Line -->
      <line x1="35" y1="80" x2="565" y2="80" stroke="rgba(248, 247, 244, 0.08)" stroke-width="1" />
      
      <!-- Ticket ID banner -->
      <rect x="35" y="95" width="530" height="40" fill="rgba(248, 247, 244, 0.02)" stroke="rgba(248, 247, 244, 0.06)" stroke-width="1" />
      <text x="50" y="118" font-family="'Courier New', monospace" font-size="9" fill="#8C8B86" letter-spacing="1">BUILDER IDENTIFIER</text>
      <text x="50" y="129" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" opacity="0.5">TICKET SECURE TOKEN</text>
      
      <text x="550" y="120" font-family="'Courier New', monospace" font-size="14" font-weight="bold" fill="${color.main}" letter-spacing="2" text-anchor="end">${ticket.ticketId}</text>

      <!-- Profile Grid Details -->
      <!-- Row 1 Label -->
      <text x="35" y="165" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" letter-spacing="1">BUILDER NAME</text>
      <text x="320" y="165" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" letter-spacing="1">EMAIL ADDRESS</text>
      
      <!-- Row 1 Value -->
      <text x="35" y="182" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#F8F7F4" letter-spacing="1">${(ticket.name || 'Anonymous').toUpperCase()}</text>
      <text x="320" y="182" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#F8F7F4" letter-spacing="0.5">${ticket.email || ''}</text>

      <!-- Row 2 Label -->
      <text x="35" y="215" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" letter-spacing="1">CORE DOMAIN</text>
      <text x="210" y="215" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" letter-spacing="1">DESIGNATION</text>
      <text x="385" y="215" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" letter-spacing="1">SEAT SLOT</text>
      
      <!-- Row 2 Value -->
      <text x="35" y="232" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#F8F7F4" letter-spacing="1">${(ticket.track || 'AI').toUpperCase()}</text>
      <text x="210" y="232" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#F8F7F4" letter-spacing="1">${(ticket.role || 'DEVELOPER').toUpperCase()}</text>
      <text x="385" y="232" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#F8F7F4" letter-spacing="1">SLOT-${ticket.seatNumber || '00'}</text>

      <!-- Row 3 Label -->
      <text x="35" y="265" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" letter-spacing="1">GITHUB HANDLE</text>
      <text x="320" y="265" font-family="'Courier New', monospace" font-size="8" fill="#8C8B86" letter-spacing="1">TEAM ASSIGNMENT</text>
      
      <!-- Row 3 Value -->
      <text x="35" y="282" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="${color.main}" letter-spacing="0.5">github.com/${ticket.github || 'none'}</text>
      <text x="320" y="282" font-family="'Courier New', monospace" font-size="10" font-weight="bold" fill="#F8F7F4" letter-spacing="1">${ticket.teamName ? ticket.teamName.toUpperCase() : 'SOLO BUILDER'}</text>

      <!-- Bottom border line -->
      <line x1="35" y1="302" x2="565" y2="302" stroke="rgba(248, 247, 244, 0.08)" stroke-width="1" stroke-dasharray="4,4" />

      <!-- Footer Barcode & Timestamp -->
      <!-- Barcode in white/cream opacity -->
      <g transform="translate(35, 312)" fill="#F8F7F4" opacity="0.25">
        <rect x="0" y="0" width="2" height="15" />
        <rect x="4" y="0" width="1" height="15" />
        <rect x="6" y="0" width="3" height="15" />
        <rect x="11" y="0" width="1" height="15" />
        <rect x="14" y="0" width="4" height="15" />
        <rect x="20" y="0" width="1" height="15" />
        <rect x="23" y="0" width="2" height="15" />
        <rect x="27" y="0" width="1" height="15" />
        <rect x="30" y="0" width="3" height="15" />
        <rect x="35" y="0" width="1" height="15" />
        <rect x="38" y="0" width="4" height="15" />
        <rect x="44" y="0" width="2" height="15" />
        <rect x="48" y="0" width="1" height="15" />
        <rect x="51" y="0" width="3" height="15" />
        <rect x="56" y="0" width="1" height="15" />
        <rect x="59" y="0" width="4" height="15" />
        <rect x="65" y="0" width="2" height="15" />
      </g>
      
      <text x="565" y="323" font-family="'Courier New', monospace" font-size="7" fill="#8C8B86" opacity="0.6" letter-spacing="1" text-anchor="end">NODE:VERIFIED // REG_TIME: ${ticket.timestamp || ''}</text>
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

