use keyring::Entry;
fn main() {
    let entry = Entry::new("test", "user");
    match entry {
        Ok(e) => {
            let _ = e.set_password("pass");
        }
        Err(_) => {}
    }
}
