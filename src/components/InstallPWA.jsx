"use client";

import { useEffect, useRef, useState } from "react";

const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

let installPrompt = null;

const InstallPWA = () => {
    const installContainer = useRef(null);
    const [installable, setInstallable] = useState(false);
    const [showInstallContainer, setShowInstallContainer] = useState(false);

    const unsetInstallable = () => {
        setInstallable(() => false);
    }

    const InstallPWAButton = ({ text }) => {
        const installButton = useRef(null);

        const clickInstallButton = async () => {
            if (!installPrompt) {
                console.log("Install prompt not initialized");
                return;
            }
            const result = await installPrompt.prompt();
            // console.log("Install prompt was:", result.outcome);
            if (result.outcome === "accepted") { closeInstallContainer(); };
            // Show the notification that installation was successful.
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

    if (isBrowser()) {
        window.addEventListener("appinstalled", () => {
            console.log("App already installed")
            unsetInstallable();
        });
    }

    const closeInstallContainer = () => {
        installPrompt = null;
        setShowInstallContainer(false);
    }

    const handleBeforePromptInstall = (event) => {
        setInstallable(true);

        // For when there is an minstallable version - e.g., for a mobile version.
        // This can be uncommented and used.
        // const relatedApps = await navigator.getInstalledRelatedApps();
        // Search for a specific installed platform-specific app
        // console.log(relatedApps);
        // const psApp = relatedApps.find((app) => console.log(app));

        event.preventDefault();
        installPrompt = event;
        console.log("Before install prompt available");
    }

    const dependency = isBrowser; // Extrae la expresión a una variable

    useEffect(() => {
        if (dependency()) {
            window.addEventListener("beforeinstallprompt", handleBeforePromptInstall);
        }

        return () => {
            if (dependency()) window.removeEventListener("beforeinstallprompt", handleBeforePromptInstall)
        }
    }, [dependency]); // Usa la variable en el array de dependencias

    useEffect(() => {
        setShowInstallContainer(installable);
    }, [installable]);

    return (
        <>
            {
                showInstallContainer
                && <section className={"sticky top-[72px] lg:top-[80px] z-10 flex flex-row items-center w-11/12 mx-auto p-4 bg-[#84c2f513] text-white backdrop-blur-md shadow rounded-xl"} ref={installContainer}>
                    <button type={"button"} className={"fa fa-times font-14 border-0 bg-transparent square-4 leading-8 text-center relative self-start dark:color-whitesmoke"} onClick={closeInstallContainer}></button>
                    <div className={"install-message w-full px-2 dark:color-whitesmoke"}>
                        Install Custos on your device.
                        <div className={"text-sm"}>
                            It will take less than 10 seconds
                        </div>
                    </div>
                    <InstallPWAButton text={"Install"} />
                </section>
            }
        </>
    );
}

export default InstallPWA;