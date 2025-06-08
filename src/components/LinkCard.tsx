
import React from 'react';
import { ExternalLink, Edit3, Palette, Trash2 } from 'lucide-react';
import { LinkItem } from '../utils/linkStorage';
import { UserProfile } from '../utils/userProfile';

interface LinkCardProps {
  link: LinkItem;
  onEdit: () => void;
  onDelete: () => void;
  onStyleEdit: () => void;
  userLevel?: UserProfile['level'];
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete, onStyleEdit, userLevel }) => {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getLevelOutline = (level: UserProfile['level']) => {
    switch (level) {
      case 'bronzo': return 'ring-2 ring-amber-400/50 ring-offset-2';
      case 'argento': return 'ring-2 ring-slate-400/50 ring-offset-2';
      case 'oro': return 'ring-2 ring-yellow-400/50 ring-offset-2';
      case 'diamante': return 'ring-2 ring-blue-400/50 ring-offset-2 shadow-lg shadow-blue-200/30';
      default: return '';
    }
  };

  const borderStyle = {
    borderWidth: `${link.style.borderWidth}px`,
    borderColor: link.style.borderColor,
    borderStyle: link.style.borderStyle,
  };

  const levelOutline = userLevel ? getLevelOutline(userLevel) : '';

  return (
    <div className="group relative">
      <div
        className={`bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-slate-100/50 ${levelOutline}`}
        style={borderStyle}
        onClick={handleClick}
      >
        {/* Link Content - Ultra minimale */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
            {link.name}
          </h3>
          <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
        </div>
        
        {/* Descrizione o URL al hover */}
        <div className="min-h-[32px] flex items-center">
          {link.description ? (
            <>
              <p className="text-slate-600 text-xs line-clamp-2 group-hover:opacity-0 transition-opacity duration-200">
                {link.description}
              </p>
              <p className="text-slate-500 text-xs break-all line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute">
                {link.url}
              </p>
            </>
          ) : (
            <p className="text-slate-500 text-xs break-all line-clamp-1">
              {link.url}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons - Ancora più piccoli */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStyleEdit();
          }}
          className="bg-white/90 backdrop-blur-sm hover:bg-purple-50 text-purple-600 p-1 rounded-md transition-colors shadow-sm"
          title="Modifica stile"
        >
          <Palette size={10} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-white/90 backdrop-blur-sm hover:bg-blue-50 text-blue-600 p-1 rounded-md transition-colors shadow-sm"
          title="Modifica link"
        >
          <Edit3 size={10} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-600 p-1 rounded-md transition-colors shadow-sm"
          title="Elimina link"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
