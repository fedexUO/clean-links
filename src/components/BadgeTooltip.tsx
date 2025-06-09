
import React, { useState } from 'react';
import { UserProfile, getNextLevelXP, LEVEL_REQUIREMENTS } from '../utils/userProfile';
import { Currency } from '../utils/currency';

interface BadgeTooltipProps {
  profile: UserProfile;
  currency: Currency;
  children: React.ReactNode;
}

const BadgeTooltip: React.FC<BadgeTooltipProps> = ({ profile, currency, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const nextLevelXP = getNextLevelXP(profile.level);
  const pointsToNextLevel = profile.level === 'diamante' ? 0 : nextLevelXP - profile.xp;
  
  const getNextLevel = () => {
    switch (profile.level) {
      case 'bronzo': return 'argento';
      case 'argento': return 'oro';
      case 'oro': return 'diamante';
      case 'diamante': return 'diamante';
      default: return 'argento';
    }
  };

  const getNextLevelPreview = () => {
    const nextLevel = getNextLevel();
    const previews = {
      argento: '🔓 Outline argento colante',
      oro: '🔓 Outline oro colante + 50 monete',
      diamante: '🔓 Outline diamanti + 100 monete + Badge speciale'
    };
    return previews[nextLevel as keyof typeof previews] || '';
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="tooltip show absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-lg min-w-48">
            <div className="text-center mb-2">
              <span className="font-bold uppercase">{profile.level}</span>
            </div>
            
            <div className="space-y-1 text-center">
              <div>XP: {profile.xp}/{nextLevelXP}</div>
              <div>💰 Monete: {currency.coins}</div>
              {profile.level !== 'diamante' && (
                <>
                  <div className="text-yellow-300">
                    -{pointsToNextLevel} XP per level up
                  </div>
                  <div className="text-green-300 text-xs mt-2">
                    {getNextLevelPreview()}
                  </div>
                </>
              )}
            </div>
            
            {/* Freccia del tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeTooltip;
