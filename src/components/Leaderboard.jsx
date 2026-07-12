import React from 'react';
import { Trophy } from 'lucide-react';

export function Leaderboard({ leaderboards }) {
  const games = [
    { id: 'invaders', title: 'GALACTIC CORE', accent: 'text-arcade-cyan', border: 'border-arcade-cyan/20' },
    { id: 'tetris', title: 'MAINFRAME GRID', accent: 'text-arcade-neon', border: 'border-arcade-neon/20' },
    { id: 'pong', title: 'LASER PADDLE', accent: 'text-arcade-amber', border: 'border-arcade-amber/20' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-mono">
      {games.map((g) => {
        const list = leaderboards[g.id] || [];
        return (
          <div 
            key={g.id} 
            className={`border border-white/5 bg-[#09080e]/60 p-5 rounded-3xl flex flex-col shadow-lg relative`}
          >
            {/* Header capsule */}
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <span className={`font-orbitron font-black text-sm tracking-wider ${g.accent}`}>
                {g.title}
              </span>
              <Trophy className={`w-4 h-4 ${g.accent}`} />
            </div>

            {/* Scores Table */}
            <div className="space-y-1.5 flex-1">
              {list.length === 0 ? (
                <div className="py-6 text-center font-mono text-[10px] text-zinc-500 uppercase">
                  No records established yet
                </div>
              ) : (
                list.slice(0, 5).map((entry, index) => {
                  const rankColors = ['text-arcade-amber', 'text-zinc-300', 'text-[#cd7f32]', 'text-zinc-500', 'text-zinc-600'];
                  return (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-zinc-950/40 border border-white/5 p-2.5 rounded-xl hover:bg-zinc-900/40 transition-colors font-mono text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-orbitron font-extrabold w-4 text-center ${rankColors[index] || 'text-zinc-500'}`}>
                          {index + 1}
                        </span>
                        <span className="text-3xl leading-none scale-[0.6] select-none">
                          {entry.avatar || '👾'}
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide">
                          {entry.username}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold font-orbitron ${g.accent}`}>
                          {entry.score.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Leaderboard;
