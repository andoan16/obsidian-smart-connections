import { DEFAULT_SETTINGS } from '../constants';

export class SettingsManager {
  constructor(plugin) {
    this.plugin = plugin;
    this.settings = {};
  }

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.plugin.loadData()
    );
    
    // Migrate embedding model settings if needed
    if (!this.settings.embeddingModels) {
      this.settings.embeddingModels = DEFAULT_SETTINGS.embeddingModels;
      await this.saveSettings();
    }
  }

  async saveSettings() {
    await this.plugin.saveData(this.settings);
  }

  getEmbeddingModelPreferences() {
    return this.settings.embeddingModels || DEFAULT_SETTINGS.embeddingModels;
  }

  updateEmbeddingModelPreferences(preferences) {
    // Validate model choices
    const validModels = [
      'text-embedding-ada-002',
      'text-embedding-3-small',
      'text-embedding-3-large'
    ];
    
    if (preferences.model && !validModels.includes(preferences.model)) {
      throw new Error(`Invalid embedding model: ${preferences.model}`);
    }
    
    this.settings.embeddingModels = {
      ...this.settings.embeddingModels,
      ...preferences
    };
    
    return this.saveSettings();
  }

  getSetting(key) {
    return this.settings[key];
  }

  setSetting(key, value) {
    this.settings[key] = value;
    return this.saveSettings();
  }
}