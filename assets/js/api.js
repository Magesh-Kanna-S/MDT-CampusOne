/* My Desktop Tech — CampusOne · live channel (inactive unless provisioned)
   v6: the channel endpoint resolves DYNAMICALLY — an administrator can paste
   the Google Sheets channel URL / API key from Admin → Settings at any time
   and every page's background data source follows without a redeploy. */
(function (g) {
'use strict';
function intg() {
  try { return (g.DB && g.DB.settings && g.DB.settings.integrations) || null; } catch (e) { return null; }
}
var Api = {
  url: function () {
    var i = intg();
    if (i && i.gsheet && i.gsheet.url) return i.gsheet.url;
    return (g.MDT_CONFIG || {}).API_URL || '';
  },
  key: function () { var i = intg(); return (i && i.gsheet && i.gsheet.key) || ''; },
  driveKey: function () { var i = intg(); return (i && i.drive && i.drive.key) || ''; },
  driveFolder: function () { var i = intg(); return (i && i.drive && i.drive.folder) || ''; },
  active: function () { return !!this.url(); },
  sync: function (actor, action) {
    if (!this.active()) return;
    try {
      fetch(this.url(), { method: 'POST', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'note', actor: actor, note: action, key: this.key() || undefined }) }).catch(function () {});
    } catch (e) {}
  },
  /* v6: apply new integration values — the background source reflects immediately */
  apply: function (vals) {
    if (vals) {
      g.MDT_CONFIG = g.MDT_CONFIG || {};
      g.MDT_CONFIG.API_URL = vals.gsheet ? (vals.gsheet.url || '') : (g.MDT_CONFIG.API_URL || '');
    }
    return this.active();
  }
};
g.Api = Api;
})(window);
