
import React from 'react';
import { ExternalLink, Edit3, Palette, Trash2 } from 'lucide-react';
import { LinkItem } from '../utils/linkStorage';

interface LinkCardProps {
  link: LinkItem;
  onEdit: () => void;
  onDelete: () => void;
  onStyleEdit: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete, onStyleEdit }) => {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const borderStyle = {
    borderWidth: `${link.style.borderWidth}px`,
    borderColor: link.style.borderColor,
    borderStyle: link.style.borderStyle,
  };

  return (
    <div className="group relative">
      <div
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-slate-100"
        style={borderStyle}
        onClick={handleClick}
      >
        {/* Link Content - Stile iOS più compatto */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-slate-800 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
            {link.name}
          </h3>
          <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
        </div>
        
        <p className="text-slate-500 text-xs break-all line-clamp-1 mb-1">
          {link.url}
        </p>
        
        {link.description && (
          <p className="text-slate-600 text-sm line-clamp-2">
            {link.description}
          </p>
        )}
      </div>

      {/* Action Buttons - Più piccoli e iOS style */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStyleEdit();
          }}
          className="bg-white/80 backdrop-blur-sm hover:bg-purple-50 text-purple-600 p-1.5 rounded-lg transition-colors shadow-sm"
          title="Modifica stile"
        >
          <Palette size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-white/80 backdrop-blur-sm hover:bg-blue-50 text-blue-600 p-1.5 rounded-lg transition-colors shadow-sm"
          title="Modifica link"
        >
          <Edit3 size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-white/80 backdrop-blur-sm hover:bg-red-50 text-red-600 p-1.5 rounded-lg transition-colors shadow-sm"
          title="Elimina link"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
