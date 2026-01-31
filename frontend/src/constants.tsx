import React from 'react';
import { ThemeColors } from './types';

// Theme Definitions matching the original design
export const THEMES: Record<string, ThemeColors> = {
  primary: {
    bg: 'bg-white',
    text: 'text-[#1A2B42]',
    accent: 'text-[#F36F21]',
    accentText: 'text-[#F36F21]',
    borderColor: '#F36F21',
    glass: 'bg-white/70'
  },
  step1: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-[#1A2B42]',
    accentText: 'text-[#1A2B42]',
    borderColor: '#1A2B42',
    glass: 'bg-white/80'
  },
  step2: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-[#EA580C]',
    accentText: 'text-[#EA580C]',
    borderColor: '#EA580C',
    glass: 'bg-white/80'
  },
  step3: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-[#166534]',
    accentText: 'text-[#166534]',
    borderColor: '#166534',
    glass: 'bg-white/80'
  },
  step4: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-[#5B21B6]',
    accentText: 'text-[#5B21B6]',
    borderColor: '#5B21B6',
    glass: 'bg-white/80'
  },
  step5: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-[#854D0E]',
    accentText: 'text-[#854D0E]',
    borderColor: '#854D0E',
    glass: 'bg-white/80'
  },
  step6: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    accent: 'bg-[#9F1239]',
    accentText: 'text-[#9F1239]',
    borderColor: '#9F1239',
    glass: 'bg-white/80'
  }
};