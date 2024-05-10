<script>
    import Button from "$lib/components/Button.svelte";
    import india from "$lib/assets/india.png";
    import cluedo from "$lib/assets/cluedo.jpg";
    import remote from "$lib/assets/remote.jpg";
    import { goto } from "$app/navigation";

    function redirect(link) {
        goto(link);
    }
</script>

<main>
    <div class="grid">
        <Button text="" img="cardthumb.png" type="img" callback={() => redirect("/cards")}/>
        <Button text="" img={india} type="img" callback={() => redirect("/odia/vowels")}/>
        <Button text="" img={cluedo} type="img" callback={() => redirect("/cluedo")}/>
        <Button text="" img={remote} type="img" callback={() => redirect("/vnc")}/>
    </div>
</main>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        padding: 1rem;
    }

    @media (max-width: 900px) {
        .grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    @media (max-width: 600px) {
        .grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
