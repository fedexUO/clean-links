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
  const [mode, setMode] = useState<'postit' | 'arrow' | 'timer' | null>(null);
  const [isCreatingArrow, setIsCreatingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState<{ x: number; y: number } | null>(null);

  const addPostIt = useCallback((e: React.MouseEvent) => {
    if (mode !== 'postit') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPostIt: PostItData = {
      id: `postit-${Date.now()}`,
      x: Math.max(0, x - 50),
      y: Math.max(0, y - 50),
      rotation: Math.random() * 6 - 3,
      color: 'yellow',
      size: 'medium',
      text: ''
    };
    
    setPostIts(prev => [...prev, newPostIt]);
    setMode(null);
  }, [mode]);

  const addTimer = useCallback((e: React.MouseEvent) => {
    if (mode !== 'timer') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newTimer: TimerData = {
      id: `timer-${Date.now()}`,
      x: Math.max(0, x - 110),
      y: Math.max(0, y - 80)
    };
    
    setTimers(prev => [...prev, newTimer]);
    setMode(null);
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
      setIsCreatingArrow(false);
      setArrowStart(null);
      setMode(null);
    }
  }, [mode, isCreatingArrow, arrowStart]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!mode) return;
    e.preventDefault();
    e.stopPropagation();
    
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
  }, []);

  const deleteArrow = useCallback((id: string) => {
    setArrows(prev => prev.filter(arrow => arrow.id !== id));
  }, []);

  const deleteTimer = useCallback((id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Toolbar - Always visible when overlay is active */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50 z-50 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'postit' ? null : 'postit')}
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
            onClick={() => {
              if (mode === 'arrow') {
                setMode(null);
                setIsCreatingArrow(false);
                setArrowStart(null);
              } else {
                setMode('arrow');
              }
            }}
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
            onClick={() => setMode(mode === 'timer' ? null : 'timer')}
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
            title="Chiudi overlay"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Canvas - Solo quando si sta aggiungendo un elemento */}
      {mode && (
        <div
          className="fixed inset-0 z-40 pointer-events-auto"
          onClick={handleCanvasClick}
          style={{ 
            cursor: mode === 'postit' ? 'copy' : mode === 'arrow' ? 'crosshair' : mode === 'timer' ? 'copy' : 'default'
          }}
        />
      )}

      {/* Post-its - Always visible */}
      {postIts.map(postit => (
        <PostItNote
          key={postit.id}
          {...postit}
          onUpdate={updatePostIt}
          onDelete={deletePostIt}
        />
      ))}

      {/* Arrows - Always visible */}
      {arrows.map(arrow => (
        <ArrowElement
          key={arrow.id}
          {...arrow}
          onUpdate={updateArrow}
          onDelete={deleteArrow}
        />
      ))}

      {/* Timers - Always visible */}
      {timers.map(timer => (
        <TimerWidget
          key={timer.id}
          {...timer}
          onUpdate={updateTimer}
          onDelete={deleteTimer}
        />
      ))}

      {/* Arrow creation preview */}
      {isCreatingArrow && arrowStart && (
        <div className="fixed inset-0 pointer-events-none z-30">
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

      {/* Instructions */}
      {mode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm z-50 pointer-events-none">
          {mode === 'postit' && 'Clicca per aggiungere un post-it'}
          {mode === 'arrow' && (isCreatingArrow ? 'Clicca per terminare la freccia' : 'Clicca per iniziare una freccia')}
          {mode === 'timer' && 'Clicca per aggiungere un timer'}
        </div>
      )}
    </>
  );
};

export default OverlaySystem;
