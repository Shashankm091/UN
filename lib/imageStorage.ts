/**
 * IndexedDB helper for persisting uploaded images as Blobs.
 * Avoids the localStorage 5 MB limit for base64-encoded images.
 * Supports multiple named stores (one per gallery section).
 */

const DB_NAME = "birthday-images-db";

// We bump the version each time we add a new store name.
// All stores we use must be declared here.
const ALL_STORES = ["secret-surprise-images"];
const DB_VERSION = ALL_STORES.length; // simple incrementing scheme

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      for (const store of ALL_STORES) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id", autoIncrement: true });
        }
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

export type StoredImage = { id: number; blob: Blob; name: string };
export type LoadedImage = { id: number; src: string; name: string };

export async function loadImagesFromDB(store: string): Promise<LoadedImage[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(store, "readonly");
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => {
        const rows = req.result as StoredImage[];
        resolve(rows.map((r) => ({ id: r.id, src: URL.createObjectURL(r.blob), name: r.name })));
      };
      req.onerror = () => resolve([]);
    });
  } catch (_) {
    return [];
  }
}

export async function saveImageToDB(store: string, file: File): Promise<LoadedImage> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const name = file.name.replace(/\.[^.]+$/, "");
    const req = tx.objectStore(store).add({ blob: file, name });
    req.onsuccess = () => {
      resolve({ id: req.result as number, src: URL.createObjectURL(file), name });
    };
    req.onerror = () => reject(req.error);
  });
}

export async function replaceImageInDB(store: string, id: number, file: File): Promise<LoadedImage> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const name = file.name.replace(/\.[^.]+$/, "");
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).put({ id, blob: file, name });
    req.onsuccess = () => resolve({ id, src: URL.createObjectURL(file), name });
    req.onerror = () => reject(req.error);
  });
}

export async function deleteImageFromDB(store: string, id: number): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).delete(id);
      tx.oncomplete = () => resolve();
    });
  } catch (_) {}
}

export async function clearAllImagesFromDB(store: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve();
    });
  } catch (_) {}
}
