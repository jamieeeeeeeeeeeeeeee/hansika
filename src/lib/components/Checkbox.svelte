<script>
    import { cluedoHideAll, cluedoClearAll } from "$lib/store.js";
    import { onDestroy } from "svelte";
    export let text = "";

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
    <label>
        <button 
        class="checkbox" 
        on:click={toggle}
        style={$cluedoHideAll ? 'background-color: black;' : (checkBoxText != "" ? "background-color: black; color: white;" : "")}
        >
            {$cluedoHideAll ? '' : checkBoxText}
        </button>
        <div>
            {text}
        </div>
    </label>
</div>

<style>
    .checkbox {
        width: 15px;
        height: 15px;
        min-width: 15px;
        min-height: 15px;
        max-width: 15px;
        max-height: 15px;
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
        margin: 0;
    }

    label {
        display: flex;
        align-items: center;
        flex-direction: row;
        touch-action: manipulation;
    }

    label > div {
        margin-left: 0.5em;
    }
</style>