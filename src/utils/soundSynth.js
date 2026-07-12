// Retro Web Audio API Synthesizer

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function playRetroSound(type, isMuted = false, volume = 0.5) {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'coin': // Two-tone ascending arcade chime
        osc.type = 'square';
        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.15, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        
        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'laser': // Quick pitch sweep down (Space Invaders laser)
        osc.type = 'sawtooth';
        gainNode.gain.setValueAtTime(volume * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'bounce': // Short dry beep (Pong bounce)
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(volume * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.frequency.setValueAtTime(440, now); // A4

        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'score': // Score point / line clear chime
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0.01, now);
        gainNode.gain.linearRampToValueAtTime(volume * 0.2, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'rotate': // Tetris block rotation tap
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(volume * 0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.frequency.setValueAtTime(330, now); // E4

        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'hit': // Explosion blast sound (Space Invaders alien hit)
        osc.type = 'sawtooth';
        gainNode.gain.setValueAtTime(volume * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.35);
        break;

      case 'gameover': // Sad descending chime
        osc.type = 'sawtooth';
        gainNode.gain.setValueAtTime(volume * 0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.setValueAtTime(196, now + 0.15); // G3
        osc.frequency.setValueAtTime(174.61, now + 0.3); // F3
        osc.frequency.setValueAtTime(146.83, now + 0.45); // D3

        osc.start(now);
        osc.stop(now + 0.6);
        break;

      default:
        break;
    }
  } catch (e) {
    console.warn("AudioContext block initialized before interaction: ", e);
  }
}
