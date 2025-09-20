"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const metadata = {
    title: "Offline",
};

export default function Page() {
    const router = useRouter()

    const HomeIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
        )
    }

    const BreadCrumb = () => {
        return (
            <ol className="fixed top-8 flex items-center whitespace-nowrap shadow bg-[#84c2f513] backdrop-blur-sm p-4 rounded-xl disabled:pointer-events-none border border-[#84c2f513]">
                <li className="inline-flex items-center">
                    <Link href="/" className="flex items-center gap-x-2 text-sm text-gray-300 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500">
                        <HomeIcon />
                        Home
                    </Link>
                    <svg className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </li>
                <li className="text-sm">
                    <div className="flex items-center text-gray-500 dark:text-neutral-500">
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                        <svg className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </div>
                </li>
                <li className="inline-flex items-center text-sm font-medium text-gray-500 underline truncate dark:text-neutral-200" aria-current="page">
                    Offline Page
                </li>
            </ol>
        )
    }

    return (
        <div className="relative w-full h-screen flex flex-col justify-center items-center">
            <BreadCrumb />
            <div className="flex flex-col justify-center items-center gap-y-8 p-4 text-center md:py-7 md:px-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi-off size-32 text-gray-500 dark:text-neutral-200"><path d="M12 20h.01" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /><path d="M5 12.859a10 10 0 0 1 5.17-2.69" /><path d="M19 12.859a10 10 0 0 0-2.007-1.523" /><path d="M2 8.82a15 15 0 0 1 4.177-2.643" /><path d="M22 8.82a15 15 0 0 0-11.288-3.764" /><path d="m2 2 20 20" /></svg>
                <div>
                    <h3 className="text-2xl font-bold text-gray-300 dark:text-white">
                        You are currently Offliine
                    </h3>
                    <div className="mt-2 text-gray-400 dark:text-neutral-400">
                        Custos needs network connectivity to function properly.
                    </div>
                </div>
                <button
                    className="mt-3 py-3 px-6 inline-flex justify-center items-center gap-x-2 text-md font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => router.refresh()}
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
}
