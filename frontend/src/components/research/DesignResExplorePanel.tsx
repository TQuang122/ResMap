import React from 'react';
import { LecturerData } from '../../types';
import { Heart } from 'lucide-react';

interface DesignResExplorePanelProps {
  lecturer: LecturerData;
  isExpanded: boolean;
  isInterested: boolean;
  isSaving: boolean;
  onToggle: () => void;
  onToggleInterest: (e: React.MouseEvent) => void;
}

const DesignResExplorePanel: React.FC<DesignResExplorePanelProps> = ({ 
  lecturer, 
  isExpanded, 
  isInterested, 
  isSaving,
  onToggle, 
  onToggleInterest 
}) => {
  return (
    <div
      className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isExpanded ? 'shadow-lg ring-2 ring-pink-500/20' : 'hover:shadow-md hover:border-pink-300'
      }`}
      onClick={onToggle}
    >
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {lecturer.title}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 bg-pink-50 text-pink-600 rounded">
                {lecturer.department}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{lecturer.fullName}</h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              <span className="font-medium text-slate-700">Topic: </span>
              {lecturer.researchTopics.slice(0, 2).join(' • ')}
              {lecturer.researchTopics.length > 2 && '...'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleInterest}
              disabled={isSaving}
              className={`p-2 rounded-full transition-all ${
                isInterested 
                  ? 'bg-red-50 text-red-500' 
                  : 'text-slate-300 hover:text-red-400 hover:bg-red-50'
              }`}
            >
              <Heart 
                className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`} 
              />
            </button>
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 bg-slate-50 border-t border-slate-100 animate-fadeIn">
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {lecturer.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-slate-600">{lecturer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${lecturer.email}`} className="text-pink-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                  {lecturer.email}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {lecturer.personalWebsite && (
                <a
                  href={lecturer.personalWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </a>
              )}
              {lecturer.googleScholar && (
                <a
                  href={lecturer.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 016.115 2.55L24 9.5L12 1z"/>
                  </svg>
                  Google Scholar
                </a>
              )}
              {lecturer.orcid && (
                <a
                  href={lecturer.orcid}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  OrCID
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-2">Lĩnh vực nghiên cứu:</p>
              <div className="flex flex-wrap gap-1.5">
                {lecturer.researchAreas.map((area) => (
                  <span key={area} className="text-xs px-2 py-0.5 bg-pink-50 text-pink-700 rounded">
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-2">Hướng nghiên cứu cụ thể:</p>
              <ul className="text-xs text-slate-600 space-y-1">
                {lecturer.researchTopics.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-pink-400 mt-1">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lecturer.note && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  <span className="font-medium">Ghi chú: </span>
                  {lecturer.note}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignResExplorePanel;
