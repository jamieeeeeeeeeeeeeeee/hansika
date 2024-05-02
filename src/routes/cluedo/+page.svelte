<script>
    import Checkbox from "$lib/components/Checkbox.svelte";

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
</script>

<main>
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

    @media (max-width: 768px) {
    }
</style>