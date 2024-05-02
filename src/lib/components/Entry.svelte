<script>
    export let text = "";
    export let type = "default";
    export let callback = function(){
      console.log("Callback function called.")
    };
    export let value = "";
</script>

<div
    tabindex="0"
    on:click={callback}
    on:keydown={(e) => {
        if (e.key === "Enter") {
            callback();
        }
    }}
    role="textbox"
    style={
    (type == "good" ? "background-color: rgb(120, 200, 61); border-color: rgb(108, 164, 48); color: white; width: 60vw;"
      : type == "select" ? "background-color: rgb(225, 243, 254); color: rgb(71, 152, 209); border-color: rgb(151, 214, 251);" : "")
    }
>
    <input type="text" placeholder={text} bind:value={value}/>
</div>

<style>
    input {
        font-size: 2em;
        border: none;
        background-color: transparent;
        width: 100%;
        text-align: left;
        padding: .5em 0;
        color: black;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        outline: none;
        font-weight: 500;

    }

    div {
        overflow: hidden;
        border: 3px solid grey;
        border-bottom-width: 5px;
        border-radius: 1em;
        font-size: 1.5rem;
        cursor: pointer;
        background-color: white;
        margin: .3em 0;
        display: flex;
        justify-content: center;
        transition: scale 0.2s ease-in;
        flex-direction: column;
        align-items: center;
        padding-left: 0.5em;
        padding-right: 0.1em;
        width: calc(100% - 0.6em);
    }

    div:active {
        scale: 0.98;
        transition: scale 0.2s ease-out;
    }
</style>
