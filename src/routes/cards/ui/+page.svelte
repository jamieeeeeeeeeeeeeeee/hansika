<script>
    import Card from "$lib/components/Card.svelte";
    import Hand from "$lib/components/Hand.svelte";
    import StatusButton from "$lib/components/StatusButton.svelte";
    import { trumpGame } from "$lib/store.js";

    function pickTrump(trump) {
        $trumpGame.pickTrump(trump);
    }
</script>

<main style="justify-content: center;">
    <div>
        <div style="padding-top: 6rem;transform: rotateZ(180deg);">
            <Hand cards={Array.from({ length: $trumpGame.you.cards.length }, () => [...["H", "♥️"]])} hidden={true}/>
        </div>
        <div class="row" style="padding: 7rem 2rem;">
            <div class="column">
                <p>Trump</p>
                <span>{$trumpGame.trump}</span>
            </div>  
            <div class="row cardrow" >
                <Card value={$trumpGame.you.card[0]} suit={$trumpGame.you.card[1]} hidden={false} placeholder={true}/>
                <div style="transform: rotateZ(180deg);">
                <Card value={$trumpGame.opp.card[0]} suit={$trumpGame.opp.card[1]} hidden={false}/>
                </div>
            </div>  
            <div class="column">
                <p>Score</p>
                <span><b>{$trumpGame.you.score} : {$trumpGame.you.score}</b></span>
            </div>    
        </div>
        <StatusButton status="Pick the Trump Suit" buttons={[
            {text: "♠️", colour: "white", action: () => pickTrump("♠️")},
            {text: "♥️", colour: "black", action: () => pickTrump("♥️")},
            {text: "♣️", colour: "white", action: () => pickTrump("♣️")},
            {text: "♦️", colour: "black", action: () => pickTrump("♦️")}
        ]}/>
        <div style="margin-top:6rem;">
            <Hand cards={$trumpGame.you.cards} hidden={false}/>
        </div>    
    </div>
</main>

<style>
    .column {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    p {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cardrow {
        gap: 1rem;
    }
</style>