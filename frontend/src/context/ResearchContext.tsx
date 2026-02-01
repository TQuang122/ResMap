import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Paper } from '../types';

interface TopicData {
  title: string;
  description: string;
}

interface ResearchState {
  topic: TopicData | null;
  researchQuestion: string;
  savedPapers: Paper[];
}

interface ResearchContextType extends ResearchState {
  setTopic: (topic: TopicData | null) => void;
  setResearchQuestion: (rq: string) => void;
  addSavedPaper: (paper: Paper) => void;
  removeSavedPaper: (paperId: string) => void;
  clearAll: () => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [researchQuestion, setResearchQuestion] = useState<string>('');
  const [savedPapers, setSavedPapers] = useState<Paper[]>([]);

  const addSavedPaper = (paper: Paper) => {
    setSavedPapers(prev => {
      if (prev.some(p => p.id === paper.id)) return prev;
      return [...prev, paper];
    });
  };

  const removeSavedPaper = (paperId: string) => {
    setSavedPapers(prev => prev.filter(p => p.id !== paperId));
  };

  const clearAll = () => {
    setTopic(null);
    setResearchQuestion('');
    setSavedPapers([]);
  };

  return (
    <ResearchContext.Provider value={{
      topic,
      setTopic,
      researchQuestion,
      setResearchQuestion,
      savedPapers,
      addSavedPaper,
      removeSavedPaper,
      clearAll
    }}>
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (context === undefined) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
