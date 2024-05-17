<script>
    import { onMount } from 'svelte'
    import Highlight, { LineNumbers } from 'svelte-highlight'
    import github from 'svelte-highlight/styles/github'
    import { cpp } from 'svelte-highlight/languages'
    export let gistId = '096e8a5c0a803bd5339e6a770222592e'
    import download from "$lib/assets/download.svg";

    let code = "";
    onMount(async () => {
        const gistUrl = `https://api.github.com/gists/${gistId}`;
    
        try {
            const response = await fetch(gistUrl);
            const gistData = await response.json();
    
            const fileNames = Object.keys(gistData.files);
            if (fileNames.length > 0) {
                const firstFileName = fileNames[0];
                const gistContent = gistData.files[firstFileName].content;
    
                code = gistContent;
            }
        } catch (error) {
            console.error('Error fetching the Gist:', error);
        }
    });
    </script>

<div id="main">
    <div id="header">
        <b>logger.c</b> compile with <b>gcc -ws2_32 logger.c</b>
        <a href="logger.c" download="logger.c">
            <img src={download} alt="download">
        </a>
    </div>
    <div id="code">
        {@html github}
        <Highlight language={cpp} code={code} let:code />
    </div>
</div>

<style>
    #main {
        display: flex;
        flex-direction: column;
        overflow: auto;
        background-color: #f6f8fa;
        padding: 16px;
        border-radius: 6px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        line-height: 1.5;
        font-size: 12px;
        color: #24292e;
        overflow-y: hidden;
        height: 100%;
        width: 100%;
    }

    #code {
        min-height: 100%;
        max-height: 200%;
        overflow-y: auto;
        
    }

    @media (min-width: 769px) {
        #code {
            max-height: 0;

        }

        #main {
            width: 45vw;
        }
    }

    #header{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    img {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        filter: invert(1);
    }


</style>