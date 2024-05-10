<script>
    export let text = "";
    export let img = "";
    export let type = "default";
    export let callback = function(){
      console.log("Callback function called.")
    };
</script>

<div
    class={`button button-${type} ${img ? 'button-img' : ''}`}
    tabindex="0"
    on:click={callback}
    on:keydown={(e) => {
        if (e.key === "Enter") {
            callback();
        }
    }}
    role="button"
>
    {#if img}
        <div class="image-container">
            <img src={img} alt={text} />
        </div>
    {:else}
        <div>
            { text }
        </div>
    {/if}
</div>

<style>
    .button {
        font-family: 'Roboto', sans-serif;
        border: 3px solid grey;
        border-bottom-width: 5px;
        border-radius: 0.5em;
        font-size: 2rem;
        cursor: pointer;
        background-color: white;
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        width: 100%;
        transition: scale 0.2s ease-in;
        flex-direction: row;
        align-items: center;
        text-align: top;
        transition: all 0.1s ease-in-out;
        max-width: 768px;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
    }

    .button-img {
        height: 15vw;
        border: none;
        padding: 0;
        background-color: transparent;
    }

    .button-img > .image-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button-img > .image-container > img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border-radius: 0.5em;
    }

    .button:active {
        scale: 0.98;
    }

    .button-good {
        background-color: #046A38;
        border-color: #046A38;
        width: 65%;
    }

    .button-good > div {
        color: white;
    }

    .button > div {
        text-align: center;
        width: 100%;
    }

    .button-select {
        background-color: #06038D;
        border-color: #06038D;
    }

    .button-good > div, .button-select > div {
        color: white;
    }
    @media (max-width: 900px) {
        .button-img {
            height: 20vw; 
        }
    }
    @media (max-width: 600px) {
        .button-img {
            height: 30vw; 
        }
    }
</style>
