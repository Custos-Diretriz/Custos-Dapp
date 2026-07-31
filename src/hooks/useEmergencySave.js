"use client";
import { useEffect, useRef, useCallback } from "react";

const DB_NAME = "custos-emergency";
const STORE = "pending-recordings";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function persistRecording(blob, meta = {}) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      blob,
      meta,
      createdAt: Date.now(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingRecordings() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function removePendingRecording(id) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Fires when a recording is interrupted: tab hidden, page closing, app
 * backgrounded, network dropping, or the media track ending unexpectedly.
 *
 * Order matters — the blob is written to IndexedDB FIRST (that must not
 * fail), then we make a best-effort upload. Anything that doesn't make it
 * out is recovered on next app open.
 */
export function useEmergencySave({
  isRecordingRef,
  recorderRef,
  chunksRef,
  onEmergency,
  meta,
  enabled = true,
}) {
  const firedRef = useRef(false);
  const metaRef = useRef(meta);
  metaRef.current = meta;

  const handleEmergency = useCallback(
    async (reason = "interrupted") => {
      if (!enabled || firedRef.current) return;
      if (!isRecordingRef.current || !chunksRef.current?.length) return;
      firedRef.current = true;

      try {
        if (recorderRef.current?.state === "recording") {
          recorderRef.current.requestData();
          recorderRef.current.stop();
        }
      } catch (_) {}

      isRecordingRef.current = false;
      const blob = new Blob(chunksRef.current, { type: "video/webm" });

      // 1. local persistence — the part that must survive
      try {
        await persistRecording(blob, { ...metaRef.current, reason });
      } catch (e) {
        console.error("Emergency local persist failed:", e);
      }

      // 2. best-effort immediate upload + onchain save
      try {
        await onEmergency?.(blob, reason);
      } catch (e) {
        console.warn("Immediate emergency save failed; queued for recovery:", e);
      }

      firedRef.current = false;
    },
    [enabled, isRecordingRef, recorderRef, chunksRef, onEmergency]
  );

  useEffect(() => {
    if (!enabled) return;

    const onVisibility = () => {
      if (document.visibilityState === "hidden") handleEmergency("tab-hidden");
    };
    const onPageHide = () => handleEmergency("page-hide");
    const onBeforeUnload = () => handleEmergency("page-close");
    const onOffline = () => handleEmergency("offline");
    const onBlur = () => {
      // mobile app-switch often only fires blur
      if (document.visibilityState === "hidden") handleEmergency("blur");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("offline", onOffline);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled, handleEmergency]);

  return { triggerEmergencySave: handleEmergency };
}