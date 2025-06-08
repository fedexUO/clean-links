
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
      name: 'Aurora Boreale',
      className: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      animation: 'animate-pulse',
      style: {
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite'
      }
    },
    {
      id: 2,
      name: 'Onde Oceaniche',
      className: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50',
      animation: 'animate-bounce',
      style: {
        backgroundImage: 'radial-gradient(ellipse at 25% 25%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
        animation: 'float 6s ease-in-out infinite'
      }
    },
    {
      id: 3,
      name: 'Tramonto Dorato',
      className: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.25) 0%, transparent 60%)',
        animation: 'glow 5s ease-in-out infinite alternate'
      }
    },
    {
      id: 4,
      name: 'Foresta Nebbiosa',
      className: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.2) 0%, transparent 50%)',
        animation: 'drift 8s ease-in-out infinite'
      }
    },
    {
      id: 5,
      name: 'Galassia Viola',
      className: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.25) 0%, transparent 50%)',
        animation: 'sparkle 7s ease-in-out infinite'
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Sfondi Animati</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onSelect(bg.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                currentBackground === bg.id
                  ? 'border-blue-500 ring-2 ring-blue-200/50 shadow-lg shadow-blue-200/30'
                  : 'border-slate-200/60 hover:border-slate-300/80'
              }`}
            >
              <div
                className={`w-full h-24 rounded-xl ${bg.className} overflow-hidden relative`}
                style={bg.style}
              >
                {/* Elementi animati decorativi */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                  <div className="absolute bottom-3 right-3 w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                  <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium text-slate-700">{bg.name}</span>
                {currentBackground === bg.id && (
                  <div className="p-1 bg-blue-500 rounded-full">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          @keyframes glow {
            0% { filter: brightness(1) saturate(1); }
            100% { filter: brightness(1.1) saturate(1.2); }
          }
          @keyframes drift {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(5px); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BackgroundSelector;
