// hooks.server.js

/** @type {import("svelte-adapter-bun").WebSocketHandler} */
export const handleWebsocket = {
    open(ws) {
      console.log("WebSocket opened");
    },
    
    /**
     * @param {Request} request
     * @param {Function} upgrade
     */ 
    upgrade(request, upgrade) {
      const url = new URL(request.url);
      if (url.pathname === "/ws") {
        return upgrade(request);
      }
    },
  };