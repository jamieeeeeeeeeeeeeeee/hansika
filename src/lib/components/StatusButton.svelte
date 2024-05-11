<script>
    export let status = "STATUS";
    export let buttons = [
        {text: "YES", colour: "green", action: () => {}},
        {text: "NO", colour: "red", action: () => {}}
    ];
</script>

<div id="status">
    <span style="margin-bottom: 2px;"><b>{status}</b></span>
    <div style="display: flex; gap: 1rem;">
        {#each buttons as button}
            <button style="background-color:{button.colour}; {button.colour==='white'?'border: 2px dotted grey;color:black;':''}" on:click={button.action}>{button.text}</button>
        {/each}
    </div>
</div>

<style>
    #status {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.5rem;
        color: white;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
    }
</style>