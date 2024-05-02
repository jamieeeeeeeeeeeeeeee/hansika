<script>
    export let title = "Menu";
    export let options = [];
</script>

<div id="menu">
    <h1>{title}</h1>
    <div id="options">
    {#each options as option}
        <div class="option">
            <span>{option}</span>
        </div>
    {/each}
    </div>
</div>

<style>
    #menu {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        padding: 0 1.5rem;
        gap: 1rem;
        background-color: white;
        height: 70vh;
        width: 50vw;
        border-radius: 1rem;
    }

    /* make options a grid */
    #options {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 1rem;
        padding: 1rem;
    }
</style>