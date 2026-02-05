import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GridCell {
  id: number;
  row: number;
  col: number;
}

interface AcademicGridBackgroundProps {
  gridSize?: number;
  glowProbability?: number;
  colors?: string[];
}

const defaultColors = [
  '#F36F21', // FPT Orange
  '#F09819', // Warm Yellow
  '#FF8C42', // Light Orange
];

const AcademicGridBackground: React.FC<AcademicGridBackgroundProps> = ({
  gridSize = 40,
  glowProbability = 0.12,
  colors = defaultColors,
}) => {
  const cells = useMemo<GridCell[]>(() => {
    const cols = Math.ceil(100 / gridSize) + 1;
    const rows = Math.ceil(100 / gridSize) + 1;
    const result: GridCell[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result.push({ id: row * cols + col, row, col });
      }
    }
    return result;
  }, [gridSize]);

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-40">
        <defs>
          <pattern
            id="academicGrid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-300"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#academicGrid)" />
      </svg>

      {/* Animated Glow Cells */}
      {cells.map((cell) => {
        const shouldGlow = Math.random() < glowProbability;
        const cellColor = getRandomColor();

        return (
          <motion.div
            key={cell.id}
            className="absolute rounded-sm"
            style={{
              left: `${cell.col * gridSize}%`,
              top: `${cell.row * gridSize}%`,
              width: gridSize,
              height: gridSize,
            }}
            initial={{ opacity: 0 }}
            animate={
              shouldGlow
                ? {
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.3, 1],
                  }
                : { opacity: 0 }
            }
            transition={
              shouldGlow
                ? {
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3,
                    ease: 'easeInOut',
                  }
                : { duration: 0 }
            }
          >
            {shouldGlow && (
              <div
                className="absolute inset-0 blur-sm"
                style={{
                  backgroundColor: cellColor,
                  opacity: 0.7,
                }}
              />
            )}
            {shouldGlow && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: cellColor,
                  opacity: 0.5,
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-[#F36F21]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-[#F09819]/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default AcademicGridBackground;
