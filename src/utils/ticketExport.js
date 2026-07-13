// Ticket SVG Exporter Utility

export const downloadSVG = (ticket, theme) => {
  const themeMap = {
    neutral: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    nebula: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    cyberpunk: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    amber: { main: '#84cc16', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    crimson: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    acid: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    void: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    dracula: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' },
    custom: { main: '#6db349', dark: '#231f20', text: '#ffffff', border: 'rgba(109,179,73,0.15)' }
  }
  const color = themeMap[theme] || themeMap.cyberpunk

  const svgContent = `
    <svg width="600" height="350" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" style="background:#231f20; font-family:'Inter', -apple-system, sans-serif;">
      <!-- Main dark background card -->
      <rect x="0" y="0" width="600" height="350" fill="#231f20" />
      
      <!-- Inner border -->
      <rect x="15" y="15" width="570" height="320" fill="transparent" stroke="rgba(109, 179, 73, 0.15)" stroke-width="1.5" rx="16" ry="16"/>
      
      <!-- Top title and tag -->
      <text x="35" y="48" font-family="-apple-system, sans-serif" font-weight="900" font-size="16" fill="#ffffff" letter-spacing="1">PASS:001</text>
      <text x="35" y="65" font-family="-apple-system, sans-serif" font-weight="bold" font-size="9" fill="#6db349" letter-spacing="0.5">TACHYON // DELHI SATELLITE HACKATHON</text>
      
      <!-- Status pill -->
      <rect x="445" y="32" width="120" height="22" fill="rgba(109,179,73,0.05)" stroke="rgba(109,179,73,0.2)" stroke-width="1" rx="11" ry="11"/>
      <text x="505" y="46" font-family="-apple-system, sans-serif" font-size="8" font-weight="bold" fill="#6db349" letter-spacing="0.5" text-anchor="middle">PROTOCOL: ACTIVE</text>
      
      <!-- Separation Line -->
      <line x1="35" y1="80" x2="565" y2="80" stroke="rgba(109, 179, 73, 0.12)" stroke-width="1" />
      
      <!-- Ticket ID banner -->
      <rect x="35" y="95" width="530" height="42" fill="rgba(0, 0, 0, 0.2)" stroke="rgba(109, 179, 73, 0.1)" stroke-width="1" rx="8" ry="8" />
      <text x="50" y="115" font-family="-apple-system, sans-serif" font-weight="bold" font-size="9" fill="#a1a1aa" letter-spacing="0.5">BUILDER IDENTIFIER</text>
      <text x="50" y="127" font-family="-apple-system, sans-serif" font-size="8" fill="#71717a">TICKET SECURE TOKEN</text>
      
      <text x="550" y="122" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" fill="#6db349" letter-spacing="1" text-anchor="end">${ticket.ticketId}</text>

      <!-- Profile Details -->
      <!-- Row 1 Label -->
      <text x="35" y="165" font-family="-apple-system, sans-serif" font-weight="bold" font-size="8" fill="#71717a" letter-spacing="0.5">BUILDER NAME</text>
      <text x="320" y="165" font-family="-apple-system, sans-serif" font-weight="bold" font-size="8" fill="#71717a" letter-spacing="0.5">EMAIL ADDRESS</text>
      
      <!-- Row 1 Value -->
      <text x="35" y="182" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" fill="#ffffff">${(ticket.name || 'Anonymous').toUpperCase()}</text>
      <text x="320" y="182" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">${ticket.email || ''}</text>

      <!-- Row 2 Label -->
      <text x="35" y="215" font-family="-apple-system, sans-serif" font-weight="bold" font-size="8" fill="#71717a" letter-spacing="0.5">CORE DOMAIN</text>
      <text x="210" y="215" font-family="-apple-system, sans-serif" font-weight="bold" font-size="8" fill="#71717a" letter-spacing="0.5">DESIGNATION</text>
      <text x="385" y="215" font-family="-apple-system, sans-serif" font-weight="bold" font-size="8" fill="#71717a" letter-spacing="0.5">SEAT SLOT</text>
      
      <!-- Row 2 Value -->
      <text x="35" y="232" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">${(ticket.track || 'AI').toUpperCase()}</text>
      <text x="210" y="232" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">${(ticket.role || 'DEVELOPER').toUpperCase()}</text>
      <text x="385" y="232" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SLOT-${ticket.seatNumber || '00'}</text>

      <!-- Row 3 Label -->
      <text x="35" y="265" font-family="-apple-system, sans-serif" font-weight="bold" font-size="8" fill="#71717a" letter-spacing="0.5">GITHUB LINK</text>
      <text x="320" y="265" font-family="-apple-system, sans-serif" font-weight="bold" font-size="8" fill="#71717a" letter-spacing="0.5">TEAM ASSIGNMENT</text>
      
      <!-- Row 3 Value -->
      <text x="35" y="282" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" fill="#6db349">${ticket.githubLink || ('github.com/' + (ticket.github || 'none'))}</text>
      <text x="320" y="282" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">${ticket.teamName ? ticket.teamName.toUpperCase() : 'SOLO BUILDER'}</text>

      <!-- Bottom border line -->
      <line x1="35" y1="302" x2="565" y2="302" stroke="rgba(109, 179, 73, 0.12)" stroke-width="1" stroke-dasharray="4,4" />

      <!-- Footer Barcode & Timestamp -->
      <!-- Barcode in brand green -->
      <g transform="translate(35, 312)" fill="#6db349" opacity="0.35">
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
      
      <text x="565" y="323" font-family="-apple-system, sans-serif" font-size="7" fill="#71717a" letter-spacing="0.5" text-anchor="end">NODE:VERIFIED // REG_TIME: ${ticket.timestamp || ''}</text>
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

