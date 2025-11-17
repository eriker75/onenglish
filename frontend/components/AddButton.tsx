'use client';

import React from 'react';
import AddIcon from '@mui/icons-material/Add';

interface AddButtonProps {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
  type?: 'button' | 'submit';
  bgColor?: string;
  hoverColor?: string;
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  type = 'button',
  bgColor = '#33CC00',
  hoverColor,
  className = '',
}) => {
  const hoverBg = hoverColor || `${bgColor}/90`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[${bgColor}] hover:bg-[${hoverBg}] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 ${className}`}
      style={{
        backgroundColor: bgColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgColor;
      }}
    >
      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
        <AddIcon fontSize="small" />
      </div>
      <span>{label}</span>
      <Icon fontSize="small" />
    </button>
  );
};

export default AddButton;
