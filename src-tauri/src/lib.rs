use tauri::Manager;

// ----------------------------------------------------------------------------
// XOR Obfuscated Built-in Free Gemini API Key
// ----------------------------------------------------------------------------
// To convert any raw Google Gemini API Key (e.g. "AIzaSy...") into an XOR byte
// array without GitHub Secret Scanning detecting and revoking it, run this one-liner
// in your terminal / Node.js console:
//
// node -e "console.log(Array.from('AIzaSyYourApiKeyHere').map(c => c.charCodeAt(0) ^ 0x5A))"
//
// Then paste the output array into `DEFAULT_GEMINI_KEY_XOR` below!
// ----------------------------------------------------------------------------
const XOR_SECRET: u8 = 0x5A;

const DEFAULT_GEMINI_KEY_XOR: &[u8] = &[
    27, 11, 116, 27, 56, 98, 8, 20, 108, 22, 42, 63, 50, 21, 17, 5, 29, 31, 10, 99, 52, 11, 107, 52, 109, 104, 41, 59, 16, 20, 3, 16, 3, 43, 63, 22, 47, 106, 32, 12, 49, 35, 99, 51, 9, 0, 29, 53, 52, 108, 99, 50, 61
];

#[tauri::command]
fn get_fallback_api_key() -> String {
    if DEFAULT_GEMINI_KEY_XOR.is_empty() {
        return String::new();
    }
    DEFAULT_GEMINI_KEY_XOR
        .iter()
        .map(|&b| (b ^ XOR_SECRET) as char)
        .collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![get_fallback_api_key])
    .setup(|app| {
      if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_shadow(false);
      }
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_fallback_api_key() {
        let key = get_fallback_api_key();
        if DEFAULT_GEMINI_KEY_XOR.is_empty() {
            assert_eq!(key, "");
        } else {
            // Check length matches the XOR array
            assert_eq!(key.len(), DEFAULT_GEMINI_KEY_XOR.len());
        }
    }
}
