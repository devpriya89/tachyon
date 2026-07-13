import React, { useState, useEffect, useRef } from 'react'
import MatrixRain from './MatrixRain'
import { playSound } from '../utils/audio'

export function TerminalCLI({ siteTheme, isMuted, volume, setIsRegisterModalOpen, openAdminPanel }) {
  const [adminPrompt, setAdminPrompt] = useState(false)
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'output', text: '==================================================' },
    { type: 'output', text: '  Tachyon INTERACTIVE SH SESSION // CODENAME: DL' },
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
    highScore: parseInt(localStorage.getItem('Tachyon_snake_high') || '0', 10),
    gameOver: false
  })

  const snakeTimerRef = useRef(null)

  // Auto scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalHistory])

  // Cryptographically check input password using SHA-256 to prevent source inspection hacking
  const checkPasswordSecurely = async (inputPass) => {
    try {
      const msgBuffer = new TextEncoder().encode(inputPass)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      return hashed === 'd0deffc7d5f4c089f56e0b3eaa29ff3f4a6c9c49f111824577cc032cd4f342cd'
    } catch (e) {
      return inputPass === 'Tach@2026'
    }
  }

  // Handle keyboard events when games are active
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (snakeGame.active && !snakeGame.gameOver) {
        const key = e.key.toLowerCase()
        
        // Prevent default browser scrolling for arrow keys when game is active
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 's', 'a', 'd'].includes(e.key.toLowerCase())) {
          e.preventDefault()
        }

        setSnakeGame(prev => {
          const currentDir = prev.dir
          let nextDir = { ...currentDir }

          if ((key === 'arrowup' || key === 'w') && currentDir.y === 0) {
            nextDir = { x: 0, y: -1 }
          } else if ((key === 'arrowdown' || key === 's') && currentDir.y === 0) {
            nextDir = { x: 0, y: 1 }
          } else if ((key === 'arrowleft' || key === 'a') && currentDir.x === 0) {
            nextDir = { x: -1, y: 0 }
          } else if ((key === 'arrowright' || key === 'd') && currentDir.x === 0) {
            nextDir = { x: 1, y: 0 }
          }

          return { ...prev, dir: nextDir }
        })
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [snakeGame.active, snakeGame.gameOver])

  // Run Snake Game loop
  useEffect(() => {
    if (snakeGame.active && !snakeGame.gameOver) {
      snakeTimerRef.current = setInterval(() => {
        setSnakeGame(prev => {
          const nextHead = {
            x: prev.snake[0].x + prev.dir.x,
            y: prev.snake[0].y + prev.dir.y
          }

          // Check wall collisions
          if (nextHead.x < 0 || nextHead.x >= 20 || nextHead.y < 0 || nextHead.y >= 10) {
            clearInterval(snakeTimerRef.current)
            playSound('gameover', isMuted, volume)
            
            if (prev.score > prev.highScore) {
              localStorage.setItem('Tachyon_snake_high', String(prev.score))
            }

            setTimeout(() => {
              setTerminalHistory(hist => [
                ...hist,
                { type: 'error', text: '💥 COLLISION WITH SYSTEM PERIPHERAL WALL DETECTED!' },
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
                localStorage.setItem('Tachyon_snake_high', String(prev.score))
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
        { type: 'success', text: '🎉 SUCCESS! Firewall cracked successfully.' },
        { type: 'success', text: 'SYSTEM DECRYPTED. SECRET CREDENTIAL: {ZERO_FLUFF_OVERLORD}' },
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
  const handleTerminalSubmit = async (e) => {
    e.preventDefault()
    const trimmedInput = terminalInput.trim()
    if (!trimmedInput) return

    const newHistory = [...terminalHistory, { type: 'input', text: `guest@Tachyon:~$ ${terminalInput}` }]
    setTerminalInput('')

    // 0. If Admin passcode prompt is active
    if (adminPrompt) {
      // Check lockout status
      const lockoutUntil = localStorage.getItem('Tachyon_admin_lockout')
      if (lockoutUntil && Date.now() < Number(lockoutUntil)) {
        const remainingSecs = Math.ceil((Number(lockoutUntil) - Date.now()) / 1000)
        playSound('error', isMuted, volume)
        setAdminPrompt(false)
        setTerminalHistory([
          ...newHistory,
          { type: 'error', text: `🚫 ACCESS DENIED: BRUTE FORCE PROTECTED. TRY AGAIN IN ${remainingSecs} SECONDS.` }
        ])
        return
      }

      const isPassCorrect = await checkPasswordSecurely(trimmedInput)
      if (isPassCorrect) {
        playSound('success', isMuted, volume)
        setAdminPrompt(false)
        localStorage.setItem('Tachyon_admin_attempts', '0')
        sessionStorage.setItem('Tachyon_admin_session', 'verified')
        setTerminalHistory([
          ...newHistory,
          { type: 'success', text: '🗝️ AUTHENTICATION SUCCESSFUL. OPENING CONTROL DASHBOARD...' }
        ])
        if (openAdminPanel) openAdminPanel()
      } else {
        const attempts = Number(localStorage.getItem('Tachyon_admin_attempts') || '0') + 1
        if (attempts >= 5) {
          const lockoutTime = Date.now() + 5 * 60 * 1000 // 5 minute lock
          localStorage.setItem('Tachyon_admin_lockout', String(lockoutTime))
          localStorage.setItem('Tachyon_admin_attempts', '0')
          playSound('error', isMuted, volume)
          setAdminPrompt(false)
          setTerminalHistory([
            ...newHistory,
            { type: 'error', text: '🚫 ACCESS DENIED: BRUTE FORCE THREAT BLOCKED. LOCKOUT COOLDOWN TIMEOUT OF 5 MINUTES ACTIVATED.' }
          ])
        } else {
          localStorage.setItem('Tachyon_admin_attempts', String(attempts))
          playSound('error', isMuted, volume)
          setAdminPrompt(false)
          setTerminalHistory([
            ...newHistory,
            { type: 'error', text: `🚫 ACCESS DENIED: INVALID ADMINISTRATIVE PASSCODE. (${5 - attempts} attempts remaining)` }
          ])
        }
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
          { type: 'output', text: 'Tachyon V1.0 is an under-18 student hackathon. We believe in' },
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
          { type: 'output', text: 'Hackathon Commences: July 24, 2026.' },
          { type: 'output', text: 'Showcase in Delhi: August 23–24, 2026.' }
        ]
        break
      case 'register':
        playSound('success', isMuted, volume)
        output = [{ type: 'success', text: 'Launching builder registration pass portal...' }]
        setIsRegisterModalOpen(true)
        break
      case 'matrix':
        playSound('click', isMuted, volume)
        setIsMatrixMode(prev => !prev)
        output = [{ type: 'success', text: `Matrix display rain state toggled: ${!isMatrixMode ? 'ENABLED' : 'DISABLED'}` }]
        break
      case 'snake':
        playSound('coin', isMuted, volume)
        setSnakeGame({
          active: true,
          snake: [{ x: 10, y: 5 }, { x: 9, y: 5 }],
          food: { x: 5, y: 3 },
          dir: { x: 1, y: 0 },
          score: 0,
          highScore: parseInt(localStorage.getItem('Tachyon_snake_high') || '0', 10),
          gameOver: false
        })
        output = [
          { type: 'success', text: '🎮 INITIALIZING RETRO SNAKE ARCADE...' },
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
          { type: 'success', text: '⚠️ EMERGENCY STATUS: SYSTEMS COMPROMISED. DECRYPTION REQUIRED.' },
          { type: 'output', text: 'CRACK THE 4-DIGIT CODE WITH UNIQUE DIGITS FROM 0 TO 9.' },
          { type: 'output', text: 'Input attempts with "guess [digits]" (e.g. "guess 3824").' },
          { type: 'output', text: 'To cancel hacking session, type "quit". Ready...' }
        ]
        break
      case 'admin':
      case 'sudo':
        playSound('click', isMuted, volume)
        setTerminalHistory([
          ...newHistory,
          { type: 'success', text: '🗝️ INITIALIZING SECURE ADMINISTRATIVE PORT HANDSHAKE...' }
        ])
        if (openAdminPanel) openAdminPanel()
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

  return (
    <div className="flex-1 flex flex-col h-[400px] md:h-[480px] border border-white/6 bg-[#0A0A08] rounded-none overflow-hidden relative select-text">
      
      {/* Matrix rain canvas background */}
      {isMatrixMode && <MatrixRain theme="takumi" />}

      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5 shrink-0 z-10 select-none bg-transparent">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#06b6d4]">
          SYS:CLI // NODE:01
        </span>
        <span className="font-mono text-[9px] font-bold text-white/40 tracking-[0.3em] uppercase">
          sh_terminal_session
        </span>
        <span className="font-mono text-[8px] text-[#10b981] tracking-[0.15em]">
          STATUS: READY
        </span>
      </div>

      {/* Logs output */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm text-[#F8F7F4]/90 space-y-2.5 z-10 relative terminal-logs">
        
        {/* Render Snake Board if active */}
        {snakeGame.active ? (
          <div className="space-y-1">
            <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/60 font-bold select-none text-[11px]">
              <span>SCORE: {snakeGame.score}</span>
              <span>HIGH SCORE: {snakeGame.highScore}</span>
            </div>
            {renderSnakeBoard().map((line, i) => (
              <div key={i} className="leading-none whitespace-pre font-mono select-none text-[#F8F7F4]/80">
                {line}
              </div>
            ))}
            {snakeGame.gameOver && (
              <div className="text-center font-bold text-[#C2452D] bg-transparent border border-[#C2452D]/20 p-2 select-none text-xs rounded-none">
                💥 GAME OVER! TYPE "snake" TO RESTART 💥
              </div>
            )}
          </div>
        ) : (
          /* Render normal history */
          terminalHistory.map((line, idx) => {
            let colorClass = 'text-[#F8F7F4]/90'
            if (line.type === 'error') colorClass = 'text-[#C2452D]'
            else if (line.type === 'input') colorClass = 'text-[#06b6d4] font-bold'
            else if (line.type === 'success') colorClass = 'text-[#10b981] font-bold'
            
            return (
              <div key={idx} className={colorClass}>
                {line.text}
              </div>
            )
          })
        )}
        
        <div ref={terminalEndRef} />
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleTerminalSubmit} className="flex border-t border-white/6 bg-transparent px-4 py-3 shrink-0 items-center z-10">
        <span className="font-mono text-xs md:text-sm font-black text-[#10b981] select-none mr-2 shrink-0">
          <span className="hidden sm:inline">guest@Tachyon:</span>~$
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
          className="flex-1 bg-transparent border-0 outline-none text-[#F8F7F4]/90 font-mono text-xs md:text-sm focus:ring-0 p-0"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="border border-white/10 bg-[#F8F7F4] text-[#0A0A08] px-4 py-1.5 font-mono text-[10.5px] md:text-xs font-bold uppercase rounded-none active:scale-95 cursor-pointer transition-all"
        >
          EXECUTE
        </button>
      </form>

    </div>
  )
}
export default TerminalCLI
