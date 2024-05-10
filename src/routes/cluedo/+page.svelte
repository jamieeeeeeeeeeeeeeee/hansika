<script>
    import Checkbox from "$lib/components/Checkbox.svelte";
    import { cluedoHideAll } from "$lib/store.js";
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
</script>

<main>
    <div class="navbar">
        <h1>Cluedo</h1>
        <div>
            <button on:click={() => {cluedoHideAll.update((v) => !v);}}>HIDE</button>
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
                    <Checkbox text={guest} />
                {/each}
            </div>
            <div>
                <h3>Weapons</h3>
                {#each weapons as weapon}
                    <Checkbox text={weapon} />
                {/each}
            </div>
        </div>
        <div>
            <h3>Rooms</h3>
            {#each rooms as room}
                <Checkbox text={room} />
            {/each}
        </div>
    </div>
</main>

<style>
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

    @media (max-width: 600px) {
        main {
            font-size: 1.5rem;
        }
    }

    /* make button look nice*/
    button {
        background-color: white;
        color: black;
        border: none;
        border-radius: 0.5em;
        padding: 0.5em;
        cursor: pointer;
    }
</style>