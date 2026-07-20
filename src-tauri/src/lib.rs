use tauri::{
    menu::{Menu, MenuItem},
    Manager, Emitter, Listener
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
      let toggle_visibility_i = MenuItem::with_id(app, "toggle_visibility", "隐藏 (Hide)", true, None::<&str>)?;
      let settings_i = MenuItem::with_id(app, "settings", "设置 (Settings)", true, None::<&str>)?;
      let shuffle_i = MenuItem::with_id(app, "shuffle", "重新洗牌 (Draw New Spread)", true, None::<&str>)?;
      let quit_i = MenuItem::with_id(app, "quit", "退出 (Quit)", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&toggle_visibility_i, &settings_i, &shuffle_i, &quit_i])?;

      let toggle_clone1 = toggle_visibility_i.clone();
      app.listen("window-hidden", move |_| {
          let _ = toggle_clone1.set_text("显示 (Show)");
      });

      let toggle_clone2 = toggle_visibility_i.clone();
      app.listen("window-shown", move |_| {
          let _ = toggle_clone2.set_text("隐藏 (Hide)");
      });

      if let Some(tray) = app.tray_by_id("main") {
          let _ = tray.set_menu(Some(menu.clone()));
          let _ = tray.set_show_menu_on_left_click(true);
          let toggle_i_clone = toggle_visibility_i.clone();
          tray.on_menu_event(move |app, event| {
              match event.id.as_ref() {
                  "quit" => { app.exit(0); }
                  "toggle_visibility" => {
                      if let Some(window) = app.get_webview_window("main") {
                          if window.is_visible().unwrap_or(false) {
                              let _ = window.hide();
                              let _ = toggle_i_clone.set_text("显示 (Show)");
                          } else {
                              let _ = app.show();
                              let _ = window.unminimize();
                              let _ = window.show();
                              let _ = window.set_focus();
                              let _ = toggle_i_clone.set_text("隐藏 (Hide)");
                          }
                      }
                  }
                  "settings" => {
                      let _ = app.show();
                      if let Some(window) = app.get_webview_window("main") {
                          let _ = window.unminimize();
                          let _ = window.show();
                          let _ = window.set_focus();
                      }
                      let _ = toggle_i_clone.set_text("隐藏 (Hide)");
                      let _ = app.emit("open-settings", ());
                  }
                  "shuffle" => {
                      let _ = app.show();
                      if let Some(window) = app.get_webview_window("main") {
                          let _ = window.unminimize();
                          let _ = window.show();
                          let _ = window.set_focus();
                      }
                      let _ = toggle_i_clone.set_text("隐藏 (Hide)");
                      let _ = app.emit("draw-new-spread", ());
                  }
                  _ => {}
              }
          });
      } else if let Some(tray) = app.tray_by_id("default") {
          let _ = tray.set_menu(Some(menu.clone()));
          let _ = tray.set_show_menu_on_left_click(true);
          let toggle_i_clone = toggle_visibility_i.clone();
          tray.on_menu_event(move |app, event| {
              match event.id.as_ref() {
                  "quit" => { app.exit(0); }
                  "toggle_visibility" => {
                      if let Some(window) = app.get_webview_window("main") {
                          if window.is_visible().unwrap_or(false) {
                              let _ = window.hide();
                              let _ = toggle_i_clone.set_text("显示 (Show)");
                          } else {
                              let _ = app.show();
                              let _ = window.unminimize();
                              let _ = window.show();
                              let _ = window.set_focus();
                              let _ = toggle_i_clone.set_text("隐藏 (Hide)");
                          }
                      }
                  }
                  "settings" => {
                      let _ = app.show();
                      if let Some(window) = app.get_webview_window("main") {
                          let _ = window.unminimize();
                          let _ = window.show();
                          let _ = window.set_focus();
                      }
                      let _ = toggle_i_clone.set_text("隐藏 (Hide)");
                      let _ = app.emit("open-settings", ());
                  }
                  "shuffle" => {
                      let _ = app.show();
                      if let Some(window) = app.get_webview_window("main") {
                          let _ = window.unminimize();
                          let _ = window.show();
                          let _ = window.set_focus();
                      }
                      let _ = toggle_i_clone.set_text("隐藏 (Hide)");
                      let _ = app.emit("draw-new-spread", ());
                  }
                  _ => {}
              }
          });
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
