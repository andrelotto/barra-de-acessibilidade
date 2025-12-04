import React, { useState, useEffect, useCallback } from 'react';
import { GripHorizontal } from 'lucide-react';

interface ReadingGuideProps {
  highContrast: boolean;
}

export const ReadingGuide: React.FC<ReadingGuideProps> = ({ highContrast }) => {
  const [position, setPosition] = useState(200);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection while dragging
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Keep the guide within reasonable viewport bounds
        const newY = Math.max(0, Math.min(window.innerHeight - 20, e.clientY));
        setPosition(newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const bgColor = highContrast ? 'bg-yellow-400' : 'bg-blue-600';
  const borderColor = highContrast ? 'border-white' : 'border-blue-800';

  return (
    <div
      className={`fixed left-0 w-full z-40 cursor-row-resize flex flex-col items-center group`}
      style={{ top: `${position}px` }}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-label="Guia de leitura ajustável"
    >
      {/* The Guide Line */}
      <div 
        className={`w-full h-1 ${bgColor} bg-opacity-70 shadow-sm transition-colors duration-200`} 
      />
      
      {/* The Drag Handle (visible on hover or drag) */}
      <div 
        className={`
          absolute -top-3 p-1 rounded-full 
          ${bgColor} text-white shadow-lg cursor-grab active:cursor-grabbing
          transform transition-transform active:scale-110
          ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        <GripHorizontal size={20} />
      </div>
      
      {/* Bottom overlay for focus (Optional: dims content below line) */}
      <div className="w-full h-8 bg-gradient-to-b from-transparent to-transparent pointer-events-none" />
    </div>
  );
};