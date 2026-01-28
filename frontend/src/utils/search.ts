import Fuse from 'fuse.js';
import { STEPS_DATA } from '../data/stepsData';
import { STARTER_KIT_ITEMS } from '../data/starterKit';

// Aggregate searchable content
const searchableData = [
  ...STEPS_DATA.map(step => ({
    id: step.id,
    type: 'step',
    title: step.title,
    description: step.description,
    keywords: `step ${step.stepNumber} ${step.title}`
  })),
  ...STARTER_KIT_ITEMS.map(item => ({
    id: item.label, // unique enough for kit items
    type: 'resource',
    title: item.label,
    description: "Tài liệu hỗ trợ / Template",
    keywords: `starter kit download ${item.label}`
  }))
];

const fuseOptions = {
  keys: ['title', 'description', 'keywords'],
  threshold: 0.3, // Lower = stricter match
  distance: 100,
};

const fuse = new Fuse(searchableData, fuseOptions);

export const searchContent = (query: string) => {
  if (!query) return [];
  return fuse.search(query).map(result => result.item);
};
