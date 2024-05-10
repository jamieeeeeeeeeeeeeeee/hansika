<script>
    import { cluedoHideAll, cluedoClearAll } from "$lib/store.js";
    import { onDestroy } from "svelte";

    let checkBoxText = "";
    function toggle() {
        if (checkBoxText == "") {
            checkBoxText = "✗";
        } else if (checkBoxText == "✗") {
            checkBoxText = "✓";
        } else {
            checkBoxText = "";
        }
    }

    const unsub = cluedoClearAll.subscribe((v) => {
        checkBoxText = "";
    });

    onDestroy(() => {
        unsub();
    });
</script>

<div>
    <button 
    class="checkbox" 
    on:click={toggle}
    style={$cluedoHideAll ? 'background-color: black;' : (checkBoxText != "" ? "background-color: black; color: white;" : "")}
    >
        {$cluedoHideAll ? '' : checkBoxText}
    </button>
</div>

<style>
    .checkbox {
        width: 20px;
        height: 20px;
        min-width: 20px;
        min-height: 20px;
        max-width: 20px;
        max-height: 20px;
        border: 2px solid black;
        border-radius: 0.25em;
        background-color: white;
        cursor: pointer;
        text-align: center;
        font-size: 1em;
        align-items: center;
        display: flex;
        justify-content: center;
        min-width: 15px;
        overflow: hidden;
        padding: 0;
        margin-right: 4px;
        touch-action: manipulation;
    }
</style>