import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  sublabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SanctumDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  width?: string;
}

export const SanctumDropdown: React.FC<SanctumDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchable = false,
  className = '',
  width = 'w-48',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = searchable && search.trim()
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.sublabel?.toLowerCase().includes(search.toLowerCase()) ||
        opt.badge?.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`} ref={dropdownRef}>
      {label && <span className="text-neutral-500 text-[11px] font-mono shrink-0">{label}</span>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-200 transition-all font-mono shadow-sm group ${width}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-400 shrink-0" />
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-transform shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Glassmorphic Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[200px] w-full max-h-64 rounded-xl bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 shadow-2xl p-1.5 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 overflow-hidden">
          {searchable && (
            <div className="px-2 py-1.5 border-b border-neutral-800/80 mb-1 flex items-center gap-2">
              <Search className="w-3 h-3 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter options..."
                className="w-full bg-transparent text-xs text-white placeholder-neutral-500 outline-none font-mono"
                autoFocus
              />
            </div>
          )}

          <div className="overflow-y-auto custom-scrollbar flex flex-col gap-0.5 max-h-52">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-neutral-500 font-mono text-center">
                No matches found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? 'bg-neutral-800/90 text-white border border-neutral-700'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {Icon && <Icon className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      <div className="truncate">
                        <span className="font-semibold">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="text-[10px] text-neutral-500 ml-1.5 truncate">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SanctumDropdown;
