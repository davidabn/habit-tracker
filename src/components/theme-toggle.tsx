'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useState, useRef, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Escuro', icon: Moon },
    { value: 'system' as const, label: 'Sistema', icon: Monitor },
  ];

  const currentIcon = resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-center
          w-9 h-9 rounded-full
          bg-bg-secondary
          text-label-primary
          hover:bg-gray-5
          transition-colors duration-fast ease-apple
        "
        aria-label="Alterar tema"
      >
        <currentIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="
          absolute right-0 top-full mt-2
          bg-bg-primary
          border border-separator
          rounded-lg
          shadow-apple-lg
          overflow-hidden
          min-w-[140px]
          z-50
        ">
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full px-4 py-3
                  text-left text-body
                  transition-colors duration-fast ease-apple
                  ${isActive
                    ? 'bg-apple-blue/10 text-apple-blue'
                    : 'text-label-primary hover:bg-bg-secondary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
