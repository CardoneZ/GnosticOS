pub mod vault;

use std::sync::Mutex;
use vault::VaultState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(VaultState {
            conn: Mutex::new(None),
        })
        .invoke_handler(tauri::generate_handler![
            vault::is_vault_unlocked,
            vault::unlock_vault,
            vault::lock_vault,
            vault::fetch_tunnels,
            vault::fetch_entities,
            vault::save_journal_entry,
            vault::fetch_journal_entries,
            vault::delete_journal_entry,
            vault::export_vault_backup,
            vault::import_vault_backup,
        ])
        .run(tauri::generate_context!())
        .expect("error while running GnosticOS application");
}
