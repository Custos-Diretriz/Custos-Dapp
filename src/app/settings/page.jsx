"use client";

import { useEffect, useState } from "react";

/**
 * Settings hub. The Hidden Guardian (background power-button recorder) is a
 * native feature of the Custos Android app, controlled from here via a
 * `custos://` deep link into the app — so there is no separate launcher icon.
 * The controls only appear when the page is running inside the installed app.
 */

const GUARDIAN_ARM =
  "intent://guardian?action=arm#Intent;scheme=custos;package=com.custosdiretriz.app;end";
const GUARDIAN_DISARM =
  "intent://guardian?action=disarm#Intent;scheme=custos;package=com.custosdiretriz.app;end";

export default function SettingsPage() {
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    const standalone =
      typeof window !== "undefined" &&
      window.matchMedia?.("(display-mode: standalone)")?.matches;
    const fromAndroidApp =
      typeof document !== "undefined" &&
      document.referrer?.startsWith("android-app://com.custosdiretriz.app");
    setInApp(Boolean(standalone || fromAndroidApp));
  }, []);

  const fire = (url) => {
    window.location.href = url;
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-4 text-[#EAF9FF]">
      <h1 className="text-2xl font-extrabold">Settings</h1>

      {/* Hidden Guardian */}
      <section className="rounded-2xl border border-white/10 bg-[#121212] p-5">
        <h2 className="text-lg font-bold">Hidden Guardian</h2>
        <p className="mt-2 text-sm leading-6 text-[#8E9A9A]">
          When armed, triple-press the power button to silently record evidence
          in the background — no camera preview. Clips are pinned to IPFS and
          anchored on-chain as guest evidence. Android shows a persistent
          notification while the camera is in use (required by the OS), so it is
          not fully invisible.
        </p>

        {inApp ? (
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => fire(GUARDIAN_ARM)}
              className="rounded-xl bg-[#0094FF] px-5 py-3 text-sm font-bold text-[#02121A]"
            >
              Arm Guardian
            </button>
            <button
              onClick={() => fire(GUARDIAN_DISARM)}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-[#EAF9FF]"
            >
              Disarm
            </button>
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-[#8E9A9A]">
            The Guardian is available in the <b>Custos Android app</b>. Install
            the app and open Settings there to arm it.
          </p>
        )}
      </section>

      {/* Consent & legality */}
      <section className="rounded-2xl border border-white/10 bg-[#121212] p-5">
        <h2 className="text-lg font-bold">Consent &amp; legality</h2>
        <p className="mt-2 text-sm leading-6 text-[#8E9A9A]">
          Recording laws vary by place. You are responsible for using Custos
          lawfully — some jurisdictions require consent to record audio or in
          private spaces. Evidence anchored on-chain is timestamped and
          tamper-evident, but is not legal advice.
        </p>
      </section>
    </div>
  );
}
