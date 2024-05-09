// server.js
import { dlopen, suffix } from 'bun:ffi';

const path = `./librd.${suffix}`;

const {
    symbols: {
        moveCursor,
        click,
        rightClick,
        keyPress,
        stringPress,
        systemCMD,
        setFrame,
        getFrame,
    },
} = dlopen(path, {
    moveCursor: {
        args: ["int", "int"],  // Use string literals for types
        result: "void",
    },
    click: {
        args: ["void"],
        result: "void",
    },
    rightClick: {
        args: ["void"],
        result: "void",
    },
    keyPress: {
        args: ["char"],
        result: "void",
    },
    stringPress: {
        args: ["string"],
        result: "void",
    },
    systemCMD: {
        args: ["string"],
        result: "void",
    },
});



/*
// Phone home at "ws://localhost:8080/ws"
const ws = new WebSocket("ws://localhost:8080/ws");
ws.onopen = () => {
    console.log("Connected to repeater.");
}

ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data);
    switch (type) {
        case 'moveCursor':
            console.log("Moving cursor to:", data.x, data.y);
            const { x, y } = data;
            moveCursor(x, y);
            break;
    }
}

ws.onclose = () => {
    console.log("Disconnected from repeater.");
}

ws.onerror = (error) => {
    console.error("WebSocket error:", error);
}

console.log("Welcome!");
while (1 + 1 == 2) {
    if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "rds", data: null }));
    await new Promise((resolve) => setTimeout(resolve, 1000));
}
*/