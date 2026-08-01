"use client";

import { useEffect, useState } from "react";

/**
 * Settings hub. The Hidden Guardian (background power-button recorder) is a
 * native feature of the Custos Android app, controlled from here via a
 * `custos://` deep link into the app — so there is no separate launcher icon.
 * The controls only appear when the page is running inside the installed app.
 */

const deepLink = (params) =>
  `intent://guardian?${new URLSearchParams(params).toString()}` +
  `#Intent;scheme=custos;package=com.custosdiretriz.app;end`;

export default function SettingsPage() {
  const [inApp, setInApp] = useState(false);

  // Guardian options.
  const [camera, setCamera] = useState("back");
  const [alert, setAlert] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const arm = () =>
    fire(
      deepLink({
        action: "arm",
        camera,
        alert: alert ? "1" : "0",
        countdown: String(countdown),
      })
    );
  const stop = () => fire(deepLink({ action: "stop" }));
  const disarm = () => fire(deepLink({ action: "disarm" }));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-4 text-[#EAF9FF]">
      <h1 className="text-2xl font-extrabold">Settings</h1>

      {/* Hidden Guardian */}
      <section className="rounded-2xl border border-white/10 bg-[#121212] p-5">
        <h2 className="text-lg font-bold">Hidden Guardian</h2>
        <p className="mt-2 text-sm leading-6 text-[#8E9A9A]">
          When armed, triple-press the power button to record evidence in the
          background — no camera preview. Triple-press again, or tap “Stop” on the
          notification, to stop. Android shows a persistent notification while the
          camera is in use (required by the OS), so it is not fully invisible.
        </p>

        {inApp ? (
          <div className="mt-5 flex flex-col gap-5">
            {/* Camera */}
            <div>
              <p className="mb-2 text-sm font-semibold">Camera</p>
              <div className="flex gap-2">
                {["back", "front"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCamera(c)}
                    className={
                      "rounded-full px-4 py-2 text-sm font-semibold capitalize " +
                      (camera === c
                        ? "bg-[#0094FF] text-[#02121A]"
                        : "border border-white/15 text-[#EAF9FF]")
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Start alert */}
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold">
                Alert when recording starts
                <span className="block text-xs font-normal text-[#8E9A9A]">
                  Vibrate + toast on start. Off = silent.
                </span>
              </span>
              <input
                type="checkbox"
                checked={alert}
                onChange={(e) => setAlert(e.target.checked)}
                className="h-5 w-5 accent-[#0094FF]"
              />
            </label>

            {/* Countdown */}
            <div>
              <p className="mb-2 text-sm font-semibold">
                Countdown before start
                <span className="block text-xs font-normal text-[#8E9A9A]">
                  Wait after the triple-press before recording begins.
                </span>
              </p>
              <div className="flex gap-2">
                {[0, 3, 5, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCountdown(n)}
                    className={
                      "rounded-full px-4 py-2 text-sm font-semibold " +
                      (countdown === n
                        ? "bg-[#0094FF] text-[#02121A]"
                        : "border border-white/15 text-[#EAF9FF]")
                    }
                  >
                    {n === 0 ? "Off" : `${n}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-1 flex flex-wrap gap-3">
              <button
                onClick={arm}
                className="rounded-xl bg-[#0094FF] px-5 py-3 text-sm font-bold text-[#02121A]"
              >
                Arm Guardian
              </button>
              <button
                onClick={stop}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-[#EAF9FF]"
              >
                Stop recording
              </button>
              <button
                onClick={disarm}
                className="rounded-xl border border-[#E5484D]/60 px-5 py-3 text-sm font-bold text-[#E5484D]"
              >
                Disarm
              </button>
            </div>
            <p className="text-xs text-[#8E9A9A]">
              Arming applies the options above. Change an option and tap “Arm
              Guardian” again to update it.
            </p>
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
