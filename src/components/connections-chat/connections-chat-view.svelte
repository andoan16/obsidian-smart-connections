<script>
  import { onMount } from 'svelte';
  import MessageHandler from './message-handler.js';
  
  let messages = [];
  let userInput = '';
  let isLoading = false;
  
  const messageHandler = new MessageHandler();
  
  async function sendMessage() {
    if (!userInput.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    messages = [...messages, userMessage];
    userInput = '';
    isLoading = true;
    
    try {
      const response = await messageHandler.processMessage(userMessage.text);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      messages = [...messages, botMessage];
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}`,
        sender: 'error',
        timestamp: new Date()
      };
      
      messages = [...messages, errorMessage];
    } finally {
      isLoading = false;
    }
  }
  
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="connections-chat-container">
  <div class="chat-messages">
    {#each messages as message (message.id)}
      <div class={`message ${message.sender}`}>
        <div class="message-text">{message.text}</div>
        <div class="message-timestamp">{message.timestamp.toLocaleTimeString()}</div>
      </div>
    {/each}
    
    {#if isLoading}
      <div class="message bot">
        <div class="message-text">Thinking...</div>
      </div>
    {/if}
  </div>
  
  <div class="chat-input-container">
    <textarea
      bind:value={userInput}
      on:keydown={handleKeyDown}
      placeholder="Ask something about your notes..."
      disabled={isLoading}
    ></textarea>
    <button 
      on:click={sendMessage} 
      disabled={!userInput.trim() || isLoading}
      class="send-button"
    >
      Send
    </button>
  </div>
</div>

<style>
  .connections-chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .message {
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 4px;
  }
  
  .message.user {
    background-color: var(--interactive-accent);
    color: white;
    align-self: flex-end;
    text-align: right;
  }
  
  .message.bot {
    background-color: var(--background-secondary);
    border: 1px solid var(--border-color);
  }
  
  .message.error {
    background-color: #ff3333;
    color: white;
  }
  
  .message-text {
    margin-bottom: 4px;
  }
  
  .message-timestamp {
    font-size: 0.7em;
    opacity: 0.7;
  }
  
  .chat-input-container {
    display: flex;
    gap: 10px;
  }
  
  textarea {
    flex: 1;
    resize: none;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }
  
  .send-button {
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    background-color: var(--interactive-accent);
    color: white;
    cursor: pointer;
  }
  
  .send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>