import { ItemView, WorkspaceLeaf } from 'obsidian';
import ConnectionsChatView from './connections-chat-view.svelte';

class ConnectionsChatComponent extends ItemView {
  constructor(leaf) {
    super(leaf);
  }

  getViewType() {
    return 'connections-chat-view';
  }

  getDisplayText() {
    return 'Smart Connections Chat';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    
    new ConnectionsChatView({
      target: container,
      props: {}
    });
  }

  async onClose() {
    // Cleanup logic if needed
  }
}

export default ConnectionsChatComponent;