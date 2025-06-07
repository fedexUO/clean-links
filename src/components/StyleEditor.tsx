
import React, { useState } from 'react';
import { X, Save, Palette } from 'lucide-react';
import { LinkItem } from '../utils/linkStorage';

interface StyleEditorProps {
  link: LinkItem;
  onSave: (style: LinkItem['style']) => void;
  onClose: () => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ link, onSave, onClose }) => {
  const [style, setStyle] = useState(link.style);

  const presetColors = [
    '#e2e8f0', // slate-200
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
  ];

  const borderStyles = [
    { value: 'solid', label: 'Solido' },
    { value: 'dashed', label: 'Tratteggiato' },
    { value: 'dotted', label: 'Puntinato' },
    { value: 'double', label: 'Doppio' },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(style);
    onClose();
  };

  const updateStyle = (field: keyof LinkItem['style'], value: any) => {
    setStyle(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Palette className="text-purple-600" size={20} />
            <h2 className="text-xl font-semibold text-slate-800">
              Personalizza Stile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-2">Anteprima:</p>
          <div
            className="bg-white p-4 rounded-lg"
            style={{
              borderWidth: `${style.borderWidth}px`,
              borderColor: style.borderColor,
              borderStyle: style.borderStyle,
            }}
          >
            <h3 className="font-semibold text-slate-800">{link.name}</h3>
            <p className="text-slate-500 text-sm">{link.url}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Colore Bordo
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateStyle('borderColor', color)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    style.borderColor === color
                      ? 'border-slate-400 scale-110'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={style.borderColor}
              onChange={(e) => updateStyle('borderColor', e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
            />
          </div>

          {/* Border Width */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Spessore: {style.borderWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="8"
              value={style.borderWidth}
              onChange={(e) => updateStyle('borderWidth', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1px</span>
              <span>8px</span>
            </div>
          </div>

          {/* Border Style */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Stile Bordo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {borderStyles.map((borderStyle) => (
                <button
                  key={borderStyle.value}
                  type="button"
                  onClick={() => updateStyle('borderStyle', borderStyle.value)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    style.borderStyle === borderStyle.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {borderStyle.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Applica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StyleEditor;
