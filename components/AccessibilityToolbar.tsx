import React, { useState } from 'react';
import { 
  Type, 
  Minus, 
  Plus, 
  RotateCcw, 
  Sun, 
  Moon, 
  Eye, 
  Link as LinkIcon, 
  Palette, 
  Ruler, 
  X,
  Accessibility
} from 'lucide-react';
import { AccessibilityState, ColorBlindnessType } from '../types';

interface Props {
  state: AccessibilityState;
  setState: React.Dispatch<React.SetStateAction<AccessibilityState>>;
}

const GroupLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 first:mt-0">{children}</h3>
);

export const AccessibilityToolbar: React.FC<Props> = ({ state, setState }) => {
  const [isOpen, setIsOpen] = useState(true);

  const updateState = (key: keyof AccessibilityState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleFontChange = (delta: number) => {
    setState(prev => ({
      ...prev,
      fontSizePercentage: Math.max(50, Math.min(200, prev.fontSizePercentage + delta))
    }));
  };

  const resetFont = () => updateState('fontSizePercentage', 100);

  const btnClass = "p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-gray-300 shadow-sm";
  const activeBtnClass = "bg-blue-600 text-white hover:bg-blue-700 border-blue-800";
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
        aria-label="Abrir barra de acessibilidade"
      >
        <Accessibility size={24} />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-screen w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto border-l border-gray-200 dark:border-gray-700 font-sans text-gray-900 dark:text-gray-100">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 sticky top-0">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Accessibility className="text-blue-600" />
          Acessibilidade
        </h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Fechar barra"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        
        {/* Font Size Controls */}
        <GroupLabel>Tamanho do Texto</GroupLabel>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => handleFontChange(-10)} 
            className={btnClass}
            aria-label="Diminuir fonte"
          >
            <Minus size={16} /> A-
          </button>
          <button 
            onClick={resetFont} 
            className={btnClass}
            aria-label="Resetar fonte"
          >
            <Type size={16} /> Pad.
          </button>
          <button 
            onClick={() => handleFontChange(10)} 
            className={btnClass}
            aria-label="Aumentar fonte"
          >
            <Plus size={16} /> A+
          </button>
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">
          Zoom atual: {state.fontSizePercentage}%
        </div>

        {/* Visual Adjustments */}
        <GroupLabel>Visual</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateState('highContrast', !state.highContrast)}
            className={`${btnClass} ${state.highContrast ? activeBtnClass : ''}`}
            aria-pressed={state.highContrast}
          >
            <Moon size={16} /> Alto Contraste
          </button>
          <button
            onClick={() => updateState('grayscale', !state.grayscale)}
            className={`${btnClass} ${state.grayscale ? activeBtnClass : ''}`}
            aria-pressed={state.grayscale}
          >
            <Eye size={16} /> Escala de Cinza
          </button>
        </div>

        <button
          onClick={() => updateState('highlightLinks', !state.highlightLinks)}
          className={`w-full ${btnClass} ${state.highlightLinks ? activeBtnClass : ''} mt-2`}
          aria-pressed={state.highlightLinks}
        >
          <LinkIcon size={16} /> Destacar Links
        </button>

        {/* Daltonismo */}
        <GroupLabel>Daltonismo</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
           <button
            onClick={() => updateState('colorBlindness', ColorBlindnessType.PROTANOPIA)}
            className={`${btnClass} ${state.colorBlindness === ColorBlindnessType.PROTANOPIA ? activeBtnClass : ''}`}
          >
            <Palette size={16} /> Prot
          </button>
           <button
            onClick={() => updateState('colorBlindness', ColorBlindnessType.DEUTERANOPIA)}
            className={`${btnClass} ${state.colorBlindness === ColorBlindnessType.DEUTERANOPIA ? activeBtnClass : ''}`}
          >
            <Palette size={16} /> Deut
          </button>
           <button
            onClick={() => updateState('colorBlindness', ColorBlindnessType.TRITANOPIA)}
            className={`${btnClass} ${state.colorBlindness === ColorBlindnessType.TRITANOPIA ? activeBtnClass : ''}`}
          >
            <Palette size={16} /> Trit
          </button>
           <button
            onClick={() => updateState('colorBlindness', ColorBlindnessType.NONE)}
            className={`${btnClass} ${state.colorBlindness === ColorBlindnessType.NONE ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
          >
            <X size={16} /> Off
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Simulação/Correção via filtros SVG.</p>

        {/* Tools */}
        <GroupLabel>Ferramentas</GroupLabel>
        <button
          onClick={() => updateState('showReadingGuide', !state.showReadingGuide)}
          className={`w-full ${btnClass} ${state.showReadingGuide ? activeBtnClass : ''}`}
          aria-pressed={state.showReadingGuide}
        >
          <Ruler size={16} /> Guia de Leitura
        </button>
      </div>

      <div className="p-4 mt-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
        <p>Configurações simuladas de persistência.</p>
      </div>
    </div>
  );
};