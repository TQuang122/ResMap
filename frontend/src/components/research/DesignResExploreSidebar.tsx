import React from 'react';

interface DesignResExploreSidebarProps {
  allAreas: string[];
  selectedAreas: string[];
  onToggleArea: (area: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  lecturerCounts: Record<string, number>;
}

const DesignResExploreSidebar: React.FC<DesignResExploreSidebarProps> = ({
  allAreas,
  selectedAreas,
  onToggleArea,
  onSelectAll,
  onClearAll,
  lecturerCounts,
}) => {
  return (
    <div className="w-full sm:w-64 flex-shrink-0 bg-white border-r border-slate-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Lọc theo lĩnh vực</h3>
        <div className="flex gap-1">
          <button
            onClick={onSelectAll}
            className="text-xs text-pink-600 hover:text-pink-700 font-medium px-1.5 py-0.5 hover:bg-pink-50 rounded"
          >
            Chọn tất cả
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={onClearAll}
            className="text-xs text-slate-500 hover:text-slate-700 font-medium px-1.5 py-0.5 hover:bg-slate-100 rounded"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
        {allAreas.sort().map((area) => {
          const isSelected = selectedAreas.includes(area);
          const count = lecturerCounts[area] || 0;

          return (
            <label
              key={area}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-pink-50 border border-pink-200'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleArea(area)}
                  className="peer w-4 h-4 border-2 border-slate-300 rounded text-pink-600 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer appearance-none checked:border-pink-600 checked:bg-pink-600 transition-colors"
                />
                <svg
                  className={`absolute left-0.5 top-0.5 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity ${
                    isSelected ? 'opacity-100' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span
                className={`flex-1 text-sm ${
                  isSelected ? 'text-pink-900 font-medium' : 'text-slate-700'
                }`}
              >
                {area}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-pink-200 text-pink-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </label>
          );
        })}
      </div>

      {selectedAreas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Đã chọn <span className="font-medium text-slate-700">{selectedAreas.length}</span> lĩnh vực
          </p>
        </div>
      )}
    </div>
  );
};

export default DesignResExploreSidebar;
