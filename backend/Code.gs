/**
 * ============================================================================
 * My Desktop Tech — CampusOne Portal v2 · Live data channel
 * ============================================================================
 *
 * Database  : Google Sheets  (one sheet = one table, row 1 = headers)
 * Storage   : Google Drive   (portal photos & uploads in category folders)
 * Frontend  : the static portal; the channel endpoint is wired in
 *             assets/js/channel.js (MDT_CONFIG.API_URL) — maintainer only.
 *
 * DEPLOYMENT (one-time, maintainer steps):
 *   1. Import database-seed/MDT_CampusOne_Seed.xlsx as a new Google Sheet
 *      (File → Import → Upload → "Insert new spreadsheet").
 *   2. In that sheet: Extensions → Apps Script → delete default code →
 *      paste THIS file → save.
 *   3. Run the function `setup()` once (Run button) and approve permissions.
 *   4. Deploy → New deployment → type "Web app":
 *        Execute as     : Me (your account)
 *        Who has access : Anyone
 *   5. Copy the /exec URL into assets/js/channel.js → API_URL.
 *
 * CALL CONTRACT (text/plain POST to avoid CORS preflight):
 *   { "action": "login" | "list" | "get" | "add" | "update" | "remove"
 *     | "uploadFile" | "fileUrl", ...params }
 *   response: { ok: true, data: ... } | { ok: false, error: "..." }
 * ============================================================================
 */

var SESSION_HOURS = 12;
var DRIVE_ROOT = 'CampusOne Portal Files';
var TOKEN = 'MDT-CAMPUSONE'; // optional shared secret — set your own

/* ------------------------------------------------------------------ *
 *  Entry points                                                       *
 * ------------------------------------------------------------------ */
function doGet() {
  return json_({ ok: true, service: 'CampusOne Portal Channel', version: '2.0.0', time: nowStr_() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse(e.postData.contents);
    if (TOKEN && body.token !== TOKEN && body.action !== 'login' && body.action !== 'ping') {
      return json_({ ok: false, error: 'Invalid token.' });
    }
    var out;
    if (lock.tryLock(20000) || isReadOnly_(body.action)) out = route_(body);
    else out = { ok: false, error: 'Server busy — please retry.' };
    return json_(out);
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

function isReadOnly_(action) {
  return action === 'ping' || action === 'login' || action === 'list' || action === 'get' || action === 'fileUrl';
}

function route_(body) {
  switch (body.action) {
    case 'ping':       return { ok: true, pong: true, mode: 'live' };
    case 'login':      return login_(body.username, body.password);
    case 'logout':     return { ok: true };
    case 'list':       return { ok: true, data: list_(body.table, body.filters || null) };
    case 'get':        return getOne_(body.table, body.id);
    case 'add':        return add_(body.table, body.data);
    case 'update':     return update_(body.table, body.id, body.data);
    case 'remove':     return remove_(body.table, body.id);
    case 'uploadFile': return uploadFile_(body);
    case 'fileUrl':    return fileUrl_(body.fileId);
    default:           throw new Error('Unknown action: ' + body.action);
  }
}

/* ------------------------------------------------------------------ *
 *  One-time setup                                                     *
 * ------------------------------------------------------------------ */
function setup() {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('SHEET_ID', SpreadsheetApp.getActive().getId());
  var root = getRootFolder_();
  props.setProperty('DRIVE_ROOT_ID', root.getId());
  return 'Setup complete. Deploy as Web App (Execute as: Me, Access: Anyone) and copy the /exec URL into the portal channel configuration.';
}

function getSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('SHEET_ID not set. Run setup() once from the Apps Script editor.');
  return SpreadsheetApp.openById(id);
}

function getRootFolder_() {
  var id = PropertiesService.getScriptProperties().getProperty('DRIVE_ROOT_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var it = DriveApp.getFoldersByName(DRIVE_ROOT);
  var folder = it.hasNext() ? it.next() : DriveApp.createFolder(DRIVE_ROOT);
  PropertiesService.getScriptProperties().setProperty('DRIVE_ROOT_ID', folder.getId());
  return folder;
}

/* ------------------------------------------------------------------ *
 *  Generic table CRUD (sheet = table, row 1 = headers, col A = ID)   *
 * ------------------------------------------------------------------ */
function sheetData_(sheet) {
  var values = sheet.getDataRange().getValues();
  if (!values.length) return { headers: [], rows: [] };
  var headers = values[0].map(String);
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    if (values[r].join('') === '') continue;
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var v = values[r][c];
      if (v instanceof Date) v = formatSheetDate_(v);
      obj[headers[c]] = v === null || v === undefined ? '' : v;
    }
    obj.__row = r + 1;
    rows.push(obj);
  }
  return { headers: headers, rows: rows };
}

function formatSheetDate_(d) {
  try { return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'); }
  catch (e) { return String(d); }
}

function list_(tableName, filters) {
  var sheet = getSheet_(tableName);
  var rows = sheetData_(sheet).rows;
  if (filters) {
    rows = rows.filter(function (row) {
      return Object.keys(filters).every(function (k) { return String(row[k] || '') === String(filters[k]); });
    });
  }
  return rows.map(function (r) { var o = {}; for (var k in r) if (k !== '__row') o[k] = r[k]; return o; });
}

function getOne_(tableName, id) {
  var rows = list_(tableName, { id: id });
  if (!rows.length) rows = list_(tableName, { ID: id });
  if (!rows.length) throw new Error(tableName + ' record not found: ' + id);
  return { ok: true, data: rows[0] };
}

function add_(tableName, data) {
  var sheet = getSheet_(tableName);
  var headers = sheetData_(sheet).headers;
  if (!headers.length) throw new Error('Sheet "' + tableName + '" has no header row.');
  var newId = data && (data.id || data.ID) ? String(data.id || data.ID) : nextId_(sheet, tableName);
  var row = headers.map(function (h) {
    if (h === 'id' || h === 'ID') return newId;
    var v = data ? data[h] : undefined;
    if (v === null || v === undefined) v = data ? (data[h.toLowerCase()] || '') : '';
    if (v instanceof Object) v = JSON.stringify(v);
    return v;
  });
  sheet.appendRow(row);
  return { ok: true, id: newId };
}

function update_(tableName, id, data) {
  var sheet = getSheet_(tableName);
  var info = sheetData_(sheet);
  var found = info.rows.filter(function (r) { return String(r.id) === String(id) || String(r.ID) === String(id); });
  if (!found.length) throw new Error(tableName + ' record not found: ' + id);
  var current = found[0];
  var newRow = info.headers.map(function (h) {
    if (h === 'id' || h === 'ID') return id;
    if (data && (data[h] !== undefined && data[h] !== null)) return data[h] instanceof Object ? JSON.stringify(data[h]) : data[h];
    return current[h] === undefined ? '' : current[h];
  });
  sheet.getRange(current.__row, 1, 1, info.headers.length).setValues([newRow]);
  return { ok: true, id: id };
}

function remove_(tableName, id) {
  var sheet = getSheet_(tableName);
  var info = sheetData_(sheet);
  var found = info.rows.filter(function (r) { return String(r.id) === String(id) || String(r.ID) === String(id); });
  if (!found.length) throw new Error(tableName + ' record not found: ' + id);
  sheet.deleteRow(found[0].__row);
  return { ok: true, deleted: id };
}

function nextId_(sheet, tableName) {
  var values = sheet.getDataRange().getValues();
  var prefix = '', pad = 3, maxNum = 0, seen = false;
  for (var r = 1; r < values.length; r++) {
    var id = String(values[r][0] || '').trim();
    var m = id.match(/^([A-Za-z]*)(\d+)$/);
    if (m) {
      seen = true;
      if (m[2].length > pad) pad = m[2].length;
      var n = parseInt(m[2], 10);
      if (n > maxNum) { maxNum = n; if (m[1]) prefix = m[1]; }
    }
  }
  if (!seen) prefix = (tableName || 'R').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'R';
  var next = maxNum + 1;
  return prefix + String(next).padStart(pad, '0');
}

function getSheet_(tableName) {
  var sheet = getSpreadsheet_().getSheetByName(tableName);
  if (!sheet) throw new Error('Sheet (table) not found: "' + tableName + '". Check the spreadsheet.');
  return sheet;
}

/* ------------------------------------------------------------------ *
 *  Auth                                                               *
 * ------------------------------------------------------------------ */
function login_(username, password) {
  if (!username || !password) throw new Error('Username and password are required.');
  var users = list_('Users', { username: String(username).trim() });
  if (!users.length) users = list_('Users', { email: String(username).trim() });
  if (!users.length) return { ok: false, error: 'Invalid username or password.' };
  var u = users[0];
  var active = String(u.active === undefined ? u.Active : u.active);
  if (String(active).toLowerCase() === 'false' || String(active) === 'No') {
    return { ok: false, error: 'Your account is not active. Contact the administrator.' };
  }
  if (String(u.pass || u.Password || '') !== String(password)) {
    return { ok: false, error: 'Invalid username or password.' };
  }
  var token = Utilities.getUuid();
  try { CacheService.getScriptCache().put('sess_' + token, JSON.stringify({ uid: u.id || u.ID, role: u.role || u.Role, exp: Date.now() + SESSION_HOURS * 3600000 }), 21600); } catch (e) {}
  return { ok: true, token: token, user: { id: u.id || u.ID, email: u.email || u.Email, role: u.role || u.Role, personId: u.personId || u.PersonId } };
}

/* ------------------------------------------------------------------ *
 *  File storage                                                       *
 * ------------------------------------------------------------------ */
function uploadFile_(body) {
  var name = String(body.fileName || 'upload');
  var mime = String(body.mimeType || 'application/octet-stream');
  var b64 = String(body.base64 || '');
  var category = String(body.category || 'General'); // Profile, OD proof, Scholarships ...
  if (!b64) throw new Error('base64 content is required.');
  if (b64.length > 12 * 1024 * 1024 * 1.37) throw new Error('File too large (limit ~10 MB).');

  var folder = getRootFolder_();
  var sub = folder.getFoldersByName(category);
  var target = sub.hasNext() ? sub.next() : folder.createFolder(category);

  var blob = Utilities.newBlob(Utilities.base64Decode(b64), mime, name);
  var file = target.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, fileId: file.getId(), url: file.getUrl() };
}

function fileUrl_(fileId) {
  if (!fileId) return { ok: true, url: '' };
  try { return { ok: true, url: DriveApp.getFileById(String(fileId)).getUrl() }; }
  catch (e) { return { ok: false, error: 'File not found: ' + fileId }; }
}

/* ------------------------------------------------------------------ *
 *  Helpers                                                            *
 * ------------------------------------------------------------------ */
function nowStr_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function testPing() { Logger.log(route_({ action: 'ping' })); }
