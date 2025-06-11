
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Clock } from 'lucide-react';

interface TimerWidgetProps {
  id: string;
  x: number;
  y: number;
  onUpdate: (id: string, updates: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const TimerWidget: React.FC<TimerWidgetProps> = ({
  id,
  x,
  y,
  onUpdate,
  onDelete,
  isSelected,
  onSelect
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('pomodoro');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const presets = {
    pomodoro: { name: 'Pomodoro', time: 25 * 60 },
    shortBreak: { name: 'Pausa Breve', time: 5 * 60 },
    longBreak: { name: 'Pausa Lunga', time: 15 * 60 },
    focus45: { name: 'Focus 45', time: 45 * 60 },
    focus15: { name: 'Focus 15', time: 15 * 60 }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Timer completed notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Timer Completato!', {
                body: `Il timer ${presets[selectedPreset as keyof typeof presets].name} è terminato.`,
                icon: '/favicon.ico'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, selectedPreset]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    setTimeLeft(presets[preset as keyof typeof presets].time);
    setIsRunning(false);
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(presets[selectedPreset as keyof typeof presets].time);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - x, y: e.clientY - y });
    onSelect(id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    onUpdate(id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const progressPercentage = ((presets[selectedPreset as keyof typeof presets].time - timeLeft) / presets[selectedPreset as keyof typeof presets].time) * 100;

  return (
    <div
      className={`absolute bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-2xl shadow-2xl cursor-move select-none transition-all duration-200 min-w-[220px] ${
        isSelected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
      } ${isDragging ? 'scale-105 shadow-3xl' : 'hover:shadow-3xl'}`}
      style={{
        left: x,
        top: y,
        zIndex: isSelected ? 1000 : 200
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Delete button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md"
        >
          <X size={12} />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-blue-400" />
        <span className="text-sm font-semibold">Timer</span>
      </div>

      {/* Preset selector */}
      <div className="mb-4">
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(presets).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timer display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-mono font-bold mb-2">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          className={`p-2 rounded-full transition-all ${
            isRunning 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="p-2 bg-slate-600 hover:bg-slate-500 rounded-full transition-all"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Status indicator */}
      <div className="text-center mt-2">
        <span className={`text-xs ${timeLeft === 0 ? 'text-green-400' : isRunning ? 'text-blue-400' : 'text-slate-400'}`}>
          {timeLeft === 0 ? 'Completato!' : isRunning ? 'In corso...' : 'In pausa'}
        </span>
      </div>
    </div>
  );
};

export default TimerWidget;
