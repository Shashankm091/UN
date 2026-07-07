/**
 * IndexedDB helper for persisting the background music file.
 * localStorage has a ~5 MB limit which MP3s easily exceed.
 * IndexedDB stores the raw Blob so there is no size problem.
 */

const DB_NAME = "birthday-music-db";
const STORE = "songs";
const KEY = "custom-song";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

/** Save a music File to IndexedDB. Returns the song display name. */
export async function saveSongToDB(file: File): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ blob: file, name: file.name }, KEY);
    tx.oncomplete = () => resolve(file.name.replace(/\.[^.]+$/, ""));
    tx.onerror = () => reject(tx.error);
  });
}

/** Load the saved song. Returns a blob URL + name, or null if none saved. */
export async function loadSongFromDB(): Promise<{ src: string; name: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => {
        const result = req.result as { blob: Blob; name: string } | undefined;
        if (result?.blob) {
          const src = URL.createObjectURL(result.blob);
          resolve({ src, name: result.name.replace(/\.[^.]+$/, "") });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (_) {
    return null;
  }
}

/** Delete the saved song from IndexedDB. */
export async function removeSongFromDB(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = () => resolve();
    });
  } catch (_) {}
}
