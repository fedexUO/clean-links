
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

const StyleEditor: React.FC<StyleEditorProps> = ({ link, onSave, onClose }) => {
  const [style, setStyle] = useState(link.style);

  const borderStyles = [
    { value: 'solid', label: 'SOLIDO', effect: false },
    { value: 'dashed', label: 'TRATTEGGIATO', effect: false },
    { value: 'dotted', label: 'PUNTINATO', effect: false },
    { value: 'double', label: 'DOPPIO', effect: false },
    { value: 'oro-colante', label: '🔥 ORO COLANTE', effect: true },
    { value: 'argento-colante', label: '❄️ ARGENTO COLANTE', effect: true },
    { value: 'bronzo-colante', label: '🔥🟤 BRONZO COLANTE', effect: true },
    { value: 'lava-colante', label: '🌋 LAVA COLANTE', effect: true },
    { value: 'diamanti-luccicanti', label: '💎 DIAMANTI', effect: true },
    { value: 'lego-border', label: '🧱 LEGO', effect: true },
  ] as const;

  const updateStyle = (field: keyof LinkItem['style'], value: any) => {
    const newStyle = { ...style, [field]: value };
    setStyle(newStyle);
    onSave(newStyle);
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

  const ColorWheel = () => {
    const colors = [
      '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#ADFF2F',
      '#00FF00', '#00FA9A', '#00CED1', '#00BFFF', '#0000FF',
      '#8A2BE2', '#9400D3', '#FF00FF', '#FF1493', '#DC143C'
    ];

    return (
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          {colors.map((color, index) => {
            const angle = (index * 360) / colors.length;
            const radius = 50;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <button
                key={color}
                onClick={() => updateStyle('borderColor', color)}
                className={`absolute w-6 h-6 rounded-full border-2 transition-all hover:scale-125 ${
                  style.borderColor === color ? 'border-slate-800 ring-2 ring-slate-300' : 'border-white'
                }`}
                style={{
                  backgroundColor: color,
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 12px)`,
                }}
              />
            );
          })}
          {/* Centro della ruota */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-slate-300"></div>
        </div>
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
            className={`bg-white/90 p-3 rounded-xl transition-all duration-300 ${getBorderClass(style.borderStyle)}`}
            style={{
              borderWidth: `${style.borderWidth}px`,
              borderColor: style.borderColor,
              borderStyle: borderStyles.find(b => b.value === style.borderStyle)?.effect ? 'solid' : style.borderStyle,
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
                  <div className="mb-2 text-center text-xs">{borderStyle.label}</div>
                  <div 
                    className={`w-full h-2 bg-slate-400 mx-auto transition-all ${
                      borderStyle.effect ? getBorderClass(borderStyle.value) : ''
                    }`}
                    style={{ 
                      borderStyle: borderStyle.effect ? 'solid' : borderStyle.value, 
                      borderWidth: '2px', 
                      borderColor: borderStyle.effect ? 'transparent' : '#64748b',
                      height: borderStyle.effect ? '16px' : '8px'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
