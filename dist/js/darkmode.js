/*!
  * Bootstrap v5.3.4 (https://chanrycz.com/assets/css/theme.css) - CHANRYCZ (https://chanrycz.com)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors), Ryan C.
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.darkmode = factory());
})(this, (function () { 'use strict';

    /**
     * *bootstrap-dark-5* `darkmode.js` -- the JavaScript module - Modified by Ryan C.
     *
     * **DarkMode**
     *
     * Use this JS file, and its `darkmode` object, in your HTML to automatically capture `prefers-color-scheme` media query
     * events and also initialize tags with the `data-bs-theme` attribute, or the document root (`<HTML>` tag) with the
     * user preferred color scheme.
     *
     * The `darkmode` object can also be used to drive a dark mode toggle event, with optional persistance
     * storage in either a cookie (if GDPR consent is given) or the browsers `localStorage` object.
     *
     * The module can be loaded into a html page using a standard script command.
     * ```html
     * <script src="darkmode.js"></script>
     * ```
     *
     * This will create a variable `darkmode` that is an instance of the DarkMode class.
     *
     * Once the DOM is loaded the script will then look for any html tag with a `data-bs-theme` attribute, and, if found
     * will use these tags to populate the current mode.  If this data attribute is not found then the script will use the document
     * root (`<HTML>` tag) with the `data-bs-theme` attribute with a value of `light` or `dark`
     *
     * You can also pre-initialize the mode by populating the data attribute:
     *
     * ```html
     * <html lang="en" data-bs-theme="dark">
     * ```
     *
     * @module DarkMode
     * @_author Vino Rodrigues, Ryan C.
     */
    class DarkMode {
      /**
       * ***property***
       *
       * Used to get the current state, `true` when in dark mode, `false` when in light mode or when mode not set
       *
       * Can also be used to set the current mode *(with no persistance saving)*
       *
       * @example <caption>Get if page is in "Dark" mode</caption>
       * var myVal = darkmode.inDarkMode;
       *
       * @example <caption>Set the page to the "Dark" mode</caption>
       * darkmode.inDarkMode = true;
       *
       * @public
       * @type {boolean}
       */
      get inDarkMode() {
        return DarkMode.getColorScheme() === DarkMode.VALUE_DARK;
      }
      set inDarkMode(val) {
        this.setDarkMode(val, false);
      }

      /** @private */

      /**
       * Variable to store GDPR Consent.  This setting drives the persistance mechanism.
       *
       * Used in {@link #saveValue} to determine if a cookie or the `localStorage` object should be used.
       * * Set to `true` when GDPR Consent has been given to enable storage to cookie *(useful in Server-Side knowledge of user preference)*
       * * The setter takes care of swapping the cookie and localStorage if appropriate
       * * Default is `false`, thus storage will use the browsers localStorage object *(Note: No expiry is set)*
       *
       * @example <caption>Set once GDPR consent is given by the user</caption>
       * darkmode.hasGDPRConsent = true;
       */
      get hasGDPRConsent() {
        return this._hasGDPRConsent;
      }
      set hasGDPRConsent(val) {
        this._hasGDPRConsent = val;
        if (val) {
          // delete cookie if it exists
          const prior = DarkMode.readCookie(DarkMode.DATA_KEY);
          if (prior) {
            DarkMode.saveCookie(DarkMode.DATA_KEY, '', -1);
            localStorage.setItem(DarkMode.DATA_KEY, prior);
          }
        } else {
          // delete localStorage if it exists
          const prior = localStorage.getItem(DarkMode.DATA_KEY);
          if (prior) {
            localStorage.removeItem(DarkMode.DATA_KEY);
            DarkMode.saveCookie(DarkMode.DATA_KEY, prior);
          }
        }
      }

      /** Expiry time in days when saving and GDPR consent is give */

      /**
       * Saves the instance of the documentRoot (i.e. `<html>` tag) when the object is created.
       */
      get documentRoot() {
        return document.getElementsByTagName('html')[0];
      }

      /**
       * @constructor
       * The constructor initializes the `darkmode` object (that should be used as a singleton).
       */
      constructor() {
        this._hasGDPRConsent = false;
        this.cookieExpiry = 365;
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            DarkMode.onDOMContentLoaded();
          });
        } else {
          DarkMode.onDOMContentLoaded();
        }
      }

      /**
       * Writes a cookie, assumes SameSite = Strict & path = /
       *
       * @private
       * @param name -- Name of the cookie
       * @param value -- Value to be saved
       * @param days -- Number of days to expire the cookie
       * @returns {void}
       */
      static saveCookie(name, value = '', days = 365) {
        let exp = '';
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
          exp = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value}${exp}; SameSite=Strict; path=/`;
      }

      /**
       * Save the current color-scheme mode
       *
       * @param {string} name -- Name of the cookie or localStorage->name, is dependant on {@link #hasGDPRConsent}
       * @param {string} value -- Should be one of `light` or `dark`
       * @param {number} days -- Number of days to expire the cookie when the cookie is used, ignored for `localStorage`
       * @returns {void}
       */
      saveValue(name, value, days = this.cookieExpiry) {
        if (this.hasGDPRConsent) {
          // use cookies
          DarkMode.saveCookie(name, value, days);
        } else {
          // use local storage
          localStorage.setItem(name, value);
        }
      }

      /**
       * Reads a cookie
       * @private
       */
      static readCookie(name) {
        const n = `${name}=`;
        const parts = document.cookie.split(';');
        for (const part_ of parts) {
          const part = part_.trim();
          if (part.startsWith(n)) {
            // found it
            return part.slice(n.length);
          }
        }
        return '';
      }

      /**
       * Retrieves the color-scheme last saved
       *
       * **NOTE:** is dependant on {@link #hasGDPRConsent}
       *
       * @param {string} name -- Name of the cookie or localStorage->name
       * @returns {string} -- The saved value, either `light` or `dark`, or an empty string if not saved prior
       */
      readValue(name) {
        if (this.hasGDPRConsent) {
          return DarkMode.readCookie(name);
        }
        const ret = localStorage.getItem(name);
        return ret != null ? ret : '';
      }

      /**
       * Deletes the saved color-scheme
       *
       * **NOTE:** is dependant on {@link #hasGDPRConsent}
       *
       * @param {string} name
       * @returns {void} -- Nothing, erasure is assumed
       */
      eraseValue(name) {
        if (this.hasGDPRConsent) {
          this.saveValue(name, '', -1);
        } else {
          localStorage.removeItem(name);
        }
      }

      /**
       * Queries the `<HTML>` tag for the current color-scheme
       *
       * *(This value is set prior via the {@link #setDarkMode}) function.)*
       *
       * @returns {string} -- The current value, either `light` or `dark`, or an empty string if not saved prior
       */
      getSavedColorScheme() {
        const val = this.readValue(DarkMode.DATA_KEY);
        return val != null ? val : '';
      }

      /**
       * Queries the `prefers-color-scheme` media query for the current color-scheme
       *
       * *(This value is set prior via the {@link #setDarkMode}) function.)*
       *
       * @returns {string} -- The current value, either `light` or `dark`, or an empty string if the media query is not supported
       */
      getPreferedColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return DarkMode.VALUE_DARK;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          return DarkMode.VALUE_LIGHT;
        }
        return '';
      }

      /**
       * Sets the color-scheme in the `<HTML>` tag as a `data-bs-theme` attribute with a value of `light` or `dark`
       *
       * **Note:** This function will modify your document root element, i.e. the `<HTML>` tag
       *
       * Default behavior when setting dark mode `true`
       *
       * ```html
       * <html lang="en" data-bs-theme="dark">
       * ```
       *
       * Default behavior when setting dark mode `false`
       *
       * ```html
       * <html lang="en" data-bs-theme="light">
       * ```
       *
       * @example <caption>Set the color scheme to ***dark***, saving the state to the persistance mechanism</caption>
       * document.querySelector('#darkmode-on-button').onclick = function(e){
       *   darkmode.setDarkMode(true);  // save=true is default
       * }
       *
       * @example <caption>Set the color scheme to ***light***, but not saving the state</caption>
       * document.querySelector('#darkmode-off-button-no-save').onclick = function(e){
       *   darkmode.setDarkMode(false, false);
       * }
       *
       * @param {boolean} darkMode -- `true` for 'dark', `false` for 'light'
       * @param {boolean} doSave -- If `true`, then will also call {@link #saveValue} to save that state
       * @returns {void} -- Nothing, assumes saved
       */
      setDarkMode(darkMode, doSave = true) {
        const nodeList = document.querySelectorAll(`[data-${DarkMode.DATA_SELECTOR}]`);
        if (nodeList.length === 0) {
          this.documentRoot.setAttribute(`data-${DarkMode.DATA_SELECTOR}`, darkMode ? DarkMode.VALUE_DARK : DarkMode.VALUE_LIGHT);
        } else {
          for (const element of nodeList) {
            element.setAttribute(`data-${DarkMode.DATA_SELECTOR}`, darkMode ? DarkMode.VALUE_DARK : DarkMode.VALUE_LIGHT);
          }
        }
        if (doSave) {
          this.saveValue(DarkMode.DATA_KEY, darkMode ? DarkMode.VALUE_DARK : DarkMode.VALUE_LIGHT);
        }
      }

      /**
       * Toggles the color scheme in the `<HTML>` tag as a class called either `light` or `dark`
       * based on the inverse of it's prior state.
       *
       * When {@link #dataSelector} is set, this is set in the given data selector as the data value.
       *
       * *(See {@link #setDarkMode})*
       *
       * @example <caption>Bind an UI Element `click` event to toggle dark mode</caption>
       * document.querySelector('#darkmode-button').onclick = function(e){
       *   darkmode.toggleDarkMode();
       * }
       *
       * @returns {void} - Nothing, assumes success
       */
      toggleDarkMode(doSave = true) {
        const node = document.querySelector(`[data-${DarkMode.DATA_SELECTOR}]`);
        const dm = node ? node.getAttribute(`data-${DarkMode.DATA_SELECTOR}`) === DarkMode.VALUE_DARK : this.documentRoot.getAttribute(`data-${DarkMode.DATA_SELECTOR}`) === DarkMode.VALUE_DARK;
        this.setDarkMode(!dm, doSave);
      }

      /**
       * Clears the persistance state of the module and resets the document to the default mode.
       *
       * Calls {@link #eraseValue} to erase any saved value, and then
       * calls {@link #getPreferedColorScheme} to retrieve the `prefers-color-scheme` media query,
       * passing its value to {@link #setDarkMode} to reset the users preference.
       *
       * @example <caption>Bind a reset UI Element `click` event to reset the dark mode </caption>
       * document.querySelector('#darkmode-forget').onclick = function(e){
       *   darkmode.resetDarkMode();
       * }
       *
       * @returns {void} - Nothing, no error handling is performed.
       */
      resetDarkMode() {
        this.eraseValue(DarkMode.DATA_KEY);
        const dm = this.getPreferedColorScheme();
        if (dm) {
          this.setDarkMode(dm === DarkMode.VALUE_DARK, false);
        } else {
          // make good when `prefers-color-scheme` not supported
          const nodeList = document.querySelectorAll(`[data-${DarkMode.DATA_SELECTOR}]`);
          if (nodeList.length === 0) {
            this.documentRoot.setAttribute(`data-${DarkMode.DATA_SELECTOR}`, '');
          } else {
            for (const element of nodeList) {
              element.setAttribute(`data-${DarkMode.DATA_SELECTOR}`, '');
            }
          }
        }
      }

      /**
       * Gets the current color-scheme from the document `<HTML>` tag
       *
       * @returns {string} -- The current value, either `light` or `dark`, or an empty string if not present
       */
      static getColorScheme() {
        const node = document.querySelector(`[data-${DarkMode.DATA_SELECTOR}]`);
        if (!node) {
          const data = darkmode.documentRoot.getAttribute(`data-${DarkMode.DATA_SELECTOR}`);
          // exact match only
          return data === DarkMode.VALUE_DARK || data === DarkMode.VALUE_LIGHT ? data : '';
        }
        const data = node.getAttribute(`data-${DarkMode.DATA_SELECTOR}`);
        // exact match only
        return data === DarkMode.VALUE_DARK || data === DarkMode.VALUE_LIGHT ? data : '';
      }

      /**
       * ***static*** -- function called by the media query on change event.
       *
       * First retrieves any persistent/saved value, and if present ignores the event, but
       * if not set then triggers the {@link #setDarkMode} function to change the current mode.
       *
       * @returns {void} -- Nothing, assumes success
       */
      static updatePreferedColorSchemeEvent() {
        let dm = darkmode.getSavedColorScheme();
        if (!dm) {
          dm = darkmode.getPreferedColorScheme();
          if (dm) {
            darkmode.setDarkMode(dm === DarkMode.VALUE_DARK, false);
          }
        }
      }

      /**
       * ***static*** -- function called when the DOM finishes loading.
       *
       * Does all the DarkMode initialization, including:
       * * Loading any prior stored preference (GDPR consent is ***not*** assumed)
       * * else, honoring any `<HTML>` tag `data-bs-theme="dark|light"` that Server-Side may set
       * * else, honoring the browser / OS `prefers-color-scheme` preference
       * and setting the derived mode by calling {@link #setDarkMode}
       *
       * Followed by setting up the media query on change event
       *
       * ***Warning:*** This function is automatically called when loading this module.
       *
       * @returns {void}
       */
      static onDOMContentLoaded() {
        let pref = darkmode.readValue(DarkMode.DATA_KEY);
        if (!pref) {
          // user has not set pref. so get from `<HTML>` tag in case developer has set pref.
          pref = DarkMode.getColorScheme();
          if (!pref) {
            // when all else fails, get pref. from OS/browser
            pref = darkmode.getPreferedColorScheme();
          }
        }
        const dm = pref === DarkMode.VALUE_DARK;

        // initialize the `HTML` tag
        darkmode.setDarkMode(dm, false);

        // update every time it changes
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            DarkMode.updatePreferedColorSchemeEvent();
          });
        }
      }
    }

    /**
     * ***const*** -- This is the global instance (object) of the DarkMode class.
     */
    /** ***const*** -- Name of the cookie or localStorage->name when saving */
    DarkMode.DATA_KEY = 'chanrycz_site-theme';
    /** ***const*** -- Data selector, when present in HTML will populate with `dark` or `light` as appropriate */
    DarkMode.DATA_SELECTOR = 'bs-theme';
    /** ***const*** -- String used to identify light mode *(do not change)*, @see https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme */
    DarkMode.VALUE_LIGHT = 'light';
    /** ***const*** -- String used to identify dark mode *(do not change)*, @see https://www.w3.org/TR/mediaqueries-5/#prefers-color-scheme */
    DarkMode.VALUE_DARK = 'dark';
    const darkmode = new DarkMode();
    window.darkmode = darkmode;

    return darkmode;

}));
//# sourceMappingURL=darkmode.js.map
