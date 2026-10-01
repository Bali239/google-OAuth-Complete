import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const loadCurrentUser = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const { data } = await api.get("/auth/me", { signal: controller.signal });

        if (!data?.user) {
          navigate("/", { replace: true });
          return;
        }

        setCurrentUser(data.user);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        if (axios.isAxiosError(error) && [401, 404].includes(error.response?.status)) {
          navigate("/", { replace: true });
          return;
        }

        setLoadError("We couldn't load your account. Check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadCurrentUser();

    return () => controller.abort();
  }, [navigate, retryCount]);

  const signOut = async () => {
    setIsLoggingOut(true);

    try {
      await api.post("/auth/logout");
      navigate("/", { replace: true });
    } catch {
      setLoadError("We couldn't sign you out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f5f2] px-6 text-[#29332e]">
        <p className="text-sm font-medium" role="status">Loading your account...</p>
      </main>
    );
  }

  if (loadError && !currentUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f3f5f2] px-6 text-[#29332e]">
        <section className="w-full max-w-md rounded-lg border border-[#d9dfd9] bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold">Account unavailable</h1>
          <p className="mt-3 text-sm text-[#64716a]" role="alert">{loadError}</p>
          <button
            className="mt-6 rounded-md bg-[#245c49] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#194a39] focus:outline-none focus:ring-2 focus:ring-[#245c49] focus:ring-offset-2"
            onClick={() => setRetryCount((count) => count + 1)}
            type="button"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f3f5f2] px-5 py-10 text-[#29332e] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-[#d9dfd9] pb-5">
          <p className="text-sm font-semibold tracking-wide text-[#245c49]">ACCOUNT</p>
          <button
            className="rounded-md border border-[#cbd4cc] px-4 py-2 text-sm font-semibold transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#245c49] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
            disabled={isLoggingOut}
            onClick={signOut}
            type="button"
          >
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        <section className="mt-10 overflow-hidden rounded-lg border border-[#d9dfd9] bg-white shadow-sm">
          <div className="h-2 bg-[#245c49]" />
          <div className="flex flex-col gap-7 p-6 sm:flex-row sm:items-center sm:p-9">
            {currentUser.picture ? (
              <img
                alt={`${currentUser.name}'s profile`}
                className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-[#edf3ef]"
                referrerPolicy="no-referrer"
                src={currentUser.picture}
              />
            ) : (
              <div
                aria-label="Profile image unavailable"
                className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[#edf3ef] text-3xl font-semibold text-[#245c49]"
              >
                {currentUser.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#718078]">Signed in with Google</p>
              <h1 className="mt-1 wrap-break-word text-2xl font-semibold">{currentUser.name}</h1>
              <p className="mt-2 break-all text-[#58665e]">{currentUser.email}</p>
            </div>
          </div>
          {loadError && (
            <p className="border-t border-[#f0d8d5] bg-[#fff7f6] px-6 py-3 text-sm text-[#a33c32]" role="alert">
              {loadError}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
