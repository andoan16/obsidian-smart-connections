class MobileDetection {
  constructor(plugin) {
    this.plugin = plugin;
    this.storageKey = 'smart_connections_mobile_loaded';
  }

  isMobile() {
    return window.navigator.userAgent.includes('Mobile') ||
           window.navigator.userAgent.includes('Android') ||
           window.navigator.userAgent.includes('iPhone');
  }

  hasUserOptedToLoad() {
    if (!this.isMobile()) return true;
    
    const stored = localStorage.getItem(this.storageKey);
    return stored === 'true';
  }

  setUserOptedToLoad() {
    localStorage.setItem(this.storageKey, 'true');
  }

  shouldShowMobileWarning() {
    return this.isMobile() && !this.hasUserOptedToLoad();
  }

  resetUserPreference() {
    localStorage.removeItem(this.storageKey);
  }
}

module.exports = MobileDetection;