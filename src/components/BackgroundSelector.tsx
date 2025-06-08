
import React from 'react';
import { X, Check } from 'lucide-react';

interface BackgroundSelectorProps {
  currentBackground: number;
  onSelect: (background: number) => void;
  onClose: () => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ 
  currentBackground, 
  onSelect, 
  onClose 
}) => {
  const backgrounds = [
    {
      id: 1,
      name: 'Gradient Wave',
      className: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      style: {}
    },
    {
      id: 2,
      name: 'Ocean Breeze',
      className: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
      }
    },
    {
      id: 3,
      name: 'Sunset Glow',
      className: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)'
      }
    },
    {
      id: 4,
      name: 'Forest Mist',
      className: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)'
      }
    },
    {
      id: 5,
      name: 'Cosmic Purple',
      className: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Scegli Sfondo</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onSelect(bg.id)}
              className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                currentBackground === bg.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-full h-20 rounded-lg ${bg.className}`}
                style={bg.style}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium text-slate-700">{bg.name}</span>
                {currentBackground === bg.id && (
                  <Check size={16} className="text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
