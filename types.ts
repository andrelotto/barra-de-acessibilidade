export enum ColorBlindnessType {
  NONE = 'none',
  PROTANOPIA = 'protanopia',
  DEUTERANOPIA = 'deuteranopia',
  TRITANOPIA = 'tritanopia',
}

export interface AccessibilityState {
  fontSizePercentage: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  colorBlindness: ColorBlindnessType;
  showReadingGuide: boolean;
}