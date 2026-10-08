import React, { useState, useEffect } from 'react';
import SanctumSidebar, { ActiveView } from './features/navigation/SanctumSidebar';
import SanctumPortal from './features/portal/SanctumPortal';
import TabletWorkbench from './features/tablets/TabletWorkbench';
import DualTreeViewer from './features/tree/DualTreeViewer';
import JournalWorkbench from './features/journal/JournalWorkbench';
import TranceSession from './features/session/TranceSession';
import CrucibleWorkbench from './features/crucible/CrucibleWorkbench';
import ChaosWorkbench from './features/chaos/ChaosWorkbench';
import InsightDashboard from './features/insights/InsightDashboard';
import GrimoireLibrary from './features/grimoire/GrimoireLibrary';
import CommandPalette from './features/navigation/CommandPalette';
import { GrimoireEntity } from './db/grimoireSeeds';
import { emergencyGroundAudio } from './features/audio/audioManager';
import {
  TunnelData,
  EntityData,
  JournalEntryData,
  getTunnels,
  getEntities,
  fetchJournalEntries,
  unlockVault,
  lockVault,
} from './platform/vault';
import { Lock, Key } from 'lucide-react';

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [passphrase, setPassphrase] = useState<string>('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ActiveView>('portal');
  const [isTranceActive, setIsTranceActive] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  const [tunnels, setTunnels] = useState<TunnelData[]>([]);
  const [entities, setEntities] = useState<EntityData[]>([]);
  const [activeTunnel, setActiveTunnel] = useState<TunnelData | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntryData[]>([]);

  const loadJournal = async () => {
    const list = await fetchJournalEntries();
    setJournalEntries(list);
  };

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      const t = await getTunnels();
      const e = await getEntities();
      setTunnels(t);
      setEntities(e);
      if (t.length > 0) setActiveTunnel(t[0]);
      await loadJournal();
    }
    init();
  }, []);

  // Listen for Ctrl+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) return;
    try {
      const ok = await unlockVault(passphrase);
      if (ok) {
        setIsUnlocked(true);
        setPassphrase('');
        setUnlockError(null);
      }
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : 'Invalid key');
    }
  };

  const handleLock = async () => {
    await lockVault();
    setIsUnlocked(false);
  };

  const handleTuneToTunnel = (tunnel: TunnelData) => {
    setActiveTunnel(tunnel);
    setCurrentView('portal');
  };

  const handleTuneSpiritToPortal = (spirit: GrimoireEntity) => {
    let noteKey = 'D';
    if (spirit.element === 'fire') noteKey = 'C';
    else if (spirit.element === 'water') noteKey = 'G#';
    else if (spirit.element === 'air') noteKey = 'E';
    else if (spirit.element === 'earth') noteKey = 'B#';

    const synthTunnel: TunnelData = {
      id: 5000 + spirit.id,
      number: spirit.goeticNumber || spirit.id,
      name: spirit.name,
      path_letter: spirit.element?.toUpperCase() || 'SPIRIT',
      attribution_type: 'element',
      planet_element: spirit.element || 'Quintessence',
      gematria: spirit.id * 7,
      musical_key: noteKey,
      key_modifier: null,
      atu: spirit.purpose,
      tier: 'magus',
    };
    handleTuneToTunnel(synthTunnel);
  };

  const handleEmergencyGrounding = () => {
    emergencyGroundAudio();
    setIsTranceActive(false);
    setIsCommandPaletteOpen(false);
  };

  // If locked, render the Master Vault Gate
  if (!isUnlocked) {
    return (
      <div className="relative w-screen h-screen bg-black flex items-center justify-center p-4 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-black to-black" />
        <div className="relative glass-panel-glow p-8 rounded-2xl max-w-md w-full border border-red-900/40 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-600/60 flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)]">
            <Lock className="w-8 h-8 text-red-500" />
          </div>

          <div>
            <h1 className="font-decorative text-2xl font-bold tracking-widest text-white">
              GNOSTIC<span className="text-red-500">OS</span>
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
              Encrypted Nightside Vault • SQLCipher AES-256
            </p>
          </div>

          <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
            <div className="relative">
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter Vault Master Passphrase..."
                autoFocus
                className="w-full bg-black/80 border border-neutral-700 rounded-lg px-4 py-3 pl-11 text-neutral-100 placeholder:text-neutral-600 font-mono text-sm focus:border-red-500 focus:outline-none shadow-inner"
              />
              <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {unlockError && (
              <p className="text-xs font-mono text-red-400">{unlockError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-700 to-purple-800 hover:from-red-600 hover:to-purple-700 text-white font-serif text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              UNSEAL SANCTUM
            </button>
          </form>

          <p className="text-[11px] font-mono text-neutral-500 leading-relaxed">
            Zero-Knowledge local encryption. Your master key derives an Argon2id key
            which unlocks your local SQLCipher database.
          </p>
        </div>
      </div>
    );
  }

  // Fullscreen Trance Session Overlay
  if (isTranceActive && activeTunnel) {
    return (
      <TranceSession
        activeTunnel={activeTunnel}
        onExit={() => setIsTranceActive(false)}
        onOpenJournalEntry={() => {
          setIsTranceActive(false);
          setCurrentView('journal');
        }}
      />
    );
  }

  return (
    <div className="w-screen h-screen flex bg-black text-neutral-200 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <SanctumSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isUnlocked={isUnlocked}
        onLock={handleLock}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 h-full overflow-hidden relative">
        {currentView === 'portal' && activeTunnel && (
          <SanctumPortal
            activeTunnel={activeTunnel}
            onSelectTunnel={setActiveTunnel}
            allTunnels={tunnels}
            onEnterTranceSession={() => setIsTranceActive(true)}
          />
        )}

        {currentView === 'tablets' && <TabletWorkbench entities={entities} />}

        {currentView === 'tree' && (
          <DualTreeViewer
            tunnels={tunnels}
            entities={entities}
            onTuneToTunnel={handleTuneToTunnel}
          />
        )}

        {currentView === 'grimoire' && (
          <GrimoireLibrary
            onNavigateToJournal={() => setCurrentView('journal')}
            onNavigateToChaos={() => setCurrentView('chaos')}
            onTuneToPortal={handleTuneSpiritToPortal}
          />
        )}

        {currentView === 'journal' && (
          <JournalWorkbench entities={entities} tunnels={tunnels} />
        )}

        {currentView === 'crucible' && <CrucibleWorkbench />}

        {currentView === 'chaos' && (
          <ChaosWorkbench
            onAttachSigilToJournal={() => setCurrentView('journal')}
          />
        )}

        {currentView === 'insights' && (
          <InsightDashboard
            entries={journalEntries}
            entities={entities}
            tunnels={tunnels}
            onRefreshEntries={loadJournal}
            onNavigateToJournal={() => setCurrentView('journal')}
          />
        )}
      </main>

      {/* Global Sanctum Command Palette Spotlight Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentView}
        onSelectTunnel={handleTuneToTunnel}
        onSelectEntity={handleTuneSpiritToPortal}
        onStartTrance={() => {
          if (activeTunnel) setIsTranceActive(true);
        }}
        onEmergencyGrounding={handleEmergencyGrounding}
      />
    </div>
  );
};

export default App;
