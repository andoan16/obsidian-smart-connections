import { Notice } from 'obsidian';
import { SmartConnectionsSettings } from '../settings';

export class EmbeddingModel {
  constructor(settings) {
    this.settings = settings;
    this.model = null;
    this.tokenizer = null;
  }

  async initialize() {
    try {
      // Load model based on settings
      if (this.settings.embedding_model === 'TaylorAI/bge-micro-v2') {
        // Ensure default configuration exists
        const modelConfig = this.settings.modelConfig || {};
        const clusteringConfig = modelConfig.clustering || {};
        
        // Provide default values to prevent undefined errors
        const subgroupMinSize = clusteringConfig.subgroupMinSize ?? 10;
        
        // Use the safe value
        console.log('Subgroup min size:', subgroupMinSize);
      }
      
      // Initialize actual model here
      // this.model = await loadModel(this.settings.embedding_model);
      
    } catch (error) {
      console.error('Error initializing embedding model:', error);
      new Notice('Failed to initialize embedding model');
    }
  }

  async embed(text) {
    if (!this.model) {
      await this.initialize();
    }
    
    try {
      // Perform embedding
      // return await this.model.embed(text);
      return [];
    } catch (error) {
      console.error('Error generating embedding:', error);
      new Notice('Failed to generate embedding');
      return [];
    }
  }

  async embedBatch(texts) {
    if (!this.model) {
      await this.initialize();
    }
    
    try {
      // Perform batch embedding
      // return await this.model.embedBatch(texts);
      return [];
    } catch (error) {
      console.error('Error generating embeddings:', error);
      new Notice('Failed to generate embeddings');
      return [];
    }
  }
}