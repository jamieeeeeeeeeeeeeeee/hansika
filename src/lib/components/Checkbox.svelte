<script>
    export let text = "";

    let checkbox;
    let value = false;
    let indeterminate = false;
    let nextInter = true;

    function toggle() {
        if (value) {
            if (nextInter) {
                indeterminate = true;
                nextInter = false;
            } else {
                value = true;
                indeterminate = false;
                nextInter = true;
            }
        }
    }
</script>

<div>
    <label>
        <input
            type="checkbox"
            bind:this={checkbox}
            bind:checked={value}
            bind:indeterminate={indeterminate}
            on:change={toggle}
        />
        {text}
    </label>
</div>