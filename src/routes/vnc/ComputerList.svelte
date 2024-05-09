<!-- ComputerList.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    const computers = [
      { id: 1, name: 'Computer 1' },
      { id: 2, name: 'Computer 2' },
      { id: 3, name: 'Computer 3' },
      // Add more computers as needed
    ];
  
    function handleComputerClick(computer) {
      dispatch('computerSelected', computer);
    }
  </script>
  
  <ul>
    {#each computers as computer}
      <li on:click={() => handleComputerClick(computer)}>{computer.name}</li>
    {/each}
  </ul>
  
  <style>
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
  
    li {
      padding: 8px 12px;
      cursor: pointer;
    }
  
    li:hover {
      background-color: #e0e0e0;
    }
  </style>