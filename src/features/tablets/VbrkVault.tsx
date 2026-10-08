import React, { useState, useEffect, useMemo } from 'react';
import { computeGematria, CONNOLLY_CIPHER } from './gematria';
import { EntityData } from '../../platform/vault';
import {
  Shield,
  Eye,
  EyeOff,
  Flame,
  Sparkles,
  Lock,
  Save,
  Key,
  Check,
} from 'lucide-react';

export interface VbrkSecretData {
  demonicName: string;
  patronEntityId: number;
  sigilSvg: string;
  covenantVows: string;
  ascensionDate: string;
}

interface VbrkVaultProps {
  entities: EntityData[];
}

const STORAGE_VBRK_KEY = 'gnosticos_vbrk_sanctuary_secret';

export const VbrkVault: React.FC<VbrkVaultProps> = ({ entities }) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [demonicName, setDemonicName] = useState<string>('AZAZEL-RAIMI-VALAC');
  const [patronEntityId, setPatronEntityId] = useState<number>(2); // Default Lucifer
  const [sigilSvg, setSigilSvg] = useState<string>('');
  const [covenantVows, setCovenantVows] = useState<string>(
    'Vi Boith Raimi Kairtey. I dedicate my will to the awakening of the Black Flame, sovereign intellect, and the dissolution of slave morality.',
  );
  const [ascensionDate, setAscensionDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Load from store on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_VBRK_KEY);
      if (raw) {
        const parsed: VbrkSecretData = JSON.parse(raw);
        setDemonicName(parsed.demonicName);
        setPatronEntityId(parsed.patronEntityId);
        setSigilSvg(parsed.sigilSvg);
        setCovenantVows(parsed.covenantVows);
        setAscensionDate(parsed.ascensionDate);
      } else {
        // Default seed VBRK SVG glyph
        const defaultSigil = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="90" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 4" />
  <circle cx="100" cy="100" r="60" fill="none" stroke="#a855f7" stroke-width="1.5" />
  <polygon points="100,20 170,140 30,140" fill="none" stroke="#eab308" stroke-width="2" />
  <polygon points="100,180 170,60 30,60" fill="none" stroke="#ef4444" stroke-width="2" />
  <circle cx="100" cy="100" r="12" fill="#ef4444" />
</svg>`;
        setSigilSvg(defaultSigil);
      }
    } catch (err) {
      console.warn('Error loading VBRK vault:', err);
    }
  }, []);

  // Compute Gematria of Secret Name in real-time
  const gematriaResult = useMemo(() => {
    if (!demonicName.trim()) return null;
    try {
      return computeGematria(demonicName, CONNOLLY_CIPHER, { onUnknown: 'skip' });
    } catch {
      return null;
    }
  }, [demonicName]);

  const patronEntity = useMemo(() => {
    return entities.find((e) => e.id === patronEntityId);
  }, [entities, patronEntityId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave: VbrkSecretData = {
      demonicName: demonicName.trim(),
      patronEntityId,
      sigilSvg: sigilSvg.trim(),
      covenantVows: covenantVows.trim(),
      ascensionDate,
    };
    localStorage.setItem(STORAGE_VBRK_KEY, JSON.stringify(dataToSave));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-black text-neutral-200 flex flex-col gap-6 select-none font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wider text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-red-500" />
            VBRK Sanctuary & Secret Demonic Name Vault
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Vi Boith Raimi Kairtey • Holy of Holies • Confidential Ascension Covenant & Gematria
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Privacy Veil Toggle */}
          <button
            onClick={() => setIsRevealed(!isRevealed)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isRevealed
                ? 'bg-red-950/70 border-red-700/60 text-red-200 shadow-[0_0_12px_rgba(220,38,38,0.3)]'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
          >
            {isRevealed ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4" />}
            {isRevealed ? 'Conceal Holy of Holies' : 'Unveil Secret Sanctuary'}
          </button>
        </div>
      </div>

      {/* Main Secret Vault Container */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Secret Name & Covenant (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Demonic Name Box */}
          <div className="glass-panel p-6 rounded-xl border border-red-900/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Secret Demonic Name Received:
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                Connolly Gematria Cipher
              </span>
            </div>

            <div className="relative">
              <input
                type={isRevealed ? 'text' : 'password'}
                value={demonicName}
                onChange={(e) => setDemonicName(e.target.value.toUpperCase())}
                placeholder="ENTER SECRET ASCENSION NAME..."
                className="w-full bg-black/90 border border-neutral-700 rounded-lg px-4 py-3 font-mono text-base tracking-widest text-amber-300 placeholder:text-neutral-700 focus:border-red-500 focus:outline-none"
              />
              {!isRevealed && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 pointer-events-none">
                  <Lock className="w-3.5 h-3.5" /> Masked
                </div>
              )}
            </div>

            {/* Live Gematria Calculation Badge */}
            {gematriaResult && (
              <div className="p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Total Connolly Gematria:</span>
                  <span className="text-amber-400 font-bold text-base">
                    {gematriaResult.total}
                  </span>
                  <span className="text-neutral-500 text-[10px] ml-2">
                    Chain: {gematriaResult.reductionChain.join(' → ')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-neutral-500 block text-[10px]">Ruling Divinity & Sephira:</span>
                  <span className="text-red-400 font-bold">
                    {gematriaResult.rulingSephira.divinity} ({gematriaResult.rulingSephira.name} #{gematriaResult.root})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Patron Divinity & Ascension Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 glass-panel p-5 rounded-xl border border-neutral-800">
            <div className="flex flex-col gap-1.5 text-xs font-mono">
              <label className="text-neutral-400">Patron Demonic Divinity:</label>
              <select
                value={patronEntityId}
                onChange={(e) => setPatronEntityId(Number(e.target.value))}
                className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:border-red-500 focus:outline-none"
              >
                {entities.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.name} ({ent.sephira || ent.pantheon})
                  </option>
                ))}
              </select>
              {patronEntity && (
                <span className="text-[10px] text-purple-400 font-mono mt-0.5">
                  Current: {patronEntity.current || 'Demonolatry'} • Sephira: {patronEntity.sephira || 'Ascension Gate'}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 text-xs font-mono">
              <label className="text-neutral-400">Date of Self-Dedication / Ascension:</label>
              <input
                type="date"
                value={ascensionDate}
                onChange={(e) => setAscensionDate(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Covenant Vows & Ascension Decrees */}
          <div className="glass-panel p-5 rounded-xl border border-neutral-800 flex flex-col gap-2 text-xs font-mono">
            <label className="text-neutral-300 font-bold uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              Covenant Vows & Nightside Decrees:
            </label>
            <textarea
              value={covenantVows}
              onChange={(e) => setCovenantVows(e.target.value)}
              rows={5}
              placeholder="Record personal vows spoken during baptism into the Current..."
              className="w-full bg-black/80 border border-neutral-700 rounded-lg p-3 text-neutral-200 placeholder:text-neutral-700 focus:border-red-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-end gap-3">
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <Check className="w-4 h-4" /> VBRK Sanctuary Sealed in Vault
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-serif text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
            >
              <Save className="w-4 h-4" /> SEAL COVENANT IN VAULT
            </button>
          </div>
        </div>

        {/* Right Column: Personal VBRK Sigil & Vector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="glass-panel p-6 rounded-xl border border-neutral-800 flex flex-col items-center justify-between gap-4 min-h-[460px]">
            <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-serif font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Personal VBRK Power Sigil
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Vector SVG</span>
            </div>

            {/* Sigil Display Viewport */}
            <div className="w-full max-w-[260px] aspect-square rounded-2xl bg-black border border-neutral-800 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_transparent_70%)] pointer-events-none" />
              {sigilSvg ? (
                <div
                  className="w-full h-full flex items-center justify-center text-red-500"
                  dangerouslySetInnerHTML={{ __html: sigilSvg }}
                />
              ) : (
                <div className="text-center text-neutral-600 text-xs font-mono p-4">
                  No VBRK Sigil loaded. Paste SVG code below.
                </div>
              )}
            </div>

            {/* SVG Code Input Area */}
            <div className="w-full flex flex-col gap-1.5 text-xs font-mono">
              <label className="text-neutral-400 flex items-center justify-between">
                <span>Personal Sigil SVG Markup:</span>
                <span className="text-[10px] text-neutral-500">Paste raw &lt;svg&gt;</span>
              </label>
              <textarea
                value={sigilSvg}
                onChange={(e) => setSigilSvg(e.target.value)}
                rows={4}
                placeholder="<svg xmlns=...><circle ... /></svg>"
                className="w-full bg-black/90 border border-neutral-800 rounded-lg p-2.5 text-[10px] font-mono text-neutral-400 focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VbrkVault;
