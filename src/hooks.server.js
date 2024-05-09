// hooks.server.js
const modes = new Map([
    ["trumps", {
        defaultState: {

        }
    }]
]);
const rooms = new Map();

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
    }

    removeUser(user) {
        const index = this.users.indexOf(user);
        if (index > -1) {
            this.users.splice(index, 1);
        }

        if (this.users.length === 0) {
            rooms.delete(this.id);
        }
    }      
}

class StatusError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function create(ws, data) {
    const { user, mode } = data;
    if (!user) throw new StatusError(400, "User not found");
    if (!mode) throw new StatusError(400, "Mode not found");
    if (!modes.has(mode)) throw new StatusError(404, "Mode not found")

    console.log("Creating room: ", user, mode);
    let roomID = Math.random().toString(16).substring(2, 6);

    let attempts = 10;
    while (rooms.has(roomID) && attempts-- > 0) roomID = Math.random().toString(16).substring(2, 6);
    if (rooms.has(roomID)) throw new StatusError(500, "Room capacity reached: " + rooms.size);

    const room = new Room(roomID, mode, user);
    rooms.set(roomID, room);
    room.addUser(user);

    console.log("Room created: ", roomID);
    ws.send(JSON.stringify({ type: "room", data: { room: room } }));
}

function join(ws, data) {
    const { user, roomID } = data;
    if (!user) throw new StatusError(400, "User not found");
    if (!roomID) throw new StatusError(400, "Room not found");

    const room = rooms.get(roomID);
    if (!room) throw new StatusError(404, "Room not found");

    room.addUser(user);
    ws.send(JSON.stringify({ type: "room", data: { room: room } }));
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
    },

    close(ws) {
        console.log("Client disconnected.");
    },

    message(ws, message) {
        let typeForError = null;
        try {
            // message is binary so we convert it to string
            message = message.toString();
            if (message === "Hello!") {
                console.log("RECEIVED HELLO");
                return;
            } else {
                console.log("RECEIVED NOT HELLO BUT: ", message);
            }
            console.log("HI");
            const { type, data } = JSON.parse(message);
            typeForError = type;
            console.log(type, data);

            switch(type) {
                case "rdc": rdc(ws, data); break;
                case "rds": rds(ws, data); break;
                case "create": create(ws, data); break;
                case "join": join(ws, data); break;
                default: throw new StatusError(404, "Endpoint not found");
            }
        } catch (e) {
            console.error(e);
            if (e instanceof StatusError) {
                if (typeForError == null) { console.error("!!! StatusError without type !!!"); return;}
                ws.send(JSON.stringify({ type: typeForError, status: e.status, data: { message: e.message } }));
            }
        }
    },
    
    upgrade(request, upgrade) {
      const url = new URL(request.url);
      console.log(url);

      if (url.pathname === "/") {
        return upgrade(request);
      } 
    },
  };
