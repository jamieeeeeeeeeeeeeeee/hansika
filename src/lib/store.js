import { writable } from "svelte/store";

const progress = writable({
  "done": 0,
  "total": 0,
  "thisTime": 0,
  "avgTime": 0
})

const options = writable([]);
const selectedOptions = writable(new Set());
const cluedoHideAll = writable(false);
const cluedoClearAll = writable(false);

const trumpGame = writable({
    you: {
        name: "OPP",
        score: 0,
        cards: [["H", "♥️"]],
        card: ["null", "null"],
    },
    opp: {
        name: "YOU",
        score: 0,
        card: ["null", "null"],
    },
    status: "Waiting for server!",
    trump: "♥️",
    turn: "initial"
});

export { 
    trumpGame, 
    progress, 
    options, 
    selectedOptions, 
    cluedoHideAll, 
    cluedoClearAll
};
