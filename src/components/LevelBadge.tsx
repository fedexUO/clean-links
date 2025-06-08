
import React from 'react';
import { Badge, Shield, Star, Crown, Gem } from 'lucide-react';
import { UserProfile } from '../utils/userProfile';

interface LevelBadgeProps {
  level: UserProfile['level'];
  size?: 'sm' | 'md' | 'lg';
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md' }) => {
  const getLevelConfig = () => {
    switch (level) {
      case 'bronzo':
        return {
          icon: Badge,
          color: 'bg-amber-600 text-white',
          name: 'Bronzo',
        };
      case 'argento':
        return {
          icon: Shield,
          color: 'bg-slate-500 text-white',
          name: 'Argento',
        };
      case 'oro':
        return {
          icon: Star,
          color: 'bg-yellow-500 text-white',
          name: 'Oro',
        };
      case 'diamante':
        return {
          icon: Gem,
          color: 'bg-blue-600 text-white',
          name: 'Diamante',
        };
      default:
        return {
          icon: Badge,
          color: 'bg-amber-600 text-white',
          name: 'Bronzo',
        };
    }
  };

  const config = getLevelConfig();
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}>
      <IconComponent size={iconSizes[size]} />
      <span>{config.name}</span>
    </div>
  );
};

export default LevelBadge;
