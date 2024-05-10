<script>
    import { cluedoHideAll } from "$lib/store.js";
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
        {text}
    </label>
</div>

<style>
    .checkbox {
        width: 1em;
        height: 1em;
        border: 2px solid black;
        border-radius: 0.25em;
        background-color: white;
        cursor: pointer;
        text-align: center;
        font-size: 1em;
        align-items: center;
        display: flex;
        justify-content: center;
        margin-right: 0.5em;
    }

    label {
        display: flex;
        align-items: center;
        flex-direction: row;
    }
</style>