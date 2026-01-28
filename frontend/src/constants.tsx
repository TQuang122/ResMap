import React from 'react';
import { ThemeColors } from './types';

// Theme Definitions matching the original design
export const THEMES: Record<string, ThemeColors> = {
  primary: {
    bg: 'bg-white',
    text: 'text-[#1A2B42]',
    accent: 'text-[#F36F21]',
    glass: 'bg-white/70'
  },
  step1: {
    bg: 'bg-[#E2E8F0]', // Slate-200ish
    text: 'text-[#1A2B42]', // Navy
    accent: 'bg-[#1A2B42]',
    glass: 'bg-white/40'
  },
  step2: {
    bg: 'bg-[#FFF7ED]', // Orange-50
    text: 'text-[#EA580C]', // Orange-600
    accent: 'bg-[#EA580C]',
    glass: 'bg-white/60'
  },
  step3: {
    bg: 'bg-[#F0FDF4]', // Green-50
    text: 'text-[#166534]', // Green-800
    accent: 'bg-[#166534]',
    glass: 'bg-white/60'
  },
  step4: {
    bg: 'bg-[#F5F3FF]', // Purple-50
    text: 'text-[#5B21B6]', // Purple-900
    accent: 'bg-[#5B21B6]',
    glass: 'bg-white/50'
  },
  step5: {
    bg: 'bg-[#FEFCE8]', // Yellow-50
    text: 'text-[#854D0E]', // Yellow-800
    accent: 'bg-[#854D0E]',
    glass: 'bg-white/60'
  },
  step6: {
    bg: 'bg-[#FFF1F2]', // Rose-50
    text: 'text-[#9F1239]', // Rose-900
    accent: 'bg-[#9F1239]',
    glass: 'bg-white/60'
  }
};