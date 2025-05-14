import React from 'react';
import { colors } from '../../../design/colors';

interface StatusTagsProps {
  status: 'Active' | 'Pending' | 'Inactive';
  text?: string; 
  className?: string; 
}

export const StatusTags: React.FC<StatusTagsProps> = ({ status, text, className }) => {
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
      className={`rounded-full font-space font-medium inline-flex justify-center items-center ${className || ''}`} 
      style={{
        ...styles[status],
        padding: '0.30rem 0.8rem',
        fontSize: '0.875rem',
        minWidth: '80px', 
        textAlign: 'center', 
      }}
    >
      {text || status}
    </span>
  );
};
