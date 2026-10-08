use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use zeroize::Zeroize;

pub struct VaultState {
    pub conn: Mutex<Option<Connection>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TunnelRecord {
    pub id: i64,
    pub number: i64,
    pub name: String,
    pub path_letter: String,
    pub attribution_type: String,
    pub planet_element: String,
    pub gematria: i64,
    pub musical_key: String,
    pub key_modifier: Option<String>,
    pub atu: String,
    pub tier: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EntityRecord {
    pub id: i64,
    pub slug: String,
    pub name: String,
    pub pantheon: String,
    pub current: Option<String>,
    pub element: Option<String>,
    pub sephira: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OfferingPayload {
    pub kind: String,
    pub quantity: Option<String>,
    pub entity_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EntityPresencePayload {
    pub entity_id: i64,
    pub intensity: Option<i64>,
    pub invoked: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JournalEntryPayload {
    pub id: String,
    pub ritual_at: String,
    pub tz_offset_min: i64,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub moon_phase: Option<String>,
    pub moon_illumination: Option<f64>,
    pub moon_age_days: Option<f64>,
    pub day_ruler: Option<String>,
    pub planetary_hour: Option<String>,
    pub planetary_hour_index: Option<i64>,
    pub is_nocturnal: Option<i64>,
    pub resonance: Option<i64>,
    pub pre_state: Option<i64>,
    pub post_state: Option<i64>,
    pub working_type: Option<String>,
    pub tunnel_id: Option<i64>,
    // Decrypted/Plaintext fields inside the application layer
    pub title: String,
    pub body_md: String,
    pub visions: Option<String>,
    pub pre_state_label: Option<String>,
    pub post_state_label: Option<String>,
    pub offerings: Vec<OfferingPayload>,
    pub entities: Vec<EntityPresencePayload>,
}

pub fn get_vault_path(app: &AppHandle) -> std::result::Result<PathBuf, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {}", e))?;
    std::fs::create_dir_all(&app_dir)
        .map_err(|e| format!("Failed to create app data dir: {}", e))?;
    Ok(app_dir.join("gnosticos_vault.enc.db"))
}

#[tauri::command]
pub fn is_vault_unlocked(state: State<'_, VaultState>) -> bool {
    let guard = state.conn.lock().unwrap();
    guard.is_some()
}

#[tauri::command]
pub fn lock_vault(state: State<'_, VaultState>) -> Result<(), String> {
    let mut guard = state.conn.lock().unwrap();
    *guard = None;
    Ok(())
}

#[tauri::command]
pub fn unlock_vault(
    app: AppHandle,
    state: State<'_, VaultState>,
    mut passphrase: String,
) -> Result<bool, String> {
    let db_path = get_vault_path(&app)?;

    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open DB: {}", e))?;

    #[cfg(feature = "sqlcipher")]
    {
        let pragma_key = format!("PRAGMA key = '{}';", passphrase.replace('\'', "''"));
        conn.execute_batch(&pragma_key)
            .map_err(|e| format!("Failed to set SQLCipher key: {}", e))?;

        conn.execute_batch("PRAGMA foreign_keys = ON; PRAGMA cipher_compatibility = 4;")
            .map_err(|e| format!("SQLCipher initialization failed: {}", e))?;
    }

    #[cfg(not(feature = "sqlcipher"))]
    {
        conn.execute_batch("PRAGMA foreign_keys = ON;")
            .map_err(|e| format!("SQLite initialization failed: {}", e))?;
    }

    passphrase.zeroize();

    let table_check: Result<i64> = conn.query_row(
        "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='tunnels_of_set';",
        [],
        |row| row.get(0),
    );

    match table_check {
        Ok(count) => {
            if count == 0 {
                let schema_sql = include_str!("../../../db/schema.sql");
                conn.execute_batch(schema_sql)
                    .map_err(|e| format!("Failed to apply initial schema: {}", e))?;
            }
        }
        Err(e) => {
            return Err(format!("Incorrect passphrase or unreadable vault: {}", e));
        }
    }

    let mut guard = state.conn.lock().unwrap();
    *guard = Some(conn);
    Ok(true)
}

#[tauri::command]
pub fn fetch_tunnels(state: State<'_, VaultState>) -> Result<Vec<TunnelRecord>, String> {
    let guard = state.conn.lock().unwrap();
    let conn = guard.as_ref().ok_or("Vault is locked")?;

    let mut stmt = conn
        .prepare(
            "SELECT id, number, name, path_letter, attribution_type, planet_element, gematria, musical_key, key_modifier, atu, tier FROM tunnels_of_set ORDER BY number ASC",
        )
        .map_err(|e| e.to_string())?;

    let tunnel_iter = stmt
        .query_map([], |row| {
            Ok(TunnelRecord {
                id: row.get(0)?,
                number: row.get(1)?,
                name: row.get(2)?,
                path_letter: row.get(3)?,
                attribution_type: row.get(4)?,
                planet_element: row.get(5)?,
                gematria: row.get(6)?,
                musical_key: row.get(7)?,
                key_modifier: row.get(8)?,
                atu: row.get(9)?,
                tier: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut tunnels = Vec::new();
    for t in tunnel_iter {
        tunnels.push(t.map_err(|e| e.to_string())?);
    }
    Ok(tunnels)
}

#[tauri::command]
pub fn fetch_entities(state: State<'_, VaultState>) -> Result<Vec<EntityRecord>, String> {
    let guard = state.conn.lock().unwrap();
    let conn = guard.as_ref().ok_or("Vault is locked")?;

    let mut stmt = conn
        .prepare(
            "SELECT id, slug, name, pantheon, current, element, sephira FROM entities ORDER BY id ASC",
        )
        .map_err(|e| e.to_string())?;

    let entity_iter = stmt
        .query_map([], |row| {
            Ok(EntityRecord {
                id: row.get(0)?,
                slug: row.get(1)?,
                name: row.get(2)?,
                pantheon: row.get(3)?,
                current: row.get(4)?,
                element: row.get(5)?,
                sephira: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut entities = Vec::new();
    for item in entity_iter {
        entities.push(item.map_err(|e| e.to_string())?);
    }
    Ok(entities)
}

#[tauri::command]
pub fn save_journal_entry(
    state: State<'_, VaultState>,
    entry: JournalEntryPayload,
) -> Result<bool, String> {
    let guard = state.conn.lock().unwrap();
    let conn = guard.as_ref().ok_or("Vault is locked")?;

    // Pack the private text fields into a JSON payload blob for SQLCipher vault storage
    let content_json = serde_json::json!({
        "title": entry.title,
        "body_md": entry.body_md,
        "visions": entry.visions,
        "pre_state_label": entry.pre_state_label,
        "post_state_label": entry.post_state_label,
    });
    let ciphertext_bytes = serde_json::to_vec(&content_json).map_err(|e| e.to_string())?;
    let dummy_nonce = vec![0u8; 12];
    let key_id = "default-vault-dek";

    conn.execute(
        r#"
        INSERT INTO journal_entries (
            id, ritual_at, tz_offset_min, latitude, longitude,
            moon_phase, moon_illumination, moon_age_days,
            day_ruler, planetary_hour, planetary_hour_index, is_nocturnal,
            resonance, pre_state, post_state, working_type, tunnel_id,
            ciphertext, nonce, key_id, sync_state
        ) VALUES (
            ?1, ?2, ?3, ?4, ?5,
            ?6, ?7, ?8,
            ?9, ?10, ?11, ?12,
            ?13, ?14, ?15, ?16, ?17,
            ?18, ?19, ?20, 'local'
        )
        ON CONFLICT(id) DO UPDATE SET
            ritual_at = excluded.ritual_at,
            tz_offset_min = excluded.tz_offset_min,
            moon_phase = excluded.moon_phase,
            moon_illumination = excluded.moon_illumination,
            day_ruler = excluded.day_ruler,
            planetary_hour = excluded.planetary_hour,
            resonance = excluded.resonance,
            pre_state = excluded.pre_state,
            post_state = excluded.post_state,
            working_type = excluded.working_type,
            tunnel_id = excluded.tunnel_id,
            ciphertext = excluded.ciphertext,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
        "#,
        params![
            entry.id,
            entry.ritual_at,
            entry.tz_offset_min,
            entry.latitude,
            entry.longitude,
            entry.moon_phase,
            entry.moon_illumination,
            entry.moon_age_days,
            entry.day_ruler,
            entry.planetary_hour,
            entry.planetary_hour_index,
            entry.is_nocturnal,
            entry.resonance,
            entry.pre_state,
            entry.post_state,
            entry.working_type,
            entry.tunnel_id,
            ciphertext_bytes,
            dummy_nonce,
            key_id,
        ],
    ).map_err(|e| e.to_string())?;

    // Refresh offerings
    conn.execute("DELETE FROM journal_offerings WHERE entry_id = ?1", params![entry.id])
        .map_err(|e| e.to_string())?;
    for off in &entry.offerings {
        conn.execute(
            "INSERT INTO journal_offerings (entry_id, entity_id, kind, quantity) VALUES (?1, ?2, ?3, ?4)",
            params![entry.id, off.entity_id, off.kind, off.quantity],
        ).map_err(|e| e.to_string())?;
    }

    // Refresh entity presences
    conn.execute("DELETE FROM journal_entity_presence WHERE entry_id = ?1", params![entry.id])
        .map_err(|e| e.to_string())?;
    for ep in &entry.entities {
        conn.execute(
            "INSERT INTO journal_entity_presence (entry_id, entity_id, intensity, invoked) VALUES (?1, ?2, ?3, ?4)",
            params![entry.id, ep.entity_id, ep.intensity, if ep.invoked { 1 } else { 0 }],
        ).map_err(|e| e.to_string())?;
    }

    Ok(true)
}

#[tauri::command]
pub fn fetch_journal_entries(
    state: State<'_, VaultState>,
) -> Result<Vec<JournalEntryPayload>, String> {
    let guard = state.conn.lock().unwrap();
    let conn = guard.as_ref().ok_or("Vault is locked")?;

    let mut stmt = conn
        .prepare(
            r#"
            SELECT
                id, ritual_at, tz_offset_min, latitude, longitude,
                moon_phase, moon_illumination, moon_age_days,
                day_ruler, planetary_hour, planetary_hour_index, is_nocturnal,
                resonance, pre_state, post_state, working_type, tunnel_id,
                ciphertext
            FROM journal_entries
            WHERE deleted_at IS NULL
            ORDER BY ritual_at DESC
            "#,
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            let id: String = row.get(0)?;
            let ritual_at: String = row.get(1)?;
            let tz_offset_min: i64 = row.get(2)?;
            let latitude: Option<f64> = row.get(3)?;
            let longitude: Option<f64> = row.get(4)?;
            let moon_phase: Option<String> = row.get(5)?;
            let moon_illumination: Option<f64> = row.get(6)?;
            let moon_age_days: Option<f64> = row.get(7)?;
            let day_ruler: Option<String> = row.get(8)?;
            let planetary_hour: Option<String> = row.get(9)?;
            let planetary_hour_index: Option<i64> = row.get(10)?;
            let is_nocturnal: Option<i64> = row.get(11)?;
            let resonance: Option<i64> = row.get(12)?;
            let pre_state: Option<i64> = row.get(13)?;
            let post_state: Option<i64> = row.get(14)?;
            let working_type: Option<String> = row.get(15)?;
            let tunnel_id: Option<i64> = row.get(16)?;
            let ciphertext_bytes: Vec<u8> = row.get(17)?;

            Ok((
                id, ritual_at, tz_offset_min, latitude, longitude,
                moon_phase, moon_illumination, moon_age_days,
                day_ruler, planetary_hour, planetary_hour_index, is_nocturnal,
                resonance, pre_state, post_state, working_type, tunnel_id,
                ciphertext_bytes,
            ))
        })
        .map_err(|e| e.to_string())?;

    let mut entries = Vec::new();
    for r in rows {
        let (
            id, ritual_at, tz_offset_min, latitude, longitude,
            moon_phase, moon_illumination, moon_age_days,
            day_ruler, planetary_hour, planetary_hour_index, is_nocturnal,
            resonance, pre_state, post_state, working_type, tunnel_id,
            ciphertext_bytes,
        ) = r.map_err(|e| e.to_string())?;

        let content_json: serde_json::Value = serde_json::from_slice(&ciphertext_bytes)
            .unwrap_or_else(|_| serde_json::json!({ "title": "Untitled", "body_md": "" }));

        let title = content_json["title"].as_str().unwrap_or("Untitled").to_string();
        let body_md = content_json["body_md"].as_str().unwrap_or("").to_string();
        let visions = content_json["visions"].as_str().map(|s| s.to_string());
        let pre_state_label = content_json["pre_state_label"].as_str().map(|s| s.to_string());
        let post_state_label = content_json["post_state_label"].as_str().map(|s| s.to_string());

        // Fetch offerings for this entry
        let mut off_stmt = conn
            .prepare("SELECT kind, quantity, entity_id FROM journal_offerings WHERE entry_id = ?1")
            .map_err(|e| e.to_string())?;
        let offerings = off_stmt
            .query_map(params![id], |orow| {
                Ok(OfferingPayload {
                    kind: orow.get(0)?,
                    quantity: orow.get(1)?,
                    entity_id: orow.get(2)?,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|x| x.ok())
            .collect();

        // Fetch entity presences
        let mut ep_stmt = conn
            .prepare("SELECT entity_id, intensity, invoked FROM journal_entity_presence WHERE entry_id = ?1")
            .map_err(|e| e.to_string())?;
        let entities_presence = ep_stmt
            .query_map(params![id], |erow| {
                let invoked_int: i64 = erow.get(2)?;
                Ok(EntityPresencePayload {
                    entity_id: erow.get(0)?,
                    intensity: erow.get(1)?,
                    invoked: invoked_int == 1,
                })
            })
            .map_err(|e| e.to_string())?
            .filter_map(|x| x.ok())
            .collect();

        entries.push(JournalEntryPayload {
            id,
            ritual_at,
            tz_offset_min,
            latitude,
            longitude,
            moon_phase,
            moon_illumination,
            moon_age_days,
            day_ruler,
            planetary_hour,
            planetary_hour_index,
            is_nocturnal,
            resonance,
            pre_state,
            post_state,
            working_type,
            tunnel_id,
            title,
            body_md,
            visions,
            pre_state_label,
            post_state_label,
            offerings,
            entities: entities_presence,
        });
    }

    Ok(entries)
}

#[tauri::command]
pub fn delete_journal_entry(
    state: State<'_, VaultState>,
    id: String,
) -> Result<bool, String> {
    let guard = state.conn.lock().unwrap();
    let conn = guard.as_ref().ok_or("Vault is locked")?;

    conn.execute(
        "UPDATE journal_entries SET deleted_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(true)
}
