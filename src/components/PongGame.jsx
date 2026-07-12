/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { playRetroSound } from '../utils/soundSynth';

export function PongGame({ isMuted, volume, onGameOver, hasCredits, spendCredit }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER, VICTORY
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const requestRef = useRef(null);
  const keysRef = useRef({});

  // Game coordinates
  const gameVars = useRef({
    ball: { x: 300, y: 200, radius: 6, vx: 4, vy: 3, speed: 5 },
    player: { x: 20, y: 150, width: 10, height: 80, speed: 6 },
    ai: { x: 570, y: 150, width: 10, height: 80, speed: 3.5 }
  });

  const handleKeyDown = (e) => {
    keysRef.current[e.key] = true;
    if (['ArrowUp', 'ArrowDown', ' '].includes(e.key) && gameState === 'PLAYING') {
      e.preventDefault(); // prevent window scrolling
    }
  };

  const handleKeyUp = (e) => {
    keysRef.current[e.key] = false;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const startGame = () => {
    if (!hasCredits && gameState === 'START') {
      alert("Please insert a coin first to play!");
      return;
    }

    if (gameState === 'START') {
      spendCredit();
    }

    playRetroSound('score', isMuted, volume);

    setPlayerScore(0);
    setAiScore(0);
    resetBall(1);

    setGameState('PLAYING');
  };

  const resetBall = (direction) => {
    const vars = gameVars.current;
    vars.ball.x = 300;
    vars.ball.y = 200;
    vars.ball.vx = 4 * direction;
    vars.ball.vy = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
    vars.ball.speed = 5;
  };

  // Canvas loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateGame = () => {
      const vars = gameVars.current;
      const ball = vars.ball;
      const player = vars.player;
      const ai = vars.ai;

      // 1. Move Player paddle
      if ((keysRef.current['ArrowUp'] || keysRef.current['w']) && player.y > 0) {
        player.y -= player.speed;
      }
      if ((keysRef.current['ArrowDown'] || keysRef.current['s']) && player.y < canvas.height - player.height) {
        player.y += player.speed;
      }

      // 2. Simple Computer AI paddle movement
      const aiCenter = ai.y + ai.height / 2;
      if (ball.y < aiCenter - 10 && ai.y > 0) {
        ai.y -= ai.speed;
      } else if (ball.y > aiCenter + 10 && ai.y < canvas.height - ai.height) {
        ai.y += ai.speed;
      }

      // 3. Move Ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // 4. Wall Bounce (Top & Bottom)
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -1;
        playRetroSound('bounce', isMuted, volume);
      } else if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= -1;
        playRetroSound('bounce', isMuted, volume);
      }

      // 5. Paddle Collision (Player Left side)
      if (ball.vx < 0 &&
          ball.x - ball.radius < player.x + player.width &&
          ball.x + ball.radius > player.x &&
          ball.y > player.y &&
          ball.y < player.y + player.height) {
        
        // Calculate hit angle
        const relativeIntersectY = (player.y + player.height / 2) - ball.y;
        const normalizedIntersectY = relativeIntersectY / (player.height / 2);
        const bounceAngle = normalizedIntersectY * (Math.PI / 3); // max 60 degrees

        ball.speed = Math.min(12, ball.speed * 1.08); // speed scaling
        ball.vx = ball.speed * Math.cos(bounceAngle);
        ball.vy = ball.speed * -Math.sin(bounceAngle);
        
        ball.x = player.x + player.width + ball.radius; // reset position
        playRetroSound('bounce', isMuted, volume);
      }

      // 6. Paddle Collision (AI Right side)
      if (ball.vx > 0 &&
          ball.x + ball.radius > ai.x &&
          ball.x - ball.radius < ai.x + ai.width &&
          ball.y > ai.y &&
          ball.y < ai.y + ai.height) {
        
        // Calculate hit angle
        const relativeIntersectY = (ai.y + ai.height / 2) - ball.y;
        const normalizedIntersectY = relativeIntersectY / (ai.height / 2);
        const bounceAngle = normalizedIntersectY * (Math.PI / 3);

        ball.speed = Math.min(12, ball.speed * 1.08);
        ball.vx = -ball.speed * Math.cos(bounceAngle);
        ball.vy = ball.speed * -Math.sin(bounceAngle);

        ball.x = ai.x - ball.radius;
        playRetroSound('bounce', isMuted, volume);
      }

      // 7. Scoring Check
      if (ball.x - ball.radius < 0) { // AI scores
        playRetroSound('hit', isMuted, volume);
        setAiScore(prev => {
          const nextScore = prev + 1;
          if (nextScore >= 5) {
            setGameState('GAMEOVER');
            onGameOver(playerScore * 100); // 100 pts per point scored
            playRetroSound('gameover', isMuted, volume);
          } else {
            resetBall(1); // serve to player
          }
          return nextScore;
        });
      } else if (ball.x + ball.radius > canvas.width) { // Player scores
        playRetroSound('score', isMuted, volume);
        setPlayerScore(prev => {
          const nextScore = prev + 1;
          if (nextScore >= 5) {
            setGameState('VICTORY');
            onGameOver(500 + playerScore * 100); // victory bonus
            playRetroSound('score', isMuted, volume);
          } else {
            resetBall(-1); // serve to AI
          }
          return nextScore;
        });
      }
    };

    const drawGame = () => {
      // Background
      ctx.fillStyle = '#06050b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const vars = gameVars.current;

      // Draw Center Net Line
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw Player Paddle (Cyan Glow)
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(vars.player.x, vars.player.y, vars.player.width, vars.player.height);
      ctx.strokeStyle = 'rgba(6,182,212,0.4)';
      ctx.strokeRect(vars.player.x, vars.player.y, vars.player.width, vars.player.height);

      // Draw AI Paddle (Pink Glow)
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(vars.ai.x, vars.ai.y, vars.ai.width, vars.ai.height);
      ctx.strokeStyle = 'rgba(236,72,153,0.4)';
      ctx.strokeRect(vars.ai.x, vars.ai.y, vars.ai.width, vars.ai.height);

      // Draw Ball (Glowing circle)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(vars.ball.x, vars.ball.y, vars.ball.radius, 0, Math.PI * 2);
      ctx.fill();

      // Ambient ball outer halo glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#a855f7';
    };

    const loop = () => {
      updateGame();
      drawGame();
      if (gameState === 'PLAYING') {
        requestRef.current = requestAnimationFrame(loop);
      }
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, playerScore, aiScore]);

  return (
    <div className="flex-grow flex flex-col h-full bg-[#08070d] text-white">
      {/* Header scoreboard display */}
      <div className="flex justify-center items-center gap-12 py-2.5 border-b border-white/5 bg-[#050409]">
        <div className="text-right">
          <span className="block text-[8px] text-zinc-500 uppercase tracking-widest font-mono mb-0.5 font-bold">YOU</span>
          <span className="font-orbitron font-black text-xl text-arcade-cyan neon-text-cyan">{playerScore}</span>
        </div>
        <div className="font-mono text-zinc-600 text-xs">VS</div>
        <div className="text-left">
          <span className="block text-[8px] text-zinc-500 uppercase tracking-widest font-mono mb-0.5 font-bold">MAINFRAME</span>
          <span className="font-orbitron font-black text-xl text-arcade-neon neon-text-pink">{aiScore}</span>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 relative min-h-[350px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full max-w-[600px] h-[400px] border border-white/5 bg-[#06050b] shadow-inner select-none"
        />

        {/* Start / Overlay Screen */}
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none z-30">
            {gameState === 'START' && (
              <div className="space-y-4 max-w-sm">
                <span className="block font-orbitron text-2xl font-black tracking-wider text-arcade-cyan neon-text-cyan">
                  LASER PADDLE
                </span>
                <p className="font-mono text-[10px] text-zinc-400 leading-normal">
                  🕹️ Use UP/DOWN arrows or W/S to move paddle. <br />
                  ⚡ Deflect the quantum ball past the mainframe. <br />
                  🔥 Ball speed increases on each paddle bounce!
                </p>
                
                {hasCredits ? (
                  <button
                    onClick={startGame}
                    className="w-full border border-arcade-cyan bg-arcade-cyan/10 hover:bg-arcade-cyan text-white hover:text-black py-2.5 font-mono text-xs font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-md uppercase active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" /> PLAY PADDLE (1 CR)
                  </button>
                ) : (
                  <div className="border border-arcade-amber/20 bg-arcade-amber/5 p-3.5 rounded-xl text-arcade-amber font-mono text-[10px] flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    INSERT COIN AT THE CABINET TOP TO PLAY!
                  </div>
                )}
              </div>
            )}

            {gameState === 'GAMEOVER' && (
              <div className="space-y-4 max-w-sm">
                <span className="block font-orbitron text-3xl font-black text-arcade-neon led-blink neon-text-pink">
                  MAINFRAME WON
                </span>
                <span className="block font-mono text-zinc-400 text-xs">
                  Final Score: <strong className="text-white font-orbitron text-sm">{playerScore * 100}</strong>
                </span>
                
                {hasCredits ? (
                  <button
                    onClick={startGame}
                    className="w-full border border-arcade-cyan bg-arcade-cyan/15 hover:bg-arcade-cyan text-white hover:text-black py-2.5 font-mono text-xs font-bold tracking-widest rounded-xl transition-all cursor-pointer uppercase active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> RETRY PADDLE (1 CR)
                  </button>
                ) : (
                  <div className="border border-arcade-amber/20 bg-arcade-amber/5 p-3 rounded-xl text-arcade-amber font-mono text-[10px]">
                    INSERT COIN AT THE CABINET TOP FOR MORE ATTEMPTS
                  </div>
                )}
              </div>
            )}

            {gameState === 'VICTORY' && (
              <div className="space-y-4 max-w-sm">
                <span className="block font-orbitron text-3xl font-black text-emerald-400 neon-text-purple animate-pulse">
                  VICTORY ACHIEVED
                </span>
                <span className="block font-mono text-zinc-400 text-xs">
                  Final Score: <strong className="text-white font-orbitron text-sm">{500 + playerScore * 100}</strong> (incl. Bonus)
                </span>
                <button
                  onClick={() => setGameState('START')}
                  className="w-full border border-white/10 bg-white text-black py-2.5 font-mono text-xs font-black tracking-widest rounded-xl transition-all cursor-pointer uppercase active:scale-95"
                >
                  RETURN TO HUD
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default PongGame;
