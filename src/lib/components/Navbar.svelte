<script>
    import { page } from "$app/stores";
    import hr from "$lib/assets/hr.png";
</script>
<header>
    <div>
        <a href="/">
            <img id="HR" src={hr} alt="HR"/>
        </a>
    </div>
    <div class="HROFFSET"></div>
    <slot name="navbar"/>
    <div id="title">{$page.url.pathname}</div>
</header>

<style>
    img {
        width: 5rem;
        height: 5rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        position: relative;
        padding-top: 0;
        padding-bottom: 0;
    }

    #HR {
        font-family: 'Pacifico', cursive;
        cursor: pointer;
        font-size: 1.5rem;
        font-weight: bold;
        text-transform: uppercase;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        text-decoration: none;
        color: black;
    }


    #title {
        font-weight: bold;
    }

    @media (max-width: 768px) {


    }
</style>