<script>
    import { page } from "$app/stores";
</script>
<header>
    <a id="HR" href="/">H</a>
    <slot name="navbar"/>
    <div id="title">{$page.url.pathname}</div>
</header>

<style>
 header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: white;
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

 #HR:after {
    content: "ansika Ray";
 }

 #title {
    font-weight: bold;
 }

 @media (max-width: 768px) {
    #HR:after {
        content: "R";
    }

    #title {
        display: none;
    }
 }
</style>