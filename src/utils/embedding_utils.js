import { Notice } from 'obsidian';

export class EmbeddingUtils {
  constructor(plugin) {
    this.plugin = plugin;
  }

  async processEmbeddings(content) {
    // Check notification preference before showing any notices
    if (!this.plugin.settings.showNotifications) {
      return;
    }

    try {
      new Notice('Processing embeddings...', 3000);
      // Processing logic here
    } catch (error) {
      new Notice('Error processing embeddings: ' + error.message);
    }
  }

  showSummaryNotification(processedCount, errorCount) {
    // Respect user notification preferences
    if (!this.plugin.settings.showNotifications) {
      return;
    }

    let message = `Embedding processing complete.`;
    if (processedCount > 0) {
      message += ` Processed ${processedCount} items.`;
    }
    if (errorCount > 0) {
      message += ` ${errorCount} errors occurred.`;
    }
    
    new Notice(message, 5000);
  }

  showErrorNotification(error) {
    // Only show error notifications if enabled
    if (!this.plugin.settings.showNotifications) {
      return;
    }

    new Notice(`Embedding error: ${error.message}`, 5000);
  }
}