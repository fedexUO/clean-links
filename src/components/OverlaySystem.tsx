
import React, { useState, useCallback } from 'react';
import { StickyNote, ArrowRight, Clock, X } from 'lucide-react';
import PostItNote from './PostItNote';
import ArrowElement from './ArrowElement';
import TimerWidget from './TimerWidget';

interface PostItData {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: 'small' | 'medium' | 'large';
  text: string;
}

interface ArrowData {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  thickness: number;
  style: 'straight' | 'curved';
}

interface TimerData {
  id: string;
  x: number;
  y: number;
}

interface OverlaySystemProps {
  isVisible: boolean;
  onClose: () => void;
}

const OverlaySystem: React.FC<OverlaySystemProps> = ({ isVisible, onClose }) => {
  const [postIts, setPostIts] = useState<PostItData[]>([]);
  const [arrows, setArrows] = useState<ArrowData[]>([]);
  const [timers, setTimers] = useState<TimerData[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [mode, setMode] = useState<'select' | 'postit' | 'arrow' | 'timer'>('select');
  const [isCreatingArrow, setIsCreatingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState<{ x: number; y: number } | null>(null);

  const addPostIt = useCallback((e: React.MouseEvent) => {
    if (mode !== 'postit') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPostIt: PostItData = {
      id: `postit-${Date.now()}`,
      x: x - 50,
      y: y - 50,
      rotation: Math.random() * 6 - 3, // Random rotation between -3 and 3 degrees
      color: 'yellow',
      size: 'medium',
      text: ''
    };
    
    setPostIts(prev => [...prev, newPostIt]);
    setSelectedElement(newPostIt.id);
  }, [mode]);

  const addTimer = useCallback((e: React.MouseEvent) => {
    if (mode !== 'timer') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newTimer: TimerData = {
      id: `timer-${Date.now()}`,
      x: x - 110,
      y: y - 80
    };
    
    setTimers(prev => [...prev, newTimer]);
    setSelectedElement(newTimer.id);
  }, [mode]);

  const handleArrowCreation = useCallback((e: React.MouseEvent) => {
    if (mode !== 'arrow') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!isCreatingArrow) {
      setArrowStart({ x, y });
      setIsCreatingArrow(true);
    } else if (arrowStart) {
      const newArrow: ArrowData = {
        id: `arrow-${Date.now()}`,
        startX: arrowStart.x,
        startY: arrowStart.y,
        endX: x,
        endY: y,
        color: 'black',
        thickness: 3,
        style: 'straight'
      };
      
      setArrows(prev => [...prev, newArrow]);
      setSelectedElement(newArrow.id);
      setIsCreatingArrow(false);
      setArrowStart(null);
    }
  }, [mode, isCreatingArrow, arrowStart]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    switch (mode) {
      case 'postit':
        addPostIt(e);
        break;
      case 'arrow':
        handleArrowCreation(e);
        break;
      case 'timer':
        addTimer(e);
        break;
      case 'select':
        setSelectedElement(null);
        break;
    }
  };

  const updatePostIt = useCallback((id: string, updates: Partial<PostItData>) => {
    setPostIts(prev => prev.map(postit => 
      postit.id === id ? { ...postit, ...updates } : postit
    ));
  }, []);

  const updateArrow = useCallback((id: string, updates: Partial<ArrowData>) => {
    setArrows(prev => prev.map(arrow => 
      arrow.id === id ? { ...arrow, ...updates } : arrow
    ));
  }, []);

  const updateTimer = useCallback((id: string, updates: { x: number; y: number }) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id ? { ...timer, ...updates } : timer
    ));
  }, []);

  const deletePostIt = useCallback((id: string) => {
    setPostIts(prev => prev.filter(postit => postit.id !== id));
    setSelectedElement(null);
  }, []);

  const deleteArrow = useCallback((id: string) => {
    setArrows(prev => prev.filter(arrow => arrow.id !== id));
    setSelectedElement(null);
  }, []);

  const deleteTimer = useCallback((id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
    setSelectedElement(null);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('select')}
            className={`p-3 rounded-xl transition-all ${
              mode === 'select' 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Seleziona"
          >
            <div className="w-4 h-4 border-2 border-current"></div>
          </button>
          
          <button
            onClick={() => setMode('postit')}
            className={`p-3 rounded-xl transition-all ${
              mode === 'postit' 
                ? 'bg-yellow-500 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Aggiungi Post-it"
          >
            <StickyNote size={16} />
          </button>
          
          <button
            onClick={() => setMode('arrow')}
            className={`p-3 rounded-xl transition-all ${
              mode === 'arrow' 
                ? 'bg-green-500 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Aggiungi Freccia"
          >
            <ArrowRight size={16} />
          </button>
          
          <button
            onClick={() => setMode('timer')}
            className={`p-3 rounded-xl transition-all ${
              mode === 'timer' 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Aggiungi Timer"
          >
            <Clock size={16} />
          </button>
          
          <div className="w-px h-8 bg-gray-300 mx-2"></div>
          
          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 transition-all"
            title="Chiudi"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        style={{ 
          cursor: mode === 'select' ? 'default' : mode === 'postit' ? 'copy' : mode === 'arrow' ? 'crosshair' : 'copy'
        }}
      >
        {/* Post-its */}
        {postIts.map(postit => (
          <PostItNote
            key={postit.id}
            {...postit}
            onUpdate={updatePostIt}
            onDelete={deletePostIt}
            isSelected={selectedElement === postit.id}
            onSelect={setSelectedElement}
          />
        ))}

        {/* Arrows */}
        {arrows.map(arrow => (
          <ArrowElement
            key={arrow.id}
            {...arrow}
            onUpdate={updateArrow}
            onDelete={deleteArrow}
            isSelected={selectedElement === arrow.id}
            onSelect={setSelectedElement}
          />
        ))}

        {/* Timers */}
        {timers.map(timer => (
          <TimerWidget
            key={timer.id}
            {...timer}
            onUpdate={updateTimer}
            onDelete={deleteTimer}
            isSelected={selectedElement === timer.id}
            onSelect={setSelectedElement}
          />
        ))}

        {/* Arrow creation preview */}
        {isCreatingArrow && arrowStart && (
          <div className="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%">
              <line
                x1={arrowStart.x}
                y1={arrowStart.y}
                x2={arrowStart.x + 50}
                y2={arrowStart.y + 50}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Instructions */}
      {mode !== 'select' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm">
          {mode === 'postit' && 'Clicca per aggiungere un post-it'}
          {mode === 'arrow' && (isCreatingArrow ? 'Clicca per terminare la freccia' : 'Clicca per iniziare una freccia')}
          {mode === 'timer' && 'Clicca per aggiungere un timer'}
        </div>
      )}
    </div>
  );
};

export default OverlaySystem;
