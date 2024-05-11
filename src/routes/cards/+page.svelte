<script>
    import Button from "$lib/components/Button.svelte";
    import Entry from "$lib/components/Entry.svelte";
    
    import { onMount, onDestroy } from "svelte";
    import { ws, check, send } from "$lib/websocket.js";
    import { goto } from "$app/navigation";
    let joinableRooms = [];
    let username;


    onMount(() => {
        if (check()) {
            ws.onopen = () => {
                console.log('Connected to websocket');
            };

            ws.onmessage = (event) => {
                const { type, data } = JSON.parse(event.data);
                switch (type) {
                    case "rooms":
                        joinableRooms = data;
                        break;
                    case "room":
                        goto(`/cards/${data.room.id}?host=yes`);
                        break;
                    default:
                        console.error("Unknown message type: " + type);
                }
            };

            ws.onclose = () => {
                console.error('Websocket disconnected');
            };
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

    function createRoom() {
        send("create", { user: username, mode: "trumps" });
    }

    function joinRoom(roomId) {
        send("join", { room: roomId, username: username });
    }
</script>

<main>
    <div id="join">
        <div class="responsive">
            <div class="flex">
                <Entry text="Username" bind:value={username}/>
                <Button type="good" text="Create A Game" callback={createRoom}/>        
            </div>
            <div class="hr">OR</div>
            <div class="flex">
                <div id="title">
                    <h1>Join an Existing Game</h1>
                </div>
                <div id="games">
                    {#if joinableRooms.length == 0}
                    <div class="game">
                        <div class="game-info">
                            <span><b>No games available - create one below.</b></span>
                        </div>
                    </div>
                    {/if}
                    {#each joinableRooms as game}
                    <div class="game">
                        <div class="game-info">
                            <span>{game.id}</span>
                            <span>-</span>
                            <span>{game.users.length} players</span>
                        </div>
                        <div class="game-players">
                            {#each game.users as player}
                            <span>{player}</span>
                            {/each}
                        </div>
                        <button on:click={() => joinRoom(game.id)}>Join</button>
                    </div>
                    {/each}
                </div>    
            </div>
        </div>
    </div>
</main>

<style>
    #title > h1 {
        padding-top: 0;
        margin-top: 0;
    }

    #games {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 0 auto;
        overflow-y: scroll;
        max-height: calc(4.7 * 4rem);
    }

    .game {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: calc(100% - 2rem);
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        margin-bottom: 1rem;
        transition: transform 0.3s ease;
    }

    .game:first-child {
        margin-top: 0.25rem;
    }

    .game:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .game-info {
        display: flex;
        align-items: center;
    }

    .game-info span {
        margin-right: 0.5rem;
    }

    .game-players {
        display: flex;
        align-items: center;
    }

    .game-players span {
        margin-left: 0.5rem;
    }    
    
    main {
        background-color: #f0d0e0;
    }

    #join {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: calc(100% - 4rem);
        justify-self: center;
        align-self: center;
    }

    .responsive {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        margin: 0 auto;
    }

    .flex {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50%;
    }

    .hr {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000000;
        font-size: 1.5rem;
        margin: 4rem;
        margin-top: 4.5rem;
        font-weight: 600;
        position: relative;
    }

    @media (max-width: 1024px) {
        .responsive {
            flex-direction: column;
        }

        .flex {
            width: 100%;
        }
    }

    @media (max-width: 600px) {
        
        .game-players {
            flex-direction: column;
            align-items: flex-start;
        }

        .game-players span {
            margin-left: 0;
            margin-top: 0.5rem;
        }

        .game:hover {
            transform: translateY(0);
        }

        .game {
            margin-bottom: 0.5rem;
        }
    }
</style>
