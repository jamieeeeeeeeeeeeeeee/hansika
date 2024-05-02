<script>
  import { options, selectedOptions } from "$lib/store.js";
  import Button from "$lib/components/Button.svelte";
  export let mult = false;
  export let doubleClickCallback = function(){
      console.log("Callback function called.")
    };


  function optionClick(option) {
      if (mult) {
            if ($selectedOptions.has(option)) {
                $selectedOptions.delete(option);
            } else {
                $selectedOptions.add(option);
            }
      } else {
            if ($selectedOptions.has(option)) {
                doubleClickCallback();
            } else {
                selectedOptions.set(new Set([option]));
                console.log("Selected options: ", $selectedOptions);
            }
      }
  }
</script>

<div>
{#each $options as option}
    <Button
        type={$selectedOptions.has(option) ? "select" : ""}
        callback={() => optionClick(option)}
        text={option}
    />
{/each}
</div>

<style>
    div {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 1rem;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        align-items: center;
    }
</style>
