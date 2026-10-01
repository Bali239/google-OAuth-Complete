import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api.js";

export default function Login() {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [searchParams] = useSearchParams();
    const authenticationError = searchParams.get("error");

    const startGoogleSignIn = () => {
        setIsRedirecting(true);
        window.location.assign(api.getUri({ url: "/auth/google" }));
    };

    const errorMessage = authenticationError
        ? "Google sign-in could not be completed. Please try again."
        : null;

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-50 via-zinc-100 to-slate-200 dark:from-slate-950 dark:via-zinc-900 dark:to-slate-900 flex items-center justify-center p-4">

            <div className="w-full max-w-md p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800 flex flex-col items-center transition-all duration-500 transform hover:scale-[1.01]">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please sign in with your Google account to continue</p>
                </div>


                <div className="w-full">
                    <button
                        onClick={startGoogleSignIn}
                        disabled={isRedirecting}
                        className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.98] transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden"
                    >

                        <div className="absolute inset-0 bg-linear-to-r from-blue-50/50 via-indigo-50/30 to-transparent dark:from-blue-950/30 dark:via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {isRedirecting ? (
                            <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                                <span className="relative z-10 tracking-wide">Sign in with Google</span>
                            </>
                        )}
                    </button>
                </div>

                {errorMessage && (
                    <p className="mt-4 text-sm text-red-600" role="alert">
                        {errorMessage}
                    </p>
                )}


                <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 text-center">
                    By signing in, you agree to our <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a> & <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
                </p>

            </div>
        </div>
    )
}
