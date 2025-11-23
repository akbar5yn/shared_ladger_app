declare global {
    interface Window {
        wt?: {
            getColorScheme: () => string;
            removeColorScheme: () => void;
        };
    }
}

export default defineNuxtPlugin(() => {
    if (typeof navigator !== 'undefined' && /NativeScript/.test(navigator.userAgent)) {
        console.log('[WebView Fallback] NativeScript WebView detected');

        // ----- fallback localStorage -----
        const ls = window.localStorage;
        if (ls) {
            const originalGetItem = ls.getItem;
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
                console.log('[localStorage.clear]');
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

        // ----- fallback dark mode API Nuxt PWA -----
        if (!window.wt) {
            window.wt = {
                getColorScheme: () => {
                    console.log('[wt.getColorScheme] called');
                    return 'light';
                },
                removeColorScheme: () => {
                    console.log('[wt.removeColorScheme] called');
                },
            };
        }

        // ----- disable Service Worker -----
        Object.defineProperty(navigator, 'serviceWorker', {
            get: () => {
                console.log('[navigator.serviceWorker] access blocked for WebView');
                return undefined;
            }
        });

        console.log('[WebView Fallback] Setup complete');
    } else {
        console.log('[WebView Fallback] Browser normal, SW handled by @vite-pwa/nuxt');
    }
});
