/* v8 — the channel layer is unchanged; the portal is served as one
   single page, and the administrator’s dynamic integration settings
   (Admin → Settings) still apply live to every view. */
/* My Desktop Tech — CampusOne · channel configuration
   v6: this file is now the FALLBACK endpoint only. The live endpoint is
   maintained by the administrator in Admin → Settings → Database &
   integrations (DB.settings.integrations.gsheet) and applies dynamically —
   when the admin saves new keys, every page's background data source
   switches without touching this file. See api.js (Api.url) for resolution
   order and backend/SETUP_GUIDE.md for the one-time deployment. */
window.MDT_CONFIG = { API_URL: '' };
