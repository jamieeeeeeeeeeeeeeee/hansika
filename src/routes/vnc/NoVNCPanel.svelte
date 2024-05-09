<!-- NoVNCPanel.svelte -->
<script>
    export let computer;
  </script>
  
  <div class="panel">
    <header class="panel-header">
      <span class="computer-name">{computer.name}</span>
      <button class="disconnect-button">Disconnect</button>
    </header>
    <div class="panel-content">
      <!-- noVNC canvas/display will go here -->
    </div>
  </div>
  
  <style>
    .panel {
      width: 800px;
      height: 600px;
      border: 1px solid #ccc;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background-color: #f0f0f0;
      border-bottom: 1px solid #ccc;
    }
  
    .computer-name {
      font-weight: bold;
    }
  
    .disconnect-button {
      background-color: #e74c3c;
      color: #fff;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .panel-content {
      height: calc(100% - 40px);
      /* Add noVNC canvas/display styles here */
    }
  </style>