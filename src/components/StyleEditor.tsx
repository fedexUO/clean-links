
import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { LinkItem } from '../utils/linkStorage';
import { UserProfile } from '../utils/userProfile';

interface StyleEditorProps {
  link: LinkItem;
  onSave: (style: LinkItem['style']) => void;
  onClose: () => void;
  userLevel?: UserProfile['level'];
}

const StyleEditor: React.FC<StyleEditorProps> = ({ link, onSave, onClose, userLevel }) => {
  const [style, setStyle] = useState(link.style);

  const borderStyles = [
    { value: 'solid', label: 'SOLIDO' },
    { value: 'dashed', label: 'TRATTEGGIATO' },
    { value: 'dotted', label: 'PUNTINATO' },
    { value: 'double', label: 'DOPPIO' },
  ] as const;

  const outlineStyles = [
    { value: 'none', label: 'NESSUNO', level: null },
    { value: 'bronzo', label: 'BRONZO', level: 'bronzo' },
    { value: 'argento', label: 'ARGENTO', level: 'argento' },
    { value: 'oro', label: 'ORO', level: 'oro' },
    { value: 'diamante', label: 'DIAMANTE', level: 'diamante' },
  ] as const;

  const updateStyle = (field: keyof LinkItem['style'], value: any) => {
    const newStyle = { ...style, [field]: value };
    setStyle(newStyle);
    onSave(newStyle);
  };

  const getOutlineClass = (outlineType: string) => {
    switch (outlineType) {
      case 'bronzo': return 'ring-2 ring-amber-400/60 ring-offset-2 bronzo-animation';
      case 'argento': return 'ring-2 ring-slate-400/60 ring-offset-2 argento-animation';
      case 'oro': return 'ring-2 ring-yellow-400/60 ring-offset-2 oro-animation';
      case 'diamante': return 'ring-2 ring-blue-400/60 ring-offset-2 shadow-lg shadow-blue-200/40 diamante-animation';
      default: return '';
    }
  };

  const isOutlineUnlocked = (level: string | null) => {
    if (!level) return true;
    if (!userLevel) return false;
    
    const levels = ['bronzo', 'argento', 'oro', 'diamante'];
    const userLevelIndex = levels.indexOf(userLevel);
    const requiredLevelIndex = levels.indexOf(level);
    
    return userLevelIndex >= requiredLevelIndex;
  };

  const ColorWheel = () => {
    const colors = [
      '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#ADFF2F',
      '#00FF00', '#00FA9A', '#00CED1', '#00BFFF', '#0000FF',
      '#8A2BE2', '#9400D3', '#FF00FF', '#FF1493', '#DC143C'
    ];

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => updateStyle('borderColor', color)}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
              style.borderColor === color ? 'border-slate-800 ring-2 ring-slate-300' : 'border-slate-200'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-white/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100/70 rounded-2xl">
              <Palette className="text-purple-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider text-center">PERSONALIZZA STILE</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Anteprima compatta */}
        <div className="mb-6 p-3 bg-slate-50/70 rounded-2xl">
          <p className="text-xs text-slate-500 mb-2 uppercase font-bold text-center">ANTEPRIMA:</p>
          <div
            className={`bg-white/90 p-3 rounded-xl transition-all duration-300 ${getOutlineClass(style.outline || 'none')}`}
            style={{
              borderWidth: `${style.borderWidth}px`,
              borderColor: style.borderColor,
              borderStyle: style.borderStyle,
            }}
          >
            <h3 className="font-bold text-slate-800 text-sm uppercase text-center">{link.name}</h3>
            <p className="text-slate-500 text-xs mt-1 uppercase text-center">{link.description || link.url}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Color Wheel */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-center">
              COLORE BORDO
            </label>
            <ColorWheel />
          </div>

          {/* Border Width */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-center">
              SPESSORE: {style.borderWidth}PX
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={style.borderWidth}
              onChange={(e) => updateStyle('borderWidth', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 font-bold uppercase">
              <span>1PX</span>
              <span>8PX</span>
            </div>
          </div>

          {/* Border Style */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-center">
              STILE BORDO
            </label>
            <div className="grid grid-cols-2 gap-2">
              {borderStyles.map((borderStyle) => (
                <button
                  key={borderStyle.value}
                  type="button"
                  onClick={() => updateStyle('borderStyle', borderStyle.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-bold uppercase transition-all hover:scale-[1.02] ${
                    style.borderStyle === borderStyle.value
                      ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-md shadow-blue-200/30'
                      : 'border-slate-200/60 text-slate-600 hover:border-slate-300/80 bg-white/50'
                  }`}
                >
                  <div className="mb-2 text-center">{borderStyle.label}</div>
                  <div 
                    className="w-full h-1 bg-slate-400"
                    style={{ borderStyle: borderStyle.value, borderWidth: '2px', borderColor: '#64748b' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Outline Styles */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider text-center">
              OUTLINE LIVELLO
            </label>
            <div className="grid grid-cols-2 gap-2">
              {outlineStyles.map((outline) => {
                const isUnlocked = isOutlineUnlocked(outline.level);
                return (
                  <button
                    key={outline.value}
                    type="button"
                    onClick={() => isUnlocked && updateStyle('outline', outline.value)}
                    disabled={!isUnlocked}
                    className={`p-3 rounded-xl border-2 text-sm font-bold uppercase transition-all relative ${
                      style.outline === outline.value
                        ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-md shadow-blue-200/30'
                        : isUnlocked
                        ? 'border-slate-200/60 text-slate-600 hover:border-slate-300/80 bg-white/50 hover:scale-[1.02]'
                        : 'border-slate-200/30 text-slate-400 bg-slate-50/30 cursor-not-allowed'
                    }`}
                  >
                    <div className="mb-2 text-center">{outline.label}</div>
                    <div 
                      className={`w-8 h-8 bg-white/90 rounded-lg mx-auto transition-all ${
                        outline.value !== 'none' ? getOutlineClass(outline.value) : 'border border-slate-300'
                      }`}
                    />
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                        <span className="text-xs text-slate-500">🔒</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
