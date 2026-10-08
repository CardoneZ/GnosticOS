import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ActiveView } from './SanctumSidebar';
import { ALL_GRIMOIRE_ENTITIES, GrimoireEntity } from '../../db/grimoireSeeds';
import { SEED_TUNNELS, TunnelData } from '../../platform/vault';
import { emergencyGroundAudio } from '../audio/audioManager';
import {
  Search,
  Eye,
  Compass,
  Network,
  BookOpen,
  Flame,
  Sparkles,
  BarChart3,
  VolumeX,
  Zap,
  ArrowRight,
  Disc,
} from 'lucide-react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ActiveView) => void;
  onSelectTunnel: (tunnel: TunnelData) => void;
  onSelectEntity?: (entity: GrimoireEntity) => void;
  onStartTrance: () => void;
  onEmergencyGrounding: () => void;
}

interface PaletteItem {
  id: string;
  category: 'tool' | 'spirit' | 'tunnel' | 'command';
  title: string;
  subtitle?: string;
  badge?: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectTunnel,
  onSelectEntity,
  onStartTrance,
  onEmergencyGrounding,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Listener for shortcuts: Ctrl+K, Ctrl+J, Ctrl+T, Ctrl+S, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      // Esc = Emergency Grounding
      if (e.key === 'Escape') {
        e.preventDefault();
        emergencyGroundAudio();
        onEmergencyGrounding();
        onClose();
        return;
      }

      // Ctrl + J = New Alchemical Journal Entry
      if (mod && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        onNavigate('journal');
        onClose();
        return;
      }

      // Ctrl + T = Start Trance Session
      if (mod && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        onStartTrance();
        onClose();
        return;
      }

      // Ctrl + S = Open Sigil Forge
      if (mod && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        onNavigate('chaos');
        onClose();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, onStartTrance, onEmergencyGrounding, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items
  const allItems: PaletteItem[] = useMemo(() => {
    const items: PaletteItem[] = [
      // Quick Ritual Commands
      {
        id: 'cmd-trance',
        category: 'command',
        title: 'Start Fullscreen Trance Session',
        subtitle: 'Engage gazing circle shader & binaural carrier',
        shortcut: 'Ctrl+T',
        icon: Zap,
        onSelect: () => {
          onStartTrance();
          onClose();
        },
      },
      {
        id: 'cmd-journal',
        category: 'command',
        title: 'New Alchemical Journal Entry',
        subtitle: 'Encrypted Zero-Knowledge ritual record',
        shortcut: 'Ctrl+J',
        icon: BookOpen,
        onSelect: () => {
          onNavigate('journal');
          onClose();
        },
      },
      {
        id: 'cmd-sigil',
        category: 'command',
        title: 'Open Austin Osman Spare Sigil Forge',
        subtitle: 'Monogram & line sigil generation',
        shortcut: 'Ctrl+S',
        icon: Sparkles,
        onSelect: () => {
          onNavigate('chaos');
          onClose();
        },
      },
      {
        id: 'cmd-ground',
        category: 'command',
        title: 'Emergency Grounding (Silence All Audio)',
        subtitle: 'Instantly cut oscillators & close active portals',
        shortcut: 'Esc',
        icon: VolumeX,
        onSelect: () => {
          emergencyGroundAudio();
          onEmergencyGrounding();
          onClose();
        },
      },

      // Tools / Views
      {
        id: 'nav-portal',
        category: 'tool',
        title: 'Gazing Portal',
        subtitle: 'WebGL Gazing Shaders & Binaural Frequency Engine',
        badge: 'WebGL',
        icon: Eye,
        onSelect: () => {
          onNavigate('portal');
          onClose();
        },
      },
      {
        id: 'nav-tablets',
        category: 'tool',
        title: '9x9 Tablet Forge',
        subtitle: 'S. Connolly Gematria & Enochian Tablets',
        badge: 'Connolly',
        icon: Compass,
        onSelect: () => {
          onNavigate('tablets');
          onClose();
        },
      },
      {
        id: 'nav-tree',
        category: 'tool',
        title: 'The Dual Tree Navigator',
        subtitle: 'Dayside Tree of Life & Nightside Qliphoth / Daäth Flip',
        badge: '22 Tunnels',
        icon: Network,
        onSelect: () => {
          onNavigate('tree');
          onClose();
        },
      },
      {
        id: 'nav-grimoire',
        category: 'tool',
        title: 'The Grimoire Library',
        subtitle: '72 Goetic Spirits, 39 Dukanté Demons, Draconian Chaos',
        badge: 'Catalog',
        icon: BookOpen,
        onSelect: () => {
          onNavigate('grimoire');
          onClose();
        },
      },
      {
        id: 'nav-journal',
        category: 'tool',
        title: 'Alchemical Journal',
        subtitle: 'Encrypted Alchemical Journal & Ephemeris Logger',
        badge: 'E2EE',
        icon: BookOpen,
        onSelect: () => {
          onNavigate('journal');
          onClose();
        },
      },
      {
        id: 'nav-crucible',
        category: 'tool',
        title: '11 Points Crucible',
        subtitle: 'Michael W. Ford Habit-Tracker & Left-Hand Path Discipline',
        badge: 'Ford',
        icon: Flame,
        onSelect: () => {
          onNavigate('crucible');
          onClose();
        },
      },
      {
        id: 'nav-insights',
        category: 'tool',
        title: 'Esoteric Analytics & Insights',
        subtitle: 'On-device correlation engine for planetary timing & resonance',
        badge: 'Local',
        icon: BarChart3,
        onSelect: () => {
          onNavigate('insights');
          onClose();
        },
      },

      // 22 Tunnels of Set
      ...SEED_TUNNELS.map((tunnel): PaletteItem => ({
        id: `tunnel-${tunnel.number}`,
        category: 'tunnel',
        title: `Tunnel ${tunnel.number}: ${tunnel.name}`,
        subtitle: `Atu: ${tunnel.atu} • Musical Key: ${tunnel.musical_key} • Gematria: ${tunnel.gematria}`,
        badge: tunnel.path_letter,
        icon: Disc,
        onSelect: () => {
          onSelectTunnel(tunnel);
          onNavigate('portal');
          onClose();
        },
      })),

      // Spirits from Grimoire
      ...ALL_GRIMOIRE_ENTITIES.map((spirit): PaletteItem => ({
        id: `spirit-${spirit.id}`,
        category: 'spirit',
        title: spirit.name,
        subtitle: `${spirit.rank ? `${spirit.rank} • ` : ''}${spirit.purpose} • "${spirit.enn || spirit.description.slice(0, 50)}"`,
        badge: spirit.element || spirit.pantheon,
        icon: Flame,
        onSelect: () => {
          onSelectEntity?.(spirit);
          onNavigate('grimoire');
          onClose();
        },
      })),
    ];

    return items;
  }, [onNavigate, onSelectTunnel, onSelectEntity, onStartTrance, onEmergencyGrounding, onClose]);

  // Filter items matching query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 30);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.badge?.toLowerCase().includes(q)
      )
      .slice(0, 40);
  }, [allItems, query]);

  // Handle arrow key navigation inside modal
  const handleKeyDownModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 select-none animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-950/95 border border-red-900/60 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.25)] flex flex-col overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800/80 bg-black/60">
          <Search className="w-5 h-5 text-red-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownModal}
            placeholder="Search spirits, 22 tunnels, tools, or type a command..."
            className="w-full bg-transparent text-sm font-mono text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
          />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[460px] overflow-y-auto p-2 flex flex-col gap-1 divide-y divide-neutral-900"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-600">
              No matching sanctum entities, tunnels, or commands found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-950/80 to-purple-950/50 border border-red-700/60 text-white shadow-md'
                      : 'hover:bg-neutral-900/60 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg border shrink-0 ${
                        isSelected
                          ? 'bg-red-900/60 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/60 border border-neutral-800 text-purple-300 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs font-mono text-neutral-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <kbd className="px-2 py-0.5 rounded bg-black/80 border border-neutral-800 text-[10px] font-mono text-amber-300 font-semibold shadow-inner">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400' : 'text-neutral-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Legend Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/80 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span><kbd className="text-neutral-400">↑↓</kbd> Navigate</span>
            <span><kbd className="text-neutral-400">↵</kbd> Select</span>
            <span><kbd className="text-neutral-400">Esc</kbd> Emergency Grounding</span>
          </div>
          <div className="text-[10px] text-neutral-600 uppercase tracking-widest">
            GnosticOS Command Center
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
