interface IBrowserInfo { 
    name:Browsers; 
    version:number; 
};


enum Browsers {
    Firefox = "Firefox", 
    Chrome = "Chrome", 
    Edge = "Edge",
    Opera = "Opera", 
    Safari = "Safari", 
    Other = "Other"
};
var logDisabled_ = true;
var deprecationWarnings_ = true;

// Utility methods.
var utils = {
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  /**
   * Disable or enable deprecation warnings
   * @param {!boolean} bool set to true to disable warnings.
   */
  disableWarnings: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'detector deprecation warnings ' + (bool ? 'disabled' : 'enabled');
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Shows a deprecation warning suggesting the modern and spec-compatible API.
   */
  deprecated: function(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
        ' instead.');
  },

  /**
   * Extract browser version out of the provided user agent string.
   *
   * @param {!string} uastring userAgent string.
   * @param {!string} expr Regular expression used as match criteria.
   * @param {!number} pos position in the version string to be returned.
   * @return {!number} browser version.
   */
  extractVersion: function(uastring, expr, pos) {
    const match = uastring.match(expr);
    return match && match.length >= pos && parseInt(match[pos], 10);
  },

  

};


export function DetectBrowser() : IBrowserInfo {
   const result = {
      name : Browsers.Other,
      version: null
    };
    
    if (typeof window === 'undefined' || !window.navigator) {
      return result;
    }
    const { navigator } = window;


    // Firefox.
    if ((navigator as any).mozGetUserMedia) {
      result.name = Browsers.Firefox;
      result.version = utils.extractVersion(navigator.userAgent,
          /Firefox\/(\d+)\./, 1);
    } else if ((navigator as any).webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
      if ((window as any).webkitRTCPeerConnection) {
        result.name = Browsers.Chrome;
        result.version = utils.extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/(\d+)\./, 2);
      } else { // Safari (in an unpublished version) or unknown webkit-based.
        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
          result.name = Browsers.Safari;
          result.version = utils.extractVersion(navigator.userAgent,
            /AppleWebKit\/(\d+)\./, 1);
        } else { 
          return result;
        }
      }
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
      result.name = Browsers.Edge;
      result.version = utils.extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
      result.name = Browsers.Safari;
      result.version = utils.extractVersion(navigator.userAgent,
          /AppleWebKit\/(\d+)\./, 1);
    } else { 
      return result;
    }

    return result;
};
