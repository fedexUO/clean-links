
import React, { useRef } from 'react';
import { X, Check, Upload } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgrounds = [
    {
      id: 1,
      name: 'Tramonto Dorato',
      className: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
      style: {
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.25) 0%, transparent 60%)'
      }
    }
  ];

  const handleCustomUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // Store custom background in localStorage
        localStorage.setItem('customBackground', imageUrl);
        // Use ID 999 for custom background
        onSelect(999);
      };
      reader.readAsDataURL(file);
    }
  };

  const customBackground = localStorage.getItem('customBackground');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 w-full max-w-sm shadow-2xl border border-white/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Sfondi</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100/70 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Preset backgrounds */}
          <div className="flex gap-2">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onSelect(bg.id)}
                className={`relative flex-1 aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                  currentBackground === bg.id
                    ? 'border-blue-500 ring-2 ring-blue-200/50 shadow-lg shadow-blue-200/30'
                    : 'border-slate-200/60 hover:border-slate-300/80'
                }`}
              >
                <div
                  className={`w-full h-full rounded-lg ${bg.className} overflow-hidden relative`}
                  style={bg.style}
                >
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full" />
                    <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/40 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white/50 rounded-full" />
                  </div>
                </div>
                {currentBackground === bg.id && (
                  <div className="absolute top-1 right-1 p-0.5 bg-blue-500 rounded-full">
                    <Check size={8} className="text-white" />
                  </div>
                )}
              </button>
            ))}

            {/* Custom background preview */}
            {customBackground && (
              <button
                onClick={() => onSelect(999)}
                className={`relative flex-1 aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                  currentBackground === 999
                    ? 'border-blue-500 ring-2 ring-blue-200/50 shadow-lg shadow-blue-200/30'
                    : 'border-slate-200/60 hover:border-slate-300/80'
                }`}
              >
                <div
                  className="w-full h-full rounded-lg overflow-hidden relative bg-cover bg-center"
                  style={{ backgroundImage: `url(${customBackground})` }}
                />
                {currentBackground === 999 && (
                  <div className="absolute top-1 right-1 p-0.5 bg-blue-500 rounded-full">
                    <Check size={8} className="text-white" />
                  </div>
                )}
              </button>
            )}
          </div>

          <div className="text-xs text-slate-600 mb-2">Sfondo personalizzato</div>
          
          {/* Upload button */}
          <button
            onClick={handleCustomUpload}
            className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-400 transition-colors duration-150 flex items-center justify-center gap-2 text-slate-600 hover:text-slate-700"
          >
            <Upload size={16} />
            <span className="text-sm font-medium">Carica sfondo</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="text-xs text-slate-500 text-center">
            Supporta immagini, GIF animate e video
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
