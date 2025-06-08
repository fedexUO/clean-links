
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

  const getOutlineClass = (outlineType: string) => {
    switch (outlineType) {
      case 'bronzo': return 'ring-2 ring-amber-400/60 ring-offset-2';
      case 'argento': return 'ring-2 ring-slate-400/60 ring-offset-2';
      case 'oro': return 'ring-2 ring-yellow-400/60 ring-offset-2';
      case 'diamante': return 'ring-2 ring-blue-400/60 ring-offset-2 shadow-lg shadow-blue-200/40';
      default: return '';
    }
  };

  const borderStyle = {
    borderWidth: `${link.style.borderWidth}px`,
    borderColor: link.style.borderColor,
    borderStyle: link.style.borderStyle,
  };

  const outlineClass = link.style.outline ? getOutlineClass(link.style.outline) : '';

  return (
    <div className="group relative">
      <div
        className={`bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-slate-100/50 ${outlineClass}`}
        style={borderStyle}
        onClick={handleClick}
      >
        {/* Link Content */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
            {link.name}
          </h3>
          <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2 opacity-60" />
        </div>
        
        {/* Descrizione o URL al hover */}
        <div className="min-h-[24px] flex items-center">
          {link.description ? (
            <>
              <p className="text-slate-600 text-xs line-clamp-2 group-hover:opacity-0 transition-opacity duration-300">
                {link.description}
              </p>
              <p className="text-slate-500 text-xs break-all line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute">
                {link.url}
              </p>
            </>
          ) : (
            <p className="text-slate-500 text-xs break-all line-clamp-1 opacity-60">
              {link.url}
            </p>
          )}
        </div>

        {/* Trasparenza interna */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none" />
      </div>

      {/* Action Buttons con stile supercircolare */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStyleEdit();
          }}
          className="bg-white/95 backdrop-blur-sm hover:bg-purple-50 text-purple-600 p-2 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110 border border-white/50"
          title="Modifica stile"
        >
          <Palette size={10} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-white/95 backdrop-blur-sm hover:bg-blue-50 text-blue-600 p-2 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110 border border-white/50"
          title="Modifica link"
        >
          <Edit3 size={10} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-white/95 backdrop-blur-sm hover:bg-red-50 text-red-600 p-2 rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-110 border border-white/50"
          title="Elimina link"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
