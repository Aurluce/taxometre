'use client';

import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export default function Dropdown({ trigger, children, align = 'right', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200
            transform transition-all duration-200 origin-top
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}