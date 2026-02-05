import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
}) => {
  const baseStyles = 'bg-slate-200';
  
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    ...(width !== undefined ? { width } : null),
    ...(height !== undefined ? { height } : null),
  };

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}> = ({ lines = 3, className = '', lastLineWidth = '60%' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height="1rem"
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  lines?: number;
}> = ({
  showImage = true,
  showTitle = true,
  showDescription = true,
  lines = 2,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="space-y-4">
        {showImage && (
          <Skeleton
            variant="rectangular"
            height="160px"
            width="100%"
          />
        )}
        {showTitle && <Skeleton variant="text" height="1.5rem" width="70%" />}
        {showDescription && <SkeletonText lines={lines} />}
        {showTitle && <Skeleton variant="text" height="2rem" width="40%" />}
      </div>
    </div>
  );
};

export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={sizeMap[size]}
    />
  );
};

export const SkeletonButton: React.FC<{
  width?: string;
}> = ({ width = '120px' }) => {
  return (
    <Skeleton
      variant="rectangular"
      className="rounded-full"
      width={width}
      height="2.5rem"
    />
  );
};

export const SkeletonListItem: React.FC<{
  avatar?: boolean;
  showDescription?: boolean;
}> = ({ avatar = true, showDescription = true }) => {
  return (
    <div className="flex items-start gap-3 p-3">
      {avatar && <SkeletonAvatar size="sm" />}
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height="1rem" width="40%" />
        {showDescription && <Skeleton variant="text" height="0.875rem" width="80%" />}
      </div>
    </div>
  );
};

export const SkeletonTableRow: React.FC<{
  columns: number;
}> = ({ columns }) => {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton variant="text" height="1rem" width={i === 0 ? '60%' : '80%'} />
        </td>
      ))}
    </tr>
  );
};

export const SkeletonChatMessage: React.FC<{
  isUser?: boolean;
}> = ({ isUser = false }) => {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} items-start`}>
      <SkeletonAvatar size="sm" />
      <div className={`flex-1 space-y-2 ${isUser ? 'max-w-[70%]' : 'max-w-[80%]'}`}>
        <Skeleton
          variant="rectangular"
          className={isUser ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none'}
          height="3rem"
          width="100%"
        />
        <Skeleton
          variant="text"
          height="0.75rem"
          width="30%"
        />
      </div>
    </div>
  );
};

export const SkeletonStats: React.FC<{
  count?: number;
}> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" height="0.875rem" width="50%" />
              <Skeleton variant="text" height="1.5rem" width="70%" />
            </div>
            <Skeleton variant="circular" height="2.5rem" width="2.5rem" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
