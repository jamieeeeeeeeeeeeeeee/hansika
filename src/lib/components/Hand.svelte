<script>
    import Card from "$lib/components/Card.svelte";
    // This component will have maximum of 7 cards
    export let hidden = false;
    export let cards = [
        ["A", "♠️"],
        ["K", "d"],
        ["Q", "♥️"],
        ["J", "♠️"],
        ["8", "♠️"],
        ["4", "c"],
        ["5", "h"],
    ]
    export let callback = () => {
        console.log("Callback called");
    }

    function cardCallback(index) {
        console.log("Card callback called");
    }
</script>

<div id="hand">
    {#each cards as [value, suit], i}
    <div class={"card-" + i}>
        <Card value={value} suit={suit} placeholder={false} hidden={hidden}/>
    </div>
    {/each}
</div>

<style>
    #hand {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 2rem;
    }

    .card-0 {
        position: absolute;
        transform: translateX(-105px);
    }

    .card-1 {
        position: absolute;
        transform:  translateX(-70px);
    }

    .card-2 {
        position: absolute;
        transform:  translateX(-35px);
    }

    .card-3 {
        position: absolute;
        transform:  translateX(0px);
    }

    .card-4 {
        position: absolute;
        transform:  translateX(35px);
    }

    .card-5 {
        position: absolute;
        transform: translateX(70px);
    }

    .card-6 {
        position: absolute;
        transform: translateX(105px);
    }
</style>