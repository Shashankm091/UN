/**
 * IndexedDB helper for persisting uploaded videos.
 * localStorage has a ~5 MB limit which MP4s easily exceed.
 * IndexedDB stores raw Blobs with no meaningful size cap.
 */

const DB_NAME = "birthday-videos-db";
const DB_VERSION = 1;
const STORE = "videos";

export type StoredVideo = {
  id: number; // auto-increment key
  blob: Blob;
  name: string;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

/** Load all videos from IndexedDB. Returns list of { id, src (blob URL), name }. */
export async function loadVideosFromDB(): Promise<{ id: number; src: string; name: string }[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => {
        const rows = req.result as StoredVideo[];
        resolve(
          rows.map((r) => ({
            id: r.id,
            src: URL.createObjectURL(r.blob),
            name: r.name,
          }))
        );
      };
      req.onerror = () => resolve([]);
    });
  } catch (_) {
    return [];
  }
}

/** Save a single video Blob. Returns the new auto-increment id. */
export async function saveVideoToDB(file: File): Promise<{ id: number; src: string; name: string }> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).add({ blob: file, name: file.name.replace(/\.[^.]+$/, "") });
    req.onsuccess = () => {
      const id = req.result as number;
      resolve({ id, src: URL.createObjectURL(file), name: file.name.replace(/\.[^.]+$/, "") });
    };
    req.onerror = () => reject(req.error);
  });
}

/** Replace a video by id. */
export async function replaceVideoInDB(id: number, file: File): Promise<{ id: number; src: string; name: string }> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const req = tx.objectStore(STORE).put({ id, blob: file, name: file.name.replace(/\.[^.]+$/, "") });
    req.onsuccess = () => resolve({ id, src: URL.createObjectURL(file), name: file.name.replace(/\.[^.]+$/, "") });
    req.onerror = () => reject(req.error);
  });
}

/** Delete a video by id. */
export async function deleteVideoFromDB(id: number): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
    });
  } catch (_) {}
}

/** Delete ALL videos. */
export async function clearAllVideosFromDB(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve();
    });
  } catch (_) {}
}
