import { StoryModal } from 'obsidian-smart-env/src/modals/story.js';

function showMobileLoadPrompt(plugin) {
  if (!plugin.env.is_mobile || plugin.settings.mobileEnvLoaded) return false;
  
  const prompt = document.createElement('div');
  prompt.className = 'mobile-load-prompt';
  prompt.innerHTML = `
    <div class="callout" data-callout="warning">
      <div class="callout-title">
        <div class="callout-icon">⚠️</div>
        <div class="callout-title-inner">Smart Environment Deferred on Mobile</div>
      </div>
      <div class="callout-content">
        <p>Smart Connections environment is deferred on mobile to improve app performance.</p>
        <button class="mobile-load-button">Load Smart Environment</button>
      </div>
    </div>
  `;
  
  const loadButton = prompt.querySelector('.mobile-load-button');
  loadButton?.addEventListener('click', async () => {
    plugin.settings.mobileEnvLoaded = true;
    await plugin.saveSettings();
    prompt.remove();
    // Reload or initialize the environment
    if (plugin.env) {
      await plugin.env.initialize();
    }
  });
  
  return prompt;
}

async function build_html(scope_plugin) {
  const mobilePrompt = showMobileLoadPrompt(scope_plugin);
  
  return `
    <div>
      ${mobilePrompt ? '<div id="mobile-load-container"></div>' : ''}
      <div data-user-agreement></div>
      <div class="actions-container">
        <button class="sc-getting-started-button">Getting started guide</button>
        <button class="sc-report-bug-button">Report a bug</button>
        <button class="sc-request-feature-button">Request a feature</button>
        <button class="sc-share-workflow-button">Share workflow ⭐</button>
      </div>
      <div id="smart-lookup-header-callout"></div>
    </div>
  `;
}

export async function render(scope_plugin) {
  const html = await build_html.call(this, scope_plugin);
  const frag = this.create_doc_fragment(html);
  const container = frag.firstElementChild;
  post_process.call(this, scope_plugin, container);
  return container;
}

export async function post_process(scope_plugin, frag) {
  // Insert mobile load prompt if needed
  const mobileContainer = frag.querySelector('#mobile-load-container');
  if (mobileContainer && !scope_plugin.settings.mobileEnvLoaded) {
    const prompt = showMobileLoadPrompt(scope_plugin);
    if (prompt) {
      mobileContainer.appendChild(prompt);
    }
  }

  /* user agreement & env settings */
  const user_agreement_container = frag.querySelector('[data-user-agreement]');
  if (user_agreement_container) {
    const user_agreement = await scope_plugin.env.smart_components.render_component(
      'user_agreement_callout',
      scope_plugin
    );
    user_agreement_container.appendChild(user_agreement);
  }

  /* header external links */
  const header_link = frag.querySelector('#header-callout a');
  if (header_link) {
    header_link.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(header_link.href, '_external');
    });
  }

  /* buttons */
  frag.querySelector('.sc-getting-started-button')?.addEventListener('click', () => {
    StoryModal.open(scope_plugin, {
      title: 'Getting Started With Smart Connections',
      url: 'https://smartconnections.app/story/smart-connections-getting-started/?utm_source=sc-op-settings'
    });
  });

  frag.querySelector('.sc-report-bug-button')?.addEventListener('click', () => {
    if (scope_plugin.env?.is_pro) {
      new ScProSupportModal(scope_plugin.app).open();
      return;
    }
    window.open(
      'https://github.com/brianpetro/obsidian-smart-connections/issues/new?template=bug_report.yml',
      '_external'
    );
  });

  frag.querySelector('.sc-request-feature-button')?.addEventListener('click', () => {
    window.open(
      'https://github.com/brianpetro/obsidian-smart-connections/issues/new?template=feature_request.yml',
      '_external'
    );
  });

  frag.querySelector('.sc-share-workflow-button')?.addEventListener('click', () => {
    window.open(
      'https://github.com/brianpetro/obsidian-smart-connections/discussions/new?category=showcase',
      '_external'
    );
  });

  const smart_lookup_header_callout = frag.querySelector('#smart-lookup-header-callout');
  if (smart_lookup_header_callout) {
    const smart_lookup_callout = await scope_plugin.env.smart_components.render_component(
      'connections_settings_lookup_callout',
      scope_plugin
    );
    smart_lookup_header_callout.appendChild(smart_lookup_callout);
  }


  return frag;
}

import { Modal } from 'obsidian';
// Obsidian Modal that says "Need help and support? Reply to your Pro welcome email for priority support."
export class ScProSupportModal extends Modal {
  open() {
    super.open();
    this.titleEl.setText('Need help and support?');
    const content = this.contentEl.createDiv({ cls: 'sc-pro-support-modal' });
    content.createEl('p', {
      text: 'Reply to your Smart Environment Pro welcome email for priority support.',
    });
    // continue to report a bug button
    const reportBugButton = content.createEl('button', { text: 'Report a bug', cls: 'mod-warning' });
    reportBugButton.addEventListener('click', () => {
      window.open(
        'https://github.com/brianpetro/obsidian-smart-connections/issues/new?template=bug_report.yml',
        '_external'
      );
    });
    const closeButton = content.createEl('button', { text: 'Close' });
    closeButton.addEventListener('click', () => {
      this.close();
    });
  }
}