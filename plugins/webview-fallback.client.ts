declare global {
    interface Window {
        wt?: {
            getColorScheme: () => string;
            removeColorScheme: () => void;
        };
    }
}

// ====== Plugin Nuxt ======
export default defineNuxtPlugin(() => {
    const ua = navigator.userAgent || "";
    const isWebView = /NativeScript/.test(ua);

    console.log("[WebView Fallback] UA:", ua);
    console.log("[WebView Fallback] Detected:", isWebView);

    if (!isWebView) {
        console.log("[WebView Fallback] Browser normal → fallback tidak dijalankan");
        return;
    }

    console.log("[WebView Fallback] NativeScript WebView detected");

    // ----- fallback localStorage -----
    const ls = window.localStorage;
    if (ls) {
        ls.getItem = (key: string) => {
            console.log(`[localStorage.getItem] key=${key}`);
            return null;
        };
        ls.setItem = (key: string, value: string) => {
            console.log(`[localStorage.setItem] key=${key} value=${value}`);
        };
        ls.removeItem = (key: string) => {
            console.log(`[localStorage.removeItem] key=${key}`);
        };
        ls.clear = () => {
            console.log("[localStorage.clear]");
        };
    }

    // ----- fallback matchMedia -----
    window.matchMedia = (query: string) => {
        console.log(`[matchMedia] query=${query}`);
        return {
            matches: false,
            media: query,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => false,
        } as MediaQueryList;
    };

    // ----- fallback dark mode API Nuxt UI / PWA -----
    if (!window.wt) {
        window.wt = {
            getColorScheme: () => {
                console.log("[wt.getColorScheme]");
                return "light";
            },
            removeColorScheme: () => {
                console.log("[wt.removeColorScheme]");
            }
        };
    }

    // ----- Disable service worker di WebView -----
    Object.defineProperty(navigator, "serviceWorker", {
        get: () => {
            console.log("[navigator.serviceWorker] disabled for WebView");
            return undefined;
        }
    });

    console.log("[WebView Fallback] Setup complete");
});
