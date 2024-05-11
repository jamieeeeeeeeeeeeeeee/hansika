<script>
    import { SUITS, SUITS_OTHER } from "$lib/cards.js";
    import card from "$lib/assets/card.png";
    export let placeholder = false;
    export let suit = "♥️";
    export let value = "H";
    export let hidden = false;

    if (!SUITS.includes(suit)) {
        let index = SUITS_OTHER.indexOf(suit);
        if (index !== -1) {
            suit = SUITS[index];
        } else {
            suit = "?";
        }
    }

    if (value === "null" || suit === "null") {
        placeholder = true;
    }
</script>

<div id="card" class={placeholder ? "":"hoverable"} style={
    placeholder ? "border-color:grey;background-color:transparent;" : ""}
>   {#if hidden}
        <img src={card} alt="Card" style="width:100%;height:100%;"/>
    {:else if !placeholder}
        <div id="top">
            <div style="display:flex;flex-direction:column;">
                <span>{value}</span>
                <span style="font-size:0.5em;">{suit}</span>
            </div>
        </div>
        <div id="center">
            <span>{suit}</span>
        </div>
        <div id="bottom">
            <span></span>
            <div style="transform:rotateZ(180deg);display:flex;flex-direction:column;">
                <span>{value}</span>
                <span style="font-size:0.5em;">{suit}</span>
            </div>
        </div>
    {:else}
        <div id="top">
            <span></span>
            <span></span>
        </div>
        <div id="center">
            <span>EMPTY</span>
        </div>
        <div id="bottom">
            <span></span>
            <span></span>
        </div>
    {/if}
</div>

<style>
    #card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 7rem;
        height: 10rem;
        border: 3px solid black;
        border-radius: 1rem;
        background-color: white;
        font-weight: bold;
        font-size: 1.5rem;
        padding: 0 0.5rem;
        transition: transform 0.3s ease;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        touch-action: manipulation;
    }

    #top, #bottom {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 0.5rem;
        touch-action: manipulation;
    }

    #center {
        display: flex;
        justify-content: center;
        width: 100%;
        touch-action: manipulation;

    }
    
    span {
        color: rgb(114, 114, 114);
        touch-action: manipulation;

    }

    .hoverable:hover {
        cursor: pointer;
        transition: transform 0.35s ease;
        transform: scale(1.1) translateY(-20px);
    }
</style>

