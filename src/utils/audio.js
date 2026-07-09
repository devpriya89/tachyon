// Web Audio API Retro Sound Effects Engine

export const playSound = (type, isMuted = false, volumeLevel = 0.5) => {
  if (isMuted) return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    
    // Core tone generator
    const playTone = (freq, waveType, duration, gainStart = 0.08, delay = 0) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = waveType
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
      
      // Scale gain by volume settings
      const finalVolume = gainStart * (volumeLevel * 2)
      
      gain.gain.setValueAtTime(finalVolume, ctx.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration - 0.01)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + duration)
    }

    if (type === 'click') {
      playTone(550, 'sine', 0.08, 0.05)
    } else if (type === 'keypress') {
      playTone(180, 'triangle', 0.04, 0.06)
    } else if (type === 'error') {
      playTone(130, 'sawtooth', 0.25, 0.06)
      playTone(110, 'sawtooth', 0.25, 0.06, 0.05)
    } else if (type === 'correct') {
      playTone(523.25, 'sine', 0.12, 0.07, 0)
      playTone(659.25, 'sine', 0.12, 0.07, 0.1)
      playTone(783.99, 'sine', 0.22, 0.07, 0.2)
    } else if (type === 'success') {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, idx) => {
        playTone(freq, 'square', 0.12, 0.05, idx * 0.06)
      })
    } else if (type === 'power-off') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(700, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35)
      
      const finalVal = 0.06 * (volumeLevel * 2)
      gain.gain.setValueAtTime(finalVal, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.35)
    } else if (type === 'power-on') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(90, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3)
      
      const finalVal = 0.08 * (volumeLevel * 2)
      gain.gain.setValueAtTime(finalVal, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } else if (type === 'coin') {
      playTone(987.77, 'sine', 0.08, 0.06, 0)
      playTone(1318.51, 'sine', 0.25, 0.06, 0.08)
    } else if (type === 'gameover') {
      playTone(330, 'sawtooth', 0.2, 0.06, 0)
      playTone(294, 'sawtooth', 0.2, 0.06, 0.15)
      playTone(262, 'sawtooth', 0.4, 0.06, 0.3)
    }
  } catch (err) {
    console.error('Audio Synth failure:', err)
  }
}

