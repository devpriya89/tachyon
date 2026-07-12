import React, { useState } from 'react';
import { Award, Sparkles, Check } from 'lucide-react';
import { playRetroSound } from '../utils/soundSynth';

const AVATARS = [
  { id: 'hacker1', label: 'NEON GHOST', symbol: '👾' },
  { id: 'hacker2', label: 'CYBER WIZARD', symbol: '🧙' },
  { id: 'hacker3', label: 'AGENT-DL', symbol: '🕵️' },
  { id: 'hacker4', label: 'PIXEL BOT', symbol: '🤖' }
];

export function PlayerProfile({ profile, setProfile, achievements, isMuted, volume }) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.username);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    
    playRetroSound('score', isMuted, volume);
    const updated = { ...profile, username: tempName.trim() };
    setProfile(updated);
    localStorage.setItem('tachyon_arcade_profile', JSON.stringify(updated));
    setEditing(false);
  };

  const handleSelectAvatar = (av) => {
    playRetroSound('rotate', isMuted, volume);
    const updated = { ...profile, avatar: av.symbol, avatarId: av.id };
    setProfile(updated);
    localStorage.setItem('tachyon_arcade_profile', JSON.stringify(updated));
  };

  // Level computation logic
  const expTarget = profile.level * 1000;
  const expPercentage = Math.min(100, Math.floor((profile.exp / expTarget) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* 1. Main Profile Info Card */}
      <div className="lg:col-span-1 border border-white/5 bg-[#09080e]/60 p-6 rounded-3xl flex flex-col items-center text-center shadow-lg relative">
        <div className="absolute top-4 right-4 bg-arcade-purple/10 border border-arcade-purple/35 text-arcade-purple text-[9px] font-black uppercase px-2.5 py-0.5 rounded-lg select-none">
          SYS_OPERATOR
        </div>

        {/* Large Avatar frame */}
        <div className="w-24 h-24 rounded-full bg-[#050407] border-2 border-arcade-purple flex items-center justify-center text-5xl shadow-[0_0_15px_rgba(168,85,247,0.2)] mb-4 select-none animate-bounce [animation-duration:3s]">
          {profile.avatar}
        </div>

        {/* Edit Username */}
        {editing ? (
          <form onSubmit={handleSaveName} className="w-full flex gap-2">
            <input
              type="text"
              value={tempName}
              maxLength={15}
              onChange={(e) => setTempName(e.target.value)}
              className="flex-1 bg-zinc-950/60 border border-white/10 px-3 py-1.5 font-mono text-xs text-white rounded-xl outline-none focus:border-arcade-purple"
            />
            <button
              type="submit"
              className="bg-arcade-purple text-white p-2 rounded-xl active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-orbitron font-extrabold text-xl text-white uppercase tracking-wider">
              {profile.username}
            </h3>
            <button
              onClick={() => {
                setTempName(profile.username);
                setEditing(true);
              }}
              className="text-[9px] font-mono text-zinc-500 hover:text-white uppercase cursor-pointer"
            >
              [Edit]
            </button>
          </div>
        )}

        <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-4">
          ID: {profile.userId}
        </span>

        {/* Level and EXP status bar */}
        <div className="w-full space-y-2 border-t border-white/5 pt-4">
          <div className="flex justify-between items-end font-mono">
            <div className="text-left">
              <span className="block text-[8px] text-zinc-500 uppercase tracking-widest">RANK LEVEL</span>
              <span className="font-orbitron text-base font-black text-arcade-cyan neon-text-cyan">
                LVL {profile.level}
              </span>
            </div>
            <div className="text-right text-[10px] text-zinc-400">
              EXP: {profile.exp} / {expTarget}
            </div>
          </div>

          {/* Progress bar container */}
          <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-arcade-purple to-arcade-cyan rounded-full transition-all duration-500 shadow-[0_0_8px_#a855f7]"
              style={{ width: `${expPercentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* 2. Avatar Selection Panel */}
      <div className="lg:col-span-1 border border-white/5 bg-[#09080e]/60 p-6 rounded-3xl flex flex-col justify-between shadow-lg">
        <div>
          <span className="block font-mono text-[9px] font-bold text-zinc-500 tracking-wider uppercase mb-3.5 border-b border-white/5 pb-1">
            SELECT RETRO AVATAR
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {AVATARS.map((av) => {
              const isSelected = profile.avatarId === av.id;
              return (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(av)}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-arcade-cyan bg-arcade-cyan/10 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-3xl">{av.symbol}</span>
                  <span className="font-mono text-[9px] font-bold uppercase">{av.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Achievements Progress Grid */}
      <div className="lg:col-span-1 border border-white/5 bg-[#09080e]/60 p-6 rounded-3xl flex flex-col shadow-lg">
        <span className="block font-mono text-[9px] font-bold text-zinc-500 tracking-wider uppercase mb-3.5 border-b border-white/5 pb-1">
          LOCKED / UNLOCKED ACHIEVEMENTS
        </span>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className={`flex items-start gap-3 border p-2.5 rounded-2xl transition-all ${
                ach.unlocked 
                  ? 'border-arcade-amber/30 bg-arcade-amber/5 text-white' 
                  : 'border-white/5 bg-zinc-950/30 text-zinc-500'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                ach.unlocked ? 'bg-arcade-amber/15 text-arcade-amber shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-zinc-900 text-zinc-600'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className={`block font-mono text-[10.5px] font-black uppercase ${ach.unlocked ? 'text-arcade-amber' : 'text-zinc-500'}`}>
                  {ach.title}
                </span>
                <p className="text-[10px] text-zinc-400 leading-normal">{ach.desc}</p>
                {ach.unlocked && (
                  <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-arcade-cyan font-mono mt-1">
                    <Sparkles className="w-2.5 h-2.5" /> UNLOCKED (+{ach.xpReward} XP)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
export default PlayerProfile;
