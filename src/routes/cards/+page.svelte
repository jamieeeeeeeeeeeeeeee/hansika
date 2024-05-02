<script>
    import Button from "$lib/components/Button.svelte";
    import Entry from "$lib/components/Entry.svelte";
    import { browser } from '$app/environment';

    let screen = "join";
    let joinableRooms = [];
    let room = {
        id: "",
        mode: "",
        users: [],
    }
    let username;

    
    if (browser) {
        const websocket = new WebSocket('ws://' + window.location.host + '/ws');
        websocket.onopen = () => {
            console.log('Connected to websocket');
        };
    }

    /*function createRoom() {
        ws.emit("create", username, "trumps");
    }

    function joinRoom(roomId) {
        ws.emit("join", roomId, username);
    }

    ws.on("joinableRooms", (rooms) => {
        joinableRooms = rooms;
    });

    ws.on("room", (resp) => {
        console.log(resp);
        if (resp.status == 201) { // Resource created
            room = resp.body.room;
            user = resp.body.user;
            host = resp.body.host;
            screen = "room";
        }
    });*/
</script>

<main>
    {#if screen == "join"}
    <div id="join">
        <div class="responsive">
            <div class="flex">
                <Entry text="Username" bind:value={username}/>
                <Button type="good" text="Create A Game"/>        
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
                            <span>{game.players.length} players</span>
                        </div>
                        <div class="game-players">
                            {#each game.players as player}
                            <span>{player}</span>
                            {/each}
                        </div>
                    </div>
                    {/each}
                </div>    
            </div>
        </div>
    </div>
    {:else if screen == "room"}
    <div id="room">
        <h1>Room {room.id}</h1>
        <div id="players">
            {#each room.users as player}
            <div>{player}</div>
            {/each}
        </div>  
    </div>
    {:else if screen == "game"}
    <div id="game">
        <h1>Game {room.id}</h1>
        <div id="players">
            {#each room.users as player}
            <div>{player}</div>
            {/each}
        </div>
    </div>
    {/if}
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
