// 2026-02-24 Should be safe to remove, leaving temporarily
/**
 * @returns {Promise<string>} A promise that resolves to the .sc-list HTML string.
 */
export async function build_html(connections_list, opts = {}) {
  return `<div><div class="connections-list sc-list" data-key="${connections_list.item.key}"></div></div>`;
}

/**
 * @param {Array} connections_list - The results array.
 * @param {Object} [opts={}] - Optional parameters, including `opts.results`.
 * @returns {Promise<DocumentFragment>} A promise that resolves to the .sc-list fragment with appended children.
 */
export async function render(connections_list, opts = {}) {
  const html = await build_html.call(this, connections_list, opts);
  const frag = this.create_doc_fragment(html);
  const container = frag.querySelector('.connections-list');
  post_process.call(this, connections_list, container, opts);
  return container;
}

export async function post_process(connections_list, container, opts = {}) {
  container.dataset.key = connections_list.item.key;
  
  // Add loading state
  let loading_indicator = this.create_doc_fragment(`<div class="sc-loading">Loading...</div>`);
  container.appendChild(loading_indicator);
  
  try {
    const results = await connections_list.get_results(opts);
    // Remove loading indicator
    if (loading_indicator && loading_indicator.parentNode) {
      loading_indicator.parentNode.removeChild(loading_indicator);
    }
    
    if(!results || !Array.isArray(results) || results.length === 0) {
      const no_results = this.create_doc_fragment(`<p class="sc-no-results">No results found.<br><em>Try using the refresh button. If that doesn't work, try running "Clear sources data" and then "Reload sources" in the Smart Environment settings.</em></p>`);
      container.appendChild(no_results);
      return container;
    }
  const smart_components = connections_list.env.smart_components;
  const result_frags = await Promise.all(results.map(result => {
    return smart_components.render_component('connections_list_item_v3', result, {...opts});
  }));
  result_frags.forEach(result_frag => container.appendChild(result_frag));
  // Add any necessary post-processing here
  return container;
  } catch (error) {
    // Handle errors and remove loading indicator
    if (loading_indicator && loading_indicator.parentNode) {
      loading_indicator.parentNode.removeChild(loading_indicator);
    }
    const error_element = this.create_doc_fragment(`<p class="sc-error">Error loading results: ${error.message}</p>`);
    container.appendChild(error_element);
    console.error('Error in post_process:', error);
    return container;
  }
}

export const display_name = "List only";