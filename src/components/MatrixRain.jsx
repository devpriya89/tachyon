import React, { useEffect, useRef } from 'react'

export function MatrixRain({ theme = 'nebula' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }
    resizeCanvas()

    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ$@#%&*+-=?<>[]{}'.split('')
    const fontSize = 11
    const columns = Math.floor(canvas.width / fontSize)
    const rainDrops = Array(columns).fill(1)

    // Map theme to matrix rain color
    const themeColors = {
      nebula: '#d946ef',
      amber: '#ffdf00',
      crimson: '#E00024',
      acid: '#22c55e',
      void: '#9333ea',
      cyberpunk: '#00f0ff',
      dracula: '#50fa7b',
      custom: 'var(--color-custom-primary)'
    }
    const color = themeColors[theme] || themeColors.nebula

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = color
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)]
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize)

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }
    }

    const loop = () => {
      draw()
      animationId = requestAnimationFrame(loop)
    }
    loop()

    window.addEventListener('resize', resizeCanvas)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-20 z-0" />
}
export default MatrixRain

