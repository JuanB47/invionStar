import React from 'react';

export const Input = ({ label, type = 'text', name, value, onChange, placeholder, icon: Icon, error }) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left mb-4">
      {label && <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>}
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3 text-gray-400 w-5 h-5" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-2.5 ${Icon ? 'pl-10' : 'pl-4'} pr-4 bg-white border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg text-invion-dark focus:outline-none focus:border-invion-turquoise transition-colors`}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};