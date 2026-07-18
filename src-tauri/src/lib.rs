use tauri::{
    menu::{Menu, MenuItem},
    Manager,
};

// ----------------------------------------------------------------------------
// XOR Obfuscated Built-in Free Gemini API Key
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
      let quit_i = MenuItem::with_id(app, "quit", "退出 (Quit)", true, None::<&str>)?;
      let show_i = MenuItem::with_id(app, "show", "显示 (Show)", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

      // In Tauri v2, if `trayIcon` is in `tauri.conf.json`, it is automatically created
      // with the ID "main" or "default". Let's try to get it.
      if let Some(tray) = app.tray_by_id("main") {
          let _ = tray.set_menu(Some(menu.clone()));
          let _ = tray.set_show_menu_on_left_click(true);
          tray.on_menu_event(move |app, event| {
              println!("Tray Menu event triggered: {:?}", event.id.as_ref());
              match event.id.as_ref() {
                  "quit" => {
                      println!("Exiting application...");
                      app.exit(0);
                  }
                  "show" => {
                      println!("Showing application...");
                      let _ = app.show();
                      if let Some(window) = app.get_webview_window("main") {
                          let _ = window.unminimize();
                          let _ = window.show();
                          let _ = window.set_focus();
                      }
                  }
                  _ => {}
              }
          });
      } else if let Some(tray) = app.tray_by_id("default") {
          let _ = tray.set_menu(Some(menu.clone()));
          let _ = tray.set_show_menu_on_left_click(true);
          tray.on_menu_event(move |app, event| {
              println!("Tray Menu event triggered: {:?}", event.id.as_ref());
              match event.id.as_ref() {
                  "quit" => {
                      println!("Exiting application...");
                      app.exit(0);
                  }
                  "show" => {
                      println!("Showing application...");
                      let _ = app.show();
                      if let Some(window) = app.get_webview_window("main") {
                          let _ = window.unminimize();
                          let _ = window.show();
                          let _ = window.set_focus();
                      }
                  }
                  _ => {}
              }
          });
      } else {
          println!("WARNING: No default tray icon found!");
      }

      app.manage(menu);

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
            assert_eq!(key.len(), DEFAULT_GEMINI_KEY_XOR.len());
        }
    }
}
