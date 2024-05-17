<script>
    import { onMount } from 'svelte';
    import Gist from '$lib/components/Gist.svelte';
  
    let keys = [];

    function decToAscii(dec) {
        return String.fromCharCode(dec);
    }
  
    onMount(async () => {
            setInterval(async () => {
            try {
                const response = await fetch('/api');
                const data = await response.json();
                if (data.length !== keys.length) {
                    keys = data;
                }
            } catch (error) {
                console.error('Error fetching keys:', error);
            }
        }, 1000);
    });


  </script>
  

<main>
    <div>
        {#if keys.length === 0}
            <p>No keys have been sent</p>
        {/if}
        {#each keys as key}
            {decToAscii(key)}
        {/each}
    </div>
    
    <div>
        <Gist/>
    </div>
</main>

<style>
    div {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-self: start;
        width: 45%;
        margin-right: 2rem;
        align-items: center;
    }

    main {
        display: flex;
        flex-direction: row;
        padding: 1rem;
    }

    @media (max-width: 768px) {
        main {
            flex-direction: column;
            align-items: center;
        }
        div {
            width: 90%;
            margin-right: 0;
            margin-top: 1rem;
        }
    }
</style>
