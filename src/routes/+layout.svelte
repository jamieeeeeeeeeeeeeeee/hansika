<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import Progress from "$lib/components/Progress.svelte";

    import { page } from "$app/stores";
</script>

<Navbar> 
    <svelte:fragment slot="navbar">
        {#if $page.url.pathname.includes("/odia/")}
            <Progress />
        {/if}
    </svelte:fragment>
</Navbar>
<slot />