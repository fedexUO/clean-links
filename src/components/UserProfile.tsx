
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
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative group">
          <button
            onClick={onEditAvatar}
            className="relative block"
          >
            <div
              className={`w-16 h-16 ${avatarStyle.bg} ${avatarStyle.shape} flex items-center justify-center transition-transform hover:scale-105`}
            >
              <User size={24} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <Edit3 size={16} className="text-white" />
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onEditUsername}
              className="font-semibold text-slate-800 hover:text-blue-600 transition-colors"
            >
              {profile.username}
            </button>
            <Edit3 size={14} className="text-slate-400" />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <LevelBadge level={profile.level} size="sm" />
            <span className="text-sm text-slate-500">
              {profile.xp} XP
            </span>
          </div>

          {/* Progress Bar */}
          {profile.level !== 'diamante' && (
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-right text-xs text-slate-500">
          <div>Login: {profile.consecutiveLogins} giorni</div>
          <div>Link: {profile.stats.linksCreated}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
