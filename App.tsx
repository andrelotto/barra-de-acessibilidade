import React, { useState, useEffect } from 'react';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { SVGFilters } from './components/SVGFilters';
import { ReadingGuide } from './components/ReadingGuide';
import { DemoContent } from './components/DemoContent';
import { ColorBlindnessType, AccessibilityState } from './types';

const App: React.FC = () => {
  // Initial State
  const [accessState, setAccessState] = useState<AccessibilityState>({
    fontSizePercentage: 100,
    highContrast: false,
    grayscale: false,
    highlightLinks: false,
    colorBlindness: ColorBlindnessType.NONE,
    showReadingGuide: false,
  });

  // Calculate styles based on state
  const getAppStyles = () => {
    const filters: string[] = [];

    if (accessState.grayscale) {
      filters.push('grayscale(100%)');
    }

    if (accessState.colorBlindness !== ColorBlindnessType.NONE) {
      filters.push(`url(#${accessState.colorBlindness})`);
    }

    return {
      filter: filters.length > 0 ? filters.join(' ') : 'none',
    };
  };

  const getContainerClasses = () => {
    let classes = "min-h-screen transition-colors duration-300 ";
    if (accessState.highContrast) {
      classes += "bg-black text-white";
    } else {
      classes += "bg-gray-50 text-gray-900";
    }
    return classes;
  };

  return (
    <div className={getContainerClasses()} style={getAppStyles()}>
      {/* Hidden SVG Definitions for Filters */}
      <SVGFilters />

      {/* Floating Toolbar */}
      <AccessibilityToolbar 
        state={accessState} 
        setState={setAccessState} 
      />

      {/* Movable Reading Guide */}
      {accessState.showReadingGuide && <ReadingGuide highContrast={accessState.highContrast} />}

      {/* Main Content Area */}
      <main className="container mx-auto p-4 md:p-8 transition-all duration-300">
        <div 
          style={{ fontSize: `${accessState.fontSizePercentage}%` }}
          className={`
            max-w-4xl mx-auto 
            ${accessState.highlightLinks ? '[&_a]:bg-yellow-300 [&_a]:text-black [&_a]:underline [&_a]:decoration-4 [&_a]:decoration-red-600 [&_a]:p-0.5' : '[&_a]:text-blue-600 [&_a]:hover:underline'}
            ${accessState.highContrast ? '[&_a]:text-yellow-300' : ''}
          `}
        >
          <DemoContent highContrast={accessState.highContrast} />
        </div>
      </main>
    </div>
  );
};

export default App;