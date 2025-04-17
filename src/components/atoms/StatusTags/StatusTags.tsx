import React from 'react';
import { colors } from '../../../design/colors';

interface StatusTagsProps {
  status: 'Active' | 'Pending' | 'Inactive';
  className?: string; 
}

export const StatusTags: React.FC<StatusTagsProps> = ({ status, className }) => {
  const styles = {
    Active: {
      backgroundColor: `${colors.accentTeal}1A`, 
      color: colors.accentTeal,
    },
    Pending: {
      backgroundColor: `${colors.primaryRed}1A`, 
      color: colors.primaryRed, 
    },
    Inactive: {
      backgroundColor: colors.ultraLightGray, 
      color: colors.mediumGray,
    },
  };

  return (
    <span
      className={`rounded-full font-semibold ${className || ''}`} 
      style={{
        ...styles[status],
        padding: '0.30rem 0.8rem',
        fontSize: '0.875rem',
      }}
    >
      {status}
    </span>
  );
};
