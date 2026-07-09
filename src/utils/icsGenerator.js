// Helper to generate and download standard ICS files

export const downloadICS = (event) => {
  const { title, description, startDateStr, endDateStr, location } = event
  
  // Format Date Helper: YYYYMMDDTHHMMSSZ
  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    const hh = String(d.getUTCHours()).padStart(2, '0')
    const min = String(d.getUTCMinutes()).padStart(2, '0')
    const ss = String(d.getUTCSeconds()).padStart(2, '0')
    return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`
  }

  const dtStart = formatDate(startDateStr)
  const dtEnd = formatDate(endDateStr)
  const dtStamp = formatDate(new Date())
  const uid = `${Date.now()}@Tachyon.org`

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tachyon//Tachyon Calendar v1.0//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location || 'Online / New Delhi, India'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const element = document.createElement('a')
  element.href = URL.createObjectURL(blob)
  element.download = `${title.toLowerCase().replace(/\s+/g, '-')}.ics`
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

