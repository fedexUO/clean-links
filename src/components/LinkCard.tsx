
import React from 'react';
import { ExternalLink, Edit3, Palette, Trash2 } from 'lucide-react';
import { LinkItem } from '../utils/linkStorage';
import { getFaviconUrl } from '../utils/faviconService';

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

  const getBorderClass = (borderType: string) => {
    const effectClasses = {
      'oro-colante': 'oro-colante',
      'argento-colante': 'argento-colante',
      'bronzo-colante': 'bronzo-colante',
      'lava-colante': 'lava-colante',
      'diamanti-luccicanti': 'diamanti-luccicanti',
      'lego-border': 'lego-border'
    };
    return effectClasses[borderType as keyof typeof effectClasses] || '';
  };

  const isEffectBorder = ['oro-colante', 'argento-colante', 'bronzo-colante', 'lava-colante', 'diamanti-luccicanti', 'lego-border'].includes(link.style.borderStyle);

  const borderStyle = isEffectBorder ? {} : {
    borderWidth: `${link.style.borderWidth}px`,
    borderColor: link.style.borderColor,
    borderStyle: link.style.borderStyle,
  };

  const borderClass = isEffectBorder ? getBorderClass(link.style.borderStyle) : '';

  // Check if it's a YouTube link for special styling
  const isYouTube = link.url.includes('youtube.com') || link.url.includes('youtu.be');

  return (
    <div className="group relative">
      <div
        className={`bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-slate-100/50 lego-box ${borderClass} ${isYouTube ? 'youtube-premium' : ''}`}
        style={borderStyle}
        onClick={handleClick}
      >
        {/* Link Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <img
                src={getFaviconUrl(link.url)}
                alt={`${link.name} favicon`}
                className="w-4 h-4 rounded-sm"
                onError={(e) => {
                  // Se il favicon non carica, mostra l'icona di default
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <ExternalLink size={16} className="text-slate-400 hidden" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider line-clamp-1">
              {link.name}
            </h3>
          </div>
          
          {link.description && (
            <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider line-clamp-2">
              {link.description}
            </p>
          )}
          
          <p className="text-slate-400 text-xs uppercase tracking-wider truncate">
            {link.url.replace(/^https?:\/\//, '')}
          </p>
        </div>

        {/* Trasparenza interna */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none" />
      </div>

      {/* Action Buttons */}
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStyleEdit();
          }}
          className="bg-purple-600/90 hover:bg-purple-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm super-circle"
          title="MODIFICA STILE"
        >
          <Palette size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-blue-600/90 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm super-circle"
          title="MODIFICA LINK"
        >
          <Edit3 size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm super-circle"
          title="ELIMINA"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
