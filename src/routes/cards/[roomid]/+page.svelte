<script>
    import { page } from '$app/stores';
    import { ws, check, send } from "$lib/websocket.js";
    import Card from "$lib/components/Card.svelte";
    import Hand from "$lib/components/Hand.svelte";
    import StatusButton from "$lib/components/StatusButton.svelte";
    import { trumpGame } from "$lib/store.js";
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';
   
    let roomid = $page.params.level;
    let status = {
        status: $page.url.searchParams.get("host"),
        buttons: [
            {text: "♠️", colour: "white", action: () => pickTrump("♠️")},
            {text: "♥️", colour: "black", action: () => pickTrump("♥️")},
            {text: "♣️", colour: "white", action: () => pickTrump("♣️")},
            {text: "♦️", colour: "black", action: () => pickTrump("♦️")}
        ]
    };
    if (status.status === null) {
        status.status = "Joining Game!";
    } else {
        status.status = "Creating Game!";
    }

    const updateGame = (data) => {
        // if trump mismatch, set as status
        if (data.turn === "opp" && data.trump !== trumpGame.trump) {
            status.status = "Opponent picked " + data.trump + "! Waiting for their move!";
        } 
        trumpGame.set(data);
    }

    onMount(() => {
        if (check()) {
            ws.onopen = () => {
                console.log('Connected to websocket');
            };

            ws.onmessage = (event) => {
                const { type, data } = JSON.parse(event.data);
                switch (type) { 
                    case "trumpGame":
                        trumpFlag = true;
                        trumpGame.set(data);
                        break;
                    case "error":
                    case "roomCheck":
                        if (data.message === "youOnly") {
                            status.status = "Waiting for Opponent!";
                        } else if (data.message === "bothTrump") {
                            status.status = "Pick the Trump Suit";
                        } else if (data.status === "bothOpp") {
                            status.status = "Opponent is picking Trump suit!";
                        } else if (data.status === 404) {
                            status.status = "(ERR 404) Room Not Found";
                            status.buttons = [
                                {text: "Back", colour: "white", action: () => goto("/cards")},
                            ]
                        }
                        break;
                    case "join": 
                        
                    default:
                        console.error("Unknown message type: " + type);
                }
            };
        } else {
            //alert("websocket not connected :(")
        }
    });
    
    onDestroy(() => {
        if (ws) {
            // unbind events
            ws.onopen = null;
            ws.onmessage = null;
            ws.onclose = null;
        }
    });

    send("roomCheck", { roomID: roomid });
</script>

<main style="justify-content: center;">
    <div>
        <div style="padding-top: 6rem;transform: rotateZ(180deg);">
            <Hand cards={Array.from({ length: $trumpGame.you.cards.length }, () => [...["H", "♥️"]])} hidden={true}/>
        </div>
        <div class="row" style="padding: 7rem 2rem;">
            <div class="column">
                <p style="margin-bottom: 0.5rem;">Trump</p>
                <span>{$trumpGame.trump}</span>
            </div>  
            <div class="row cardrow" >
                <Card value={$trumpGame.you.card[0]} suit={$trumpGame.you.card[1]} hidden={false} placeholder={true}/>
                <div style="transform: rotateZ(180deg);">
                <Card value={$trumpGame.opp.card[0]} suit={$trumpGame.opp.card[1]} hidden={false}/>
                </div>
            </div>  
            <div class="column">
                <span>{$trumpGame.opp.name} <b>({$trumpGame.opp.score})</b></span>
                <span style="margin: 1.5rem 0;"><b>VS</b></span>
                <span>{$trumpGame.you.name} <b>({$trumpGame.opp.score})</b></span>
            </div>    
        </div>
        <StatusButton status={status.status} buttons={status.buttons}/>
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