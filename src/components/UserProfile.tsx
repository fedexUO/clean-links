import React from 'react';
import { Edit3 } from 'lucide-react';
import { UserProfile as UserProfileType, getNextLevelXP } from '../utils/userProfile';
import LevelBadge from './LevelBadge';

interface UserProfileProps {
  profile: UserProfileType;
  onEditAvatar: () => void;
  onEditUsername: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, onEditAvatar, onEditUsername }) => {
  const nextLevelXP = getNextLevelXP(profile.level);
  const progressPercentage = profile.level === 'diamante' 
    ? 100 
    : (profile.xp / nextLevelXP) * 100;
  
  const pointsToNextLevel = profile.level === 'diamante' ? 0 : nextLevelXP - profile.xp;

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
        bg: 'bg-green-100',
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
        bg: 'bg-yellow-100',
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
        bg: 'bg-pink-100',
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
        bg: 'bg-purple-100',
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

  const avatar = getAvatarContent(profile.avatar);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100/50">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <button
            onClick={onEditAvatar}
            className="relative block"
          >
            <div
              className={`w-14 h-14 ${profile.customAvatar ? '' : avatar.bg} rounded-full flex items-center justify-center transition-all hover:scale-105 super-circle text-slate-700 overflow-hidden`}
            >
              {profile.customAvatar ? (
                <img
                  src={profile.customAvatar}
                  alt="Custom avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                avatar.svg
              )}
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <Edit3 size={14} className="text-white" />
            </div>
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onEditUsername}
              className="font-bold text-slate-800 hover:text-blue-600 transition-colors text-sm uppercase tracking-wider"
            >
              {profile.username}
            </button>
            <Edit3 size={12} className="text-slate-400" />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <LevelBadge level={profile.level} size="sm" />
            <span className="text-xs text-slate-500 font-bold uppercase">
              {profile.xp} XP
            </span>
            {profile.level !== 'diamante' && (
              <span className="text-xs text-slate-400 bg-slate-100/70 px-2 py-0.5 rounded-full font-bold uppercase">
                -{pointsToNextLevel} PER LEVEL UP
              </span>
            )}
          </div>

          {profile.level !== 'diamante' && (
            <div className="w-full bg-slate-200/70 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>

        <div className="text-right text-xs text-slate-500 font-bold uppercase">
          <div>LOGIN: {profile.consecutiveLogins}</div>
          <div>LINK: {profile.stats.linksCreated}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
