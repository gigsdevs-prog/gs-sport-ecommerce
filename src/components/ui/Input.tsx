// ============================================
// GS SPORT - Input Component
// ============================================

'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, name, ...props }, ref) => {
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs tracking-widest uppercase text-neutral-500 mb-2 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={`
            w-full px-4 py-3 bg-neutral-50 border border-neutral-200
            text-sm text-neutral-800 placeholder:text-neutral-400
            focus:outline-none focus:border-black focus:bg-white
            transition-all duration-300
            ${error ? 'border-red-400 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
