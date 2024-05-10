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
export { progress, options, selectedOptions, cluedoHideAll};
