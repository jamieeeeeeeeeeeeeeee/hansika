<script>
    import { OpenAI } from "openai";
    import { afterUpdate, onDestroy } from 'svelte';
    import Highlight from "svelte-highlight";
    import github from "svelte-highlight/styles/github";
    import { python, javascript, css } from "svelte-highlight/languages";
    import { writable } from "svelte/store";
    import { browser } from "$app/environment";
    

    const languages = {
        "python": python,
        "javascript": javascript,
        "css": css
    };
    
    let openai = null;
    let apiKey = writable("");
    if (browser)
    if (localStorage.getItem("openai-api-key"))
        apiKey.set(localStorage.getItem("openai-api-key"));

    const unsub = apiKey.subscribe(value => {
        if (value) {
            console.log(value);
            if (browser)
                localStorage.setItem("openai-api-key", value);
            openai = new OpenAI({
                apiKey: value,
                dangerouslyAllowBrowser: true
            });
        }
    });

    const messages = [];
    let message = "";
    let messageDiv;

    async function generate() {
        if (!message || message.replaceAll(" ", "") === "") return;
        messages.push({ role: "user", content: message });
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            stream: true,
            messages: messages
        });
        message = "";

        messages.push({ role: "assistant", content: ""});
        for await (const msg of stream) {
            let chunk = msg.choices[0]?.delta?.content;
            if (chunk) messages[messages.length - 1].content += chunk;
        }
    }

    afterUpdate(() => {
        messageDiv.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
    });

    function getLanguage(lang) {
        if (lang in languages) return languages[lang];
        return python;
    }

    function contentToBlocks(content) {
        // split content into code and text
        const codeBlocks = [];
        let currentText = '';

        const regex = /```([\s\S]*?)```/g;
        let match;
        let lastIndex = 0;

        while ((match = regex.exec(content)) !== null) {
            // Push any text before the code block
            if (match.index > lastIndex) {
                currentText += content.slice(lastIndex, match.index);
            }

            if (currentText) {
                codeBlocks.push({ lang: null, txt: currentText.trim().replaceAll('\n', '<br><br>') });
                currentText = '';
            }

            // Extract the language and code from the code block
            const [_, codeBlock] = match;
            const [lang, ...codeLines] = codeBlock.split('\n');
            const code = codeLines.join('\n');

            codeBlocks.push({ lang: lang || null, txt: code.trim() });
            lastIndex = regex.lastIndex;
        }

        // Push any remaining text after the last code block
        if (lastIndex < content.length) {
            currentText += content.slice(lastIndex);
        }

        if (currentText) {
            codeBlocks.push({ lang: null, txt: currentText.trim().replaceAll('\n', '<br><br>') });
        }

        console.log(codeBlocks);
        return codeBlocks;
    }

    onDestroy(() => {
        unsub();
    });
</script>

<main>
    <div id="terminal">
        <div id="header">
            <div id="circlerow">
                <div class="circle red"></div>
                <div class="circle yellow"></div>
                <div class="circle green"></div>    
            </div>
            <div>
                <input id="apikey" type="text" placeholder="SK-*****-*************" bind:value={$apiKey} />
            </div>
        </div>
        <div id="messages" style="scroll-behavior: smooth;" bind:this={messageDiv}>
            {#each messages as { role, content }, i}
                <div>
                    <div class="message">
                        {#if role === "assistant"}
                            <div>
                                {#each contentToBlocks(content) as { lang, txt }}
                                    {#if lang === null}
                                        {@html txt}
                                    {:else}
                                        {@html github}
                                        <Highlight language={getLanguage(lang)} code={txt}/>
                                    {/if}
                                {/each}
                            </div>
                        {:else}
                            {role === "user" ? '> ' : ''}{content}
                        {/if}
                    </div>
                </div>
            {/each}
            <div id="input" 
                on:keydown={(e) => e.key === "Enter" && e.shiftKey === false && generate()}
                role="textbox"
                aria-multiline="true"
                tabindex="0"
            >
                <textarea id="message" bind:value={message} placeholder="Enter your message..."></textarea>
            </div>    
        </div>
    </div>
    <div class="message"><div></div></div>
</main>

<style>
    main {
        justify-content: center;
    }

    #circlerow {
        display: flex;
        align-items: center;
    }

    .circle {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        display: inline-block;
        margin: 0 0.1rem;
    }

    #header {
        padding: 0.5rem;
        background-color: white;
        border-top-left-radius: 1em;
        border-top-right-radius: 1em;
        border-bottom: 2px solid black;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #apikey {
        border: none;
        outline: none;
        background-color: transparent;
        font-family: "Courier New", Courier, monospace;
        font-size: 1rem;
        width: 100%;
        max-width: 6rem;
    }

    .red {
        background-color: #ff5f56;
    }

    .yellow {
        background-color: #ffbd2e;
    }

    .green {
        background-color: #27c93f;
    }

    #messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        background-color: black;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;

    }

    #terminal {
        display: flex;
        flex-direction: column;
        width: calc(100% - 4rem);
        height: calc(100% - 4rem);
        align-self: center;
    }

    #messages {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
        background-color: #000;
        font-family: "Courier New", Courier, monospace;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
    }

    #input {
        display: flex;
        align-items: center;
        background-color: #000;
    }

    #input textarea {
        flex: 1;
        background-color: transparent;
        color: white;
        font-family: "Courier New", Courier, monospace;
        border: none;
        outline: none;
        resize: none;
        padding-left: 1.25rem;
    }

    #input textarea::placeholder {
        color: black;
        padding-top: 0.5rem;
    }

    #input textarea:focus {
        outline: none;
    }

    .message {
        color: white;
    }

    .message > * {
        color: inherit;
        color: white;
    }
</style>

