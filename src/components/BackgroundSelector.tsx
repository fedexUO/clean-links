
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
    // Statico
    {
      id: 1,
      name: 'Tramonto Dorato',
      type: 'static',
      className: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.25) 0%, transparent 60%)'
      }
    },
    
    // Fase 1 - Essenziali (MVP)
    {
      id: 2,
      name: 'Matrix Rain',
      type: 'animated',
      className: 'bg-black relative overflow-hidden',
      animation: 'matrix-rain'
    },
    {
      id: 3,
      name: 'Tron Grid',
      type: 'animated',
      className: 'bg-slate-900 relative overflow-hidden',
      animation: 'tron-grid'
    },
    {
      id: 4,
      name: 'Starfield Warp',
      type: 'animated',
      className: 'bg-slate-900 relative overflow-hidden',
      animation: 'starfield-warp'
    },
    {
      id: 5,
      name: 'Binary Rain',
      type: 'animated',
      className: 'bg-green-900 relative overflow-hidden',
      animation: 'binary-rain'
    },
    
    // Fase 2 - Popolari
    {
      id: 6,
      name: 'Neural Network',
      type: 'animated',
      className: 'bg-blue-900 relative overflow-hidden',
      animation: 'neural-network'
    },
    {
      id: 7,
      name: 'Synthwave Sunset',
      type: 'animated',
      className: 'bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden',
      animation: 'synthwave-sunset'
    },
    {
      id: 8,
      name: 'Pixel Rain',
      type: 'animated',
      className: 'bg-cyan-900 relative overflow-hidden',
      animation: 'pixel-rain'
    },
    {
      id: 9,
      name: 'Glitch Effect',
      type: 'animated',
      className: 'bg-red-900 relative overflow-hidden',
      animation: 'glitch-effect'
    },
    
    // Fase 3 - Avanzati
    {
      id: 10,
      name: 'Plasma Waves',
      type: 'animated',
      className: 'bg-purple-900 relative overflow-hidden',
      animation: 'plasma-waves'
    },
    {
      id: 11,
      name: 'Geometric Mandala',
      type: 'animated',
      className: 'bg-indigo-900 relative overflow-hidden',
      animation: 'geometric-mandala'
    },
    {
      id: 12,
      name: 'Particle Constellation',
      type: 'animated',
      className: 'bg-slate-900 relative overflow-hidden',
      animation: 'particle-constellation'
    },
    {
      id: 13,
      name: 'Code Stream',
      type: 'animated',
      className: 'bg-green-900 relative overflow-hidden',
      animation: 'code-stream'
    }
  ];

  const renderAnimationPreview = (animation: string) => {
    const animationElements = {
      'matrix-rain': (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-0.5 h-full bg-green-400 opacity-60 animate-pulse" />
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-green-400 opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-0 left-3/4 w-0.5 h-full bg-green-400 opacity-80 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      ),
      'tron-grid': (
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }} />
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 opacity-60" />
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-cyan-400 opacity-60" />
        </div>
      ),
      'starfield-warp': (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-80 animate-ping" />
          <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-white rounded-full opacity-90 animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      ),
      'binary-rain': (
        <div className="absolute inset-0 text-green-400 text-xs overflow-hidden">
          <div className="absolute top-0 left-1/4 animate-pulse">1010</div>
          <div className="absolute top-1/3 left-1/2 animate-pulse" style={{ animationDelay: '0.3s' }}>0110</div>
          <div className="absolute top-2/3 left-3/4 animate-pulse" style={{ animationDelay: '0.6s' }}>1101</div>
        </div>
      ),
      'neural-network': (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full opacity-80" />
          <div className="absolute top-3/4 left-3/4 w-2 h-2 bg-blue-400 rounded-full opacity-60" />
          <div className="absolute top-1/4 left-1/4 w-8 h-0.5 bg-blue-400 opacity-40 rotate-45 origin-left" />
          <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-blue-400 opacity-40 rotate-12 origin-left" />
        </div>
      ),
      'synthwave-sunset': (
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-40" style={{
            backgroundImage: 'linear-gradient(90deg, transparent 49%, #ff00ff 50%, transparent 51%)',
            backgroundSize: '16px 100%'
          }} />
          <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-yellow-400 rounded-full opacity-60" />
        </div>
      ),
      'pixel-rain': (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 opacity-60" />
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 opacity-80" />
          <div className="absolute top-3/4 left-3/4 w-2 h-2 bg-cyan-400 opacity-60" />
        </div>
      ),
      'glitch-effect': (
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 w-full h-1 bg-red-400 opacity-60" />
          <div className="absolute top-2/3 left-0 w-3/4 h-1 bg-blue-400 opacity-40" />
          <div className="absolute top-1/2 left-1/4 w-1/2 h-1 bg-green-400 opacity-80" />
        </div>
      ),
      'plasma-waves': (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-purple-400 via-transparent to-pink-400 opacity-60 animate-pulse" />
        </div>
      ),
      'geometric-mandala': (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-400 rotate-45 opacity-60" />
          <div className="absolute w-6 h-6 border-2 border-indigo-400 rounded-full opacity-40" />
        </div>
      ),
      'particle-constellation': (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-80" />
          <div className="absolute top-1/3 left-2/3 w-1 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white rounded-full opacity-90" />
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white rounded-full opacity-70" />
        </div>
      ),
      'code-stream': (
        <div className="absolute inset-0 text-green-400 text-xs">
          <div className="absolute top-1/4 left-2 opacity-60">{'<div>'}</div>
          <div className="absolute top-1/2 left-4 opacity-80">{'func()'}</div>
          <div className="absolute top-3/4 left-1 opacity-40">{'return'}</div>
        </div>
      )
    };

    return animationElements[animation as keyof typeof animationElements] || null;
  };

  const groupedBackgrounds = [
    { title: "Statico", items: backgrounds.slice(0, 1) },
    { title: "Essenziali", items: backgrounds.slice(1, 5) },
    { title: "Popolari", items: backgrounds.slice(5, 9) },
    { title: "Avanzati", items: backgrounds.slice(9, 13) }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 w-full max-w-md shadow-2xl border border-white/30 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Sfondi</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100/70 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)] space-y-4">
          {groupedBackgrounds.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-medium text-slate-600 mb-2 px-1">{group.title}</h3>
              <div className="space-y-2">
                {group.items.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onSelect(bg.id)}
                    className={`relative p-3 rounded-xl border-2 transition-all hover:scale-[1.02] w-full ${
                      currentBackground === bg.id
                        ? 'border-blue-500 ring-2 ring-blue-200/50 shadow-lg shadow-blue-200/30'
                        : 'border-slate-200/60 hover:border-slate-300/80'
                    }`}
                  >
                    <div
                      className={`w-full h-16 rounded-lg ${bg.className} overflow-hidden relative`}
                      style={bg.type === 'static' ? bg.style : undefined}
                    >
                      {bg.type === 'animated' && bg.animation && renderAnimationPreview(bg.animation)}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-slate-700">{bg.name}</span>
                      {currentBackground === bg.id && (
                        <div className="p-1 bg-blue-500 rounded-full">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
