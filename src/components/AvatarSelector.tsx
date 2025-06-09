
import React from 'react';
import { X, Check } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar: number;
  onSelect: (avatar: number) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onSelect, onClose }) => {
  const avatars = [
    { 
      id: 1, 
      name: 'NORMALE', 
      bg: 'bg-blue-100', 
      shape: 'rounded-full',
      svg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="6" r="2" fill="currentColor"/>
          <line x1="12" y1="8" x2="12" y2="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="10" y1="18" x2="8" y2="22" stroke="currentColor" strokeWidth="2"/>
          <line x1="14" y1="18" x2="16" y2="22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 2, 
      name: 'CORSA', 
      bg: 'bg-green-100', 
      shape: 'rounded-full',
      svg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="10" cy="5" r="2" fill="currentColor"/>
          <line x1="10" y1="7" x2="14" y2="16" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="10" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="14" y1="16" x2="18" y2="20" stroke="currentColor" strokeWidth="2"/>
          <line x1="14" y1="16" x2="10" y2="20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 3, 
      name: 'SALTO', 
      bg: 'bg-yellow-100', 
      shape: 'rounded-full',
      svg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="12" cy="4" r="2" fill="currentColor"/>
          <line x1="12" y1="6" x2="12" y2="14" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="14" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="14" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 4, 
      name: 'DANZA', 
      bg: 'bg-pink-100', 
      shape: 'rounded-full',
      svg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="14" cy="5" r="2" fill="currentColor"/>
          <line x1="14" y1="7" x2="10" y2="15" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="2"/>
          <line x1="10" y1="15" x2="6" y2="19" stroke="currentColor" strokeWidth="2"/>
          <line x1="10" y1="15" x2="14" y2="19" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    { 
      id: 5, 
      name: 'RELAX', 
      bg: 'bg-purple-100', 
      shape: 'rounded-full',
      svg: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <circle cx="8" cy="6" r="2" fill="currentColor"/>
          <line x1="8" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="4" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="12" x2="20" y2="16" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="12" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
  ];

  const handleSelect = (avatarId: number) => {
    onSelect(avatarId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider text-center">SCEGLI AVATAR</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              className={`group relative p-4 border-2 transition-all hover:scale-105 rounded-2xl ${
                currentAvatar === avatar.id
                  ? 'border-blue-500 bg-blue-50/70 shadow-lg shadow-blue-200/30'
                  : 'border-slate-200/60 hover:border-slate-300/80 bg-white/50'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-16 h-16 ${avatar.bg} ${avatar.shape} flex items-center justify-center transition-all super-circle text-slate-700`}
                  >
                    {avatar.svg}
                  </div>
                  {currentAvatar === avatar.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
                  {avatar.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
