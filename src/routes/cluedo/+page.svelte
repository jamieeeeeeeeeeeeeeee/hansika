<script>
    import Checkbox from "$lib/components/Checkbox.svelte";
    import { cluedoHideAll, cluedoClearAll } from "$lib/store.js";
    const guests = [
        "Mustard",
        "Plum",
        "Green",
        "Peacock",
        "Scarlet",
        "White"
    ];

    const weapons = [
        "Knife",
        "Candlestick",
        "Pistol",
        "Poison",
        "Trophy",
        "Rope",
        "Bat",
        "Axe",
        "Dumbbell"
    ];

    const rooms = [
        "Hall",
        "Dining Room",
        "Kitchen",
        "Patio",
        "Observatory",
        "Theatre",
        "Living Room",
        "Spa",
        "Guest House"
    ];

    let randomGuest = "";
    let randomWeapon = "";
    let randomRoom = "";
    function randomGuess() {
        randomGuest = guests[Math.floor(Math.random() * guests.length)];
        randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
        randomRoom = rooms[Math.floor(Math.random() * rooms.length)];    
    }
    function clearAll() {
        cluedoClearAll.update((v) => !v); 
        cluedoHideAll.set(false);
        randomGuest = "";
        randomWeapon = "";
        randomRoom = "";
    }

    let numPlayers = 1;
    function setNumPlayers(num) {
        numPlayers = num
    }
</script>

<main>
    <div class="navbar">
        <div class="navbar">
            <button id="clear" on:click={clearAll}>CLEAR</button>
            <button 
            class="spinner"
            on:click={() => setNumPlayers(numPlayers - 1)}
            >-</button>
            <input 
            type="number" 
            min="1" 
            max="4" 
            bind:value={numPlayers}
            />
            <button 
            class="spinner"
            on:click={() => setNumPlayers(numPlayers + 1)}
            >+</button>
        </div>
        <div>
            {#each Array(numPlayers) as _}
                <input type="text"/>
            {/each}
        </div>
        <div>
            <button on:click={() => {cluedoHideAll.update((v) => !v);}}>{$cluedoHideAll ? "SHOW" : "HIDE"}</button>
            <button on:click={randomGuess}>RANDOM</button>
        </div>
    </div>
    <div class="navbar">
        <b>{randomGuest}</b> {randomGuest == "" ? "" : "with the"} <b>{randomWeapon}</b> {randomGuest == "" ? "" : "in the"} <b>{randomRoom}</b>
    </div>
    <div id="container">
        <div class="column">
            <div>
                <h3 class="remove">Guests</h3>
                {#each guests as guest}
                    <div class="item">
                        {#each Array(numPlayers) as _}
                            <Checkbox/>
                        {/each}
                        {guest}
                    </div>
                {/each}
            </div>
            <div>
                <h3>Weapons</h3>
                {#each weapons as weapon}
                    <div class="item">
                        {#each Array(numPlayers) as _}
                            <Checkbox/>
                        {/each}
                        {weapon}
                    </div>
                {/each}
            </div>
        </div>
        <div>
            <h3>Rooms</h3>
            {#each rooms as room}
                <div class="item">
                    {#each Array(numPlayers) as _}
                        <Checkbox/>
                    {/each}
                    {room}
                </div>
            {/each}
        </div>
    </div>
</main>
<div class="item"><div class="item"></div></div>

<style>
    #clear {
        margin-right: 1rem;
    }
    .navbar {
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        height: 3rem;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.5em;
    }

    #container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 100%;
        align-items: center;
    }

    .remove {
        margin-top: 0rem;
        padding-top: 0rem;
    }

    #container > div {
        margin: 0 1rem;
    }

    button {
        background-color: white;
        color: black;
        border: none;
        border-radius: 0.5em;
        padding: 0.5em;
        cursor: pointer;
        touch-action: manipulation;
    }

    .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0.15em;
        padding-top: 0.3em;
        padding-bottom: 0.3em;
    }

    input[type=number] {
        margin: 0;
        border: none;
        border-radius: 0.5em;
        padding: 0.5em;
        width: 3em;
        text-align: center;
        font-size: 1rem;
        -moz-appearance: textfield;
        appearance: textfield;
        height: 1.5rem;
    }

    .spinner {
        background-color: white;
        color: black;
        border: none;
        border-radius: 0.5em;
        cursor: pointer;
        touch-action: manipulation;
        margin: 0 2px;
        padding: 0.5em 0.75em;
    }
    
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button {
        opacity: 0;
        appearance: none;
    }

    input[type=text] {
        margin: 0 1px;
        border: none;
        border-radius: 0.5em;
        padding: 0.5em;
        width: 2rem;
        text-align: center;
        font-size: 1rem;
    }
</style>