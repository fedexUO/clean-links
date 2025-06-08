
import React from 'react';
import { X, Check } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar: number;
  onSelect: (avatar: number) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onSelect, onClose }) => {
  const avatars = [
    { id: 1, name: 'Moderno', bg: 'bg-blue-500', shape: 'rounded-full' },
    { id: 2, name: 'Geometrico', bg: 'bg-green-500', shape: 'rounded-none rotate-45' },
    { id: 3, name: 'Creativo', bg: 'bg-yellow-500', shape: 'rounded-lg' },
    { id: 4, name: 'Tech', bg: 'bg-gray-500', shape: 'rounded-md' },
    { id: 5, name: 'Natura', bg: 'bg-emerald-500', shape: 'rounded-full' },
  ];

  const handleSelect = (avatarId: number) => {
    onSelect(avatarId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Scegli Avatar</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              className="group relative p-4 border-2 border-transparent hover:border-blue-500 rounded-lg transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-12 h-12 ${avatar.bg} ${avatar.shape} flex items-center justify-center transform transition-transform group-hover:scale-110`}
                  >
                    {currentAvatar === avatar.id && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                  {currentAvatar === avatar.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-700">
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
