<script>
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";

    let user = $page.url.searchParams.get("user");
    export let form;
</script>

<main>
    <div id="container">
        <div id="left">
            <div>
                <div id="title">Login</div>
                {#if form?.error}
                <p id="error">{form.error}</p>
                {:else if user}
                    <p id="success">Signup worked :)</p>
                {:else} 
                    <p id="description">Welcome back!</p>
                {/if}     
            </div>
        </div>
        <div id="right">
            <form method="POST" use:enhance>
                <input
                    bind:value={user}
                    type="text"
                    placeholder="Username"
                    name="username"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                />
                <div class="flex-end">
                    <input type="submit" value="Login" />
                    <a href="/signup">Or sign up</a>
                </div>
            </form>
        </div>
    </div>
</main>

<style>
    .flex-end {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    .flex-end:nth-child(2) {
        justify-content: flex-end;
    }

    p {
        padding-bottom: 0;
        margin-bottom: 0;
    }

    main {
        background-color: #f1eaff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #container {
        display: flex;
        flex-direction: row;
        border-radius: 2em;
        padding: 1em;
        max-width: 60em;
        width: 70vw;
        justify-self: center;
        align-items: center;
        background-color: white;
    }

    #left {
        align-self: flex-start;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 0.5em;
        margin-bottom: 1rem;
        width: 120%;
    }

    #title {
        font-size: 3em;
        font-weight: 500;
        margin-bottom: 0.2em;
    }

    #description {
        font-weight: 400;
        color: grey;
    }

    #right {
        display: flex;
        flex-direction: column;
        padding: 0.5em;
        width: 180%;
        justify-content: right;
    }

    #error {
        color: #ee5d5d;
        font-weight: 400;
        margin-top: 1rem;
    }

    #success {
        color: rgb(122, 236, 122);
        font-weight: 400;
        margin-top: 1rem;
    }

    form {
        flex-direction: column;
        padding: 2em 2em;
    }

    input {
        font-size: 1em;
    }

    form > input[type="text"], form > input[type="password"] {
        border-radius: 0.5em;
        border: 1px solid rgb(128, 130, 128);
        font-weight: 600;
        margin-bottom: 1rem;
        padding: 1rem 0.6em;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 1.6rem;
    }

    input[type="submit"] {
        padding: 0.75em 1.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ff856f;
        color: #000;
        border-radius: 0.5em;
        cursor: pointer;
        transition: background-color 0.25s;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        border: none;
        font-weight: 700;
        margin-bottom: 0;
        border-radius: 2em;
    }

    input[type="submit"]:hover {
        background-color: #FF6347;
    }


    @media (max-width: 768px) {
        form > input {
            padding: 0.8rem 0.4em;
            font-size: 1rem;
        }

        #container {
            flex-direction: column;
        }

        #left {
            width: 100%;
            padding-bottom: 0;
        }

        #right {
            width: 100%;
            padding-top: 0;
        }
    }
</style>