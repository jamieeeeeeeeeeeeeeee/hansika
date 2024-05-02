<script>
    export let text = "";
    export let img = "";
    export let type = "default";
    export let callback = function(){
      console.log("Callback function called.")
    };
</script>

<div
    class="button button-{type}"
    style={img != "" ? "" : "padding: 0.2em 0;"}
    tabindex="0"
    on:click={callback}
    on:keydown={(e) => {
        if (e.key === "Enter") {
            callback();
        }
    }}
    role="button"
>
    {#if img != ""}
        <img src={img} alt={text} />
    {:else}
        <div>
            { text }
        </div>
    {/if}
</div>

<style>
    .button {
        font-family: 'Roboto', sans-serif;
        overflow: hidden;
        border: 3px solid grey;
        border-bottom-width: 5px;
        border-radius: 0.5em;
        font-size: 2rem;
        cursor: pointer;
        background-color: white;
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        transition: scale 0.2s ease-in;
        flex-direction: row;
        align-items: center;
        text-align: top;
        transition: all 0.1s ease-in-out;
        width: 100%;
        max-width: 768px;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .button-good {
        background-color: #046A38;
        border-color: #046A38;
        width: 65%;
    }

    .button-good > div {
        color: white;
    }

    .button-select {
        background-color: #06038D;
        border-color: #06038D;
    }

    .button-select > div {
        color: white;
    }

    .button:active {
        scale: 0.98;
        transition: scale 0.2s ease-out;
    }

    .button > div {
        text-align: center;
        width: 100%;
    }

    .button-img > img{
        height: 33vw;
        
        border-radius: 0.5em;
        transition: all 0.1s ease-in-out;
    }

    .button-img  {
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: none;
        max-width: 100%;
        object-fit: cover;

    }
</style>
