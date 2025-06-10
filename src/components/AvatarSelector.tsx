import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import CustomAvatarUpload from './CustomAvatarUpload';

interface AvatarSelectorProps {
  currentAvatar: number;
  onSelect: (avatar: number) => void;
  onClose: () => void;
  customAvatar?: string;
  onCustomAvatarSelect?: (imageUrl: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  currentAvatar, 
  onSelect, 
  onClose,
  customAvatar,
  onCustomAvatarSelect
}) => {
  const [showCustomUpload, setShowCustomUpload] = useState(false);

  const getAvatarContent = (avatarId: number) => {
    const avatars = [
      { 
        bg: 'bg-blue-100',
        svg: (
          <svg viewBox="0 0 24 24" className="w-6 h-6">
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
          <svg viewBox="0 0 24 24" className="w-6 h-6">
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
          <svg viewBox="0 0 24 24" className="w-6 h-6">
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
          <svg viewBox="0 0 24 24" className="w-6 h-6">
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
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <circle cx="8" cy="6" r="2" fill="currentColor"/>
            <line x1="8" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
            <line x1="4" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="12" x2="20" y2="16" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="12" x2="12" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
    ];
    return avatars[avatarId - 1] || avatars[0];
  };

  const handleCustomAvatarSelect = (imageUrl: string) => {
    if (onCustomAvatarSelect) {
      onCustomAvatarSelect(imageUrl);
    }
    setShowCustomUpload(false);
    onClose();
  };

  if (showCustomUpload) {
    return (
      <CustomAvatarUpload
        onImageSelect={handleCustomAvatarSelect}
        onClose={() => setShowCustomUpload(false)}
        currentCustomAvatar={customAvatar}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
            SCEGLI AVATAR
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((avatarId) => {
            const avatar = getAvatarContent(avatarId);
            return (
              <button
                key={avatarId}
                onClick={() => {
                  onSelect(avatarId);
                  onClose();
                }}
                className={`w-16 h-16 ${avatar.bg} rounded-full flex items-center justify-center transition-all hover:scale-105 super-circle text-slate-700 ${
                  currentAvatar === avatarId ? 'ring-4 ring-blue-500' : ''
                }`}
              >
                {avatar.svg}
              </button>
            );
          })}

          {/* Custom Avatar Option */}
          <button
            onClick={() => setShowCustomUpload(true)}
            className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center transition-all hover:scale-105 super-circle text-purple-600 border-2 border-dashed border-purple-300"
          >
            {customAvatar ? (
              <img
                src={customAvatar}
                alt="Custom avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Upload size={20} />
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-600 border border-slate-300/60 rounded-2xl hover:bg-slate-50/70 transition-all font-bold uppercase tracking-widest"
          >
            CHIUDI
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
