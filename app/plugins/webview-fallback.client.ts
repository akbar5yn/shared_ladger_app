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
        console.log('NativeScript WebView detected, applying browser API fallbacks');

        // fallback localStorage
        const fallbackStorage: Storage = {
            getItem: (key: string) => null,
            setItem: (key: string, value: string) => { },
            removeItem: (key: string) => { },
            clear: () => { },
            key: (index: number) => null,
            length: 0,
        };
        window.localStorage = fallbackStorage;

        // fallback matchMedia
        window.matchMedia = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => false,
        } as MediaQueryList);

        // fallback dark mode API Nuxt PWA
        window.wt = {
            getColorScheme: () => 'light',
            removeColorScheme: () => { },
        };
    }
});
