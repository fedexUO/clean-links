
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Clock, Edit3 } from 'lucide-react';

interface TimerWidgetProps {
  id: string;
  x: number;
  y: number;
  onUpdate: (id: string, updates: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
}

const TimerWidget: React.FC<TimerWidgetProps> = ({
  id,
  x,
  y,
  onUpdate,
  onDelete
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingTime, setIsSettingTime] = useState(true);
  const [inputMinutes, setInputMinutes] = useState('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Crea un suono di campanella usando Web Audio API
    const createBellSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Suona la campanella
            createBellSound();
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
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetTime = () => {
    const minutes = parseInt(inputMinutes);
    if (minutes > 0 && minutes <= 999) {
      const totalSeconds = minutes * 60;
      setTimeLeft(totalSeconds);
      setInitialTime(totalSeconds);
      setIsSettingTime(false);
    }
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRunning(!isRunning);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRunning(false);
    setIsSettingTime(true);
    setInputMinutes(Math.floor(initialTime / 60).toString());
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSettingTime || e.target !== e.currentTarget) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - x, y: e.clientY - y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = Math.max(0, Math.min(window.innerWidth - 220, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragStart.y));
    onUpdate(id, { x: newX, y: newY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
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

  const progressPercentage = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  if (isSettingTime) {
    return (
      <div
        className="absolute bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-2xl shadow-2xl min-w-[220px]"
        style={{ left: x, top: y, zIndex: 1000 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-blue-400" />
          <span className="text-sm font-semibold">Imposta Timer</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Minuti:</label>
            <input
              type="number"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="es. 25"
              min="1"
              max="999"
              autoFocus
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(id)}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-sm transition-all"
            >
              Annulla
            </button>
            <button
              onClick={handleSetTime}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-all"
            >
              Avvia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-2xl shadow-2xl cursor-move select-none transition-all duration-200 min-w-[220px] ${
        isDragging ? 'scale-105 shadow-3xl z-50' : 'hover:shadow-3xl'
      }`}
      style={{
        left: x,
        top: y,
        zIndex: isDragging ? 1000 : isHovered ? 500 : 200
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover controls */}
      {isHovered && !isDragging && (
        <div className="absolute -top-3 -right-3 flex gap-1 z-[1001]">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md transition-all"
            title="Modifica tempo"
          >
            <Edit3 size={12} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-all"
            title="Elimina timer"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-blue-400" />
        <span className="text-sm font-semibold">Timer</span>
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
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handlePlayPause}
          className={`p-2 rounded-full transition-all ${
            isRunning 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleReset}
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
