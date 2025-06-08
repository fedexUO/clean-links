
import React, { useState } from 'react';
import { Palette } from 'lucide-react';
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
    { value: 'solid', label: 'Solido' },
    { value: 'dashed', label: 'Tratteggiato' },
    { value: 'dotted', label: 'Puntinato' },
    { value: 'double', label: 'Doppio' },
  ] as const;

  const outlineStyles = [
    { value: 'none', label: 'Nessuno', level: null },
    { value: 'bronzo', label: 'Bronzo', level: 'bronzo' },
    { value: 'argento', label: 'Argento', level: 'argento' },
    { value: 'oro', label: 'Oro', level: 'oro' },
    { value: 'diamante', label: 'Diamante', level: 'diamante' },
  ] as const;

  const updateStyle = (field: keyof LinkItem['style'], value: any) => {
    const newStyle = { ...style, [field]: value };
    setStyle(newStyle);
    onSave(newStyle); // Applicazione in tempo reale
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

  const isOutlineUnlocked = (level: string | null) => {
    if (!level) return true;
    if (!userLevel) return false;
    
    const levels = ['bronzo', 'argento', 'oro', 'diamante'];
    const userLevelIndex = levels.indexOf(userLevel);
    const requiredLevelIndex = levels.indexOf(level);
    
    return userLevelIndex >= requiredLevelIndex;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-white/30">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100/70 rounded-2xl">
            <Palette className="text-purple-600" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Personalizza Stile</h2>
        </div>

        {/* Anteprima compatta */}
        <div className="mb-6 p-3 bg-slate-50/70 rounded-2xl">
          <p className="text-xs text-slate-500 mb-2">Anteprima:</p>
          <div
            className={`bg-white/90 p-3 rounded-xl transition-all duration-300 ${getOutlineClass(style.outline || 'none')}`}
            style={{
              borderWidth: `${style.borderWidth}px`,
              borderColor: style.borderColor,
              borderStyle: style.borderStyle,
            }}
          >
            <h3 className="font-medium text-slate-800 text-sm">{link.name}</h3>
            <p className="text-slate-500 text-xs mt-1">{link.description || link.url}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Color Wheel */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Colore Bordo
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={style.borderColor}
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="w-16 h-16 rounded-2xl border-2 border-slate-200 cursor-pointer shadow-sm transition-transform hover:scale-105"
              />
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-1">Colore selezionato:</div>
                <div className="text-xs font-mono text-slate-500 bg-slate-100/70 px-2 py-1 rounded-lg">
                  {style.borderColor}
                </div>
              </div>
            </div>
          </div>

          {/* Border Width */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Spessore: {style.borderWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={style.borderWidth}
              onChange={(e) => updateStyle('borderWidth', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1px</span>
              <span>8px</span>
            </div>
          </div>

          {/* Border Style con anteprime */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Stile Bordo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {borderStyles.map((borderStyle) => (
                <button
                  key={borderStyle.value}
                  type="button"
                  onClick={() => updateStyle('borderStyle', borderStyle.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all hover:scale-[1.02] ${
                    style.borderStyle === borderStyle.value
                      ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-md shadow-blue-200/30'
                      : 'border-slate-200/60 text-slate-600 hover:border-slate-300/80 bg-white/50'
                  }`}
                >
                  <div className="mb-2">{borderStyle.label}</div>
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
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Outline Livello
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
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all relative ${
                      style.outline === outline.value
                        ? 'border-blue-500 bg-blue-50/70 text-blue-700 shadow-md shadow-blue-200/30'
                        : isUnlocked
                        ? 'border-slate-200/60 text-slate-600 hover:border-slate-300/80 bg-white/50 hover:scale-[1.02]'
                        : 'border-slate-200/30 text-slate-400 bg-slate-50/30 cursor-not-allowed'
                    }`}
                  >
                    <div className="mb-2">{outline.label}</div>
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
