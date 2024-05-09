<!--[vnc]/+page.svelte-->
<script>
    let ws;
    let connectionStatus = 'Disconnected';
    let inputValue = '';
    let canvas;
    let imageStream;

    function connectToServer() {
        ws = new WebSocket('ws://' + window.location.host + '/ws');

        ws.onopen = () => {
            connectionStatus = 'Connected';
            console.log('Connected to repeater server');
        };

        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);
            console.log('Received message:', type, data);

            switch (type) {
                case 'room':
                    handleRoomMessage(data);
                    break;
                case 'rdc':
                    handleRemoteControlMessage(data);
                    break;
                default:
                    console.log('Unhandled message type:', type);
            }
        };

        ws.onclose = () => {
            connectionStatus = 'Disconnected';
            console.log('Disconnected from repeater server');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Setup image stream
        imageStream = new EventSource('/img');
        imageStream.onmessage = (event) => {
            const img = new Image();
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
            };
            img.src = `data:image/jpeg;base64,${event.data}`;
        };
    }

    function handleRoomMessage(data) {
        console.log('Room data:', data);
    }

    function handleRemoteControlMessage(data) {
        console.log('Remote control data:', data);
    }

    function sendMessage() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'rdc', data: inputValue }));
            inputValue = '';
        }
    }

    function handleMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xPercent = ((x / rect.width) * 100) | 0;
        const yPercent = ((y / rect.height) * 100) | 0;

        console.log(xPercent, yPercent);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'rdc', data: { func: 'moveCursor', x: xPercent, y: yPercent } }));
        } else console.log("Not connected");
    }
</script>

<main>
    <h1>Remote Control Client</h1>
    <p>Connection status: {connectionStatus}</p>
    <button on:click={connectToServer}>Connect to Server</button>
    <canvas bind:this={canvas} on:mousemove={handleMouseMove}></canvas>
    <div>
        <input type="text" bind:value={inputValue} placeholder="Enter message..." />
        <button on:click={sendMessage}>Send</button>
    </div>
</main>

<style>
    canvas {
        width: 720px;
        height: 480px;
        border: 1px solid black;
    }
</style>