import { Notice } from 'obsidian';
import { get } from 'http';

export async function search_embeddings(query_embedding, k=10) {
  const plugin = window.ObsidianSmartConnectionsPlugin;
  if (!plugin) {
    console.error('Smart Connections plugin not found');
    return [];
  }

  try {
    // Check if we're using zvec
    if (plugin.settings.embedding_model.includes('zvec')) {
      return await search_zvec_embeddings(query_embedding, k);
    }
    
    // Existing search logic for other models
    const searchUrl = `${plugin.settings.api_url}/search`;
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query_embedding: query_embedding,
        k: k,
      }),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Error searching embeddings:', error);
    new Notice('Error searching embeddings');
    return [];
  }
}

async function search_zvec_embeddings(query_embedding, k) {
  const plugin = window.ObsidianSmartConnectionsPlugin;
  if (!plugin) {
    throw new Error('Smart Connections plugin not found');
  }

  try {
    // Zvec-specific search implementation
    const searchUrl = `${plugin.settings.zvec_api_url || plugin.settings.api_url}/search`;
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${plugin.settings.api_key}`
      },
      body: JSON.stringify({
        embedding: query_embedding,
        top_k: k,
        collection: plugin.settings.collection_name || 'documents'
      }),
    });

    if (!response.ok) {
      throw new Error(`Zvec search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform zvec response format to match existing expectations
    const transformedResults = data.results?.map(result => ({
      id: result.id,
      score: result.score,
      content: result.text || result.content,
      metadata: result.metadata || {}
    })) || [];

    return transformedResults;
  } catch (error) {
    console.error('Error in zvec search:', error);
    throw error;
  }
}

export async function hybrid_search(query, k=10) {
  const plugin = window.ObsidianSmartConnectionsPlugin;
  if (!plugin) {
    console.error('Smart Connections plugin not found');
    return [];
  }

  try {
    // Check if we're using zvec
    if (plugin.settings.embedding_model.includes('zvec')) {
      return await hybrid_search_zvec(query, k);
    }

    // Existing hybrid search logic
    const searchUrl = `${plugin.settings.api_url}/hybrid-search`;
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        k: k,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hybrid search failed: ${response.statusText}`);
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error('Error in hybrid search:', error);
    new Notice('Error performing hybrid search');
    return [];
  }
}

async function hybrid_search_zvec(query, k) {
  const plugin = window.ObsidianSmartConnectionsPlugin;
  if (!plugin) {
    throw new Error('Smart Connections plugin not found');
  }

  try {
    // Zvec hybrid search implementation
    const searchUrl = `${plugin.settings.zvec_api_url || plugin.settings.api_url}/hybrid-search`;
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${plugin.settings.api_key}`
      },
      body: JSON.stringify({
        query: query,
        top_k: k,
        collection: plugin.settings.collection_name || 'documents'
      }),
    });

    if (!response.ok) {
      throw new Error(`Zvec hybrid search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform zvec response format
    const transformedResults = data.results?.map(result => ({
      id: result.id,
      score: result.score,
      content: result.text || result.content,
      metadata: result.metadata || {}
    })) || [];

    return transformedResults;
  } catch (error) {
    console.error('Error in zvec hybrid search:', error);
    throw error;
  }
}