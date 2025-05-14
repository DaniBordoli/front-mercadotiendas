import React from 'react';
import { ProgressBarProps } from './types';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 33,
  height = "h-2.5",
  backgroundColor = "bg-gray-200",
  progressColor = "bg-sky-500",
  className = ""
}) => {
  return (
    <div className={`w-full rounded-full ${height} ${backgroundColor} dark:bg-white-700 overflow-hidden ${className}`}>
      <div 
        className={`${progressColor} ${height} rounded-full animate-loading`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
