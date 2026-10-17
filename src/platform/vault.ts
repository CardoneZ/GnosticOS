/**
 * Platform abstraction layer for the GnosticOS Encrypted Vault.
 * Detects whether running inside Tauri v2 or Web/PWA.
 */

export interface TunnelData {
  id: number;
  number: number;
  name: string;
  path_letter: string;
  attribution_type: string;
  planet_element: string;
  gematria: number;
  musical_key: string;
  key_modifier?: string | null;
  atu: string;
  tier: 'adept' | 'magus';
}

export interface EntityData {
  id: number;
  slug: string;
  name: string;
  pantheon: string;
  current?: string | null;
  element?: string | null;
  sephira?: string | null;
}

export interface OfferingData {
  kind: 'incense' | 'candle' | 'food' | 'drink' | 'blood' | 'art' | 'devotion' | 'other';
  quantity?: string;
  entity_id?: number | null;
}

export interface EntityPresenceData {
  entity_id: number;
  intensity?: number;
  invoked: boolean;
}

export interface MeditationRecordData {
  duration_minutes?: number | string;
  description?: string;
  felt_before?: string;
  felt_during?: string;
  felt_after?: string;
  mind_popups?: string;
  smells?: string;
  sounds?: string;
  physical_sensations?: string;
  emotional_sensations?: string;
  thoughts_comments?: string;
}

export interface JournalEntryData {
  id: string;
  ritual_at: string;
  tz_offset_min: number;
  latitude?: number | null;
  longitude?: number | null;
  moon_phase?: string | null;
  moon_illumination?: number | null;
  moon_age_days?: number | null;
  day_ruler?: string | null;
  planetary_hour?: string | null;
  planetary_hour_index?: number | null;
  is_nocturnal?: number | null;
  resonance?: number | null;
  pre_state?: number | null;
  post_state?: number | null;
  working_type?: string | null;
  tunnel_id?: number | null;
  title: string;
  body_md: string;
  visions?: string | null;
  pre_state_label?: string | null;
  post_state_label?: string | null;
  offerings: OfferingData[];
  entities: EntityPresenceData[];
  meditation_record?: MeditationRecordData | null;
}

// Fallback seed reference data
export const SEED_TUNNELS: TunnelData[] = [
  { id: 11, number: 11, name: 'Amprodias', path_letter: 'Aleph', attribution_type: 'element', planet_element: 'Air / Satan', gematria: 401, musical_key: 'E', atu: 'The Fool', tier: 'adept' },
  { id: 12, number: 12, name: 'Baratchial', path_letter: 'Beth', attribution_type: 'planet', planet_element: 'Mercury', gematria: 260, musical_key: 'E', key_modifier: 'chatter', atu: 'The Magus', tier: 'magus' },
  { id: 13, number: 13, name: 'Gargophias', path_letter: 'Gimel', attribution_type: 'luminary', planet_element: 'Moon / Hecate', gematria: 393, musical_key: 'G#', atu: 'The Priestess', tier: 'magus' },
  { id: 14, number: 14, name: 'Dagdagiel', path_letter: 'Daleth', attribution_type: 'planet', planet_element: 'Venus / Babalon', gematria: 55, musical_key: 'F#', atu: 'The Empress', tier: 'magus' },
  { id: 15, number: 15, name: 'Hemethterith', path_letter: 'He', attribution_type: 'sign', planet_element: 'Aries', gematria: 1054, musical_key: 'A#', atu: 'The Star', tier: 'magus' },
  { id: 16, number: 16, name: 'Uriens', path_letter: 'Vau', attribution_type: 'sign', planet_element: 'Taurus', gematria: 395, musical_key: 'C#', atu: 'The Hierophant', tier: 'magus' },
  { id: 17, number: 17, name: 'Zamradiel', path_letter: 'Zain', attribution_type: 'sign', planet_element: 'Gemini', gematria: 292, musical_key: 'D', atu: 'The Lovers', tier: 'magus' },
  { id: 18, number: 18, name: 'Characith', path_letter: 'Cheth', attribution_type: 'sign', planet_element: 'Cancer', gematria: 640, musical_key: 'D#', atu: 'The Chariot', tier: 'magus' },
  { id: 19, number: 19, name: 'Temphioth', path_letter: 'Teth', attribution_type: 'sign', planet_element: 'Leo', gematria: 610, musical_key: 'E', key_modifier: 'roar', atu: 'Lust', tier: 'magus' },
  { id: 20, number: 20, name: 'Yamatu', path_letter: 'Yod', attribution_type: 'sign', planet_element: 'Virgo', gematria: 131, musical_key: 'F', atu: 'The Hermit', tier: 'magus' },
  { id: 21, number: 21, name: 'Kurgasiax', path_letter: 'Kaph', attribution_type: 'planet', planet_element: 'Jupiter', gematria: 315, musical_key: 'A#', atu: 'Fortune', tier: 'magus' },
  { id: 22, number: 22, name: 'Lafcursiax', path_letter: 'Lamed', attribution_type: 'sign', planet_element: 'Libra', gematria: 671, musical_key: 'F#', atu: 'Adjustment', tier: 'magus' },
  { id: 23, number: 23, name: 'Malkunofat', path_letter: 'Mem', attribution_type: 'element', planet_element: 'Water / Leviathan', gematria: 307, musical_key: 'G#', atu: 'The Hanged Man', tier: 'magus' },
  { id: 24, number: 24, name: 'Niantiel', path_letter: 'Nun', attribution_type: 'sign', planet_element: 'Scorpio', gematria: 160, musical_key: 'G', atu: 'Death', tier: 'magus' },
  { id: 25, number: 25, name: 'Saksaksalim', path_letter: 'Samekh', attribution_type: 'sign', planet_element: 'Sagittarius', gematria: 300, musical_key: 'G#', atu: 'Art', tier: 'magus' },
  { id: 26, number: 26, name: 'A\'ano\'nin', path_letter: 'Ayin', attribution_type: 'sign', planet_element: 'Capricorn', gematria: 237, musical_key: 'A', atu: 'The Devil', tier: 'magus' },
  { id: 27, number: 27, name: 'Parfaxitas', path_letter: 'Pe', attribution_type: 'planet', planet_element: 'Mars', gematria: 450, musical_key: 'C', atu: 'The Tower', tier: 'magus' },
  { id: 28, number: 28, name: 'Tzuflifu', path_letter: 'Tzaddi', attribution_type: 'sign', planet_element: 'Aquarius', gematria: 302, musical_key: 'A#', atu: 'The Emperor', tier: 'magus' },
  { id: 29, number: 29, name: 'Qulielfi', path_letter: 'Qoph', attribution_type: 'sign', planet_element: 'Pisces', gematria: 266, musical_key: 'B', atu: 'The Moon', tier: 'magus' },
  { id: 30, number: 30, name: 'Raflifu', path_letter: 'Resh', attribution_type: 'luminary', planet_element: 'Sun / Black Sun', gematria: 406, musical_key: 'D', atu: 'The Sun', tier: 'magus' },
  { id: 31, number: 31, name: 'Shalicu', path_letter: 'Shin', attribution_type: 'element', planet_element: 'Fire / Aeon', gematria: 500, musical_key: 'C', atu: 'The Aeon', tier: 'magus' },
  { id: 32, number: 32, name: 'Thantifaxath', path_letter: 'Tau', attribution_type: 'planet', planet_element: 'Saturn', gematria: 1040, musical_key: 'B#', atu: 'The Universe', tier: 'adept' },
];

export const SEED_ENTITIES: EntityData[] = [
  { id: 1, slug: 'satan', name: 'Satan', pantheon: 'demonic_divinity', current: 'demonolatry', sephira: 'Kether' },
  { id: 2, slug: 'lucifer', name: 'Lucifer', pantheon: 'demonic_divinity', current: 'demonolatry', element: 'air', sephira: 'Chokmah' },
  { id: 3, slug: 'unsere', name: 'Unsere', pantheon: 'demonic_divinity', current: 'demonolatry', sephira: 'Binah' },
  { id: 4, slug: 'lucifuge-rofocale', name: 'Lucifuge Rofocale', pantheon: 'demonic_divinity', current: 'demonolatry', sephira: 'Daath' },
  { id: 5, slug: 'verrine', name: 'Verrine', pantheon: 'demonic_divinity', current: 'demonolatry', sephira: 'Chesed' },
  { id: 6, slug: 'leviathan', name: 'Leviathan', pantheon: 'demonic_divinity', current: 'demonolatry', element: 'water', sephira: 'Geburah' },
  { id: 7, slug: 'belial', name: 'Belial', pantheon: 'demonic_divinity', current: 'demonolatry', element: 'earth', sephira: 'Tiphereth' },
  { id: 8, slug: 'amducious', name: 'Amducious', pantheon: 'demonic_divinity', current: 'demonolatry', sephira: 'Netzach' },
  { id: 9, slug: 'eurynomous', name: 'Eurynomous', pantheon: 'demonic_divinity', current: 'demonolatry', sephira: 'Hod' },
  { id: 10, slug: 'flereous', name: 'Flereous', pantheon: 'demonic_divinity', current: 'demonolatry', element: 'fire', sephira: 'Yesod' },
];

export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export async function unlockVault(passphrase: string): Promise<boolean> {
  if (isTauriEnvironment()) {
    const { invoke } = await import('@tauri-apps/api/core');
    const ok = await invoke<boolean>('unlock_vault', { passphrase });
    if (ok) {
      const { setActivePassphrase } = await import('../db/vaultRepository');
      setActivePassphrase(passphrase);
    }
    return ok;
  }
  const { setActivePassphrase } = await import('../db/vaultRepository');
  setActivePassphrase(passphrase);
  sessionStorage.setItem('gnosticos_unlocked', 'true');
  return true;
}

export async function lockVault(): Promise<void> {
  if (isTauriEnvironment()) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<void>('lock_vault');
  }
  sessionStorage.removeItem('gnosticos_unlocked');
  sessionStorage.removeItem('gnosticos_active_key');
}

export async function getTunnels(): Promise<TunnelData[]> {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<TunnelData[]>('fetch_tunnels');
    } catch (err) {
      console.warn('Falling back to seed tunnels:', err);
    }
  }
  return SEED_TUNNELS;
}

export async function getEntities(): Promise<EntityData[]> {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<EntityData[]>('fetch_entities');
    } catch (err) {
      console.warn('Falling back to seed entities:', err);
    }
  }
  return SEED_ENTITIES;
}

export async function saveJournalEntry(entry: JournalEntryData): Promise<boolean> {
  const { sp_save_entry } = await import('../db/vaultRepository');
  return sp_save_entry(entry);
}

export async function fetchJournalEntries(): Promise<JournalEntryData[]> {
  const { sp_fetch_all_entries } = await import('../db/vaultRepository');
  return sp_fetch_all_entries();
}

export async function deleteJournalEntry(id: string): Promise<boolean> {
  const { sp_delete_entry } = await import('../db/vaultRepository');
  return sp_delete_entry(id);
}

export async function exportVaultBackup(): Promise<string> {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<string>('export_vault_backup');
    } catch (err) {
      console.warn('Tauri export backup failed, using web repository:', err);
    }
  }
  const { sp_export_backup_json } = await import('../db/vaultRepository');
  return sp_export_backup_json();
}

export async function importVaultBackup(jsonStr: string): Promise<{ imported: number; total: number }> {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const count = await invoke<number>('import_vault_backup', { backupJsonStr: jsonStr });
      return { imported: count, total: count };
    } catch (err) {
      console.warn('Tauri import backup failed, using web repository:', err);
    }
  }
  const { sp_import_backup_json } = await import('../db/vaultRepository');
  return sp_import_backup_json(jsonStr);
}

export async function getRollingBackups() {
  const { sp_get_rolling_backups } = await import('../db/vaultRepository');
  return sp_get_rolling_backups();
}

export async function restoreRollingBackup(snapshotId: string): Promise<boolean> {
  const { sp_restore_rolling_backup } = await import('../db/vaultRepository');
  return sp_restore_rolling_backup(snapshotId);
}
