class EmbeddingManager {
  constructor(plugin) {
    this.plugin = plugin;
    this.defaultModel = 'text-embedding-ada-002';
    this.supportedModels = [
      'text-embedding-ada-002',
      'text-embedding-3-small',
      'text-embedding-3-large'
    ];
  }

  getModel() {
    const settingsModel = this.plugin.settings.embedding_model;
    if (this.supportedModels.includes(settingsModel)) {
      return settingsModel;
    }
    return this.defaultModel;
  }

  getDimensions() {
    const model = this.getModel();
    switch (model) {
      case 'text-embedding-3-small':
        return 1536;
      case 'text-embedding-3-large':
        return 3072;
      default:
        return 1536;
    }
  }

  getMaxTokens() {
    const model = this.getModel();
    switch (model) {
      case 'text-embedding-ada-002':
        return 8191;
      case 'text-embedding-3-small':
      case 'text-embedding-3-large':
        return 8191;
      default:
        return 8191;
    }
  }

  isModelSupported(model) {
    return this.supportedModels.includes(model);
  }

  async validateApiKey(apiKey) {
    if (!apiKey) return false;
    
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
}

module.exports = EmbeddingManager;