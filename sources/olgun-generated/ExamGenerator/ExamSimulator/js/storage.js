// Automatic result.md saving via the File System Access API. The user's chosen
// root directory handle is persisted in IndexedDB so re-grants aren't needed.

import { FS_DB_NAME, FS_STORE_NAME, FS_ROOT_KEY } from "./constants.js";
import { state } from "./state.js";
import { buildResultMarkdown } from "./result-md.js";

function idbOpen() {
  return new Promise(function (resolve, reject) {
    var req = indexedDB.open(FS_DB_NAME, 1);
    req.onupgradeneeded = function () { req.result.createObjectStore(FS_STORE_NAME); };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}

function idbGet(key) {
  return idbOpen().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(FS_STORE_NAME, "readonly");
      var req = tx.objectStore(FS_STORE_NAME).get(key);
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function idbSet(key, value) {
  return idbOpen().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(FS_STORE_NAME, "readwrite");
      tx.objectStore(FS_STORE_NAME).put(value, key);
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function verifyPermission(handle, mode) {
  var opts = { mode: mode || "readwrite" };
  return handle.queryPermission(opts).then(function (status) {
    if (status === "granted") return true;
    return handle.requestPermission(opts).then(function (s) { return s === "granted"; });
  });
}

function pickRootDir() {
  if (!window.showDirectoryPicker) return Promise.reject(new Error("File System Access API not supported in this browser"));
  return window.showDirectoryPicker({ id: "examgen-root" }).then(function (handle) {
    return idbSet(FS_ROOT_KEY, handle).then(function () { return handle; });
  });
}

function getRootDirHandle() {
  return idbGet(FS_ROOT_KEY).then(function (handle) {
    if (!handle) return pickRootDir();
    return verifyPermission(handle, "readwrite").then(function (ok) {
      return ok ? handle : pickRootDir();
    });
  });
}

export function setAutosaveBanner(msg, kind) {
  var el = document.getElementById("autosaveBanner");
  if (!el) return;
  el.textContent = msg;
  el.className = "autosave-banner" + (kind ? " " + kind : "");
}

export function autoSaveResult() {
  if (!window.showDirectoryPicker) {
    setAutosaveBanner("Automatic saving needs Chrome or Edge. Use the buttons below instead.", "err");
    return;
  }
  var md = buildResultMarkdown();
  getRootDirHandle()
    .then(function (root) { return root.getDirectoryHandle(state.examId, { create: true }); })
    .then(function (dir) { return dir.getFileHandle("result.md", { create: true }); })
    .then(function (fileHandle) {
      return fileHandle.createWritable().then(function (writable) {
        return writable.write(md).then(function () { return writable.close(); });
      });
    })
    .then(function () {
      setAutosaveBanner("Saved automatically to GeneratedExams/" + state.examId + "/result.md", "ok");
    })
    .catch(function (err) {
      setAutosaveBanner("Automatic save failed (" + err.message + "). Use the buttons below.", "err");
    });
}

export function deleteSavedResult(id) {
  if (!window.showDirectoryPicker) return Promise.resolve();
  return getRootDirHandle()
    .then(function (root) { return root.getDirectoryHandle(id, { create: false }); })
    .then(function (dir) { return dir.removeEntry("result.md").catch(function () {}); })
    .catch(function () {});
}
