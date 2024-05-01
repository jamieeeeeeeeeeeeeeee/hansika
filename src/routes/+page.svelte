<script>
    import { browser } from '$app/environment';
    
    if (browser) {
        const websocket = new WebSocket('ws://' + window.location.host + '/ws');
        websocket.onopen = () => {
            console.log('Connected to websocket');
        };
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
