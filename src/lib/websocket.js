import { get } from 'svelte/store';
import { browser } from '$app/environment';
let ws;

if (browser)
    ws = new WebSocket('ws://' + window.location.host + '/ws');

function check() {
    if (ws === undefined) {
        console.error("Websocket never existed");
    } else if (ws.readyState === WebSocket.CLOSED) {
        console.error("Websocket closed, reconnecting");
        ws = new WebSocket('ws://' + window.location.host + '/ws');
    } else if (ws.readyState === WebSocket.CONNECTING) {
        console.error("Websocket connecting");
        return true;
    } else if (ws.readyState === WebSocket.OPEN) 
    return true; return false;
}

const send = (type, data) => {
    if (check()) {
        ws.send(JSON.stringify({ type, data }));
        console.log("Sent", type, data);
    }
}

export { ws, check, send };