import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  const baseStyles = 'w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none';
  const variants = {
    primary: 'bg-invion-turquoise hover:bg-opacity-90 text-white shadow-md', // #16B3B0[cite: 1]
    secondary: 'bg-invion-navy hover:bg-opacity-90 text-white',               // #102A43[cite: 1]
    outline: 'border-2 border-invion-turquoise text-invion-turquoise hover:bg-invion-turquoise hover:text-white',
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

