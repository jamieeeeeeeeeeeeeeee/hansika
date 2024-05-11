// hooks.server.js
const modes = new Map([
    ["trumps", {
        defaultState: {

        }
    }]
]);
const rooms = new Map();
const clients = new Map();

class Room {
    constructor(id, mode, host) {
        this.id = id;
        this.mode = mode;
        this.users = [];
        this.state = {};
        this.addUser(host);
    }

    addUser(user) {
        this.users.push(user);
        if (clients.has(user)) clients.get(user).room = this.id;
    }

    removeUser(user) {
        this.users = this.users.filter(u => u !== user);
        if (clients.has(user)) clients.get(user).room = null;

        if (this.users.length === 0) {
            rooms.delete(this.id);
            sendAllRooms();
        }
    }      

    getRoom() {
        return {
            id: this.id,
            mode: this.mode,
            users: this.users.map(user => clients.has(user) ? clients.get(user).user : "ERR_USER404"),
        };
    }
}

class RespAsErr extends Error {
    constructor(status, message, data={}, error=true) {
        super(message);
        this.data = data;
        this.status = status;
        this.error = error;
    }
}

class Resp extends RespAsErr {
    constructor(status, message, data={}, error=false) {
        super(status, message, data, error);
    }

}

function sendAllRooms() {
    const data = Array.from(rooms.values()).map(room => room.getRoom());

    const message = JSON.stringify({ type: "rooms", data: data });
    for (const ws of clients.keys()) {
        if (!clients.get(ws).room) {
            ws.send(message);
        }
    }
}

function create(ws, data) {
    if (!clients.has(ws)) throw new RespAsErr(400, "Client not found");
    let client = clients.get(ws); 
    const { user, mode } = data;
    if (!user) throw new RespAsErr(400, "User not found");
    if (!mode) throw new RespAsErr(400, "Mode not found");
    if (!modes.has(mode)) throw new RespAsErr(404, "Mode not found")

    console.log("Creating room: ", user, mode);
    let roomID = Math.random().toString(16).substring(2, 6);

    let attempts = 10;
    while (rooms.has(roomID) && attempts-- > 0) roomID = Math.random().toString(16).substring(2, 6);
    if (rooms.has(roomID)) throw new RespAsErr(500, "Room capacity reached: " + rooms.size);

    client.user = user;
    const room = new Room(roomID, mode, ws);
    rooms.set(roomID, room);

    console.log("Room created: ", roomID);
    ws.send(JSON.stringify({ type: "room", data: { room: room.getRoom() } }));
    sendAllRooms();
}

function join(ws, data) {
    if (!clients.has(ws)) throw new RespAsErr(400, "Client not found");
    let client = clients.get(ws);
    const { user, roomID } = data;
    if (!user) throw new RespAsErr(400, "User not found");
    if (!roomID) throw new RespAsErr(400, "Room not found");

    if (client.room === roomID) {
        ws.send(JSON.stringify({ type: "room", data: { room: rooms.get(roomID).getRoom() } }));
        return;
    } else if (client.room) {
        let room = rooms.get(client.room);
        if (room) room.removeUser(ws);
    }

    const room = rooms.get(roomID);
    if (!room) throw new RespAsErr(404, "Room not found");
    client.user = user;

    room.addUser(ws);
    ws.send(JSON.stringify({ type: "room", data: { room: room.getRoom() } }));
}

function roomCheck(ws, data) {
    if (!clients.has(ws)) throw new RespAsErr(400, "Client not found");
    let client = clients.get(ws);
    const { roomID } = data;
    if (!rooms.has(roomID)) throw new RespAsErr(404, "Room not found");
    else if (client.room !== roomID) join(ws, { user: "", roomID: roomID });
    else throw new Resp(200, "Already in room", { room: rooms.get(roomID).getRoom() });
}

const rd = new Map();
let RDS = null;
let RDC = null;
function rdc(ws, data) {
    if (RDC == null) RDC = ws;
    let type = data.func;
    delete data.func;
    if (RDS != null) RDS.send(JSON.stringify({ type: type, data: data}));
}

function rds(ws, data) {
    if (RDS == null) {
        RDS = ws;
        ws.send("Welcome Remote Server");
    }
    if (data == null) return;
    let type = data.func;
    delete data.func;
    if (RDC != null) RDC.send(JSON.stringify({ type: type, data: data}));
}

export const handleWebsocket = {
    open(ws) {
      console.log("Client connected: " + ws);
      clients.set(ws, {});
      sendAllRooms();
    },

    close(ws) {
        console.log("Client disconnected.");
        if (!clients.has(ws)) return;
        let client = clients.get(ws);
        if (client.room) {

            let room = rooms.get(client.room);
            if (room) {
                room.removeUser(ws);
            }
        }
        clients.delete(ws);
    },

    message(ws, message) {
        let typeForLater = null;
        try {
            const { type, data } = JSON.parse(message);
            typeForLater = type;
            console.log(type, data);

            switch(type) {
                case "rdc": rdc(ws, data); break;
                case "rds": rds(ws, data); break;
                case "create": create(ws, data); break;
                case "join": join(ws, data); break;
                case "roomCheck": roomCheck(ws, data); break;
                default: throw new RespAsErr(404, "Endpoint not found");
            }
        } catch (e) {
            console.error(e);
            if (e instanceof RespAsErr) {
                if (typeForLater == null) { console.error("Resp without 'type'"); return;}
                if (e.error)
                    ws.send(JSON.stringify({ type: "error",   data: { message: e.message, status: e.status,} }));
                else {
                    data.message = e.message; // Make sure 'message' is reserved.
                    ws.send(JSON.stringify({ type: typeForLater, data: e.data }));
                }
            }
        }
    },
    
    upgrade(request, upgrade) {
      const url = new URL(request.url);
      //console.log(url);

      if (url.pathname === "/ws") {
        return upgrade(request);
      } 
    },
  };
