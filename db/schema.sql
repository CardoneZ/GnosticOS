-- =============================================================================
-- GnosticOS — Local Vault Schema (SQLite 3.45+ / SQLCipher 4.x)
-- =============================================================================
-- Encryption model (two layers, see docs/ARCHITECTURE.md §4):
--   L1  SQLCipher encrypts the whole database file at rest (key from Argon2id).
--   L2  Personal plaintext (journal bodies, intents, notes) is ALSO sealed with
--       AES-256-GCM before insert, so ciphertext can be synced to the cloud
--       without the server ever holding a usable key (zero-knowledge).
--
-- Columns that stay plaintext *inside* the SQLCipher vault (moon phase,
-- planetary hour, resonance) do so on purpose: on-device analytics need them.
-- They are never sent to the server in plaintext — sync ships whole rows as
-- sealed blobs (see db/server_sync.pg.sql).
--
-- PostgreSQL port: BLOB→BYTEA, TEXT JSON→JSONB, INTEGER bool→BOOLEAN,
-- strftime defaults→now(), json_valid() CHECKs→drop (JSONB validates).
-- =============================================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- -----------------------------------------------------------------------------
-- 0. Meta & key registry
-- -----------------------------------------------------------------------------
CREATE TABLE schema_migrations (
  version     INTEGER PRIMARY KEY,
  applied_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Data-encryption keys (DEKs) wrapped by the passphrase-derived KEK.
-- Rotating the passphrase re-wraps DEKs; it never re-encrypts payloads.
CREATE TABLE key_registry (
  key_id        TEXT PRIMARY KEY,                       -- UUIDv7
  wrapped_dek   BLOB NOT NULL,                          -- AES-KW / AES-GCM wrapped
  wrap_nonce    BLOB NOT NULL CHECK (length(wrap_nonce) = 12),
  kdf           TEXT NOT NULL DEFAULT 'argon2id',
  kdf_params    TEXT NOT NULL CHECK (json_valid(kdf_params)), -- {m,t,p,salt_b64}
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','retired')),
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- -----------------------------------------------------------------------------
-- 1. Tunnels of Set (Grant, Nightside of Eden / Liber 231) — reference data
-- -----------------------------------------------------------------------------
-- The listed names ARE the sentinels of each tunnel, so no separate column.
CREATE TABLE tunnels_of_set (
  id                INTEGER PRIMARY KEY,
  number            INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 11 AND 32),
  name              TEXT    NOT NULL UNIQUE,
  path_letter       TEXT    NOT NULL,
  attribution_type  TEXT    NOT NULL
                    CHECK (attribution_type IN ('element','planet','luminary','sign')),
  planet_element    TEXT    NOT NULL,          -- e.g. 'Air / Satan'
  gematria          INTEGER NOT NULL CHECK (gematria > 0),
  musical_key       TEXT    NOT NULL,          -- note name; enharmonics allowed ('B#')
  key_modifier      TEXT    CHECK (key_modifier IN ('chatter','roar')),
  atu               TEXT    NOT NULL,
  color_scale       TEXT    CHECK (color_scale IS NULL OR json_valid(color_scale)),
  sigil_svg         TEXT,                      -- sanitized SVG markup
  tier              TEXT    NOT NULL DEFAULT 'magus'
                    CHECK (tier IN ('adept','magus'))
);

-- -----------------------------------------------------------------------------
-- 2. Entities (Divinities, Dukanté Families, Goetia, Sentinels, Draconic heads)
-- -----------------------------------------------------------------------------
CREATE TABLE entities (
  id               INTEGER PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  pantheon         TEXT NOT NULL CHECK (pantheon IN (
                     'demonic_divinity','dukante_family','goetia',
                     'qliphoth_sentinel','azhdeha_head','custom')),
  current          TEXT CHECK (current IN (
                     'demonolatry','luciferian','draconian','typhonian','other')),
  element          TEXT CHECK (element IN ('fire','water','air','earth','spirit')),
  sephira          TEXT,                     -- 'Kether'..'Malkuth','Daath'
  goetic_number    INTEGER CHECK (goetic_number BETWEEN 1 AND 72),
  family_id        INTEGER REFERENCES entities(id) ON DELETE SET NULL, -- Dukanté family
  tunnel_id        INTEGER REFERENCES tunnels_of_set(id) ON DELETE SET NULL,
  enn              TEXT,                     -- phonetic Enn
  enn_audio_ref    TEXT,                     -- asset key for the Enn looper
  sigil_svg        TEXT,
  correspondences  TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(correspondences)),
  tier             TEXT NOT NULL DEFAULT 'adept' CHECK (tier IN ('adept','magus')),
  is_user_defined  INTEGER NOT NULL DEFAULT 0 CHECK (is_user_defined IN (0,1)),
  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX idx_entities_pantheon ON entities(pantheon);
CREATE INDEX idx_entities_element  ON entities(element);

-- -----------------------------------------------------------------------------
-- 3. Alchemical Journal
-- -----------------------------------------------------------------------------
CREATE TABLE journal_entries (
  id                    TEXT PRIMARY KEY,                -- UUIDv7 (time-sortable)
  ritual_at             TEXT NOT NULL,                   -- ISO-8601 UTC
  tz_offset_min         INTEGER NOT NULL,
  latitude              REAL CHECK (latitude  BETWEEN -90  AND 90),
  longitude             REAL CHECK (longitude BETWEEN -180 AND 180),

  -- Ephemeris snapshot (computed client-side at save time)
  moon_phase            TEXT CHECK (moon_phase IN (
                          'new','waxing_crescent','first_quarter','waxing_gibbous',
                          'full','waning_gibbous','last_quarter','waning_crescent')),
  moon_illumination     REAL CHECK (moon_illumination BETWEEN 0 AND 1),
  moon_age_days         REAL CHECK (moon_age_days BETWEEN 0 AND 29.6),
  moon_sign             TEXT,
  day_ruler             TEXT CHECK (day_ruler IN
                          ('saturn','jupiter','mars','sun','venus','mercury','moon')),
  planetary_hour        TEXT CHECK (planetary_hour IN
                          ('saturn','jupiter','mars','sun','venus','mercury','moon')),
  planetary_hour_index  INTEGER CHECK (planetary_hour_index BETWEEN 1 AND 24),
  is_nocturnal          INTEGER CHECK (is_nocturnal IN (0,1)),

  -- Metrics
  resonance             INTEGER CHECK (resonance BETWEEN 1 AND 10),
  pre_state             INTEGER CHECK (pre_state  BETWEEN -5 AND 5), -- valence
  post_state            INTEGER CHECK (post_state BETWEEN -5 AND 5),
  tunnel_id             INTEGER REFERENCES tunnels_of_set(id),
  working_type          TEXT,                            -- 'invocation','pathworking',...

  -- Sealed body: {title, body_md, visions, transcript, tags[]}
  ciphertext            BLOB NOT NULL,
  nonce                 BLOB NOT NULL CHECK (length(nonce) = 12),
  key_id                TEXT NOT NULL REFERENCES key_registry(key_id),
  aad_version           INTEGER NOT NULL DEFAULT 1,     -- AAD = id||ritual_at||version

  sync_state            TEXT NOT NULL DEFAULT 'local'
                        CHECK (sync_state IN ('local','pending','synced','conflict')),
  revision              INTEGER NOT NULL DEFAULT 1,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  deleted_at            TEXT                             -- tombstone for sync
);
CREATE INDEX idx_journal_ritual_at ON journal_entries(ritual_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_journal_moon      ON journal_entries(moon_phase, resonance);
CREATE INDEX idx_journal_hour      ON journal_entries(planetary_hour, resonance);
CREATE INDEX idx_journal_sync      ON journal_entries(sync_state) WHERE sync_state <> 'synced';

CREATE TRIGGER trg_journal_touch AFTER UPDATE ON journal_entries
FOR EACH ROW WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE journal_entries
     SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
         revision   = OLD.revision + 1,
         sync_state = CASE WHEN OLD.sync_state = 'synced' THEN 'pending' ELSE OLD.sync_state END
   WHERE id = NEW.id;
END;

CREATE TABLE journal_offerings (
  id          INTEGER PRIMARY KEY,
  entry_id    TEXT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  entity_id   INTEGER REFERENCES entities(id) ON DELETE SET NULL,
  kind        TEXT NOT NULL CHECK (kind IN
                ('incense','candle','food','drink','blood','art','devotion','other')),
  quantity    TEXT
);
CREATE INDEX idx_offerings_entry ON journal_offerings(entry_id);

CREATE TABLE journal_entity_presence (
  entry_id    TEXT    NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  entity_id   INTEGER NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  intensity   INTEGER CHECK (intensity BETWEEN 1 AND 10),
  invoked     INTEGER NOT NULL DEFAULT 1 CHECK (invoked IN (0,1)), -- 0 = arrived unbidden
  PRIMARY KEY (entry_id, entity_id)
);

-- -----------------------------------------------------------------------------
-- 4. 11 Points of Power Crucible (Ford)
-- -----------------------------------------------------------------------------
-- Reference text for the 11 points is licensed content — seeded by content pack.
CREATE TABLE power_points (
  point_number  INTEGER PRIMARY KEY CHECK (point_number BETWEEN 1 AND 11),
  title         TEXT NOT NULL,
  summary       TEXT,
  tier          TEXT NOT NULL DEFAULT 'adept' CHECK (tier IN ('adept','magus'))
);

CREATE TABLE points_of_power_tracker (
  id                    TEXT PRIMARY KEY,                -- UUIDv7
  point_number          INTEGER NOT NULL REFERENCES power_points(point_number),
  start_date            TEXT NOT NULL,                   -- local date YYYY-MM-DD
  target_days           INTEGER NOT NULL DEFAULT 21 CHECK (target_days BETWEEN 21 AND 30),
  habit_status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (habit_status IN ('active','paused','completed','broken','abandoned')),
  intention_ciphertext  BLOB,                            -- the dogma being dismantled
  intention_nonce       BLOB CHECK (intention_nonce IS NULL OR length(intention_nonce) = 12),
  key_id                TEXT REFERENCES key_registry(key_id),
  completed_at          TEXT,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
-- Only one active cycle per point at a time.
CREATE UNIQUE INDEX uq_pop_active ON points_of_power_tracker(point_number)
  WHERE habit_status = 'active';

-- Normalised daily logs (instead of a JSON array column) => streak SQL is trivial.
CREATE TABLE points_of_power_logs (
  id               INTEGER PRIMARY KEY,
  tracker_id       TEXT NOT NULL REFERENCES points_of_power_tracker(id) ON DELETE CASCADE,
  log_date         TEXT NOT NULL,                        -- YYYY-MM-DD
  day_index        INTEGER NOT NULL CHECK (day_index BETWEEN 1 AND 30),
  observed         INTEGER NOT NULL CHECK (observed IN (0,1)),  -- conditioning caught?
  overcome         INTEGER NOT NULL CHECK (overcome IN (0,1)),  -- pattern broken?
  black_flame      INTEGER CHECK (black_flame BETWEEN 1 AND 10),
  note_ciphertext  BLOB,
  note_nonce       BLOB CHECK (note_nonce IS NULL OR length(note_nonce) = 12),
  UNIQUE (tracker_id, log_date)
);

-- Compatibility view exposing the spec's `daily_logs` shape.
CREATE VIEW v_points_of_power_tracker AS
SELECT t.*,
       (SELECT json_group_array(json_object(
                 'date', o.log_date, 'day', o.day_index,
                 'observed', o.observed, 'overcome', o.overcome,
                 'black_flame', o.black_flame))
          FROM (SELECT * FROM points_of_power_logs l
                 WHERE l.tracker_id = t.id
                 ORDER BY l.day_index) o) AS daily_logs,
       (SELECT COUNT(*) FROM points_of_power_logs l
         WHERE l.tracker_id = t.id AND l.overcome = 1) AS days_overcome
  FROM points_of_power_tracker t;

-- -----------------------------------------------------------------------------
-- 5. Gematria Tablets (9x9)
-- -----------------------------------------------------------------------------
CREATE TABLE gematria_tablets (
  id                 TEXT PRIMARY KEY,
  label              TEXT NOT NULL,
  entity_id          INTEGER REFERENCES entities(id) ON DELETE SET NULL,
  input_ciphertext   BLOB,                     -- intent statements are private
  input_nonce        BLOB CHECK (input_nonce IS NULL OR length(input_nonce) = 12),
  key_id             TEXT REFERENCES key_registry(key_id),
  cipher_id          TEXT NOT NULL,            -- 'connolly-v1', 'english-ordinal'
  layout_version     INTEGER NOT NULL DEFAULT 1,
  calculated_value   INTEGER NOT NULL CHECK (calculated_value > 0),
  reduction_chain    TEXT NOT NULL CHECK (json_valid(reduction_chain)), -- [401,5]
  reduced_root       INTEGER NOT NULL CHECK (reduced_root BETWEEN 1 AND 9),
  ruling_sephira     TEXT NOT NULL,
  matrix_data        TEXT NOT NULL CHECK (json_valid(matrix_data)
                                          AND json_array_length(matrix_data) = 9),
  sigil_path         TEXT CHECK (sigil_path IS NULL OR json_valid(sigil_path)),
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX idx_tablets_root ON gematria_tablets(reduced_root);

-- -----------------------------------------------------------------------------
-- 6. Servitors
-- -----------------------------------------------------------------------------
CREATE TABLE servitors (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  intent_ciphertext     BLOB NOT NULL,
  intent_nonce          BLOB NOT NULL CHECK (length(intent_nonce) = 12),
  key_id                TEXT NOT NULL REFERENCES key_registry(key_id),
  anchor_type           TEXT NOT NULL CHECK (anchor_type IN
                          ('sigil','object','location','image','tablet','other')),
  anchor_description    TEXT,
  sigil_svg             TEXT,
  tablet_id             TEXT REFERENCES gematria_tablets(id) ON DELETE SET NULL,
  feeding_rrule         TEXT,                  -- RFC 5545, e.g. 'FREQ=DAILY;BYHOUR=21'
  feeding_method        TEXT,
  last_fed_at           TEXT,
  status                TEXT NOT NULL DEFAULT 'gestating'
                        CHECK (status IN ('gestating','active','dormant','dissolved')),
  dissolution_terms     TEXT NOT NULL,         -- mandatory: every servitor has an end
  dissolution_due_at    TEXT,
  dissolved_at          TEXT,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (status <> 'dissolved' OR dissolved_at IS NOT NULL)
);
CREATE INDEX idx_servitors_due ON servitors(status, dissolution_due_at);

CREATE TABLE servitor_feedings (
  id           INTEGER PRIMARY KEY,
  servitor_id  TEXT NOT NULL REFERENCES servitors(id) ON DELETE CASCADE,
  fed_at       TEXT NOT NULL,
  method       TEXT,
  entry_id     TEXT REFERENCES journal_entries(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 7. VBRK (Vi Boith Raimi Kairtey) & Secret Demonic Name Vault
-- -----------------------------------------------------------------------------
CREATE TABLE vbrk_secrets (
  id                 TEXT PRIMARY KEY,
  demonic_name       TEXT NOT NULL,
  gematria_value     INTEGER,
  patron_entity_id   INTEGER REFERENCES entities(id) ON DELETE SET NULL,
  sigil_svg          TEXT,
  ciphertext         BLOB,                         -- Covenant vows, private visions
  nonce              BLOB,
  key_id             TEXT REFERENCES key_registry(key_id),
  ascension_date     TEXT,
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- =============================================================================
-- SEED DATA
-- =============================================================================
-- Seeded verbatim from the GnosticOS spec. NOTE: He/Star (15) and Tzaddi/Emperor
-- (28) carry the Golden-Dawn sign with Crowley's swapped Atu — verify against
-- Nightside of Eden before release.
INSERT INTO tunnels_of_set
  (number, name, path_letter, attribution_type, planet_element, gematria, musical_key, key_modifier, atu, tier)
VALUES
  (11,'Amprodias',   'Aleph', 'element', 'Air / Satan',            401,'E', NULL,     'The Fool',    'adept'),
  (12,'Baratchial',  'Beth',  'planet',  'Mercury',                260,'E', 'chatter','The Magus',   'magus'),
  (13,'Gargophias',  'Gimel', 'luminary','Moon / Hecate',          393,'G#',NULL,     'The Priestess','magus'),
  (14,'Dagdagiel',   'Daleth','planet',  'Venus / Babalon',         55,'F#',NULL,     'The Empress', 'magus'),
  (15,'Hemethterith','He',    'sign',    'Aries',                 1054,'A#',NULL,     'The Star',    'magus'),
  (16,'Uriens',      'Vau',   'sign',    'Taurus',                 395,'C#',NULL,     'The Hierophant','magus'),
  (17,'Zamradiel',   'Zain',  'sign',    'Gemini',                 292,'D', NULL,     'The Lovers',  'magus'),
  (18,'Characith',   'Cheth', 'sign',    'Cancer',                 640,'D#',NULL,     'The Chariot', 'magus'),
  (19,'Temphioth',   'Teth',  'sign',    'Leo',                    610,'E', 'roar',   'Lust',        'magus'),
  (20,'Yamatu',      'Yod',   'sign',    'Virgo',                  131,'F', NULL,     'The Hermit',  'magus'),
  (21,'Kurgasiax',   'Kaph',  'planet',  'Jupiter',                315,'A#',NULL,     'Fortune',     'magus'),
  (22,'Lafcursiax',  'Lamed', 'sign',    'Libra',                  671,'F#',NULL,     'Adjustment',  'magus'),
  (23,'Malkunofat',  'Mem',   'element', 'Water / Leviathan',      307,'G#',NULL,     'The Hanged Man','magus'),
  (24,'Niantiel',    'Nun',   'sign',    'Scorpio',                160,'G', NULL,     'Death',       'magus'),
  (25,'Saksaksalim', 'Samekh','sign',    'Sagittarius',            300,'G#',NULL,     'Art',         'magus'),
  (26,'A''ano''nin', 'Ayin',  'sign',    'Capricorn',              237,'A', NULL,     'The Devil',   'magus'),
  (27,'Parfaxitas',  'Pe',    'planet',  'Mars',                   450,'C', NULL,     'The Tower',   'magus'),
  (28,'Tzuflifu',    'Tzaddi','sign',    'Aquarius',               302,'A#',NULL,     'The Emperor', 'magus'),
  (29,'Qulielfi',    'Qoph',  'sign',    'Pisces',                 266,'B', NULL,     'The Moon',    'magus'),
  (30,'Raflifu',     'Resh',  'luminary','Sun / Black Sun',        406,'D', NULL,     'The Sun',     'magus'),
  (31,'Shalicu',     'Shin',  'element', 'Fire / Aeon',            500,'C', NULL,     'The Aeon',    'magus'),
  (32,'Thantifaxath','Tau',   'planet',  'Saturn',                1040,'B#',NULL,     'The Universe','adept');

-- Nine Demonic Divinities + Daath (Connolly). Elements only for the four
-- cardinal elemental rulers; extend via content pack.
INSERT INTO entities (slug, name, pantheon, current, element, sephira) VALUES
  ('satan',             'Satan',             'demonic_divinity','demonolatry', NULL,   'Kether'),
  ('lucifer',           'Lucifer',           'demonic_divinity','demonolatry','air',   'Chokmah'),
  ('unsere',            'Unsere',            'demonic_divinity','demonolatry', NULL,   'Binah'),
  ('lucifuge-rofocale', 'Lucifuge Rofocale', 'demonic_divinity','demonolatry', NULL,   'Daath'),
  ('verrine',           'Verrine',           'demonic_divinity','demonolatry', NULL,   'Chesed'),
  ('leviathan',         'Leviathan',         'demonic_divinity','demonolatry','water', 'Geburah'),
  ('belial',            'Belial',            'demonic_divinity','demonolatry','earth', 'Tiphereth'),
  ('amducious',         'Amducious',         'demonic_divinity','demonolatry', NULL,   'Netzach'),
  ('eurynomous',        'Eurynomous',        'demonic_divinity','demonolatry', NULL,   'Hod'),
  ('flereous',          'Flereous',          'demonic_divinity','demonolatry','fire',  'Yesod');

-- Seven (+1) Heads of Azhdeha (Ford, Ahrimanic Yoga)
INSERT INTO entities (slug, name, pantheon, current, correspondences) VALUES
  ('taprev',      'Taprev',      'azhdeha_head','draconian','{"head":1}'),
  ('zairich',     'Zairich',     'azhdeha_head','draconian','{"head":2}'),
  ('naonghaitha', 'Naonghaitha', 'azhdeha_head','draconian','{"head":3}'),
  ('indra',       'Indra',       'azhdeha_head','draconian','{"head":4}'),
  ('savar',       'Savar',       'azhdeha_head','draconian','{"head":5}'),
  ('akoman',      'Akoman',      'azhdeha_head','draconian','{"head":6}'),
  ('ahriman',     'Ahriman',     'azhdeha_head','draconian','{"head":7}'),
  ('aeshma',      'Aeshma',      'azhdeha_head','draconian','{"head":8}');

-- Link sentinels into the entity graph so they can appear in journal presence.
INSERT INTO entities (slug, name, pantheon, current, tunnel_id, tier)
SELECT lower(replace(name, '''', '')), name, 'qliphoth_sentinel', 'typhonian', id, tier
  FROM tunnels_of_set;

-- Seed Michael W. Ford's 11 Points of Power
INSERT INTO power_points (point_number, title, summary, tier) VALUES
  (1,  'Luciferian Awakening',            'Self-deification and freedom from blind slave dogma.',                         'adept'),
  (2,  'The Triad of the Morning Star',   'Liberation, Illumination, and Apotheosis as continual life practices.',         'adept'),
  (3,  'The Adversary as Catalyst',       'Embracing struggle and opposition as the forge of personal evolutionary fire.', 'adept'),
  (4,  'Mastery of Flesh and Spirit',     'Harmonizing primal subconscious instincts with razor-sharp conscious intellect.','adept'),
  (5,  'Darkness Precedes the Light',     'Plumbing the subconscious abyss to retrieve raw spiritual empowerment.',        'adept'),
  (6,  'Self-Accountability and Will',    'Absolute ownership of karma and consequences; repudiation of blame.',           'adept'),
  (7,  'The Forge of Cain',               'The alchemical craftsman shaping raw passion into lethal worldly mastery.',     'magus'),
  (8,  'Questioning Dogma',               'Relentless skepticism toward cultural conditioning and arbitrary orthodoxies.', 'adept'),
  (9,  'Strategic Solitude',              'Retreating into silence to fortify the mind and distill sovereign purpose.',    'adept'),
  (10, 'Creation Over Destruction',       'Directing dark current energy into generative art, philosophy, and conquest.',  'magus'),
  (11, 'The Eternal Apotheosis',          'Refusing complacency; perpetual self-overcoming and Godhood.',                  'magus');

-- Seed Goetic Spirits (The 72 Spirits of Solomon - Connolly Demonolatry)
INSERT OR IGNORE INTO entities (slug, name, pantheon, current, element, goetic_number, enn, correspondences) VALUES
  ('bael', 'Bael', 'goetia', 'demonolatry', 'fire', 1, 'Ayer Secore On Ca Bael', '{"rank":"King","purpose":"Protection","metal":"Iron / Gold","incense":"Frankincense"}'),
  ('agares', 'Agares', 'goetia', 'demonolatry', 'earth', 2, 'Rean Caire An Ca Agares', '{"rank":"Duke","purpose":"Magick","metal":"Copper","incense":"Sandalwood"}'),
  ('vassago', 'Vassago', 'goetia', 'demonolatry', 'water', 3, 'Keyan Cire Vassago Secore', '{"rank":"Prince","purpose":"Divination","metal":"Tin","incense":"Cedar"}'),
  ('samigina', 'Samigina (Gamigin)', 'goetia', 'demonolatry', 'water', 4, 'Esta Ca Ra Samigina Secore', '{"rank":"Marquis","purpose":"Divination","metal":"Silver","incense":"Jasmine"}'),
  ('marbas', 'Marbas', 'goetia', 'demonolatry', 'air', 5, 'Renich Tasa Fubin Marbas', '{"rank":"President","purpose":"Healing","metal":"Mercury","incense":"Storax"}'),
  ('valefor', 'Valefor', 'goetia', 'demonolatry', 'earth', 6, 'Keyan Gore Tasa Valefor', '{"rank":"Duke","purpose":"Wealth","metal":"Copper","incense":"Sandalwood"}'),
  ('amon', 'Amon', 'goetia', 'demonolatry', 'water', 7, 'Aveta Fubin Amon Secore', '{"rank":"Marquis","purpose":"Protection","metal":"Silver","incense":"Jasmine"}'),
  ('barbatos', 'Barbatos', 'goetia', 'demonolatry', 'fire', 8, 'Eveta Fubin Barbatos', '{"rank":"Duke","purpose":"Divination","metal":"Copper","incense":"Frankincense"}'),
  ('paimon', 'Paimon', 'goetia', 'demonolatry', 'water', 9, 'Linan Tasa Vefa Paimon', '{"rank":"King","purpose":"Enlightenment","metal":"Gold","incense":"Frankincense"}'),
  ('buer', 'Buer', 'goetia', 'demonolatry', 'fire', 10, 'Erato Raca Buer On Ca', '{"rank":"President","purpose":"Healing","metal":"Mercury","incense":"Lavender"}'),
  ('gusion', 'Gusion', 'goetia', 'demonolatry', 'water', 11, 'Secore Vefa Gusion', '{"rank":"Duke","purpose":"Divination","metal":"Copper","incense":"Jasmine"}'),
  ('sitri', 'Sitri', 'goetia', 'demonolatry', 'earth', 12, 'Lirach Alora Vefa Sitri', '{"rank":"Prince","purpose":"Magick","metal":"Tin","incense":"Cedar"}'),
  ('beleth', 'Beleth', 'goetia', 'demonolatry', 'earth', 13, 'Lirach Tasa Vefa Beleth', '{"rank":"King","purpose":"Magick","metal":"Gold","incense":"Frankincense"}'),
  ('leraje', 'Leraje', 'goetia', 'demonolatry', 'fire', 14, 'Caymen Daca Leraje', '{"rank":"Marquis","purpose":"Vengeance","metal":"Silver","incense":"Jasmine"}'),
  ('eligos', 'Eligos', 'goetia', 'demonolatry', 'water', 15, 'Ayer Secore Eligos', '{"rank":"Duke","purpose":"Protection","metal":"Copper","incense":"Sandalwood"}'),
  ('zepar', 'Zepar', 'goetia', 'demonolatry', 'earth', 16, 'Lirach Caire Zepar', '{"rank":"Duke","purpose":"Magick","metal":"Copper","incense":"Sandalwood"}'),
  ('botis', 'Botis', 'goetia', 'demonolatry', 'water', 17, 'Jedan Tasa Botis On Ca', '{"rank":"President","purpose":"Divination","metal":"Mercury","incense":"Storax"}'),
  ('bathin', 'Bathin', 'goetia', 'demonolatry', 'earth', 18, 'Dyern Tasa Bathin', '{"rank":"Duke","purpose":"Magick","metal":"Copper","incense":"Sandalwood"}'),
  ('sallos', 'Sallos', 'goetia', 'demonolatry', 'earth', 19, 'Serena Alora Sallos Aken', '{"rank":"Duke","purpose":"Magick","metal":"Copper","incense":"Sandalwood"}'),
  ('purson', 'Purson', 'goetia', 'demonolatry', 'earth', 20, 'Ana Caire Purson', '{"rank":"King","purpose":"Divination","metal":"Gold","incense":"Frankincense"}'),
  ('marax', 'Marax', 'goetia', 'demonolatry', 'earth', 21, 'Kaymen Vefa Marax', '{"rank":"President","purpose":"Enlightenment","metal":"Mercury","incense":"Storax"}'),
  ('ipos', 'Ipos', 'goetia', 'demonolatry', 'water', 22, 'Desa On Ipos Aken', '{"rank":"Prince","purpose":"Protection","metal":"Tin","incense":"Cedar"}'),
  ('aim', 'Aim', 'goetia', 'demonolatry', 'fire', 23, 'Ayer Avage Secore Aim', '{"rank":"Duke","purpose":"Vengeance","metal":"Copper","incense":"Dragon’s Blood"}'),
  ('naberius', 'Naberius', 'goetia', 'demonolatry', 'air', 24, 'Eyan Ra Naberius On Ca', '{"rank":"Marquis","purpose":"Protection","metal":"Silver","incense":"Jasmine"}'),
  ('glasya-labolas', 'Glasya-Labolas', 'goetia', 'demonolatry', 'fire', 25, 'Elan Caire Glasya-Labolas', '{"rank":"President","purpose":"Vengeance","metal":"Mercury","incense":"Storax"}'),
  ('bune', 'Bune', 'goetia', 'demonolatry', 'earth', 26, 'Wehlc Bune Gar An Ca', '{"rank":"Duke","purpose":"Wealth","metal":"Copper","incense":"Sandalwood"}'),
  ('ronove', 'Ronove', 'goetia', 'demonolatry', 'air', 27, 'Kaymen Vefa Ronove', '{"rank":"Marquis","purpose":"Enlightenment","metal":"Silver","incense":"Jasmine"}'),
  ('berith', 'Berith', 'goetia', 'demonolatry', 'fire', 28, 'Hoath Redar Ganabal Berith', '{"rank":"Duke","purpose":"Wealth","metal":"Copper","incense":"Dragon’s Blood"}'),
  ('astaroth-goetia', 'Astaroth', 'goetia', 'demonolatry', 'earth', 29, 'Tasa Alora Foren Astaroth', '{"rank":"Duke","purpose":"Divination","metal":"Copper","incense":"Sandalwood"}'),
  ('forneus', 'Forneus', 'goetia', 'demonolatry', 'water', 30, 'Senan Vefa Forneus', '{"rank":"Marquis","purpose":"Protection","metal":"Silver","incense":"Jasmine"}'),
  ('foras', 'Foras', 'goetia', 'demonolatry', 'earth', 31, 'Kaymen Vefa Foras', '{"rank":"President","purpose":"Enlightenment","metal":"Mercury","incense":"Storax"}'),
  ('asmoday', 'Asmoday', 'goetia', 'demonolatry', 'air', 32, 'Ayer Avage Aloren Asmoday Aken', '{"rank":"King","purpose":"Enlightenment","metal":"Gold","incense":"Frankincense"}'),
  ('gaap', 'Gaap', 'goetia', 'demonolatry', 'air', 33, 'Deyan Anay Tasa Gaap', '{"rank":"Prince / President","purpose":"Magick","metal":"Tin","incense":"Cedar"}'),
  ('furfur', 'Furfur', 'goetia', 'demonolatry', 'fire', 34, 'Gallen Caire Furfur', '{"rank":"Earl","purpose":"Magick","metal":"Copper / Silver","incense":"Dragon’s Blood"}'),
  ('marchosias', 'Marchosias', 'goetia', 'demonolatry', 'fire', 35, 'Es Na Ayer Marchosias Secore', '{"rank":"Marquis","purpose":"Protection","metal":"Silver","incense":"Jasmine"}'),
  ('stolas', 'Stolas', 'goetia', 'demonolatry', 'air', 36, 'Stolas Raca Tasa', '{"rank":"Prince","purpose":"Enlightenment","metal":"Tin","incense":"Cedar"}'),
  ('phenex', 'Phenex', 'goetia', 'demonolatry', 'air', 37, 'Ef En Phenex', '{"rank":"Marquis","purpose":"Enlightenment","metal":"Silver","incense":"Jasmine"}'),
  ('halphas', 'Halphas', 'goetia', 'demonolatry', 'fire', 38, 'Erato Halphas On Ca', '{"rank":"Earl","purpose":"Protection","metal":"Copper / Silver","incense":"Dragon’s Blood"}'),
  ('malphas', 'Malphas', 'goetia', 'demonolatry', 'air', 39, 'Lirach Tasa Malphas', '{"rank":"President","purpose":"Protection","metal":"Mercury","incense":"Storax"}'),
  ('raum', 'Raum', 'goetia', 'demonolatry', 'fire', 40, 'Furca Na Alle Laris Raum', '{"rank":"Earl","purpose":"Vengeance","metal":"Copper / Silver","incense":"Dragon’s Blood"}'),
  ('focalor', 'Focalor', 'goetia', 'demonolatry', 'water', 41, 'En Ca Focalor Secore', '{"rank":"Duke","purpose":"Vengeance","metal":"Copper","incense":"Sandalwood"}'),
  ('vepar', 'Vepar', 'goetia', 'demonolatry', 'water', 42, 'On Ca Vepar Renich', '{"rank":"Duke","purpose":"Protection","metal":"Copper","incense":"Sandalwood"}'),
  ('sabnock', 'Sabnock', 'goetia', 'demonolatry', 'fire', 43, 'Tasa Sabnock On Ca Vir', '{"rank":"Marquis","purpose":"Protection","metal":"Silver","incense":"Jasmine"}'),
  ('shax', 'Shax', 'goetia', 'demonolatry', 'air', 44, 'Ayer Avage Shax Aken', '{"rank":"Marquis","purpose":"Protection","metal":"Silver","incense":"Jasmine"}'),
  ('vine', 'Vine', 'goetia', 'demonolatry', 'water', 45, 'Eyesta Vefa Vine', '{"rank":"King / Earl","purpose":"Magick","metal":"Gold","incense":"Frankincense"}'),
  ('bifrons', 'Bifrons', 'goetia', 'demonolatry', 'earth', 46, 'Bifrons Gar An Ca', '{"rank":"Earl","purpose":"Enlightenment","metal":"Copper / Silver","incense":"Sandalwood"}'),
  ('uvall', 'Uvall', 'goetia', 'demonolatry', 'water', 47, 'Asana Caire Uvall', '{"rank":"Duke","purpose":"Divination","metal":"Copper","incense":"Sandalwood"}'),
  ('haagenti', 'Haagenti', 'goetia', 'demonolatry', 'earth', 48, 'Haagenti Gar An Ca', '{"rank":"President","purpose":"Wealth","metal":"Mercury","incense":"Storax"}'),
  ('crocell', 'Crocell', 'goetia', 'demonolatry', 'water', 49, 'Jedan Tasa Crocell On Ca', '{"rank":"Duke","purpose":"Enlightenment","metal":"Copper","incense":"Sandalwood"}'),
  ('furcas', 'Furcas', 'goetia', 'demonolatry', 'air', 50, 'Secore Furcas On Ca', '{"rank":"Knight","purpose":"Divination","metal":"Lead","incense":"Frankincense"}'),
  ('balam', 'Balam', 'goetia', 'demonolatry', 'earth', 51, 'Lirach Tasa Balam', '{"rank":"King","purpose":"Divination","metal":"Gold","incense":"Frankincense"}'),
  ('alloces', 'Alloces', 'goetia', 'demonolatry', 'fire', 52, 'Typan Alloces Berith On Ca', '{"rank":"Duke","purpose":"Enlightenment","metal":"Copper","incense":"Dragon’s Blood"}'),
  ('camio', 'Camio', 'goetia', 'demonolatry', 'air', 53, 'Tasa Camio On Ca Vir', '{"rank":"President","purpose":"Divination","metal":"Mercury","incense":"Storax"}'),
  ('murmur', 'Murmur', 'goetia', 'demonolatry', 'water', 54, 'Vefa Sonnelion Murmur', '{"rank":"Duke / Earl","purpose":"Divination","metal":"Copper / Silver","incense":"Sandalwood"}'),
  ('orobas', 'Orobas', 'goetia', 'demonolatry', 'water', 55, 'Jedan Tasa Orobas', '{"rank":"Prince","purpose":"Protection","metal":"Tin","incense":"Cedar"}'),
  ('gremory', 'Gremory', 'goetia', 'demonolatry', 'water', 56, 'An Ca Gremory Ayer', '{"rank":"Duke","purpose":"Wealth","metal":"Copper","incense":"Sandalwood"}'),
  ('ose', 'Ose', 'goetia', 'demonolatry', 'air', 57, 'Ayer Serpente Ose', '{"rank":"President","purpose":"Magick","metal":"Mercury","incense":"Storax"}'),
  ('amy', 'Amy', 'goetia', 'demonolatry', 'fire', 58, 'Tu Fubin Amy Secore', '{"rank":"President","purpose":"Enlightenment","metal":"Mercury","incense":"Storax"}'),
  ('oriax', 'Oriax', 'goetia', 'demonolatry', 'air', 59, 'Lirach Caire An Ca Oriax', '{"rank":"Marquis","purpose":"Divination","metal":"Silver","incense":"Jasmine"}'),
  ('vapula', 'Vapula', 'goetia', 'demonolatry', 'air', 60, 'Renich Tasa Vapula On Ca', '{"rank":"Duke","purpose":"Enlightenment","metal":"Copper","incense":"Sandalwood"}'),
  ('zagan', 'Zagan', 'goetia', 'demonolatry', 'earth', 61, 'An Ca Zagan Ayer Secore', '{"rank":"King / President","purpose":"Wealth","metal":"Gold / Mercury","incense":"Frankincense"}'),
  ('valac', 'Valac', 'goetia', 'demonolatry', 'earth', 62, 'Secore On Ca Valac Ayer', '{"rank":"President","purpose":"Divination","metal":"Mercury","incense":"Storax"}'),
  ('andras', 'Andras', 'goetia', 'demonolatry', 'air', 63, 'En Ca Andras Caire On Ca', '{"rank":"Marquis","purpose":"Vengeance","metal":"Silver","incense":"Jasmine"}'),
  ('flauros', 'Flauros', 'goetia', 'demonolatry', 'fire', 64, 'Gallen Caire Flauros Secore', '{"rank":"Duke","purpose":"Protection","metal":"Copper","incense":"Dragon’s Blood"}'),
  ('andrealphus', 'Andrealphus', 'goetia', 'demonolatry', 'air', 65, 'Tasa Andrealphus On Ca Vir', '{"rank":"Marquis","purpose":"Enlightenment","metal":"Silver","incense":"Jasmine"}'),
  ('cimejes', 'Cimejes', 'goetia', 'demonolatry', 'earth', 66, 'Cimejes Ayer Secore', '{"rank":"Marquis","purpose":"Protection","metal":"Silver","incense":"Jasmine"}'),
  ('amdusias', 'Amdusias', 'goetia', 'demonolatry', 'air', 67, 'Denyen Valocur Avage Secore Amdusias', '{"rank":"Duke","purpose":"Magick","metal":"Copper","incense":"Sandalwood"}'),
  ('belial-goetia', 'Belial (Goetic)', 'goetia', 'demonolatry', 'earth', 68, 'Lirach Tasa Vefa Wehlc Belial', '{"rank":"King","purpose":"Wealth","metal":"Gold","incense":"Frankincense"}'),
  ('decarabia', 'Decarabia', 'goetia', 'demonolatry', 'air', 69, 'Hoath Raca Decarabia', '{"rank":"Marquis","purpose":"Magick","metal":"Silver","incense":"Jasmine"}'),
  ('seere', 'Seere', 'goetia', 'demonolatry', 'air', 70, 'Jaden Tasa Seere On Ca', '{"rank":"Prince","purpose":"Wealth","metal":"Tin","incense":"Cedar"}'),
  ('dantalion', 'Dantalion', 'goetia', 'demonolatry', 'water', 71, 'Avage Ayer Dantalion On Ca', '{"rank":"Duke","purpose":"Magick","metal":"Copper","incense":"Sandalwood"}'),
  ('andromalius', 'Andromalius', 'goetia', 'demonolatry', 'fire', 72, 'Tasa Fubin Andromalius On Ca', '{"rank":"Earl","purpose":"Vengeance","metal":"Copper / Silver","incense":"Dragon’s Blood"}');

-- Seed Dukanté Hierarchs (9 Demonic Families)
INSERT OR IGNORE INTO entities (slug, name, pantheon, current, element, enn, correspondences) VALUES
  ('delepitorae', 'Delepitorae', 'dukante_family', 'demonolatry', 'water', 'Deyen Tasa Delepitorae On', '{"family":"Family 1","purpose":"Magick"}'),
  ('sonnelion', 'Sonnelion', 'dukante_family', 'demonolatry', 'earth', 'Ayer Tasa Sonnelion Secore', '{"family":"Family 1","purpose":"Vengeance"}'),
  ('mesphito', 'Mesphito', 'dukante_family', 'demonolatry', 'air', 'Mesphito Ramec Viasa On Ca', '{"family":"Family 1","purpose":"Divination"}'),
  ('luithian', 'Luithian', 'dukante_family', 'demonolatry', 'water', 'Deyan Anay Tasa Luithian', '{"family":"Family 2","purpose":"Enlightenment"}'),
  ('azlyn', 'Azlyn', 'dukante_family', 'demonolatry', 'water', 'Rean Par Tasa Azlyn Ayar', '{"family":"Family 2","purpose":"Divination"}'),
  ('abbadon', 'Abbadon', 'dukante_family', 'demonolatry', 'earth', 'Es Na Ayer Abbadon Avage', '{"family":"Family 3","purpose":"Protection"}'),
  ('ammon', 'Ammon', 'dukante_family', 'demonolatry', 'air', 'Avage Secore Ammon Ninan', '{"family":"Family 3","purpose":"Protection"}'),
  ('mammon', 'Mammon', 'dukante_family', 'demonolatry', 'earth', 'Tasa Mammon On Ca Lirach', '{"family":"Family 3","purpose":"Wealth"}'),
  ('rosier', 'Rosier', 'dukante_family', 'demonolatry', 'water', 'Serena Alora Rosier Aken', '{"family":"Family 4","purpose":"Magick"}'),
  ('astarte', 'Astarte', 'dukante_family', 'demonolatry', 'water', 'Serena Alora Astarte Aken', '{"family":"Family 4","purpose":"Magick"}'),
  ('ashtaroth', 'Ashtaroth', 'dukante_family', 'demonolatry', 'earth', 'Tasa Alora Foren Ashtaroth', '{"family":"Family 4","purpose":"Protection"}'),
  ('astarot', 'Astarot', 'dukante_family', 'demonolatry', 'earth', 'Serena Alora Astarot Aken', '{"family":"Family 4","purpose":"Magick"}'),
  ('balberith', 'Balberith', 'dukante_family', 'demonolatry', 'earth', 'Avage Secore On Ca Baalberith', '{"family":"Family 5","purpose":"Divination"}'),
  ('babeal', 'Babeal', 'dukante_family', 'demonolatry', 'earth', 'Alan Secore On Ca Babeal', '{"family":"Family 5","purpose":"Protection"}'),
  ('verrier', 'Verrier', 'dukante_family', 'demonolatry', 'earth', 'Elit Rayesta Verrier', '{"family":"Family 6","purpose":"Healing"}'),
  ('ronwe', 'Ronwe', 'dukante_family', 'demonolatry', 'earth', 'Kaymen Vefa Ronwe', '{"family":"Family 6","purpose":"Enlightenment"}'),
  ('svengali', 'Svengali', 'dukante_family', 'demonolatry', 'fire', 'Desa On Svengali Ayer', '{"family":"Family 7","purpose":"Vengeance"}'),
  ('tezrian', 'Tezrian', 'dukante_family', 'demonolatry', 'earth', 'Ezyr Ramec Ganen Tezrian', '{"family":"Family 7","purpose":"Vengeance"}'),
  ('asafoetida', 'Asafoetida', 'dukante_family', 'demonolatry', 'water', 'Asana Nanay On Ca Asafoetida', '{"family":"Family 8","purpose":"Magick"}'),
  ('rashoon', 'Rashoon', 'dukante_family', 'demonolatry', 'water', 'Taran Rashoon Nanay', '{"family":"Family 8","purpose":"Magick"}'),
  ('taroon', 'Taroon', 'dukante_family', 'demonolatry', 'water', 'Taroon An Ca Nanay', '{"family":"Family 8","purpose":"Magick"}');

INSERT INTO schema_migrations (version) VALUES (1);
