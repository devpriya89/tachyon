/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { playRetroSound } from '../utils/soundSynth';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20; // in pixels

// Shape representations
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

const COLORS = {
  I: '#06b6d4', // Cyan
  O: '#f59e0b', // Amber
  T: '#a855f7', // Purple
  S: '#10b981', // Green
  Z: '#ec4899', // Pink
  J: '#3b82f6', // Blue
  L: '#f97316'  // Orange
};

export function TetrisGame({ isMuted, volume, onGameOver, hasCredits, spendCredit }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextPiece, setNextPiece] = useState(null);

  const gameVars = useRef({
    grid: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
    currentPiece: null,
    nextPiece: null,
    dropInterval: 800,
    lastDrop: 0
  });

  // Controls listeners
  const handleKeyDown = (e) => {
    if (gameState !== 'PLAYING') return;

    const vars = gameVars.current;
    if (!vars.currentPiece) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotatePiece();
        break;
      case ' ': // Hard drop
        e.preventDefault();
        hardDropPiece();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Set up random piece
  const getRandomPiece = () => {
    const keys = Object.keys(SHAPES);
    const type = keys[Math.floor(Math.random() * keys.length)];
    return {
      type,
      shape: SHAPES[type],
      color: COLORS[type],
      x: Math.floor((COLS - SHAPES[type][0].length) / 2),
      y: 0
    };
  };

  const startGame = () => {
    if (!hasCredits && gameState === 'START') {
      alert("Please insert a coin first to play!");
      return;
    }

    if (gameState === 'START') {
      spendCredit();
    }

    playRetroSound('score', isMuted, volume);

    setScore(0);
    setLines(0);
    setLevel(1);

    const vars = gameVars.current;
    vars.grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    vars.currentPiece = getRandomPiece();
    const next = getRandomPiece();
    vars.nextPiece = next;
    setNextPiece(next);
    vars.dropInterval = 800;
    vars.lastDrop = Date.now();

    setGameState('PLAYING');
  };

  const movePiece = (dx, dy) => {
    const vars = gameVars.current;
    const piece = vars.currentPiece;
    if (!piece) return false;

    const nextX = piece.x + dx;
    const nextY = piece.y + dy;

    if (isValidMove(piece.shape, nextX, nextY)) {
      piece.x = nextX;
      piece.y = nextY;
      if (dy > 0) {
        vars.lastDrop = Date.now(); // reset timer on soft drops
      }
      return true;
    }

    // If it hit bottom
    if (dy > 0) {
      lockPiece();
    }
    return false;
  };

  const rotatePiece = () => {
    const vars = gameVars.current;
    const piece = vars.currentPiece;
    if (!piece) return;

    // Rotate matrix
    const newShape = piece.shape[0].map((val, index) =>
      piece.shape.map(row => row[index]).reverse()
    );

    if (isValidMove(newShape, piece.x, piece.y)) {
      piece.shape = newShape;
      playRetroSound('rotate', isMuted, volume);
    }
  };

  const hardDropPiece = () => {
    const vars = gameVars.current;
    while (isValidMove(vars.currentPiece.shape, vars.currentPiece.x, vars.currentPiece.y + 1)) {
      vars.currentPiece.y++;
    }
    lockPiece();
  };

  const isValidMove = (shape, posX, posY) => {
    const vars = gameVars.current;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const gridX = posX + c;
          const gridY = posY + r;

          if (gridX < 0 || gridX >= COLS || gridY >= ROWS) {
            return false;
          }
          if (gridY >= 0 && vars.grid[gridY][gridX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const lockPiece = () => {
    const vars = gameVars.current;
    const piece = vars.currentPiece;
    if (!piece) return;

    // Place on grid
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] !== 0) {
          const gridY = piece.y + r;
          if (gridY < 0) {
            // Game Over
            setGameState('GAMEOVER');
            onGameOver(score);
            playRetroSound('gameover', isMuted, volume);
            return;
          }
          vars.grid[gridY][piece.x + c] = piece.color;
        }
      }
    }

    playRetroSound('bounce', isMuted, volume);
    clearRows();

    // Spawn next piece
    vars.currentPiece = vars.nextPiece;
    const next = getRandomPiece();
    vars.nextPiece = next;
    setNextPiece(next);

    // Initial collision check
    if (!isValidMove(vars.currentPiece.shape, vars.currentPiece.x, vars.currentPiece.y)) {
      setGameState('GAMEOVER');
      onGameOver(score);
      playRetroSound('gameover', isMuted, volume);
    }
  };

  const clearRows = () => {
    const vars = gameVars.current;
    let cleared = 0;

    for (let r = ROWS - 1; r >= 0; r--) {
      if (vars.grid[r].every(val => val !== 0)) {
        vars.grid.splice(r, 1);
        vars.grid.unshift(Array(COLS).fill(0));
        cleared++;
        r++; // check same row again since rows shifted down
      }
    }

    if (cleared > 0) {
      playRetroSound('score', isMuted, volume);
      const points = [0, 100, 300, 500, 800];
      setScore(prev => prev + points[cleared] * level);
      setLines(prev => {
        const nextLines = prev + cleared;
        const nextLevel = Math.floor(nextLines / 10) + 1;
        if (nextLevel > level) {
          setLevel(nextLevel);
          vars.dropInterval = Math.max(100, 800 - (nextLevel - 1) * 80);
        }
        return nextLines;
      });
    }
  };

  // Canvas render loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const render = () => {
      const vars = gameVars.current;
      const now = Date.now();

      // Gravity tick
      if (now - vars.lastDrop > vars.dropInterval) {
        movePiece(0, 1);
        vars.lastDrop = now;
      }

      // Draw Grid
      ctx.fillStyle = '#06050b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw blocks
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const block = vars.grid[r][c];
          if (block !== 0) {
            ctx.fillStyle = block;
            ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        }
      }

      // Draw active piece
      const piece = vars.currentPiece;
      if (piece) {
        ctx.fillStyle = piece.color;
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] !== 0) {
              ctx.fillRect(
                (piece.x + c) * BLOCK_SIZE,
                (piece.y + r) * BLOCK_SIZE,
                BLOCK_SIZE - 1,
                BLOCK_SIZE - 1
              );
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, level]);

  return (
    <div className="flex-grow flex flex-col h-full bg-[#08070d] text-white">
      {/* Header stats */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[#050409] font-mono text-[11px]">
        <div>
          <span className="text-zinc-500 uppercase tracking-widest mr-1">SCORE:</span>
          <span className="text-arcade-neon font-bold font-orbitron text-sm">{score.toString().padStart(6, '0')}</span>
        </div>
        <div>
          <span className="text-zinc-500 uppercase tracking-widest mr-1">LVL:</span>
          <span className="text-arcade-amber font-bold">{level}</span>
        </div>
        <div>
          <span className="text-zinc-500 uppercase tracking-widest mr-1">LINES:</span>
          <span className="text-arcade-cyan font-bold">{lines}</span>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 relative min-h-[350px]">
        <div className="flex gap-6 items-start">
          {/* Main Board Canvas */}
          <canvas
            ref={canvasRef}
            width={200}
            height={400}
            className="border border-white/10 bg-[#06050b] shadow-inner rounded-xl"
          />

          {/* Next block preview card */}
          <div className="w-24 border border-white/5 bg-[#09080e]/60 p-3.5 rounded-2xl flex flex-col items-center">
            <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest leading-none mb-3">NEXT PIECE</span>
            {nextPiece ? (
              <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, minmax(0, 1fr))` }}>
                {nextPiece.shape.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: val !== 0 ? nextPiece.color : 'transparent' }}
                    />
                  ))
                )}
              </div>
            ) : (
              <span className="font-mono text-[10px] text-zinc-600">NONE</span>
            )}
          </div>
        </div>

        {/* Start / Overlay Screen */}
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none z-30">
            {gameState === 'START' && (
              <div className="space-y-4 max-w-sm">
                <span className="block font-orbitron text-2xl font-black tracking-wider text-arcade-neon neon-text-pink">
                  MAINFRAME GRID
                </span>
                <p className="font-mono text-[10px] text-zinc-400 leading-normal">
                  🕹️ Use LEFT/RIGHT keys to slide blocks. <br />
                  🔄 Press UP ARROW key to rotate piece. <br />
                  ⚡ SPACEBAR triggers immediate drop.
                </p>
                
                {hasCredits ? (
                  <button
                    onClick={startGame}
                    className="w-full border border-arcade-neon bg-arcade-neon/10 hover:bg-arcade-neon text-white hover:text-black py-2.5 font-mono text-xs font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-md uppercase active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-current" /> PLAY GRID (1 CR)
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
                  GRID LOCKED
                </span>
                <span className="block font-mono text-zinc-400 text-xs">
                  Final Score: <strong className="text-white font-orbitron text-sm">{score}</strong>
                </span>
                
                {hasCredits ? (
                  <button
                    onClick={startGame}
                    className="w-full border border-arcade-neon bg-arcade-neon/15 hover:bg-arcade-neon text-white hover:text-black py-2.5 font-mono text-xs font-bold tracking-widest rounded-xl transition-all cursor-pointer uppercase active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> RETRY GRID (1 CR)
                  </button>
                ) : (
                  <div className="border border-arcade-amber/20 bg-arcade-amber/5 p-3 rounded-xl text-arcade-amber font-mono text-[10px]">
                    INSERT COIN AT THE CABINET TOP FOR MORE ATTEMPTS
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default TetrisGame;
