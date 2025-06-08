
import React from 'react';
import { User, Edit3 } from 'lucide-react';
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

  const getAvatarStyle = (avatarId: number) => {
    const avatars = [
      { bg: 'bg-blue-500', shape: 'rounded-full' },
      { bg: 'bg-green-500', shape: 'rounded-none rotate-45' },
      { bg: 'bg-yellow-500', shape: 'rounded-lg' },
      { bg: 'bg-gray-500', shape: 'rounded-md' },
      { bg: 'bg-emerald-500', shape: 'rounded-full' },
    ];
    return avatars[avatarId - 1] || avatars[0];
  };

  const avatarStyle = getAvatarStyle(profile.avatar);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100/50">
      <div className="flex items-center gap-4">
        {/* Avatar senza outline */}
        <div className="relative group">
          <button
            onClick={onEditAvatar}
            className="relative block"
          >
            <div
              className={`w-14 h-14 ${avatarStyle.bg} ${avatarStyle.shape} flex items-center justify-center transition-all hover:scale-105`}
            >
              <User size={20} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <Edit3 size={14} className="text-white" />
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onEditUsername}
              className="font-semibold text-slate-800 hover:text-blue-600 transition-colors text-sm"
            >
              {profile.username}
            </button>
            <Edit3 size={12} className="text-slate-400" />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <LevelBadge level={profile.level} size="sm" />
            <span className="text-xs text-slate-500">
              {profile.xp} XP
            </span>
            {profile.level !== 'diamante' && (
              <span className="text-xs text-slate-400 bg-slate-100/70 px-2 py-0.5 rounded-full">
                -{pointsToNextLevel} per level up
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {profile.level !== 'diamante' && (
            <div className="w-full bg-slate-200/70 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-right text-xs text-slate-500">
          <div>Login: {profile.consecutiveLogins}</div>
          <div>Link: {profile.stats.linksCreated}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
