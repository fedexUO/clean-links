
import React, { useState, useRef, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';

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
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - x, y: e.clientY - y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(id);
    }, 300);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(id, { text: e.target.value });
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`absolute ${sizeClasses[size]} ${colorClasses[color as keyof typeof colorClasses]} border-2 shadow-lg cursor-move select-none transition-all duration-100 ${
        isDragging ? 'scale-105 shadow-xl z-50' : 'hover:shadow-xl'
      } ${isDeleting ? 'animate-pulse scale-75 opacity-0' : ''}`}
      style={{
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        zIndex: isDragging ? 1000 : isHovered ? 500 : 100
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Corner fold effect */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white/30 rotate-45 border-r border-t border-gray-300/50"></div>
      
      {/* Hover controls */}
      {isHovered && !isEditing && !isDragging && (
        <div className="absolute -top-3 -right-3 flex gap-1">
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-md transition-all"
            title="Modifica testo"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-all"
            title="Elimina post-it"
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
          onKeyDown={handleKeyDown}
          className="w-full h-full p-2 bg-transparent border-none outline-none resize-none text-sm font-handwriting"
          placeholder="Scrivi qui..."
        />
      ) : (
        <div className="w-full h-full p-2 text-sm font-handwriting break-words overflow-hidden flex items-center justify-center text-center">
          {text || 'Clicca la matita per scrivere'}
        </div>
      )}
    </div>
  );
};

export default PostItNote;
