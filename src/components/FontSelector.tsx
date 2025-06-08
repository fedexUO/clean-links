
import React, { useState } from 'react';
import { Type, X } from 'lucide-react';

interface FontSelectorProps {
  currentFont: string;
  onSelect: (font: string) => void;
  onClose: () => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ currentFont, onSelect, onClose }) => {
  const fonts = [
    { 
      name: 'SF Pro', 
      value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      className: 'font-system'
    },
    { 
      name: 'Inter', 
      value: 'Inter, system-ui, sans-serif',
      className: 'font-inter'
    },
    { 
      name: 'Roboto', 
      value: 'Roboto, system-ui, sans-serif',
      className: 'font-roboto'
    },
    { 
      name: 'Poppins', 
      value: 'Poppins, system-ui, sans-serif',
      className: 'font-poppins'
    },
    { 
      name: 'Montserrat', 
      value: 'Montserrat, system-ui, sans-serif',
      className: 'font-montserrat'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Type className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-slate-800">Scegli Font</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {fonts.map((font) => (
            <button
              key={font.value}
              onClick={() => onSelect(font.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                currentFont === font.value
                  ? 'border-blue-500 bg-blue-50/70 shadow-md shadow-blue-200/30'
                  : 'border-slate-200/60 hover:border-slate-300/80 bg-white/50'
              }`}
              style={{ fontFamily: font.value }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-slate-800">{font.name}</span>
                <span className="text-sm text-slate-500" style={{ fontFamily: font.value }}>
                  Abc 123
                </span>
              </div>
              <p className="text-left text-sm text-slate-600 mt-1" style={{ fontFamily: font.value }}>
                Anteprima del font selezionato
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
