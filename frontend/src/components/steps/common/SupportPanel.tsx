import React, { useState } from 'react';
import { Wrench, Lightbulb, Play, X } from 'lucide-react';
import { SupportData, ThemeColors } from '../../../types';

interface SupportPanelProps {
  data: SupportData;
  theme: ThemeColors;
}

const SupportPanel: React.FC<SupportPanelProps> = ({ data, theme }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border-2 border-orange-300 bg-orange-50/80 p-6 space-y-5">
        {/* Tools Section */}
        <div>
          <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
            <Wrench size={18} />
            Tools
          </h4>
          <ul className="space-y-2">
            {data.tools.map((tool, idx) => (
              <li key={idx} className="text-sm">
                <span className="font-semibold text-orange-700">{tool.label}</span>
                <span className="text-orange-600/80"> - {tool.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips Section */}
        <div>
          <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
            <Lightbulb size={18} />
            Tips & Tricks
          </h4>
          <ul className="space-y-2">
            {data.tips.map((tip, idx) => (
              <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Video Button */}
        {data.videoUrl && (
          <button
            onClick={() => setIsVideoOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            <Play size={18} />
            <span className="text-sm">Watch how others have done it before</span>
          </button>
        )}
      </div>

      {/* Video Overlay Modal */}
      {isVideoOpen && data.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-800">
                {data.videoTitle || 'Video Hướng dẫn'}
              </h3>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Đóng video"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            {/* Video Embed */}
            <div className="aspect-video">
              <iframe
                src={data.videoUrl}
                title={data.videoTitle || 'Video Hướng dẫn'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportPanel;
