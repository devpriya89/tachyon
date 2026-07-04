import React, { useState, useEffect, useRef } from 'react'
import MatrixRain from './MatrixRain'
import { playSound } from '../utils/audio'

export function TerminalCLI({ siteTheme, isMuted, volume, setIsRegisterModalOpen, openAdminPanel }) {
  const [adminPrompt, setAdminPrompt] = useState(false)
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: '==================================================' },
    { type: 'output', text: '  HACKLABIFY INTERACTIVE SH SESSION // CODENAME: DL' },
    { type: 'output', text: '==================================================' },
    { type: 'output', text: 'MUTE STATUS: OFF. SOUND SYNTHESIZER: LOADED.' },
    { type: 'output', text: 'Type "help" to see available terminal logs.' },
    { type: 'output', text: 'Try "matrix" to toggle overlay rain.' },
    { type: 'output', text: 'Type "snake" to play Retro Arcade Snake!' },
    { type: 'output', text: 'Type "game" to start passcode decryption hacking!' },
    { type: 'output', text: ' ' }
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [isMatrixMode, setIsMatrixMode] = useState(false)
  const terminalEndRef = useRef(null)

  // Firewall Decryption Game State
  const [decryptState, setDecryptState] = useState({
    active: false,
    targetCode: null,
    guesses: 0
  })

  // Retro Snake Game States
  const [snakeGame, setSnakeGame] = useState({
    active: false,
    snake: [{ x: 10, y: 5 }, { x: 9, y: 5 }],
    food: { x: 5, y: 3 },
    dir: { x: 1, y: 0 },
    score: 0,
    highScore: parseInt(localStorage.getItem('hacklabify_snake_high') || '0', 10),
    gameOver: false
  })

  const snakeTimerRef = useRef(null)

  // Auto scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalHistory])

  // Handle keyboard events when games are active
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (snakeGame.active && !snakeGame.gameOver) {
        let newDir = null
        if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
          if (snakeGame.dir.y === 0) newDir = { x: 0, y: -1 }
        } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
          if (snakeGame.dir.y === 0) newDir = { x: 0, y: 1 }
        } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
          if (snakeGame.dir.x === 0) newDir = { x: -1, y: 0 }
        } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
          if (snakeGame.dir.x === 0) newDir = { x: 1, y: 0 }
        }

        if (newDir) {
          e.preventDefault()
          playSound('keypress', isMuted, volume)
          setSnakeGame(prev => ({ ...prev, dir: newDir }))
        }
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [snakeGame, isMuted, volume])

  // Snake game loop controller
  useEffect(() => {
    if (snakeGame.active && !snakeGame.gameOver) {
      snakeTimerRef.current = setInterval(() => {
        setSnakeGame(prev => {
          const head = prev.snake[0]
          const nextHead = {
            x: head.x + prev.dir.x,
            y: head.y + prev.dir.y
          }

          // Check wall collisions (Board size: 20 x 10)
          if (nextHead.x < 0 || nextHead.x >= 20 || nextHead.y < 0 || nextHead.y >= 10) {
            clearInterval(snakeTimerRef.current)
            playSound('gameover', isMuted, volume)
            
            // Save high score if necessary
            if (prev.score > prev.highScore) {
              localStorage.setItem('hacklabify_snake_high', String(prev.score))
            }

            // Append game over screen to terminal logs
            setTimeout(() => {
              setTerminalHistory(hist => [
                ...hist,
                { type: 'error', text: '💥 COLLISION DETECTED!' },
                { type: 'output', text: `GAME OVER! Final Score: ${prev.score}. High Score: ${Math.max(prev.score, prev.highScore)}` },
                { type: 'output', text: 'Type "snake" to play again, or "quit" to exit arcade.' }
              ])
            }, 10)

            return { ...prev, gameOver: true, highScore: Math.max(prev.score, prev.highScore) }
          }

          // Check body collisions
          for (const cell of prev.snake) {
            if (cell.x === nextHead.x && cell.y === nextHead.y) {
              clearInterval(snakeTimerRef.current)
              playSound('gameover', isMuted, volume)
              
              if (prev.score > prev.highScore) {
                localStorage.setItem('hacklabify_snake_high', String(prev.score))
              }

              setTimeout(() => {
                setTerminalHistory(hist => [
                  ...hist,
                  { type: 'error', text: '💥 SELF-COLLISION DETECTED!' },
                  { type: 'output', text: `GAME OVER! Final Score: ${prev.score}. High Score: ${Math.max(prev.score, prev.highScore)}` },
                  { type: 'output', text: 'Type "snake" to play again, or "quit" to exit arcade.' }
                ])
              }, 10)

              return { ...prev, gameOver: true, highScore: Math.max(prev.score, prev.highScore) }
            }
          }

          const newSnake = [nextHead, ...prev.snake]
          let nextFood = prev.food
          let nextScore = prev.score

          // Check food intake
          if (nextHead.x === prev.food.x && nextHead.y === prev.food.y) {
            playSound('coin', isMuted, volume)
            nextScore += 10
            
            // Spawn new food at random free spot
            let validFood = false
            while (!validFood) {
              const rx = Math.floor(Math.random() * 20)
              const ry = Math.floor(Math.random() * 10)
              const hitBody = newSnake.some(c => c.x === rx && c.y === ry)
              if (!hitBody) {
                nextFood = { x: rx, y: ry }
                validFood = true
              }
            }
          } else {
            // Remove tail
            newSnake.pop()
          }

          return {
            ...prev,
            snake: newSnake,
            food: nextFood,
            score: nextScore
          }
        })
      }, 200)
    }

    return () => clearInterval(snakeTimerRef.current)
  }, [snakeGame.active, snakeGame.gameOver, isMuted, volume])

  // Renders the current ASCII frame of the Snake Board
  const renderSnakeBoard = () => {
    const { snake, food } = snakeGame
    const board = []
    
    // Header border
    board.push('##'.repeat(22))

    for (let y = 0; y < 10; y++) {
      let row = '##'
      for (let x = 0; x < 20; x++) {
        const isHead = snake[0].x === x && snake[0].y === y
        const isBody = snake.slice(1).some(c => c.x === x && c.y === y)
        const isFood = food.x === x && food.y === y

        if (isHead) {
          row += 'O '
        } else if (isBody) {
          row += 'o '
        } else if (isFood) {
          row += '* '
        } else {
          row += '  '
        }
      }
      row += '##'
      board.push(row)
    }

    board.push('##'.repeat(22))
    return board
  }

  // Handle Firewall Guessing Game Command
  const handleGameCommand = (guessStr, historyAcc) => {
    const guess = guessStr.trim()
    
    if (guess.length !== 4 || isNaN(Number(guess))) {
      playSound('error', isMuted, volume)
      return [
        ...historyAcc,
        { type: 'error', text: `INVALID INPUT: "${guess}". Guess must be exactly 4 digits.` }
      ]
    }

    const digitsSet = new Set(guess.split(''))
    if (digitsSet.size !== 4) {
      playSound('error', isMuted, volume)
      return [
        ...historyAcc,
        { type: 'error', text: `INVALID INPUT: Digits must be unique (e.g. 1234).` }
      ]
    }

    const currentGuesses = decryptState.guesses + 1
    const guessArr = guess.split('')
    const targetArr = decryptState.targetCode

    let bulls = 0
    let cows = 0

    for (let i = 0; i < 4; i++) {
      if (guessArr[i] === targetArr[i]) {
        bulls++
      } else if (targetArr.includes(guessArr[i])) {
        cows++
      }
    }

    const nextHistory = [
      ...historyAcc,
      { type: 'output', text: `Attempt ${currentGuesses}: guess ${guess} -> ${bulls} Bulls (correct position), ${cows} Cows (wrong position).` }
    ]

    if (bulls === 4) {
      playSound('correct', isMuted, volume)
      setDecryptState({ active: false, targetCode: null, guesses: 0 })
      return [
        ...nextHistory,
        { type: 'output', text: '🎉 SUCCESS! Firewall cracked successfully.' },
        { type: 'output', text: 'SYSTEM DECRYPTED. SECRET CREDENTIAL: {ZERO_FLUFF_OVERLORD}' },
        { type: 'output', text: 'Classified ASCII log unlocked:' },
        { type: 'output', text: '   /\\_/\\  ' },
        { type: 'output', text: '  ( o.o ) - "Nice hacking skills, builder!"' },
        { type: 'output', text: '   > ^ <  ' },
        { type: 'output', text: 'Exiting hacking system console... Session cleared.' }
      ]
    } else {
      playSound('keypress', isMuted, volume)
      setDecryptState(prev => ({ ...prev, guesses: currentGuesses }))
      return nextHistory
    }
  }

  // Command submissions
  const handleTerminalSubmit = (e) => {
    e.preventDefault()
    const trimmedInput = terminalInput.trim()
    if (!trimmedInput) return

    const newHistory = [...terminalHistory, { type: 'input', text: `guest@hacklabify:~$ ${terminalInput}` }]
    setTerminalInput('')

    // 0. If Admin passcode prompt is active
    if (adminPrompt) {
      if (trimmedInput === 'admin123' || trimmedInput.toLowerCase() === 'root') {
        playSound('success', isMuted, volume)
        setAdminPrompt(false)
        setTerminalHistory([
          ...newHistory,
          { type: 'output', text: '🗝️ AUTHENTICATION SUCCESSFUL. OPENING CONTROL DASHBOARD...' }
        ])
        if (openAdminPanel) openAdminPanel()
      } else {
        playSound('error', isMuted, volume)
        setAdminPrompt(false)
        setTerminalHistory([
          ...newHistory,
          { type: 'error', text: '🚫 ACCESS DENIED: INVALID ADMINISTRATIVE PASSCODE.' }
        ])
      }
      return
    }

    // 1. If Decryption Game is Active
    if (decryptState.active) {
      const args = trimmedInput.toLowerCase().split(' ')
      if (args[0] === 'guess' && args[1]) {
        const updatedHistory = handleGameCommand(args[1], newHistory)
        setTerminalHistory(updatedHistory)
      } else if (args[0] === 'quit' || args[0] === 'exit') {
        playSound('power-off', isMuted, volume)
        setDecryptState({ active: false, targetCode: null, guesses: 0 })
        setTerminalHistory([
          ...newHistory,
          { type: 'output', text: 'Hacking session closed. Firewall connection terminated.' }
        ])
      } else {
        playSound('error', isMuted, volume)
        setTerminalHistory([
          ...newHistory,
          { type: 'error', text: `Unknown command inside decryption system. Use "guess [4 digits]" or "quit".` }
        ])
      }
      return
    }

    // 2. If Snake game is Active (handling Quit commands)
    if (snakeGame.active) {
      const cmd = trimmedInput.toLowerCase()
      if (cmd === 'quit' || cmd === 'exit') {
        playSound('power-off', isMuted, volume)
        clearInterval(snakeTimerRef.current)
        setSnakeGame(prev => ({ ...prev, active: false, gameOver: false }))
        setTerminalHistory([
          ...newHistory,
          { type: 'output', text: 'Snake Arcade closed. Welcome back to bash CLI.' }
        ])
      } else {
        playSound('error', isMuted, volume)
        setTerminalHistory([
          ...newHistory,
          { type: 'error', text: 'Snake Arcade in progress. Use arrow keys to navigate. Type "quit" to exit.' }
        ])
      }
      return
    }

    // 3. Standard CLI command parser
    const splitArgs = trimmedInput.toLowerCase().split(' ')
    const cmd = splitArgs[0]

    let output = []
    switch (cmd) {
      case 'help':
        playSound('click', isMuted, volume)
        output = [
          { type: 'output', text: 'Available Command Logs:' },
          { type: 'output', text: '  about      - philosophy and core principles.' },
          { type: 'output', text: '  tracks     - explore the target development pathways.' },
          { type: 'output', text: '  prizes     - overview of the cash distribution.' },
          { type: 'output', text: '  timeline   - key dates and stages.' },
          { type: 'output', text: '  register   - trigger form registration pipeline.' },
          { type: 'output', text: '  matrix     - toggles falling rain matrix effect.' },
          { type: 'output', text: '  snake      - starts interactive ASCII Snake Game.' },
          { type: 'output', text: '  game       - start crypt-hacking passcode game.' },
          { type: 'output', text: '  admin      - open system administration control panel.' },
          { type: 'output', text: '  clear      - clear output history log.' }
        ]
        break
      case 'about':
        playSound('click', isMuted, volume)
        output = [
          { type: 'output', text: 'Hacklabify V1.0 is an under-18 student hackathon. We believe in' },
          { type: 'output', text: 'rewarding craftsmanship over hype. No slides, just execution.' }
        ]
        break
      case 'tracks':
        playSound('click', isMuted, volume)
        output = [
          { type: 'output', text: 'Domains: AI (AI & Agents), CYBER (Cybersecurity), GAME (Retro Games), WEB (Web Platforms).' }
        ]
        break
      case 'prizes':
        playSound('click', isMuted, volume)
        output = [
          { type: 'output', text: 'Grand prize pool of 1,50,000 INR.' },
          { type: 'output', text: '  - Grand Craft winner: 60,000 INR' },
          { type: 'output', text: '  - Track top builds: 20,000 INR - 30,000 INR' }
        ]
        break
      case 'timeline':
        playSound('click', isMuted, volume)
        output = [
          { type: 'output', text: 'Qualifiers release: July 24, 2026.' },
          { type: 'output', text: 'Finals in Delhi: August 23–24, 2026.' }
        ]
        break
      case 'register':
        playSound('success', isMuted, volume)
        output = [{ type: 'output', text: 'Launching builder registration pass portal...' }]
        setIsRegisterModalOpen(true)
        break
      case 'matrix':
        playSound('click', isMuted, volume)
        setIsMatrixMode(prev => !prev)
        output = [{ type: 'output', text: `Matrix display rain state toggled: ${!isMatrixMode ? 'ENABLED' : 'DISABLED'}` }]
        break
      case 'snake':
        playSound('coin', isMuted, volume)
        setSnakeGame({
          active: true,
          snake: [{ x: 10, y: 5 }, { x: 9, y: 5 }],
          food: { x: 5, y: 3 },
          dir: { x: 1, y: 0 },
          score: 0,
          highScore: parseInt(localStorage.getItem('hacklabify_snake_high') || '0', 10),
          gameOver: false
        })
        output = [
          { type: 'output', text: '🎮 INITIALIZING RETRO SNAKE ARCADE...' },
          { type: 'output', text: 'USE UP/DOWN/LEFT/RIGHT (OR WASD) TO STEER.' },
          { type: 'output', text: 'TYPE "quit" AT ANY POINT TO EXIT.' }
        ]
        break
      case 'game':
        playSound('power-on', isMuted, volume)
        const digits = ['0','1','2','3','4','5','6','7','8','9']
        const target = []
        for (let i = 0; i < 4; i++) {
          const randIdx = Math.floor(Math.random() * digits.length)
          target.push(digits[randIdx])
          digits.splice(randIdx, 1)
        }
        setDecryptState({ active: true, targetCode: target, guesses: 0 })
        output = [
          { type: 'output', text: '⚠️ EMERGENCY STATUS: SYSTEMS COMPROMISED. DECRYPTION REQUIRED.' },
          { type: 'output', text: 'CRACK THE 4-DIGIT CODE WITH UNIQUE DIGITS FROM 0 TO 9.' },
          { type: 'output', text: 'Input attempts with "guess [digits]" (e.g. "guess 3824").' },
          { type: 'output', text: 'To cancel hacking session, type "quit". Ready...' }
        ]
        break
      case 'admin':
      case 'sudo':
        playSound('click', isMuted, volume)
        setAdminPrompt(true)
        setTerminalHistory([
          ...newHistory,
          { type: 'output', text: 'ENTER ADMINISTRATIVE SECURITY PASSCODE:' }
        ])
        return
      case 'clear':
        setTerminalHistory([])
        return
      default:
        playSound('error', isMuted, volume)
        output = [
          { type: 'error', text: `Command syntax not found: "${cmd}".` },
          { type: 'output', text: 'Type "help" to see available terminal logs.' }
        ]
    }

    setTerminalHistory([...newHistory, ...output])
  }

  // Theme-specific execute button configurations
  const executeBtnStyles = {
    amber: 'bg-yellow-400 text-black hover:bg-yellow-300',
    crimson: 'bg-red-500 text-white hover:bg-red-400',
    acid: 'bg-green-400 text-black hover:bg-green-300',
    void: 'bg-purple-600 text-white hover:bg-purple-500',
    cyberpunk: 'bg-cyan-400 text-black hover:bg-cyan-350',
    dracula: 'bg-pink-400 text-black hover:bg-pink-350',
    custom: 'bg-[var(--color-custom-primary)] text-[var(--color-custom-text)]'
  }
  const currentBtn = executeBtnStyles[siteTheme] || executeBtnStyles.amber

  return (
    <div className="flex-1 flex flex-col h-[400px] md:h-[480px] border border-white/10 bg-zinc-950/65 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden relative crt-overlay select-text">
      
      {/* Matrix rain canvas background */}
      {isMatrixMode && <MatrixRain theme={siteTheme} />}

      {/* Console Header */}
      <div className="flex items-center justify-between bg-zinc-900/50 border-b border-white/5 px-4 py-2.5 shrink-0 z-10 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
        </div>
        <span className="font-mono text-xs font-bold text-zinc-500 tracking-widest uppercase">
          sh_terminal_session
        </span>
        <div className="w-4 h-4 bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-mono text-[9px] text-zinc-500">
          ■
        </div>
      </div>

      {/* Logs output */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm text-green-400 space-y-2.5 z-10 relative terminal-logs">
        
        {/* Render Snake Board if active */}
        {snakeGame.active ? (
          <div className="space-y-1">
            <div className="flex justify-between border-b border-zinc-800 pb-1.5 text-[#ffdf00] font-bold select-none text-[11px]">
              <span>SCORE: {snakeGame.score}</span>
              <span>HIGH SCORE: {snakeGame.highScore}</span>
            </div>
            {renderSnakeBoard().map((line, i) => (
              <div key={i} className="leading-none whitespace-pre font-mono font-bold select-none text-emerald-400">
                {line}
              </div>
            ))}
            {snakeGame.gameOver && (
              <div className="text-center font-black text-[#ff3b30] bg-black border border-[#ff3b30]/30 p-2 animate-pulse select-none text-xs rounded-lg">
                💥 GAME OVER! TYPE "snake" TO RESTART 💥
              </div>
            )}
          </div>
        ) : (
          /* Render normal history */
          terminalHistory.map((line, idx) => (
            <div key={idx} className={line.type === 'error' ? 'text-red-400' : line.type === 'input' ? 'text-yellow-400 font-bold' : 'text-emerald-400'}>
              {line.text}
            </div>
          ))
        )}
        
        <div ref={terminalEndRef} />
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleTerminalSubmit} className="flex border-t border-white/5 bg-zinc-950/80 px-4 py-3 shrink-0 items-center z-10">
        <span className="font-mono text-xs md:text-sm font-black text-yellow-400 select-none mr-2 shrink-0">
          <span className="hidden sm:inline">guest@hacklabify:</span>~$
        </span>
        <input
          type="text"
          value={terminalInput}
          onChange={(e) => {
            if (!snakeGame.active) {
              playSound('keypress', isMuted, volume)
              setTerminalInput(e.target.value)
            }
          }}
          disabled={snakeGame.active && !snakeGame.gameOver}
          placeholder={
            snakeGame.active
              ? 'Navigate using arrows/WASD... Type "quit" here'
              : decryptState.active
              ? 'Type guess (e.g. "guess 1234")...'
              : 'Type command (e.g. "help", "snake")...'
          }
          className="flex-1 bg-transparent border-0 outline-none text-emerald-400 font-mono text-xs md:text-sm focus:ring-0 p-0"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className={`border border-white/10 ${currentBtn} px-4 py-1.5 font-mono text-[10.5px] md:text-xs font-bold uppercase rounded-lg active:scale-95 cursor-pointer shadow-md transition-all`}
        >
          EXECUTE
        </button>
      </form>

    </div>
  )
}
export default TerminalCLI
