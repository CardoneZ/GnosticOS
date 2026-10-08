import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  calculateNatalEsotericBlueprint,
  NatalCalculationResult,
  ESOTERIC_CITIES,
} from './natalEngine';
import { ALL_GRIMOIRE_ENTITIES, GrimoireEntity } from '../../db/grimoireSeeds';
import { DAY_RULERS, PLANETARY_CORRESPONDENCES, Planet } from '../ephemeris/planetaryHours';
import SacredSigil from '../sigils/SacredSigil';
import { playEnnChantTone, emergencyGroundAudio } from '../audio/audioManager';
import SanctumDropdown, { DropdownOption } from '../ui/SanctumDropdown';
import {
  Orbit,
  Calendar,
  Clock,
  User,
  Sparkles,
  Flame,
  Moon,
  Sun,
  Eye,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Shield,
  Layers,
  Compass,
  FileText,
  Info,
  MapPin,
} from 'lucide-react';

interface NatalAstrolabeProps {
  onTuneToPortal?: (entity: GrimoireEntity) => void;
  onNavigateToChaos?: (intent?: string) => void;
  onSendToJournal?: (draft: {
    title: string;
    body_md: string;
    working_type: string;
    pre_state_label: string;
    post_state_label: string;
    resonance: number;
  }) => void;
  onNavigateToMeditation?: () => void;
  onNavigateToTree?: () => void;
}

type TabType =
  | 'overview'
  | 'goetia'
  | 'crowley'
  | 'nightside'
  | 'meditation'
  | 'lore';

// Notable Occult Figures for 1-Click Inspiration
const PRESET_FIGURES = [
  {
    name: 'Aleister Crowley (To Mega Therion)',
    date: '1875-10-12',
    time: '23:42',
    motto: 'Perdurabo (I will endure unto the end)',
    tag: 'Thelema / Master 11',
  },
  {
    name: 'Austin Osman Spare',
    date: '1886-12-30',
    time: '04:00',
    motto: 'Zos vel Thanatos',
    tag: 'Chaos Magick / Zos Kia Cultus',
  },
  {
    name: 'S.L. MacGregor Mathers',
    date: '1854-01-08',
    time: '12:00',
    motto: 'Deo Duce Comite Ferro',
    tag: 'Golden Dawn / Goetia Translator',
  },
  {
    name: 'Anton Szandor LaVey',
    date: '1930-04-11',
    time: '18:00',
    motto: 'Anton Szandor LaVey',
    tag: 'Church of Satan / Left Hand Path',
  },
];

export const NatalAstrolabe: React.FC<NatalAstrolabeProps> = ({
  onTuneToPortal,
  onNavigateToChaos,
  onSendToJournal,
  onNavigateToMeditation,
  onNavigateToTree,
}) => {
  // Persistence in Local Storage
  const [birthDate, setBirthDate] = useState<string>(() => {
    return localStorage.getItem('gnosticos_natal_date') || '1990-10-12';
  });
  const [birthTime, setBirthTime] = useState<string>(() => {
    return localStorage.getItem('gnosticos_natal_time') || '12:00';
  });
  const [magicalName, setMagicalName] = useState<string>(() => {
    return localStorage.getItem('gnosticos_natal_name') || 'Perdurabo';
  });
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem('gnosticos_natal_city') || 'tuxpan';
  });
  const [customLat, setCustomLat] = useState<number>(() => {
    const saved = localStorage.getItem('gnosticos_natal_custom_lat');
    return saved ? parseFloat(saved) : 20.9573;
  });
  const [customLng, setCustomLng] = useState<number>(() => {
    const saved = localStorage.getItem('gnosticos_natal_custom_lng');
    return saved ? parseFloat(saved) : -97.4081;
  });
  const [customTz, setCustomTz] = useState<number>(() => {
    const saved = localStorage.getItem('gnosticos_natal_custom_tz');
    return saved ? parseFloat(saved) : -6;
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Audio State
  const [activeAudioNote, setActiveAudioNote] = useState<string | null>(null);
  const stopAudioRef = useRef<(() => void) | null>(null);

  // Meditation Chamber States
  const [meditationDurationMin, setMeditationDurationMin] = useState<number>(5);
  const [meditationIsRunning, setMeditationIsRunning] = useState<boolean>(false);
  const [meditationSecondsLeft, setMeditationSecondsLeft] = useState<number>(300);
  const [meditationFocusTarget, setMeditationFocusTarget] = useState<'day' | 'night' | 'lucifer'>('day');
  const [meditationLoopAudio, setMeditationLoopAudio] = useState<boolean>(true);
  const [meditationBreathPhase, setMeditationBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [meditationBreathCount, setMeditationBreathCount] = useState<number>(4);

  // Save changes to storage
  useEffect(() => {
    localStorage.setItem('gnosticos_natal_date', birthDate);
    localStorage.setItem('gnosticos_natal_time', birthTime);
    localStorage.setItem('gnosticos_natal_name', magicalName);
    localStorage.setItem('gnosticos_natal_city', selectedCityId);
    localStorage.setItem('gnosticos_natal_custom_lat', String(customLat));
    localStorage.setItem('gnosticos_natal_custom_lng', String(customLng));
    localStorage.setItem('gnosticos_natal_custom_tz', String(customTz));
  }, [birthDate, birthTime, magicalName, selectedCityId, customLat, customLng, customTz]);

  // Compute Blueprint
  const blueprint: NatalCalculationResult | null = useMemo(() => {
    const cityParam =
      selectedCityId === 'custom'
        ? { latitude: customLat, longitude: customLng, timezoneOffset: customTz, name: 'Custom Sanctuary' }
        : selectedCityId;
    return calculateNatalEsotericBlueprint(
      birthDate,
      magicalName.trim() || undefined,
      birthTime,
      cityParam
    );
  }, [birthDate, magicalName, birthTime, selectedCityId, customLat, customLng, customTz]);

  const cityOptions: DropdownOption[] = useMemo(() => {
    return ESOTERIC_CITIES.map((c) => ({
      value: c.id,
      label: c.name,
      sublabel: `${c.stateOrRegion ? `${c.stateOrRegion}, ` : ''}${c.country}`,
      badge: c.id === 'tuxpan' ? 'Veracruz' : `${c.latitude > 0 ? '+' : ''}${c.latitude.toFixed(1)}°, ${c.longitude > 0 ? '+' : ''}${c.longitude.toFixed(1)}°`,
    }));
  }, []);

  // Planetary Day Ruler from Birth Date
  const natalDayRuler = useMemo(() => {
    const parts = birthDate.split('-').map((p) => parseInt(p, 10));
    if (parts.length !== 3 || isNaN(parts[0])) return null;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayOfWeek = d.getDay(); // 0 = Sunday
    const planetKey = DAY_RULERS[dayOfWeek] as Planet;
    return PLANETARY_CORRESPONDENCES[planetKey];
  }, [birthDate]);

  // Resolve matching GrimoireEntity for Day and Night Goetia Spirits
  const { dayEntity, nightEntity } = useMemo(() => {
    if (!blueprint) return { dayEntity: null, nightEntity: null };

    const dEnt =
      ALL_GRIMOIRE_ENTITIES.find(
        (e) => e.goeticNumber === blueprint.goeticPatrons.daySpirit.number
      ) || null;

    const nEnt =
      ALL_GRIMOIRE_ENTITIES.find(
        (e) => e.goeticNumber === blueprint.goeticPatrons.nightSpirit.number
      ) || null;

    return { dayEntity: dEnt, nightEntity: nEnt };
  }, [blueprint]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (stopAudioRef.current) {
        stopAudioRef.current();
      }
      emergencyGroundAudio();
    };
  }, []);

  // Play Enn with carrier drone
  const handlePlayEnn = (noteKey: string, spokenEnn?: string) => {
    if (activeAudioNote) {
      if (stopAudioRef.current) stopAudioRef.current();
      emergencyGroundAudio();
      setActiveAudioNote(null);
      return;
    }

    setActiveAudioNote(noteKey);
    stopAudioRef.current = playEnnChantTone(
      noteKey,
      5.0,
      () => {
        setActiveAudioNote(null);
      },
      spokenEnn
    );
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Meditation Chamber Timer Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (meditationIsRunning) {
      interval = setInterval(() => {
        setMeditationSecondsLeft((prev) => {
          if (prev <= 1) {
            setMeditationIsRunning(false);
            emergencyGroundAudio();
            return 0;
          }
          return prev - 1;
        });

        // 4 in / 4 hold / 6 out breath pacing cycle (14s total)
        setMeditationBreathCount((prevCount) => {
          // Handled via timestamp modulation
          return prevCount;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [meditationIsRunning]);

  // Breathing Rhythm Sub-ticker
  useEffect(() => {
    if (!meditationIsRunning) return;
    const breathTimer = setInterval(() => {
      const sec = meditationSecondsLeft % 14;
      if (sec < 4) {
        setMeditationBreathPhase('inhale');
        setMeditationBreathCount(4 - sec);
      } else if (sec < 8) {
        setMeditationBreathPhase('hold');
        setMeditationBreathCount(8 - sec);
      } else {
        setMeditationBreathPhase('exhale');
        setMeditationBreathCount(14 - sec);
      }
    }, 1000);
    return () => clearInterval(breathTimer);
  }, [meditationIsRunning, meditationSecondsLeft]);

  // Periodic Enn Chanting in Meditation if looping is enabled
  useEffect(() => {
    if (!meditationIsRunning || !meditationLoopAudio || !blueprint) return;

    // Trigger audio at start and every 28 seconds
    const cycle = meditationSecondsLeft % 28;
    if (cycle === 0 && !activeAudioNote) {
      const spirit =
        meditationFocusTarget === 'day'
          ? blueprint.goeticPatrons.daySpirit
          : blueprint.goeticPatrons.nightSpirit;
      const enn = meditationFocusTarget === 'lucifer' ? 'Renich Tasa Uberaca Biasa Icar Lucifer' : spirit.enn;
      handlePlayEnn(blueprint.alchemical.musicalKey, enn);
    }
  }, [meditationIsRunning, meditationSecondsLeft, meditationLoopAudio, meditationFocusTarget, blueprint]);

  const handleStartMeditation = () => {
    setMeditationSecondsLeft(meditationDurationMin * 60);
    setMeditationIsRunning(true);

    if (meditationLoopAudio && blueprint) {
      const spirit =
        meditationFocusTarget === 'day'
          ? blueprint.goeticPatrons.daySpirit
          : blueprint.goeticPatrons.nightSpirit;
      const enn = meditationFocusTarget === 'lucifer' ? 'Renich Tasa Uberaca Biasa Icar Lucifer' : spirit.enn;
      handlePlayEnn(blueprint.alchemical.musicalKey, enn);
    }
  };

  const handleStopMeditation = () => {
    setMeditationIsRunning(false);
    emergencyGroundAudio();
    setActiveAudioNote(null);
  };

  const handleResetMeditation = () => {
    handleStopMeditation();
    setMeditationSecondsLeft(meditationDurationMin * 60);
  };

  // Export Complete Blueprint into Alchemical Journal Draft
  const handleExportToJournal = () => {
    if (!blueprint || !onSendToJournal) return;

    const draftMd = `
# 🌌 Esoteric Natal Blueprint & Currents Record

**Subject / Magickal Motto:** ${blueprint.name || 'Anonymous Magus'}  
**Date of Physical Manifestation:** ${blueprint.birthDate.raw} (${birthTime || '12:00'})  
**Sanctuary City / Geodesic:** ${blueprint.geographicOrigins?.city.name || 'Tuxpan, Veracruz'} (${blueprint.geographicOrigins?.latitude.toFixed(4)}°, ${blueprint.geographicOrigins?.longitude.toFixed(4)}°)  
**Planetary Day Ruler:** ${natalDayRuler?.title || 'Unknown'} (${natalDayRuler?.symbol || '☉'})  
**Planetary Hour Ruler of Birth:** ${blueprint.geographicOrigins?.planetaryHourOfBirth.rulingPlanet || 'Sun'} ${blueprint.geographicOrigins?.planetaryHourOfBirth.symbol || '☉'} (${blueprint.geographicOrigins?.planetaryHourOfBirth.isDiurnal ? 'Diurnal' : 'Nocturnal'} Hour ${blueprint.geographicOrigins?.planetaryHourOfBirth.hourIndex || 1})  

---

## 1. Numerological Geometry & Gematria
- **Life Path Vibration:** **${blueprint.lifePath}** ${
      blueprint.isMasterNumber ? `*(Master Vibration: ${blueprint.masterTitle})*` : ''
    }
- **Birthday Vibration:** ${blueprint.birthdayNumber}
- **Qliphothic Shadow Frequency:** ${blueprint.shadowNumber} (Mirror spectrum of self-deification)
${blueprint.destinyNumber ? `- **Name Destiny / Expression Number:** ${blueprint.destinyNumber}` : ''}
${blueprint.soulUrgeNumber ? `- **Soul Urge (Vocal Heart):** ${blueprint.soulUrgeNumber}` : ''}

---

## 2. Crowley Thoth Tarot Birth Arcana
- **Primary Atu:** **${blueprint.tarotBirthCard.name}** (*${blueprint.tarotBirthCard.crowleyTitle}*)
- **Hebrew Letter & Tree Path:** ${blueprint.tarotBirthCard.hebrewLetter} (Path ${blueprint.tarotBirthCard.pathNumber}: ${blueprint.tarotBirthCard.treeDescription})
- **Liber 777 Godforms:** ${blueprint.tarotBirthCard.liber777Godform}
- **Esoteric Archetype:** ${blueprint.tarotBirthCard.meaning}
- **Shadow Warning:** ${blueprint.tarotBirthCard.shadowWarning}

---

## 3. Astrological Decanate & 72 Goetic Quinance Patrons
- **Zodiac Sign:** ${blueprint.zodiacSign.symbol} **${blueprint.zodiacSign.name}** (Decan ${blueprint.zodiacSign.decan}, ${blueprint.zodiacSign.decanDegreeRange})
- **Element & Modality:** ${blueprint.zodiacSign.element.toUpperCase()} / ${blueprint.zodiacSign.modality}
- **Ruling Planet:** ${blueprint.zodiacSign.rulingPlanet} (Sub-Ruler: ${blueprint.zodiacSign.subRuler})
- **Minor Arcana Decan Card:** ${blueprint.zodiacSign.tarotMinorCard}

### Patron Goetic Spirits (Mathers & Crowley Zodiacal Alignment)
1. **Diurnal (Day) Patron: #${blueprint.goeticPatrons.daySpirit.number} ${blueprint.goeticPatrons.daySpirit.name} (${blueprint.goeticPatrons.daySpirit.rank})**
   - **Enn Chant:** \`${blueprint.goeticPatrons.daySpirit.enn}\`
   - **Magical Office:** ${blueprint.goeticPatrons.daySpirit.office}
2. **Nocturnal (Night) Patron: #${blueprint.goeticPatrons.nightSpirit.number} ${blueprint.goeticPatrons.nightSpirit.name} (${blueprint.goeticPatrons.nightSpirit.rank})**
   - **Enn Chant:** \`${blueprint.goeticPatrons.nightSpirit.enn}\`
   - **Magical Office:** ${blueprint.goeticPatrons.nightSpirit.office}

---

## 4. Geographical Origins, Geodesic Sanctuary & Ascendant Daimon
- **Birth Sanctuary:** ${blueprint.geographicOrigins?.city.name} (${blueprint.geographicOrigins?.city.country}) — ${blueprint.geographicOrigins?.city.description}
- **Geodesic Coordinates:** ${blueprint.geographicOrigins?.latitude.toFixed(4)}° N, ${blueprint.geographicOrigins?.longitude.toFixed(4)}° W (Timezone: UTC ${blueprint.geographicOrigins && blueprint.geographicOrigins.timezoneOffset >= 0 ? `+${blueprint.geographicOrigins.timezoneOffset}` : blueprint.geographicOrigins?.timezoneOffset})
- **Local Sidereal Time:** ${blueprint.geographicOrigins?.localSiderealTimeString} LST
- **Solar Horizon:** Sunrise: ${blueprint.geographicOrigins?.solarTiming.sunrise} | Sunset: ${blueprint.geographicOrigins?.solarTiming.sunset} (${blueprint.geographicOrigins?.solarTiming.isDiurnal ? 'Diurnal' : 'Nocturnal'})
- **Planetary Hour of Birth:** ${blueprint.geographicOrigins?.planetaryHourOfBirth.rulingPlanet} ${blueprint.geographicOrigins?.planetaryHourOfBirth.symbol} (Hour ${blueprint.geographicOrigins?.planetaryHourOfBirth.hourIndex})
  - Archangel: ${blueprint.geographicOrigins?.planetaryHourOfBirth.archangel}
  - Olympic Spirit: ${blueprint.geographicOrigins?.planetaryHourOfBirth.olympicSpirit}
  - Demonic Reflex: ${blueprint.geographicOrigins?.planetaryHourOfBirth.demonicReflex}
  - Magical Work: ${blueprint.geographicOrigins?.planetaryHourOfBirth.magicalFocus}
- **Natal Ascendant (Rising Sign):** ${blueprint.geographicOrigins?.ascendant.signSymbol} **${blueprint.geographicOrigins?.ascendant.formattedDegree}** (Decan ${blueprint.geographicOrigins?.ascendant.decan}, Sub-Ruler: ${blueprint.geographicOrigins?.ascendant.subRuler})
- **Natal Rising Goetic Patron (Threshold Daimon):** #${blueprint.geographicOrigins?.ascendant.risingGoetiaPatron.number} ${blueprint.geographicOrigins?.ascendant.risingGoetiaPatron.name} (${blueprint.geographicOrigins?.ascendant.risingGoetiaPatron.rank})
  - Enn Chant: \`${blueprint.geographicOrigins?.ascendant.risingGoetiaPatron.enn}\`
  - Office: ${blueprint.geographicOrigins?.ascendant.risingGoetiaPatron.office}

---

## 5. Dukanté Demonic Family Alignment (S. Connolly)
- **Family:** ${blueprint.dukanteFamily.familyName}
- **Demonic Patrons:** ${blueprint.dukanteFamily.demonicPatron}
- **Direction / Element:** ${blueprint.dukanteFamily.direction} / ${blueprint.dukanteFamily.element}
- **Philosophical Current:** ${blueprint.dukanteFamily.philosophicalFocus}

---

## 6. Nightside Qliphothic Tunnel of Set (Kenneth Grant / Liber 231)
- **Tunnel:** ${blueprint.qliphothTunnel.tunnelNumber} (${blueprint.qliphothTunnel.guardian})
- **Shadow Gnosis:** ${blueprint.qliphothTunnel.shadowGnosis}

---

## 7. Alchemical Correspondences & Ritual Altar
- **Carrier Musical Key & Resonance:** ${blueprint.alchemical.musicalKey} (${blueprint.alchemical.frequencyHz} Hz)
- **Alchemical Metal:** ${blueprint.alchemical.metal}
- **Ritual Incense:** ${blueprint.alchemical.incense}
- **Altar Candles:** ${blueprint.alchemical.candleColor}
- **Sacred Stone:** ${blueprint.alchemical.stone}

*Recorded automatically via GnosticOS Natal Astrolabe Engine.*
    `.trim();

    onSendToJournal({
      title: `Natal Blueprint: ${blueprint.name || 'Magus'} (${blueprint.birthDate.raw} — ${blueprint.geographicOrigins?.city.name || 'Tuxpan'})`,
      body_md: draftMd,
      working_type: 'initiation',
      pre_state_label: 'Seeking Natal Origins',
      post_state_label: 'Attuned to Natal Decan & Ascendant',
      resonance: blueprint.isMasterNumber ? 95 : 88,
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Top Header / Astrolabe Calibration Bar */}
      <header className="px-6 py-4 bg-neutral-950/90 backdrop-blur border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-purple-700 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/30">
            <Orbit className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-decorative text-lg font-bold tracking-wider text-white">
                NATAL <span className="text-red-500">ASTROLABE</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/60 tracking-wider">
                CROWLEY · 72 GOETIA · GRANT · CONNOLLY
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Calculate your esoteric blueprint across Thelemic Atus, Goetic Decan Quinances, and Nightside Shadows.
            </p>
          </div>
        </div>

        {/* Input Calibration Fields */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Birth Date */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 focus-within:border-red-600 transition-colors shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            <label className="text-[10px] font-mono text-neutral-400 uppercase">Birth Date</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="bg-transparent text-xs font-mono text-white outline-none cursor-pointer"
            />
          </div>

          {/* Birth Time */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 focus-within:border-red-600 transition-colors shadow-inner">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <label className="text-[10px] font-mono text-neutral-400 uppercase">Time</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="bg-transparent text-xs font-mono text-white outline-none cursor-pointer"
            />
          </div>

          {/* Geodetic Sanctuary / City Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 focus-within:border-red-600 transition-colors shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <SanctumDropdown
              options={cityOptions}
              value={selectedCityId}
              onChange={(val) => setSelectedCityId(val)}
              searchable={true}
              width="w-48"
              placeholder="Sanctuary City..."
            />
          </div>

          {/* Custom Coordinates Inputs (Shown only if selectedCityId === 'custom') */}
          {selectedCityId === 'custom' && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs font-mono">
              <div className="flex items-center gap-1">
                <span className="text-neutral-500 text-[10px]">Lat:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={customLat}
                  onChange={(e) => setCustomLat(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-white text-xs outline-none"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500 text-[10px]">Lon:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={customLng}
                  onChange={(e) => setCustomLng(parseFloat(e.target.value) || 0)}
                  className="w-16 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-white text-xs outline-none"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500 text-[10px]">TZ:</span>
                <input
                  type="number"
                  step="1"
                  value={customTz}
                  onChange={(e) => setCustomTz(parseFloat(e.target.value) || 0)}
                  className="w-12 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-white text-xs outline-none"
                />
              </div>
            </div>
          )}

          {/* Magickal Name / Motto */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 focus-within:border-red-600 transition-colors shadow-inner min-w-[160px]">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="text"
              placeholder="Magickal Motto / Name"
              value={magicalName}
              onChange={(e) => setMagicalName(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-neutral-500 outline-none w-full"
            />
          </div>

          {/* Quick Presets Dropdown */}
          <div className="relative group">
            <button className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Presets</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 shadow-2xl p-2 hidden group-hover:flex flex-col gap-1 z-50">
              <p className="text-[10px] font-mono uppercase text-neutral-500 px-2 py-1">
                Historical Masters
              </p>
              {PRESET_FIGURES.map((fig) => (
                <button
                  key={fig.name}
                  onClick={() => {
                    setBirthDate(fig.date);
                    setBirthTime(fig.time);
                    setMagicalName(fig.motto);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-neutral-900 transition-colors text-xs flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-200">{fig.name}</span>
                    <span className="text-[9px] font-mono text-red-400">{fig.date}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 italic truncate">{fig.tag}</span>
                </button>
              ))}
              <div className="border-t border-neutral-800 my-1" />
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setBirthDate(today);
                  setBirthTime('12:00');
                  setMagicalName('Today\'s Transit');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-neutral-900 text-xs text-amber-400 font-mono flex items-center gap-1.5"
              >
                <Sun className="w-3 h-3" />
                <span>Today's Current Transit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Astrolabe Body */}
      {blueprint ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Hero Archetype Ribbon */}
          <section className="px-6 py-4 bg-gradient-to-r from-neutral-950 via-neutral-900/60 to-neutral-950 border-b border-neutral-800/80 shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
              {/* 1. Astrological Decan Card */}
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-900/50 transition-all shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-red-400 tracking-wider uppercase">
                      Zodiac Decanate
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl text-amber-300">{blueprint.zodiacSign.symbol}</span>
                      <h2 className="text-base font-bold text-white tracking-wide">
                        {blueprint.zodiacSign.name}
                      </h2>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-950/80 text-[10px] font-mono text-red-300 border border-red-800/40">
                    Decan {blueprint.zodiacSign.decan}
                  </span>
                </div>
                <div className="mt-2 text-xs text-neutral-300 flex flex-col gap-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Span:</span>
                    <span className="font-mono text-neutral-200">{blueprint.zodiacSign.decanDegreeRange}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Ruling:</span>
                    <span className="text-neutral-200">{blueprint.zodiacSign.rulingPlanet} (Sub: {blueprint.zodiacSign.subRuler})</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1 border-t border-neutral-800/60 text-amber-300">
                    <span className="text-neutral-400">Minor Arcana:</span>
                    <span className="font-semibold">{blueprint.zodiacSign.tarotMinorCard}</span>
                  </div>
                </div>
              </div>

              {/* 2. Numerology & Master Vibration */}
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-purple-900/50 transition-all shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 tracking-wider uppercase">
                      Numerological Geometry
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-purple-300 font-mono">
                        {blueprint.lifePath}
                      </span>
                      <h2 className="text-sm font-semibold text-neutral-200">
                        {blueprint.isMasterNumber ? blueprint.masterTitle : 'Life Path Frequency'}
                      </h2>
                    </div>
                  </div>
                  {blueprint.isMasterNumber && (
                    <span className="px-2 py-0.5 rounded bg-amber-950/80 text-[10px] font-mono text-amber-300 border border-amber-600/60 animate-pulse">
                      MASTER
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-neutral-300 flex flex-col gap-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Birthday Power:</span>
                    <span className="font-mono text-neutral-200">{blueprint.birthdayNumber}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Qliphoth Mirror:</span>
                    <span className="font-mono text-red-400 font-bold">{blueprint.shadowNumber}</span>
                  </div>
                  {blueprint.destinyNumber && (
                    <div className="flex justify-between text-[11px] pt-1 border-t border-neutral-800/60">
                      <span className="text-neutral-400">Name Destiny:</span>
                      <span className="font-mono text-purple-300">{blueprint.destinyNumber} (Soul: {blueprint.soulUrgeNumber})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Crowley Thoth Birth Card */}
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-900/50 transition-all shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 tracking-wider uppercase">
                      Crowley Thoth Birth Card
                    </span>
                    <h2 className="text-sm font-bold text-white tracking-wide mt-0.5 truncate">
                      {blueprint.tarotBirthCard.name}
                    </h2>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-neutral-300">
                    Atu {blueprint.tarotBirthCard.number}
                  </span>
                </div>
                <div className="mt-2 text-xs text-neutral-300 flex flex-col gap-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Hebrew Letter:</span>
                    <span className="font-mono text-amber-200">{blueprint.tarotBirthCard.hebrewLetter}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Tree Path:</span>
                    <span className="text-neutral-200">Path {blueprint.tarotBirthCard.pathNumber}</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1 border-t border-neutral-800/60 truncate">
                    <span className="text-neutral-400">Godform:</span>
                    <span className="text-neutral-300 truncate">{blueprint.tarotBirthCard.liber777Godform.split(',')[0]}</span>
                  </div>
                </div>
              </div>

              {/* 4. Goetia Patrons & Connolly Family */}
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-900/50 transition-all shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-red-400 tracking-wider uppercase">
                      Demonic Patrons (Quinances)
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <h2 className="text-sm font-bold text-white">
                        #{blueprint.goeticPatrons.daySpirit.number} {blueprint.goeticPatrons.daySpirit.name}
                      </h2>
                      <span className="text-neutral-500 text-xs">/</span>
                      <h2 className="text-sm font-bold text-white">
                        #{blueprint.goeticPatrons.nightSpirit.number} {blueprint.goeticPatrons.nightSpirit.name}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-neutral-300 flex flex-col gap-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Dukanté Family:</span>
                    <span className="text-neutral-200 font-semibold">{blueprint.dukanteFamily.familyName.split(':')[0]}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-400">Altar / Direction:</span>
                    <span className="text-neutral-200">{blueprint.dukanteFamily.direction} ({blueprint.dukanteFamily.element})</span>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1 border-t border-neutral-800/60">
                    <span className="text-neutral-400">Alchemical Drone:</span>
                    <span className="font-mono text-amber-300">{blueprint.alchemical.musicalKey} ({blueprint.alchemical.frequencyHz} Hz)</span>
                  </div>
                </div>
              </div>

              {/* 5. Geographic Ascendant & Planetary Hour */}
              {blueprint.geographicOrigins && (
                <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-emerald-900/50 transition-all shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>Ascendant & Geodesic</span>
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xl text-emerald-300">
                          {blueprint.geographicOrigins.ascendant.signSymbol}
                        </span>
                        <h2 className="text-sm font-bold text-white tracking-wide truncate">
                          {blueprint.geographicOrigins.ascendant.signName} (Decan {blueprint.geographicOrigins.ascendant.decan})
                        </h2>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-[10px] font-mono text-emerald-300 border border-emerald-800/40 truncate max-w-[80px]">
                      {blueprint.geographicOrigins.city.name}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-neutral-300 flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">Rising Degree:</span>
                      <span className="font-mono text-emerald-200">{blueprint.geographicOrigins.ascendant.formattedDegree}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400">Rising Patron:</span>
                      <span className="text-white font-semibold truncate">
                        #{blueprint.geographicOrigins.ascendant.risingGoetiaPatron.number} {blueprint.geographicOrigins.ascendant.risingGoetiaPatron.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-neutral-800/60 text-neutral-300">
                      <span className="text-neutral-400">Hour Ruler:</span>
                      <span className="font-mono text-amber-300">
                        {blueprint.geographicOrigins.planetaryHourOfBirth.rulingPlanet} {blueprint.geographicOrigins.planetaryHourOfBirth.symbol} ({blueprint.geographicOrigins.planetaryHourOfBirth.isDiurnal ? 'Day' : 'Night'} Hr {blueprint.geographicOrigins.planetaryHourOfBirth.hourIndex})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Tab Navigation Ribbon */}
          <nav className="px-6 py-2 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
            <div className="flex items-center gap-1">
              {[
                { id: 'overview', label: '🌌 Natal Blueprint', icon: Orbit },
                { id: 'goetia', label: '🕯️ Goetic Quinances', icon: Flame },
                { id: 'crowley', label: '🌳 Crowley Thoth & Atu', icon: Layers },
                { id: 'nightside', label: '🌒 Nightside Qliphoth', icon: Moon },
                { id: 'meditation', label: '🧘 Natal Meditation Chamber', icon: Eye },
                { id: 'lore', label: '📚 Deep Lore & Foundations', icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-neutral-800 text-white border border-neutral-700 shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-500' : 'text-neutral-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportToJournal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800 text-xs font-mono text-red-200 transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Save to Journal</span>
              </button>
            </div>
          </nav>

          {/* Active Tab Viewport */}
          <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {/* ============================================================= */}
            {/* TAB 1: OVERVIEW & SYNTHESIS */}
            {/* ============================================================= */}
            {activeTab === 'overview' && (
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                {/* Master Summary Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 to-purple-600/30 border border-red-500/40 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="font-decorative text-2xl font-bold text-amber-300">
                        {blueprint.zodiacSign.symbol}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {blueprint.name ? `${blueprint.name} — ` : ''}Natal Esoteric Current
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                        Born under <span className="text-white font-semibold">{blueprint.zodiacSign.name} (Decan {blueprint.zodiacSign.decan})</span> with Life Path vibration <span className="text-purple-400 font-bold font-mono">{blueprint.lifePath}</span>. Governed by Day Spirit <span className="text-red-400 font-bold">{blueprint.goeticPatrons.daySpirit.name}</span> and Night Spirit <span className="text-red-400 font-bold">{blueprint.goeticPatrons.nightSpirit.name}</span>, crossing Tree of Life Path {blueprint.tarotBirthCard.pathNumber} ({blueprint.tarotBirthCard.crowleyTitle}).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        handlePlayEnn(
                          blueprint.alchemical.musicalKey,
                          blueprint.goeticPatrons.daySpirit.enn
                        )
                      }
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                        activeAudioNote
                          ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                      }`}
                    >
                      {activeAudioNote ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400" />}
                      <span>{activeAudioNote ? 'Silence Audio' : 'Chant Natal Enn & Drone'}</span>
                    </button>
                  </div>
                </div>

                {/* Grid: 4 Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pillar 1: High Magick & Tarot */}
                  <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-bold text-white">Crowley Thoth Birth Card</h4>
                      </div>
                      <span className="text-xs font-mono text-amber-400">Atu {blueprint.tarotBirthCard.number}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-bold text-amber-200">
                          {blueprint.tarotBirthCard.name}
                        </span>
                        <span className="text-xs font-mono text-neutral-400">
                          Letter: {blueprint.tarotBirthCard.hebrewLetter}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                        {blueprint.tarotBirthCard.meaning}
                      </p>
                      <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Tree Placement:</span>
                        <span className="text-neutral-200 font-mono">Path {blueprint.tarotBirthCard.pathNumber} ({blueprint.tarotBirthCard.treeDescription})</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30 text-xs text-neutral-300">
                      <span className="text-red-400 font-semibold block mb-1">Shadow Warning / Inversion:</span>
                      {blueprint.tarotBirthCard.shadowWarning}
                    </div>

                    {onNavigateToTree && (
                      <button
                        onClick={onNavigateToTree}
                        className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-mono flex items-center justify-center gap-2 transition-colors mt-auto"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Path on Dual Tree</span>
                      </button>
                    )}
                  </div>

                  {/* Pillar 2: Goetic Patron Spirits */}
                  <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-red-500" />
                        <h4 className="text-sm font-bold text-white">Goetic Zodiac Rulers</h4>
                      </div>
                      <span className="text-xs font-mono text-red-400">Mathers-Crowley Wheel</span>
                    </div>

                    {/* Day Spirit */}
                    <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between gap-4">
                      <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1 shrink-0">
                        <SacredSigil
                          variant={blueprint.goeticPatrons.daySpirit.number}
                          size={40}
                          color="#f87171"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                            DAY
                          </span>
                          <span className="font-bold text-white text-sm truncate">
                            #{blueprint.goeticPatrons.daySpirit.number} {blueprint.goeticPatrons.daySpirit.name}
                          </span>
                          <span className="text-xs text-neutral-400">({blueprint.goeticPatrons.daySpirit.rank})</span>
                        </div>
                        <p className="text-[11px] font-mono text-red-300 mt-1 truncate">
                          "{blueprint.goeticPatrons.daySpirit.enn}"
                        </p>
                      </div>
                      {dayEntity && onTuneToPortal && (
                        <button
                          onClick={() => onTuneToPortal(dayEntity)}
                          title="Scry in Gazing Portal"
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>

                    {/* Night Spirit */}
                    <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between gap-4">
                      <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center p-1 shrink-0">
                        <SacredSigil
                          variant={blueprint.goeticPatrons.nightSpirit.number}
                          size={40}
                          color="#c084fc"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                            NIGHT
                          </span>
                          <span className="font-bold text-white text-sm truncate">
                            #{blueprint.goeticPatrons.nightSpirit.number} {blueprint.goeticPatrons.nightSpirit.name}
                          </span>
                          <span className="text-xs text-neutral-400">({blueprint.goeticPatrons.nightSpirit.rank})</span>
                        </div>
                        <p className="text-[11px] font-mono text-purple-300 mt-1 truncate">
                          "{blueprint.goeticPatrons.nightSpirit.enn}"
                        </p>
                      </div>
                      {nightEntity && onTuneToPortal && (
                        <button
                          onClick={() => onTuneToPortal(nightEntity)}
                          title="Scry in Gazing Portal"
                          className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-purple-400" />
                        </button>
                      )}
                    </div>

                    {onNavigateToChaos && (
                      <button
                        onClick={() =>
                          onNavigateToChaos(
                            `COMMUNE WITH NATAL SPIRITS ${blueprint.goeticPatrons.daySpirit.name.toUpperCase()} AND ${blueprint.goeticPatrons.nightSpirit.name.toUpperCase()}`
                          )
                        }
                        className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-mono flex items-center justify-center gap-2 transition-colors mt-auto"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        <span>Forge Natal Spirit Sigil in Chaos Workbench</span>
                      </button>
                    )}
                  </div>

                  {/* Pillar 3: Dukanté Demonic Family */}
                  <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-bold text-white">Dukanté Demonic Hierarchy</h4>
                      </div>
                      <span className="text-xs font-mono text-neutral-400">S. Connolly System</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex flex-col gap-2">
                      <span className="text-sm font-bold text-neutral-200">
                        {blueprint.dukanteFamily.familyName}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-neutral-300">
                        <span className="text-neutral-400">Patron Hierarch:</span>
                        <span className="text-red-400 font-semibold">{blueprint.dukanteFamily.demonicPatron}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-300">
                        <span className="text-neutral-400">Direction / Element:</span>
                        <span className="text-amber-300">{blueprint.dukanteFamily.direction} · {blueprint.dukanteFamily.element}</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed italic border-t border-neutral-800/60 pt-2">
                        "{blueprint.dukanteFamily.philosophicalFocus}"
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                      <span className="text-neutral-400 block mb-1">Recommended Altar Setup:</span>
                      Place your primary working altar facing <strong className="text-white">{blueprint.dukanteFamily.direction}</strong>, burned with <span className="text-amber-300">{blueprint.alchemical.incense}</span> and candles of <span className="text-red-400">{blueprint.alchemical.candleColor}</span>.
                    </div>
                  </div>

                  {/* Pillar 4: Nightside Tunnel of Set */}
                  <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-red-500" />
                        <h4 className="text-sm font-bold text-white">Nightside Shadow Gnosis</h4>
                      </div>
                      <span className="text-xs font-mono text-red-400">Liber 231 / Grant</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex flex-col gap-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-bold text-red-300">
                          Tunnel {blueprint.qliphothTunnel.tunnelNumber}: {blueprint.qliphothTunnel.guardian}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Sentinel Reflex
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                        {blueprint.qliphothTunnel.shadowGnosis}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex flex-col gap-1">
                      <span className="text-neutral-400">Shadow Integration Work:</span>
                      <p className="text-neutral-300 text-[11px] leading-relaxed">
                        Rather than banishing the shadow, the Luciferian adept absorbs its subterranean primal power through conscious integration, transmuting terror into sovereign gnosis.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 5: Geographical Origins, Geodesic Sanctuary & Ascendant Daimon */}
                  {blueprint.geographicOrigins && (
                    <div className="md:col-span-2 p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-sm font-bold text-white">
                            Geographical Sanctuary & Natal Ascendant Daimon
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-emerald-300">
                          {blueprint.geographicOrigins.city.name} ({blueprint.geographicOrigins.city.country})
                        </span>
                      </div>

                      {/* Top Info Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase">Geodesic Coordinates</span>
                          <span className="text-xs font-bold text-white">
                            {blueprint.geographicOrigins.latitude.toFixed(4)}° N, {blueprint.geographicOrigins.longitude.toFixed(4)}° W
                          </span>
                          <span className="text-[10px] text-neutral-500 block mt-0.5">
                            {blueprint.geographicOrigins.city.description}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase">Local Solar Horizon</span>
                          <div className="flex items-center justify-between text-xs mt-0.5">
                            <span className="text-amber-300">Sunrise: {blueprint.geographicOrigins.solarTiming.sunrise}</span>
                            <span className="text-purple-300">Sunset: {blueprint.geographicOrigins.solarTiming.sunset}</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                            LST: <strong className="text-white">{blueprint.geographicOrigins.localSiderealTimeString}</strong> · {blueprint.geographicOrigins.solarTiming.isDiurnal ? '☀️ Diurnal Birth' : '🌙 Nocturnal Birth'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80">
                          <span className="text-[10px] font-mono text-neutral-400 block uppercase">Chaldean Hour Ruler</span>
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mt-0.5">
                            <span>{blueprint.geographicOrigins.planetaryHourOfBirth.rulingPlanet} {blueprint.geographicOrigins.planetaryHourOfBirth.symbol}</span>
                            <span className="text-[10px] font-mono text-neutral-400 font-normal">
                              ({blueprint.geographicOrigins.planetaryHourOfBirth.isDiurnal ? 'Day' : 'Night'} Hour {blueprint.geographicOrigins.planetaryHourOfBirth.hourIndex})
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 block mt-0.5 truncate">
                            Archangel: {blueprint.geographicOrigins.planetaryHourOfBirth.archangel.split('(')[0].trim()} · Demon: {blueprint.geographicOrigins.planetaryHourOfBirth.demonicReflex.split('(')[0].trim()}
                          </span>
                        </div>
                      </div>

                      {/* Ascendant Rising Sign & Goetic Patron Daimon */}
                      <div className="p-4 rounded-xl bg-black/70 border border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-2xl font-bold text-emerald-300 shrink-0">
                            {blueprint.geographicOrigins.ascendant.signSymbol}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                              Rising Ascendant (Eastern Horizon)
                            </span>
                            <h3 className="text-base font-bold text-white mt-0.5">
                              {blueprint.geographicOrigins.ascendant.formattedDegree}
                            </h3>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              Decan {blueprint.geographicOrigins.ascendant.decan} (Sub-Ruler: {blueprint.geographicOrigins.ascendant.subRuler}) · Minor Arcana: <strong className="text-amber-300">{blueprint.geographicOrigins.ascendant.tarotMinorCard}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Rising Goetic Patron */}
                        <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col gap-2 max-w-md w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-red-500" />
                              <span>Rising Threshold Goetic Patron</span>
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                              #{blueprint.geographicOrigins.ascendant.risingGoetiaPatron.number} {blueprint.geographicOrigins.ascendant.risingGoetiaPatron.rank}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-bold text-white">
                              {blueprint.geographicOrigins.ascendant.risingGoetiaPatron.name}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-300 leading-snug">
                            {blueprint.geographicOrigins.ascendant.risingGoetiaPatron.office}
                          </p>

                          <p className="font-serif italic text-xs text-red-300 select-all pt-1 border-t border-neutral-800/60">
                            "{blueprint.geographicOrigins.ascendant.risingGoetiaPatron.enn}"
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() =>
                                handlePlayEnn(
                                  blueprint.alchemical.musicalKey,
                                  blueprint.geographicOrigins?.ascendant.risingGoetiaPatron.enn
                                )
                              }
                              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                                activeAudioNote
                                  ? 'bg-red-600 text-white animate-pulse'
                                  : 'bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-200'
                              }`}
                            >
                              <Volume2 className="w-3 h-3 text-emerald-300" />
                              <span>Chant Rising Patron Enn</span>
                            </button>

                            {onNavigateToChaos && (
                              <button
                                onClick={() =>
                                  onNavigateToChaos(
                                    `COMMUNE WITH RISING PATRON ${blueprint.geographicOrigins?.ascendant.risingGoetiaPatron.name.toUpperCase()}`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
                                title="Forge Sigil for Rising Patron"
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 2: GOETIC QUINANCES (MATHERS & CROWLEY) */}
            {/* ============================================================= */}
            {activeTab === 'goetia' && (
              <div className="max-w-5xl mx-auto flex flex-col gap-6">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        The 72 Goetic Quinances of the Zodiac
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        In Hermetic astrology and *Liber 777* Col. CLXXV, each 30° zodiac sign is divided into three 10° decans, and each decan is subdivided into two 5° quinances ruled by a Day spirit and a Night spirit.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      Decan {blueprint.zodiacSign.decan} ({blueprint.zodiacSign.decanDegreeRange})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Day Spirit Full Dossier */}
                  <div className="p-6 rounded-2xl bg-neutral-900/80 border border-amber-900/40 flex flex-col gap-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-amber-800/60 p-2 flex items-center justify-center shadow-inner">
                          <SacredSigil
                            variant={blueprint.goeticPatrons.daySpirit.number}
                            size={52}
                            color="#fbbf24"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                            DIURNAL QUINANCE
                          </span>
                          <h4 className="text-lg font-bold text-white mt-1">
                            #{blueprint.goeticPatrons.daySpirit.number} {blueprint.goeticPatrons.daySpirit.name}
                          </h4>
                          <span className="text-xs text-neutral-400 font-mono">
                            Rank: {blueprint.goeticPatrons.daySpirit.rank}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Demonic Enn Chant</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-amber-300 font-semibold select-all">
                          {blueprint.goeticPatrons.daySpirit.enn}
                        </span>
                        <button
                          onClick={() => handleCopy(blueprint.goeticPatrons.daySpirit.enn, 'day-enn')}
                          className="text-neutral-400 hover:text-white p-1"
                        >
                          {copiedText === 'day-enn' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Magickal Office & Authority</span>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {blueprint.goeticPatrons.daySpirit.office}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() =>
                          handlePlayEnn(
                            blueprint.alchemical.musicalKey,
                            blueprint.goeticPatrons.daySpirit.enn
                          )
                        }
                        className="flex-1 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700 text-xs font-mono text-amber-200 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Chant Day Enn ({blueprint.alchemical.musicalKey})</span>
                      </button>

                      {dayEntity && onTuneToPortal && (
                        <button
                          onClick={() => onTuneToPortal(dayEntity)}
                          className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-red-400" />
                          <span>Scry</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Night Spirit Full Dossier */}
                  <div className="p-6 rounded-2xl bg-neutral-900/80 border border-purple-900/40 flex flex-col gap-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-purple-800/60 p-2 flex items-center justify-center shadow-inner">
                          <SacredSigil
                            variant={blueprint.goeticPatrons.nightSpirit.number}
                            size={52}
                            color="#c084fc"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700">
                            NOCTURNAL QUINANCE
                          </span>
                          <h4 className="text-lg font-bold text-white mt-1">
                            #{blueprint.goeticPatrons.nightSpirit.number} {blueprint.goeticPatrons.nightSpirit.name}
                          </h4>
                          <span className="text-xs text-neutral-400 font-mono">
                            Rank: {blueprint.goeticPatrons.nightSpirit.rank}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Demonic Enn Chant</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-purple-300 font-semibold select-all">
                          {blueprint.goeticPatrons.nightSpirit.enn}
                        </span>
                        <button
                          onClick={() => handleCopy(blueprint.goeticPatrons.nightSpirit.enn, 'night-enn')}
                          className="text-neutral-400 hover:text-white p-1"
                        >
                          {copiedText === 'night-enn' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Magickal Office & Authority</span>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {blueprint.goeticPatrons.nightSpirit.office}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() =>
                          handlePlayEnn(
                            blueprint.alchemical.musicalKey,
                            blueprint.goeticPatrons.nightSpirit.enn
                          )
                        }
                        className="flex-1 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700 text-xs font-mono text-purple-200 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Chant Night Enn ({blueprint.alchemical.musicalKey})</span>
                      </button>

                      {nightEntity && onTuneToPortal && (
                        <button
                          onClick={() => onTuneToPortal(nightEntity)}
                          className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-400" />
                          <span>Scry</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Demonolatry Working Philosophy */}
                <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-500" />
                    <span>Communion Without Coercion (Modern Demonolatry)</span>
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Traditional Solomonic grimoires enforced harsh triangles of pacts and threats with divine names. In Demonolatry (Connolly, Dukanté) and Left-Hand Path gnosis, the 72 Goetic spirits are recognized as ancient divine archetypes and forces of nature. We do not use circles of containment to bind them; instead, we construct a sacred sanctuary, vibrate their Enn respectfully, and commune with them as allies of personal transformation.
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 3: CROWLEY THOTH & LIBER 777 */}
            {/* ============================================================= */}
            {activeTab === 'crowley' && (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-900/40 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                        Aleister Crowley · The Book of Thoth
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        Atu {blueprint.tarotBirthCard.number}: {blueprint.tarotBirthCard.name}
                      </h3>
                      <p className="text-xs text-neutral-400 italic">
                        "{blueprint.tarotBirthCard.crowleyTitle}"
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-amber-950/40 border border-amber-600/60 flex items-center justify-center font-decorative text-2xl font-bold text-amber-300">
                      {blueprint.tarotBirthCard.hebrewLetter}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-200 leading-relaxed">
                    {blueprint.tarotBirthCard.meaning}
                  </div>

                  {/* Correspondences Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Tree of Life Attribution</span>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Path:</span>
                        <span className="font-mono text-white">Path {blueprint.tarotBirthCard.pathNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Connection:</span>
                        <span className="text-neutral-200">{blueprint.tarotBirthCard.treeDescription}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Hebrew Letter:</span>
                        <span className="text-amber-300 font-mono">{blueprint.tarotBirthCard.hebrewLetter}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">Liber 777 Godforms</span>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Divinities:</span>
                        <span className="text-neutral-200">{blueprint.tarotBirthCard.liber777Godform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Carrier Tone:</span>
                        <span className="font-mono text-amber-300">{blueprint.alchemical.musicalKey} ({blueprint.alchemical.frequencyHz} Hz)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Decan Minor:</span>
                        <span className="text-white font-semibold">{blueprint.zodiacSign.tarotMinorCard}</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning & Initiation Crucible */}
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 flex flex-col gap-1.5 text-xs">
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Crowley's Ordeal & Shadow Danger:</span>
                    </span>
                    <p className="text-neutral-300 leading-relaxed">
                      {blueprint.tarotBirthCard.shadowWarning}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 4: NIGHTSIDE & TUNNELS OF SET */}
            {/* ============================================================= */}
            {activeTab === 'nightside' && (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-neutral-900/80 border border-red-950 flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">
                        Kenneth Grant · Nightside of Eden & Liber 231
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        Tunnel {blueprint.qliphothTunnel.tunnelNumber}: Guardian {blueprint.qliphothTunnel.guardian}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        The Qliphothic inverse of Path {blueprint.tarotBirthCard.pathNumber} ({blueprint.tarotBirthCard.name})
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-700 flex items-center justify-center font-mono font-bold text-lg text-red-300">
                      #{blueprint.qliphothTunnel.tunnelNumber}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 leading-relaxed flex flex-col gap-2">
                    <span className="text-red-400 font-bold">Shadow Sentinel Formula:</span>
                    <p>{blueprint.qliphothTunnel.shadowGnosis}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 leading-relaxed flex flex-col gap-2">
                    <span className="text-amber-400 font-bold">Psychological Shadow Integration (Jung & Ford):</span>
                    <p>
                      In modern Luciferianism, the Tunnels of Set represent the untamed unconscious instincts—the suppressed primal id, repressed will, and subterranean impulses. Instead of fearing or exorcising them, the initiate walks the tunnel, confronting the guardian ({blueprint.qliphothTunnel.guardian}), assimilating the shadow energy, and reaching sovereign psychic wholeness (*Individuation*).
                    </p>
                  </div>

                  {onNavigateToTree && (
                    <button
                      onClick={onNavigateToTree}
                      className="w-full py-3 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-xs font-mono text-red-200 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Moon className="w-4 h-4 text-red-400" />
                      <span>Inspect 22 Tunnels of Set in Dual Tree Viewer</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 5: NATAL MEDITATION CHAMBER */}
            {/* ============================================================= */}
            {activeTab === 'meditation' && (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-radial-at-c from-red-900/10 via-transparent to-transparent pointer-events-none" />

                  {/* Header / Focus Selector */}
                  <div className="flex flex-col items-center gap-2 z-10">
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">
                      Natal Alignment Chamber
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Attunement to Natal Patrons & Carrier Frequency
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-lg">
                      Gaze upon the sigil, sync your breathing with the sacred rhythm (4s Inhale · 4s Hold · 6s Exhale), and absorb the natal frequency ({blueprint.alchemical.musicalKey} {blueprint.alchemical.frequencyHz} Hz).
                    </p>
                  </div>

                  {/* Focus Target Switcher */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800 z-10">
                    <button
                      onClick={() => setMeditationFocusTarget('day')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        meditationFocusTarget === 'day'
                          ? 'bg-amber-950 text-amber-200 border border-amber-700'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Day Spirit (#{blueprint.goeticPatrons.daySpirit.number})
                    </button>
                    <button
                      onClick={() => setMeditationFocusTarget('night')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        meditationFocusTarget === 'night'
                          ? 'bg-purple-950 text-purple-200 border border-purple-700'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Night Spirit (#{blueprint.goeticPatrons.nightSpirit.number})
                    </button>
                    <button
                      onClick={() => setMeditationFocusTarget('lucifer')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        meditationFocusTarget === 'lucifer'
                          ? 'bg-red-950 text-red-200 border border-red-700'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Lucifer (Sovereign Void)
                    </button>
                  </div>

                  {/* Center Gazing Sigil Portal */}
                  <div className="relative my-2 z-10">
                    <div
                      className={`w-44 h-44 rounded-full border-2 flex items-center justify-center p-4 transition-all duration-1000 ${
                        meditationIsRunning
                          ? meditationBreathPhase === 'inhale'
                            ? 'scale-110 border-red-500 shadow-[0_0_40px_rgba(220,38,38,0.5)]'
                            : meditationBreathPhase === 'hold'
                            ? 'scale-110 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.6)]'
                            : 'scale-95 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                          : 'scale-100 border-neutral-800 bg-neutral-950'
                      }`}
                    >
                      {meditationFocusTarget === 'day' ? (
                        <SacredSigil
                          variant={blueprint.goeticPatrons.daySpirit.number}
                          size={110}
                          color="#fbbf24"
                          glow={meditationIsRunning}
                        />
                      ) : meditationFocusTarget === 'night' ? (
                        <SacredSigil
                          variant={blueprint.goeticPatrons.nightSpirit.number}
                          size={110}
                          color="#c084fc"
                          glow={meditationIsRunning}
                        />
                      ) : (
                        <SacredSigil
                          variant="lucifer"
                          size={110}
                          color="#ef4444"
                          glow={meditationIsRunning}
                        />
                      )}
                    </div>

                    {/* Breath Prompt Floating Pill */}
                    {meditationIsRunning && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neutral-950 border border-neutral-700 text-[11px] font-mono font-bold tracking-wider uppercase text-amber-300 shadow-lg">
                        {meditationBreathPhase} ({meditationBreathCount}s)
                      </div>
                    )}
                  </div>

                  {/* Timer & Controls */}
                  <div className="flex flex-col items-center gap-3 z-10">
                    <div className="font-mono text-3xl font-black tracking-widest text-white">
                      {formatTimer(meditationSecondsLeft)}
                    </div>

                    {/* Duration Presets */}
                    <div className="flex items-center gap-1.5">
                      {[3, 5, 11, 22].map((dur) => (
                        <button
                          key={dur}
                          disabled={meditationIsRunning}
                          onClick={() => {
                            setMeditationDurationMin(dur);
                            setMeditationSecondsLeft(dur * 60);
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                            meditationDurationMin === dur
                              ? 'bg-neutral-800 text-white font-bold border border-neutral-600'
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          {dur}m
                        </button>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-2">
                      {meditationIsRunning ? (
                        <button
                          onClick={handleStopMeditation}
                          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                        >
                          <Pause className="w-4 h-4" />
                          <span>Pause Contemplation</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleStartMeditation}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                        >
                          <Play className="w-4 h-4" />
                          <span>Commence Natal Gaze</span>
                        </button>
                      )}

                      <button
                        onClick={handleResetMeditation}
                        className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setMeditationLoopAudio(!meditationLoopAudio)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          meditationLoopAudio
                            ? 'bg-red-950 text-red-300 border-red-800'
                            : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                        }`}
                        title={meditationLoopAudio ? 'Audio Drone Active' : 'Audio Drone Muted'}
                      >
                        {meditationLoopAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </button>

                      {onNavigateToMeditation && (
                        <button
                          onClick={onNavigateToMeditation}
                          className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                          title="Open Fullscreen Lucifer Meditation"
                        >
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>Lucifer Sanctum</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4 Guided Meditation Stages */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3 text-left z-10 pt-4 border-t border-neutral-800">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <span className="text-[10px] font-mono text-red-400 block font-bold mb-1">STAGE 1: CENTERING</span>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        Settle into your posture. Let bodily tension drop into the earth element. Follow the breath circle.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <span className="text-[10px] font-mono text-amber-400 block font-bold mb-1">STAGE 2: NATAL ENN</span>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        Silently or softly vibrate the Enn. Allow the spirit's frequency to align with your natal current.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <span className="text-[10px] font-mono text-purple-400 block font-bold mb-1">STAGE 3: SHADOW INVERSION</span>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        Face the unconscious fear or blockage. Embrace it without judgment; transmute it into power.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <span className="text-[10px] font-mono text-emerald-400 block font-bold mb-1">STAGE 4: WILL & RETURN</span>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        Affirm your sovereign True Will. Ground the light in your physical vessel and open your eyes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* TAB 6: DEEP LORE & FOUNDATIONS */}
            {/* ============================================================= */}
            {activeTab === 'lore' && (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-red-500" />
                    <span>The Foundations of the Currents: What They Really Represent</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    This section details the historical, astrological, and philosophical lineages embedded inside the GnosticOS Natal Engine.
                  </p>
                </div>

                {/* Section 1: Decans and Goetia */}
                <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-amber-300">
                    1. The 36 Egyptian Decans & 72 Quinances of the Goetia
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Ancient Egyptian astrologers observed 36 star clusters (*decans*) rising heliacally every 10 days, dividing the 360° celestial sphere into 36 segments of 10 degrees each. In the Hermetic Order of the Golden Dawn and Aleister Crowley's *Liber 777* (Col. CLXXV), each decan was bisected into two 5° *quinances* (36 × 2 = 72), exactly matching the 72 spirits of the *Lesser Key of Solomon* (Ars Goetia).
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Thus, the Goetic spirits are not arbitrary medieval demons: they represent specific celestial sectors and archetypal angles of the solar-zodiacal wheel. The "Day" spirit rules the diurnal manifestation of that frequency, while the "Night" spirit rules its nocturnal, subconscious, and instinctual current.
                  </p>
                </div>

                {/* Section 2: Crowley Thoth Tarot */}
                <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-amber-300">
                    2. Aleister Crowley's Thoth Tarot & The 22 Paths of Wisdom
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Between 1938 and 1943, Aleister Crowley and Lady Frieda Harris produced the *Thoth Tarot*. Unlike Victorian decks, Crowley re-titled several trumps to mirror modern occult philosophy:
                  </p>
                  <ul className="text-xs text-neutral-300 space-y-1 pl-4 list-disc">
                    <li><strong className="text-white">Adjustment (Atu VIII)</strong> instead of Justice: Equilibrium is not moral punishment, but cosmic balance through karma and truth.</li>
                    <li><strong className="text-white">Lust (Atu XI)</strong> instead of Strength: Sacred ecstasy, divine passion, and the union of Babalon and the Beast rather than moral suppression.</li>
                    <li><strong className="text-white">Art (Atu XIV)</strong> instead of Temperance: Alchemical transmutation (*solve et coagula*), fusing fire and water into the philosopher's stone.</li>
                    <li><strong className="text-white">The Aeon (Atu XX)</strong> instead of Judgement: The dawn of the Aeon of Horus, ending guilt-based slave religions.</li>
                  </ul>
                </div>

                {/* Section 3: Demonolatry & The 9 Demonic Families */}
                <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-amber-300">
                    3. S. Connolly's Demonolatry & Richard Dukanté's 9 Families
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    In traditional Demonolatry (formalized by S. Connolly from the private grimoires of Richard Dukanté in the 1960s), demons are not viewed as Christian adversaries of evil, but as primordial divine intelligences (*daimones*).
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Dukanté classified 39 primary hierarchs into 9 elemental and philosophical families. Working with one's natal family connects the practitioner to their inherent elemental direction, altar resonance, and protective patrons.
                  </p>
                </div>

                {/* Section 4: Nightside Tunnels of Set */}
                <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-amber-300">
                    4. Kenneth Grant & The Tunnels of Set (Liber 231)
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Kenneth Grant, head of the Typhonian O.T.O. and disciple of Crowley and Spare, published *Nightside of Eden* in 1977. He revealed that behind the 22 radiant paths of the Tree of Life lie the 22 subterranean Tunnels of Set, originally encoded in Crowley's *Liber 231*.
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Where the front paths represent solar, conscious ideals, the Tunnels represent the dark, instinctual, and chthonic powers of the unconscious mind. Transmuting these tunnels through shadow integration is the core work of Left-Hand Path self-deification (*Apotheosis*).
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center gap-3">
            <Info className="w-8 h-8 text-red-500" />
            <h3 className="text-base font-bold text-white">Enter a Valid Birth Date</h3>
            <p className="text-xs text-neutral-400">
              Please enter your date of birth in the top calibration bar to generate your esoteric blueprint.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatalAstrolabe;
