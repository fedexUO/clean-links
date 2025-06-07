
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
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
        style={borderStyle}
        onClick={handleClick}
      >
        {/* Link Content */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
            {link.name}
          </h3>
          <ExternalLink size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
        
        <p className="text-slate-500 text-sm break-all">
          {link.url}
        </p>
        
        {link.description && (
          <p className="text-slate-600 text-sm mt-2">
            {link.description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStyleEdit();
          }}
          className="bg-purple-100 hover:bg-purple-200 text-purple-600 p-2 rounded-lg transition-colors"
          title="Modifica stile"
        >
          <Palette size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition-colors"
          title="Modifica link"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
          title="Elimina link"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
