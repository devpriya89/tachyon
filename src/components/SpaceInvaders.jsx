/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { playRetroSound } from '../utils/soundSynth';

export function SpaceInvaders({ isMuted, volume, onGameOver, hasCredits, spendCredit }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER, VICTORY
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  // Game Loop references
  const requestRef = useRef(null);
  const keysRef = useRef({});
  
  // Game variables
  const gameVars = useRef({
    player: { x: 280, y: 360, width: 35, height: 15, speed: 5 },
    lasers: [],
    alienLasers: [],
    aliens: [],
    shields: [],
    alienSpeed: 1,
    alienDirection: 1,
    lastAlienFire: 0
  });

  const handleKeyDown = (e) => {
    keysRef.current[e.key] = true;
    if (e.key === ' ' && gameState === 'PLAYING') {
      e.preventDefault();
      firePlayerLaser();
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

  // Launch game
  const startGame = () => {
    if (!hasCredits && gameState === 'START') {
      alert("Please insert a coin first to play!");
      return;
    }
    
    if (gameState === 'START') {
      spendCredit();
    }

    playRetroSound('score', isMuted, volume);
    
    // Reset game variables
    setScore(0);
    setLives(3);
    gameVars.current.player.x = 280;
    gameVars.current.lasers = [];
    gameVars.current.alienLasers = [];
    gameVars.current.alienSpeed = 1;
    gameVars.current.alienDirection = 1;
    
    // Setup aliens grid (5 columns, 3 rows)
    const aliens = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        aliens.push({
          x: 60 + c * 70,
          y: 40 + r * 45,
          width: 32,
          height: 22,
          alive: true,
          points: (3 - r) * 10
        });
      }
    }
    gameVars.current.aliens = aliens;

    // Setup Shields
    const shields = [];
    for (let i = 0; i < 3; i++) {
      shields.push({
        x: 100 + i * 180,
        y: 300,
        width: 50,
        height: 20,
        hp: 4 // takes 4 hits to destroy
      });
    }
    gameVars.current.shields = shields;

    setGameState('PLAYING');
  };

  const firePlayerLaser = () => {
    const { player, lasers } = gameVars.current;
    if (lasers.length < 3) { // limit 3 active lasers on screen
      lasers.push({
        x: player.x + player.width / 2 - 2,
        y: player.y - 8,
        width: 4,
        height: 10,
        speed: 6
      });
      playRetroSound('laser', isMuted, volume);
    }
  };

  // Main Canvas render loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateGame = () => {
      const vars = gameVars.current;

      // 1. Move Player
      if (keysRef.current['ArrowLeft'] && vars.player.x > 0) {
        vars.player.x -= vars.player.speed;
      }
      if (keysRef.current['ArrowRight'] && vars.player.x < canvas.width - vars.player.width) {
        vars.player.x += vars.player.speed;
      }

      // 2. Move player lasers
      vars.lasers.forEach((laser, idx) => {
        laser.y -= laser.speed;
        if (laser.y < 0) {
          vars.lasers.splice(idx, 1);
        }
      });

      // 3. Move alien lasers
      vars.alienLasers.forEach((al, idx) => {
        al.y += al.speed;
        if (al.y > canvas.height) {
          vars.alienLasers.splice(idx, 1);
        }
      });

      // 4. Move Aliens Grid
      let shiftDown = false;
      const aliveAliens = vars.aliens.filter(a => a.alive);
      
      if (aliveAliens.length === 0) {
        setGameState('VICTORY');
        onGameOver(score + 500); // Victory bonus
        playRetroSound('score', isMuted, volume);
        return;
      }

      aliveAliens.forEach(alien => {
        alien.x += vars.alienSpeed * vars.alienDirection;
        if (alien.x > canvas.width - alien.width || alien.x < 0) {
          shiftDown = true;
        }
      });

      if (shiftDown) {
        vars.alienDirection *= -1;
        vars.aliens.forEach(alien => {
          alien.y += 15;
          // check if aliens land
          if (alien.alive && alien.y + alien.height >= vars.player.y) {
            setGameState('GAMEOVER');
            onGameOver(score);
            playRetroSound('gameover', isMuted, volume);
          }
        });
      }

      // 5. Random alien firing
      const now = Date.now();
      if (now - vars.lastAlienFire > 1200 && aliveAliens.length > 0) {
        const randomAlien = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        vars.alienLasers.push({
          x: randomAlien.x + randomAlien.width / 2 - 2,
          y: randomAlien.y + randomAlien.height,
          width: 4,
          height: 10,
          speed: 3.5
        });
        vars.lastAlienFire = now;
      }

      // 6. Laser collision checks
      // Player lasers hit aliens
      vars.lasers.forEach((laser, lIdx) => {
        vars.aliens.forEach(alien => {
          if (alien.alive && 
              laser.x < alien.x + alien.width &&
              laser.x + laser.width > alien.x &&
              laser.y < alien.y + alien.height &&
              laser.y + laser.height > alien.y) {
            
            alien.alive = false;
            vars.lasers.splice(lIdx, 1);
            setScore(prev => prev + alien.points);
            playRetroSound('hit', isMuted, volume);
          }
        });
      });

      // Player lasers hit shields
      vars.lasers.forEach((laser, lIdx) => {
        vars.shields.forEach(shield => {
          if (shield.hp > 0 &&
              laser.x < shield.x + shield.width &&
              laser.x + laser.width > shield.x &&
              laser.y < shield.y + shield.height &&
              laser.y + laser.height > shield.y) {
            vars.lasers.splice(lIdx, 1);
          }
        });
      });

      // Alien lasers hit shields
      vars.alienLasers.forEach((al, alIdx) => {
        vars.shields.forEach(shield => {
          if (shield.hp > 0 &&
              al.x < shield.x + shield.width &&
              al.x + al.width > shield.x &&
              al.y < shield.y + shield.height &&
              al.y + al.height > shield.y) {
            
            shield.hp--;
            vars.alienLasers.splice(alIdx, 1);
            playRetroSound('bounce', isMuted, volume);
          }
        });
      });

      // Alien lasers hit player
      vars.alienLasers.forEach((al, alIdx) => {
        if (al.x < vars.player.x + vars.player.width &&
            al.x + al.width > vars.player.x &&
            al.y < vars.player.y + vars.player.height &&
            al.y + al.height > vars.player.y) {
          
          vars.alienLasers.splice(alIdx, 1);
          setLives(prev => {
            const nextLives = prev - 1;
            if (nextLives <= 0) {
              setGameState('GAMEOVER');
              onGameOver(score);
              playRetroSound('gameover', isMuted, volume);
            } else {
              playRetroSound('gameover', isMuted, volume);
            }
            return nextLives;
          });
        }
      });
    };

    const drawGame = () => {
      // Clear canvas
      ctx.fillStyle = '#06050b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const vars = gameVars.current;

      // Draw Shields
      vars.shields.forEach(shield => {
        if (shield.hp > 0) {
          const greenLevels = ['rgba(34,197,94,0.1)', 'rgba(34,197,94,0.4)', 'rgba(34,197,94,0.7)', 'rgba(34,197,94,1)'];
          ctx.fillStyle = greenLevels[shield.hp - 1];
          ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
          
          // shield outline
          ctx.strokeStyle = 'rgba(34,197,94,0.4)';
          ctx.strokeRect(shield.x, shield.y, shield.width, shield.height);
        }
      });

      // Draw Player Ship (Glowing Retro style)
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(vars.player.x, vars.player.y, vars.player.width, vars.player.height);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(vars.player.x + 12, vars.player.y - 4, 11, 4);

      // Draw player lasers
      ctx.fillStyle = '#00f0ff';
      vars.lasers.forEach(laser => {
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      });

      // Draw Alien Ships
      vars.aliens.forEach(alien => {
        if (alien.alive) {
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
          
          // Draw alien eyes
          ctx.fillStyle = '#000000';
          ctx.fillRect(alien.x + 6, alien.y + 6, 4, 4);
          ctx.fillRect(alien.x + 22, alien.y + 6, 4, 4);
        }
      });

      // Draw alien lasers
      ctx.fillStyle = '#ec4899';
      vars.alienLasers.forEach(al => {
        ctx.fillRect(al.x, al.y, al.width, al.height);
      });
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
  }, [gameState, score]);

  return (
    <div className="flex-grow flex flex-col h-full bg-[#08070d] text-white">
      {/* Game Header stats */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[#050409]">
        <div className="font-mono text-xs">
          <span className="text-zinc-500 uppercase tracking-widest mr-1">SCORE</span>
          <span className="text-arcade-cyan font-bold text-sm font-orbitron">{score.toString().padStart(6, '0')}</span>
        </div>
        
        {/* Lives slots */}
        <div className="flex gap-1.5 items-center">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mr-1">LIVES</span>
          {Array(3).fill(0).map((_, idx) => (
            <div 
              key={idx} 
              className={`w-3.5 h-3.5 border rounded ${
                idx < lives ? 'bg-arcade-neon border-arcade-neon' : 'bg-transparent border-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Screen Frame Content switch */}
      <div className="flex-1 relative flex items-center justify-center min-h-[350px]">
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
                  GALACTIC CORE
                </span>
                <p className="font-mono text-[10px] text-zinc-400 leading-normal">
                  🛸 Move ship with LEFT/RIGHT arrows. <br />
                  🚀 Press SPACEBAR to fire shields lasers. <br />
                  🛡️ Use defense barrier blocks to hide.
                </p>
                
                {hasCredits ? (
                  <button
                    onClick={startGame}
                    className="w-full border border-arcade-cyan bg-arcade-cyan/10 hover:bg-arcade-cyan text-white hover:text-black py-2.5 font-mono text-xs font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-md uppercase active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" /> PLAY MISSION (1 CR)
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
                  MISSION FAILED
                </span>
                <span className="block font-mono text-zinc-400 text-xs">
                  Final Score: <strong className="text-white font-orbitron text-sm">{score}</strong>
                </span>
                
                {hasCredits ? (
                  <button
                    onClick={startGame}
                    className="w-full border border-arcade-cyan bg-arcade-cyan/15 hover:bg-arcade-cyan text-white hover:text-black py-2.5 font-mono text-xs font-bold tracking-widest rounded-xl transition-all cursor-pointer uppercase active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> RETRY MISSION (1 CR)
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
                  MISSION SUCCESS
                </span>
                <span className="block font-mono text-zinc-400 text-xs">
                  Final Score: <strong className="text-white font-orbitron text-sm">{score + 500}</strong> (incl. Bonus)
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
export default SpaceInvaders;
