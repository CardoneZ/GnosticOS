import React from 'react';

export interface SacredSigilProps {
  /** 'lucifer' | 'baphomet' | 'baphomet_pentagram' | number (1-72) | string (slug) */
  variant: 'lucifer' | 'baphomet' | 'baphomet_pentagram' | 'ishtar' | 'azhdaha' | 'alb' | 'will_desire_belief' | number | string;
  size?: number;
  glow?: boolean;
  color?: string; // e.g. '#ff3b2f' or '#fbbf24'
  className?: string;
  alt?: string;
}

// Map Goetia spirit ID / number (1-72) or slug to SVG filename in /svg/
export const GOETIA_SVG_MAP: Record<number, { slug: string; file: string }> = {
  1: { slug: 'bael', file: '01-bael-sigilo-ars-goetia.svg' },
  2: { slug: 'agares', file: '02-agares-sigilo-ars-goetia.svg' },
  3: { slug: 'vassago', file: '03-vassago-sigilo-ars-goetia.svg' },
  4: { slug: 'samigina', file: '04-samigina-sigilo-ars-goetia.svg' },
  5: { slug: 'marbas', file: '05-marbas-sigilo-ars-goetia.svg' },
  6: { slug: 'valefor', file: '06-valefor-sigilo-ars-goetia.svg' },
  7: { slug: 'amon', file: '07-amon-sigilo-ars-goetia.svg' },
  8: { slug: 'barbatos', file: '08-barbatos-sigilo-ars-goetia.svg' },
  9: { slug: 'paimon', file: '09-paimon-sigilo-ars-goetia.svg' },
  10: { slug: 'buer', file: '10-buer-sigilo-ars-goetia.svg' },
  11: { slug: 'gusion', file: '11-gusion-sigilo-ars-goetia.svg' },
  12: { slug: 'sitri', file: '12-sitri-sigilo-ars-goetia.svg' },
  13: { slug: 'beleth', file: '13-beleth-sigilo-ars-goetia.svg' },
  14: { slug: 'leraje', file: '14-leraje-sigilo-ars-goetia.svg' },
  15: { slug: 'eligos', file: '15-eligos-sigilo-ars-goetia.svg' },
  16: { slug: 'zepar', file: '16-zepar-sigilo-ars-goetia.svg' },
  17: { slug: 'botis', file: '17-botis-sigilo-ars-goetia.svg' },
  18: { slug: 'bathin', file: '18-bathin-sigilo-ars-goetia.svg' },
  19: { slug: 'sallos', file: '19-sallos-sigilo-ars-goetia.svg' },
  20: { slug: 'purson', file: '20-purson-sigilo-ars-goetia.svg' },
  21: { slug: 'marax', file: '21-marax-sigilo-ars-goetia.svg' },
  22: { slug: 'ipos', file: '22-ipos-sigilo-ars-goetia.svg' },
  23: { slug: 'aim', file: '23-aim-sigilo-ars-goetia.svg' },
  24: { slug: 'naberius', file: '24-naberius-sigilo-ars-goetia.svg' },
  25: { slug: 'glasya', file: '25-glasya-sigilo-ars-goetia.svg' },
  26: { slug: 'bune', file: '26-bune-sigilo-ars-goetia.svg' },
  27: { slug: 'ronove', file: '27-ronove-sigilo-ars-goetia.svg' },
  28: { slug: 'berith', file: '28-berith-sigilo-ars-goetia.svg' },
  29: { slug: 'astaroth', file: '29-astaroth-sigilo-ars-goetia.svg' },
  30: { slug: 'forneus', file: '30-forneus-sigilo-ars-goetia.svg' },
  31: { slug: 'foras', file: '31-foras-sigilo-ars-goetia.svg' },
  32: { slug: 'asmodeo', file: '32-asmodeo-sigilo-ars-goetia.svg' },
  33: { slug: 'gaap', file: '33-gaap-sigilo-ars-goetia.svg' },
  34: { slug: 'furfur', file: '34-furfur-sigilo-ars-goetia.svg' },
  35: { slug: 'marchosias', file: '35-marchosias-sigilo-ars-goetia.svg' },
  36: { slug: 'stolas', file: '36-stolas-sigilo-ars-goetia.svg' },
  37: { slug: 'phenex', file: '37-phenex-sigilo-ars-goetia.svg' },
  38: { slug: 'halphas', file: '38-halphas-sigilo-ars-goetia.svg' },
  39: { slug: 'malphas', file: '39-malphas-sigilo-ars-goetia.svg' },
  40: { slug: 'raum', file: '40-raum-sigilo-ars-goetia.svg' },
  41: { slug: 'focalor', file: '41-focalor-sigilo-ars-goetia.svg' },
  42: { slug: 'vepar', file: '42-vepar-sigilo-ars-goetia.svg' },
  43: { slug: 'sabnock', file: '43-sabnock-sigilo-ars-goetia.svg' },
  44: { slug: 'shax', file: '44-shax-sigilo-ars-goetia.svg' },
  45: { slug: 'vine', file: '45-vine-sigilo-ars-goetia.svg' },
  46: { slug: 'bifrons', file: '46-bifrons-sigilo-ars-goetia.svg' },
  47: { slug: 'vual', file: '47-vual-sigilo-ars-goetia.svg' },
  48: { slug: 'haagenti', file: '48-haagenti-sigilo-ars-goetia.svg' },
  49: { slug: 'crocell', file: '49-crocell-sigilo-ars-goetia.svg' },
  50: { slug: 'furcas', file: '50-furcas-sigilo-ars-goetia.svg' },
  51: { slug: 'balam', file: '51-balam-sigilo-ars-goetia.svg' },
  52: { slug: 'alloces', file: '52-alloces-sigilo-ars-goetia.svg' },
  53: { slug: 'camio', file: '53-camio-sigilo-ars-goetia.svg' },
  54: { slug: 'murmur', file: '54-murmur-sigilo-ars-goetia.svg' },
  55: { slug: 'orobas', file: '55-orobas-sigilo-ars-goetia.svg' },
  56: { slug: 'gremory', file: '56-gremory-sigilo-ars-goetia.svg' },
  57: { slug: 'ose', file: '57-ose-sigilo-ars-goetia.svg' },
  58: { slug: 'amy', file: '58-amy-sigilo-ars-goetia.svg' },
  59: { slug: 'orias', file: '59-orias-sigilo-ars-goetia.svg' },
  60: { slug: 'vapula', file: '60-vapula-sigilo-ars-goetia.svg' },
  61: { slug: 'zagan', file: '61-zagan-sigilo-ars-goetia.svg' },
  62: { slug: 'valac', file: '62-valac-sigilo-ars-goetia.svg' },
  63: { slug: 'andras', file: '63-andras-sigilo-ars-goetia.svg' },
  64: { slug: 'haures', file: '64-haures-sigilo-ars-goetia.svg' },
  65: { slug: 'andrealphus', file: '65-andrealphus-sigilo-ars-goetia.svg' },
  66: { slug: 'cimeies', file: '66-cimeies-sigilo-ars-goetia.svg' },
  67: { slug: 'amdusias', file: '67-amdusias-sigilo-ars-goetia.svg' },
  68: { slug: 'belial', file: '68-belial-sigilo-ars-goetia.svg' },
  69: { slug: 'decarabia', file: '69-decarabia-sigilo-ars-goetia.svg' },
  70: { slug: 'seere', file: '70-seere-sigilo-ars-goetia.svg' },
  71: { slug: 'dantalion', file: '71-dantalion-sigilo-ars-goetia.svg' },
  72: { slug: 'andromalius', file: '72-andromalius-sigilo-ars-goetia.svg' },
};

export function getGoetiaSvgPath(numberOrSlug: number | string): string | null {
  if (typeof numberOrSlug === 'number') {
    const entry = GOETIA_SVG_MAP[numberOrSlug];
    return entry ? `/svg/${entry.file}` : null;
  }
  const clean = numberOrSlug.toLowerCase().trim();
  const entry = Object.values(GOETIA_SVG_MAP).find((e) => e.slug === clean || clean.includes(e.slug));
  return entry ? `/svg/${entry.file}` : null;
}

export const SacredSigil: React.FC<SacredSigilProps> = ({
  variant,
  size = 200,
  glow = true,
  color = '#ef4444',
  className = '',
  alt,
}) => {
  let src = '';
  let label = alt || 'Sacred Sigil';

  if (variant === 'lucifer') {
    src = '/svg/00-sigil-of-lucifer.svg';
    label = alt || 'Sigil of Lucifer (Grimorium Verum)';
  } else if (variant === 'baphomet') {
    src = '/svg/00-sigil-of-baphomet.svg';
    label = alt || 'Official Sigil of Baphomet';
  } else if (variant === 'baphomet_pentagram') {
    src = '/svg/00-baphomet-pentagram.svg';
    label = alt || 'Sigil of Baphomet / Goat Pentagram';
  } else if (typeof variant === 'number') {
    src = getGoetiaSvgPath(variant) || '';
    label = alt || `Goetic Seal #${variant}`;
  } else if (typeof variant === 'string') {
    const found = getGoetiaSvgPath(variant);
    if (found) {
      src = found;
      label = alt || `Goetic Seal ${variant}`;
    }
  }

  const glowStyle: React.CSSProperties = {
    width: size,
    height: size,
    filter: glow
      ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 28px ${color}80) invert(1)`
      : 'invert(1)',
    transition: 'all 0.5s ease-out',
  };

  if (!src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center border border-dashed border-red-800 rounded-full text-xs font-mono text-red-400 ${className}`}
      >
        No Sigil
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={label}
        style={glowStyle}
        className="w-full h-full object-contain pointer-events-none"
        loading="lazy"
      />
    </div>
  );
};

export default SacredSigil;
