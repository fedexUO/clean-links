
import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';

interface PostItNoteProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: 'small' | 'medium' | 'large';
  text: string;
  onUpdate: (id: string, updates: Partial<PostItNoteProps>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PostItNote: React.FC<PostItNoteProps> = ({
  id,
  x,
  y,
  rotation,
  color,
  size,
  text,
  onUpdate,
  onDelete,
  isSelected,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  const colorClasses = {
    yellow: 'bg-yellow-200 border-yellow-300',
    pink: 'bg-pink-200 border-pink-300',
    green: 'bg-green-200 border-green-300',
    blue: 'bg-blue-200 border-blue-300',
    orange: 'bg-orange-200 border-orange-300',
    purple: 'bg-purple-200 border-purple-300'
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
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

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(id, { text: e.target.value });
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = (rotation + 15) % 360;
    onUpdate(id, { rotation: newRotation });
  };

  return (
    <div
      className={`absolute ${sizeClasses[size]} ${colorClasses[color as keyof typeof colorClasses]} border-2 shadow-lg cursor-move select-none transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${isDragging ? 'scale-105 shadow-xl' : 'hover:shadow-xl'}`}
      style={{
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        zIndex: isSelected ? 1000 : 100
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Corner fold effect */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white/30 rotate-45 border-r border-t border-gray-300/50"></div>
      
      {isSelected && (
        <div className="absolute -top-8 -right-8 flex gap-1">
          <button
            onClick={handleRotate}
            className="bg-white/90 hover:bg-white text-gray-600 p-1 rounded-full shadow-md"
          >
            <RotateCw size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="bg-red-500/90 hover:bg-red-500 text-white p-1 rounded-full shadow-md"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          className="w-full h-full p-2 bg-transparent border-none outline-none resize-none text-sm font-handwriting"
          style={{ transform: `rotate(-${rotation}deg)` }}
        />
      ) : (
        <div className="w-full h-full p-2 text-sm font-handwriting break-words overflow-hidden">
          {text || 'Doppio click per modificare'}
        </div>
      )}
    </div>
  );
};

export default PostItNote;
