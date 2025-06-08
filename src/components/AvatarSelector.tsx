
import React from 'react';
import { X, Check } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar: number;
  onSelect: (avatar: number) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onSelect, onClose }) => {
  const avatars = [
    { id: 1, name: '😊', bg: 'bg-blue-100', shape: 'rounded-full', content: '😊' },
    { id: 2, name: '🚀', bg: 'bg-purple-100', shape: 'rounded-full', content: '🚀' },
    { id: 3, name: '🎨', bg: 'bg-pink-100', shape: 'rounded-full', content: '🎨' },
    { id: 4, name: '⭐', bg: 'bg-yellow-100', shape: 'rounded-full', content: '⭐' },
    { id: 5, name: '🔥', bg: 'bg-red-100', shape: 'rounded-full', content: '🔥' },
    { id: 6, name: '💎', bg: 'bg-cyan-100', shape: 'rounded-full', content: '💎' },
    { id: 7, name: '🌟', bg: 'bg-indigo-100', shape: 'rounded-full', content: '🌟' },
    { id: 8, name: '🎯', bg: 'bg-emerald-100', shape: 'rounded-full', content: '🎯' },
  ];

  const handleSelect = (avatarId: number) => {
    onSelect(avatarId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Scegli Avatar</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              className={`group relative p-3 border-2 transition-all hover:scale-105 rounded-2xl ${
                currentAvatar === avatar.id
                  ? 'border-blue-500 bg-blue-50/70 shadow-lg shadow-blue-200/30'
                  : 'border-slate-200/60 hover:border-slate-300/80 bg-white/50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-12 h-12 ${avatar.bg} ${avatar.shape} flex items-center justify-center transition-all super-circle text-xl`}
                  >
                    {avatar.content}
                  </div>
                  {currentAvatar === avatar.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
