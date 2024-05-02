<script>
    import Options from "$lib/components/Options.svelte";
    import india from "$lib/assets/india.png";
    import Button from "$lib/components/Button.svelte";
    import { writable } from "svelte/store";
    import { progress, options, selectedOptions } from "$lib/store.js";
    import { page } from "$app/stores";
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";

    let level  = $page.params.level;
    const info = writable({"info": "", "color": "green", "showing": false, "button": "CHECK"})
    const answer = writable("");
    const question = writable("");

    export const levels = [
        "vowels",
        "consonants"
    ];

    const docs = {};

    function generateQuestion() {
        // So docs now have the id of english translation, with .translation as Odia.
        // so let us pick  4 random options from docs.
        const keys = Object.keys(docs);
        let answerDoc = "";
        const randomKeys = [];
        while (randomKeys.length < 4) {
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            if (!randomKeys.includes(docs[randomKey].t)) {
                randomKeys.push(docs[randomKey].t);
                answerDoc = randomKey;
            }
        }
        
        // set options to randomKeys
        options.set(randomKeys.sort(() => Math.random() - 0.5));
        answer.set(answerDoc);
        question.set('Translate to English: ' + answerDoc);
        progress.update((p) => {
            return {
                done: p.done,
                total: p.total,
                thisTime: 0,
                avgTime: p.avgTime
            };
        });
    }

    // get .json file
    // it is in static "/odia-lang/{level}.json"
    // the format is: 
    // "ଅ": {"t": "a", "e": "(a)bout"},
    // where t is translit, and e is british-english example.

    async function fetchJson() {
        for (const key in docs) {
            delete docs[key];
        }
        progress.update((p) => {
            return {
                done: 0,
                total: 0,
                thisTime: 0,
                avgTime: 0
            };
        });
        const res = await fetch(`/odia-lang/${level}.json`);
        const data = await res.json();
        Object.keys(data).forEach((key) => {
            docs[key] = data[key];
        });
        console.log(docs);
        generateQuestion();
    }

    onMount(async () => {
        fetchJson();
    });

    let interval;

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });

    interval = setInterval(() => {
        if ($info.showing) return;
        progress.update((p) => {
            return {
                done: p.done,
                total: p.total,
                thisTime: p.thisTime + 1/100,
                avgTime: p.avgTime
            };
        });
    }, 10);

    function buttonClick() {
        if ($info.showing == false) { // i.e. answer
            if ($selectedOptions.has(docs[$answer].t)) {
            progress.update((p) => {
                return {
                    done: p.done + 1,
                    total: p.total + 1,
                    thisTime: p.thisTime,
                    avgTime: (p.avgTime * (p.done) + (p.thisTime)) / (p.done + 1)
                };
            });
            info.update((i) => {
                return {
                    info: "Correct!",
                    button: "NEXT",
                    color: "#046A38",
                    showing: true
                };
            })
            } else {
            progress.update((p) => {
                return {
                    done: p.done,
                    total: p.total + 1,
                    thisTime: 0,
                    avgTime: p.avgTime
                };
            });
            info.update((i) => {
                return {
                    info: $answer + " is ( " + docs[$answer].t + " )  as in " + docs[$answer].e,
                    button: "NEXT QUESTION",
                    color: "#FF671F",
                    showing: true
                };
            });
            }

        } else {
            selectedOptions.set(new Set());
            info.update((i) => {
                return {
                    info: "",
                    button: "CHECK",
                    color: "green",
                    showing: false
                };
            });
            generateQuestion();
        }
    }

    function redirect(e) {
        goto(`/odia/${e.target.value}`);
        fetchJson();
    }
</script>

<main>
{#if $question == ""}
        <div id="question">
            Loading...
        </div>
    {:else}
        <div id="question">{$question}</div>
    {/if}
    <div id="center">
        <Options doubleClickCallback={buttonClick}/>
    </div>
    <div
    id="info"
    style={!$info.showing ? "" : "background-color: " + $info.color + ";"}
>
    <div style="{$info.color == "#046A38" ? "color: white;" : ""} margin: 1rem; min-width: 10rem; height: 2rem;" id="infoinfo">{$progress.total == 0 ? "Choose a category below." : ""} {$info.showing ? $info.info : ""}</div>
    <Button text={$info.button} type="good" callback={buttonClick}/>
</div>    
</main>
<footer>
    <div id="hansika">For Hansika ❤️</div>
    <select bind:value={level} on:change={redirect}>
        {#each levels as l}
                <option value={l}>{l}</option>
        {/each}
    </select>
    <div id="lang">
        <div>ଓଡ଼ିଆ<br>Odia</div>
        <img width={50} src={india} alt='India' />
    </div>
</footer>

<style>
    select {
        font-family: "Outfit", sans-serif;
        font-size: 1rem;
        padding: 0.5rem;
        border: none;
        background-color: white;
    }

    option {
        font-family: "Outfit", sans-serif;
        padding: 0.5rem;
        background-color: white;
        color: #333;
    }

    #info {
        padding-bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #infoinfo {
        font-size: 1.7rem;
        align-self: flex-start;
        justify-self: flex-start;
    }

    #center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        align-self: center;
        justify-self: center;
        width: 50vw;
    }

    #question {
        align-self: flex-start;
        margin-left: 1rem;
        min-width: 25rem;
        margin-top: 1rem;
        font-size: 3rem;
    }

    footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        height: 3vh;
        background-color: white;
    }

    #hansika {
        font-weight: 700;
    }

    #lang {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #lang img {
        margin-left: .5rem;
    }
</style>
