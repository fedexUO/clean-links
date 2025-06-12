import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ArrowElementProps {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  thickness: number;
  style: 'straight' | 'curved';
  onUpdate: (id: string, updates: Partial<ArrowElementProps>) => void;
  onDelete: (id: string) => void;
}

const ArrowElement: React.FC<ArrowElementProps> = ({
  id,
  startX,
  startY,
  endX,
  endY,
  color,
  thickness,
  style,
  onUpdate,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState<'start' | 'end' | 'line' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const colorClasses = {
    black: '#000000',
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b'
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isDragging) {
        setIsHovered(false);
      }
    }, 150);
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end' | 'line') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(type);
    setIsHovered(true);
    
    if (type === 'line') {
      setDragOffset({
        x: e.clientX - (startX + endX) / 2,
        y: e.clientY - (startY + endY) / 2
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const newX = Math.max(0, Math.min(window.innerWidth, e.clientX));
    const newY = Math.max(0, Math.min(window.innerHeight, e.clientY));

    switch (isDragging) {
      case 'start':
        onUpdate(id, { startX: newX, startY: newY });
        break;
      case 'end':
        onUpdate(id, { endX: newX, endY: newY });
        break;
      case 'line':
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const deltaX = newX - dragOffset.x - centerX;
        const deltaY = newY - dragOffset.y - centerY;
        onUpdate(id, {
          startX: startX + deltaX,
          startY: startY + deltaY,
          endX: endX + deltaX,
          endY: endY + deltaY
        });
        break;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(null);
    setTimeout(() => {
      if (!isHovered) {
        setIsHovered(false);
      }
    }, 100);
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
  }, [isDragging, dragOffset, startX, startY, endX, endY]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const getPath = () => {
    if (style === 'curved') {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const offsetX = (endY - startY) * 0.2;
      const offsetY = (startX - endX) * 0.2;
      return `M ${startX} ${startY} Q ${midX + offsetX} ${midY + offsetY} ${endX} ${endY}`;
    }
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  };

  const getArrowHead = () => {
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;

    const x1 = endX - arrowLength * Math.cos(angle - arrowAngle);
    const y1 = endY - arrowLength * Math.sin(angle - arrowAngle);
    const x2 = endX - arrowLength * Math.cos(angle + arrowAngle);
    const y2 = endY - arrowLength * Math.sin(angle + arrowAngle);

    return `M ${endX} ${endY} L ${x1} ${y1} M ${endX} ${endY} L ${x2} ${y2}`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: isDragging ? 999 : 99 }}>
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      >
        {/* Invisible wider line for better hitbox */}
        <path
          d={getPath()}
          stroke="transparent"
          strokeWidth={Math.max(30, thickness * 5)}
          fill="none"
          strokeLinecap="round"
          className="pointer-events-auto cursor-move transition-all duration-200"
          onMouseDown={(e) => handleMouseDown(e as any, 'line')}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        
        {/* Visible arrow line */}
        <path
          d={getPath()}
          stroke={colorClasses[color as keyof typeof colorClasses]}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          className="pointer-events-none transition-all duration-300 ease-out"
          style={{
            filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
          }}
        />
        
        {/* Arrow head */}
        <path
          d={getArrowHead()}
          stroke={colorClasses[color as keyof typeof colorClasses]}
          strokeWidth={thickness}
          strokeLinecap="round"
          className="pointer-events-none transition-all duration-300 ease-out"
          style={{
            filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
          }}
        />

        {/* Control points when hovered */}
        {isHovered && (
          <g className="animate-fade-in">
            <circle
              cx={startX}
              cy={startY}
              r="8"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
              className="pointer-events-auto cursor-move transition-all duration-200 hover:r-10 hover:stroke-blue-400"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                transform: isDragging === 'start' ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: 'center'
              }}
              onMouseDown={(e) => handleMouseDown(e as any, 'start')}
            />
            <circle
              cx={endX}
              cy={endY}
              r="8"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="2"
              className="pointer-events-auto cursor-move transition-all duration-200 hover:r-10 hover:stroke-blue-400"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                transform: isDragging === 'end' ? 'scale(1.2)' : 'scale(1)',
                transformOrigin: 'center'
              }}
              onMouseDown={(e) => handleMouseDown(e as any, 'end')}
            />
          </g>
        )}
      </svg>

      {/* Delete button when hovered */}
      {isHovered && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          className="absolute bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg pointer-events-auto transition-all duration-200 ease-out hover:scale-110 z-[1001] animate-fade-in"
          style={{
            left: (startX + endX) / 2 - 12,
            top: (startY + endY) / 2 - 24,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}
          title="Elimina freccia"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default ArrowElement;
