// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::sync::Arc;
use tokio::runtime::Handle;
use tokio::sync::mpsc;

use futures_util::lock::Mutex;
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

#[derive(Debug)]
struct WebSocketState {
    sender: mpsc::Sender<String>,
}

#[tauri::command]
async fn send_message(
    state: tauri::State<'_, Arc<Mutex<WebSocketState>>>,
    msg: String,
) -> Result<(), ()> {
    let state = state.lock().await;
    let _ = state.sender.send(msg).await; // TODO: Handle error
    Ok(())
}

async fn websocket_task(url: &str, mut sender: mpsc::Receiver<String>) {
    let (ws_stream, _) = connect_async(url)
        .await
        .expect("Can't connect to websocket.");
    println!("Connected to websocket.");

    let (mut write, mut read) = ws_stream.split();

    let handle = Handle::current(); // Get the current (handle to the) runtime
    handle.spawn(async move {
        while let Some(msg) = sender.recv().await {
            if let Err(e) = write.send(Message::Text(msg)).await {
                eprintln!("Failed to send message: {}", e)
            }
        }
    });

    while let Some(msg) = read.next().await {
        if let Ok(Message::Text(text)) = msg {
            println!("Recv: {}", text)
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let websocket_url = "ws://localhost:3000/ws";
    let (ws_tx, ws_rx) = mpsc::channel::<String>(32);

    let runtime = tokio::runtime::Runtime::new().unwrap();
    runtime.spawn(websocket_task(websocket_url, ws_rx));
    let state = Arc::new(Mutex::new(WebSocketState { sender: ws_tx }));

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![send_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
