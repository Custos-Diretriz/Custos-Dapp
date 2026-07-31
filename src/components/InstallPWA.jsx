"use client";

import { useEffect, useRef, useState } from "react";

const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

const DISMISS_KEY = "custos:pwa-dismissed";

let installPrompt = null;

const InstallPWAButton = ({ text, onInstalled }) => {
    const installButton = useRef(null);

    const clickInstallButton = async () => {
        if (!installPrompt) {
            console.log("Install prompt not initialized");
            return;
        }
        const result = await installPrompt.prompt();
        if (result?.outcome === "accepted") { onInstalled(); }
    }

    return (
        <button
            type="button"
            className={"py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:focus:bg-white/20 dark:focus:text-white"}
            ref={installButton}
            onClick={clickInstallButton}
        >
            {text}
        </button>
    )
}

const InstallPWA = () => {
    const installContainer = useRef(null);
    const [installable, setInstallable] = useState(false);
    const [showInstallContainer, setShowInstallContainer] = useState(false);

    const unsetInstallable = () => {
        setInstallable(() => false);
    }

    const closeInstallContainer = () => {
        installPrompt = null;
        setShowInstallContainer(false);
        if (isBrowser()) localStorage.setItem(DISMISS_KEY, "1");
    }

    const handleBeforePromptInstall = (event) => {
        if (localStorage.getItem(DISMISS_KEY)) return;
        setInstallable(true);

        // For when there is an installable version - e.g., for a mobile version.
        // This can be uncommented and used.
        // const relatedApps = await navigator.getInstalledRelatedApps();
        // const psApp = relatedApps.find((app) => console.log(app));

        event.preventDefault();
        installPrompt = event;
        console.log("Before install prompt available");
    }

    const handleAppInstalled = () => {
        console.log("App already installed");
        unsetInstallable();
        if (isBrowser()) localStorage.setItem(DISMISS_KEY, "1");
    }

    useEffect(() => {
        if (!isBrowser()) return;

        window.addEventListener("beforeinstallprompt", handleBeforePromptInstall);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforePromptInstall);
            window.removeEventListener("appinstalled", handleAppInstalled);
        }
    }, []);

    useEffect(() => {
        setShowInstallContainer(installable);
    }, [installable]);

    return (
        <>
            {
                showInstallContainer
                && <section className={"fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-row items-center gap-2 w-[calc(100%-2rem)] max-w-md p-4 bg-[#84c2f513] text-white backdrop-blur-md shadow rounded-xl"} ref={installContainer}>
                    <div className={"install-message w-full px-2 dark:color-whitesmoke"}>
                        Install Custos on your device.
                        <div className={"text-sm"}>
                            It will take less than 10 seconds
                        </div>
                    </div>
                    <InstallPWAButton text={"Install"} onInstalled={closeInstallContainer} />
                    <button
                        type={"button"}
                        aria-label={"Dismiss"}
                        className={"text-lg leading-none px-2 text-[#19B1D2] hover:text-white bg-transparent border-0"}
                        onClick={closeInstallContainer}
                    >
                        ×
                    </button>
                </section>
            }
        </>
    );
}

export default InstallPWA;