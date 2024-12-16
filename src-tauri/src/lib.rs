// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::sync::Arc;
use tauri::Emitter;
use tokio::runtime::Handle;
use tokio::sync::mpsc;

use futures_util::lock::Mutex;
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

#[derive(Debug)]
struct WebSocketState {
    sender: mpsc::Sender<String>,
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[tauri::command]
async fn send_message(
    state: tauri::State<'_, Arc<Mutex<WebSocketState>>>,
    message: String,
) -> Result<(), ()> {
    let state = state.lock().await;
    let _ = state.sender.send(message).await; // TODO: Handle error
    Ok(())
}

async fn websocket_task(
    url: &str,
    mut receiver: mpsc::Receiver<String>,
    app_handle: tauri::AppHandle,
) {
    println!("Websocket task running...");
    let (stream, _) = connect_async(url)
        .await
        .expect("Can't connect to websocket.");
    println!("Connected to websocket.");

    let (mut write, read) = stream.split();

    let handle = Handle::current(); // Get the current (handle to the) runtime
    handle.spawn(async move {
        while let Some(message) = receiver.recv().await {
            if let Err(error) = write.send(Message::Text(message)).await {
                eprintln!("Failed to send message: {}", error)
            }
        }
    });

    read.for_each(|message| async {
        match message {
            Ok(Message::Text(text)) => {
                let _ = app_handle.emit(
                    "messageCreate",
                    Payload {
                        message: text.clone(),
                    },
                );
                println!("message recv: {}", text)
            }
            Err(error) => eprintln!("Err recv: {:?}", error),
            _ => {}
        }
    })
    .await;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let websocket_url = "ws://localhost:3000/ws";
    let (sender, receiver) = mpsc::channel::<String>(128); // Buffer of 128 messages

    let state = Arc::new(Mutex::new(WebSocketState { sender }));

    tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.handle();
            tauri::async_runtime::spawn(websocket_task(websocket_url, receiver, app_handle.clone()));
            Ok(())
        })
        .manage(state)
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![send_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
