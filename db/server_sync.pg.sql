-- =============================================================================
-- GnosticOS — Magus Cloud Sync (PostgreSQL 16) — ZERO-KNOWLEDGE
-- =============================================================================
-- The server stores only opaque, client-sealed blobs. It cannot read journal
-- text, moon phases, entity names, or intents. It knows: account, object id,
-- collection name, revision, size, timestamps.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE accounts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash       BYTEA NOT NULL UNIQUE,         -- HMAC(email), not plaintext
  auth_verifier    BYTEA NOT NULL,                -- OPAQUE / SRP verifier, never the passphrase
  tier             TEXT  NOT NULL DEFAULT 'adept' CHECK (tier IN ('adept','magus')),
  tier_expires_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wrapped DEKs so a new device can unlock with the passphrase.
CREATE TABLE key_envelopes (
  account_id   UUID  NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  key_id       UUID  NOT NULL,
  wrapped_dek  BYTEA NOT NULL,
  kdf_params   JSONB NOT NULL,                    -- salt + Argon2id params (public)
  PRIMARY KEY (account_id, key_id)
);

CREATE TABLE sync_objects (
  account_id   UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  object_id    UUID        NOT NULL,              -- same UUIDv7 as local row
  collection   TEXT        NOT NULL,              -- 'journal','tablet','servitor','pop'
  revision     BIGINT      NOT NULL,
  key_id       UUID        NOT NULL,
  nonce        BYTEA       NOT NULL CHECK (octet_length(nonce) = 12),
  ciphertext   BYTEA       NOT NULL,              -- whole row, sealed client-side
  deleted      BOOLEAN     NOT NULL DEFAULT false,
  server_seq   BIGSERIAL,                         -- monotonic cursor for pulls
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (account_id, object_id)
);
CREATE INDEX idx_sync_cursor ON sync_objects(account_id, server_seq);
