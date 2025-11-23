export default defineNuxtPlugin(() => {
    if (typeof navigator !== 'undefined' && /NativeScript/.test(navigator.userAgent)) {
        console.log('NativeScript WebView detected, Service Worker disabled');
    } else {
        console.log('Browser normal, SW handled by @vite-pwa/nuxt');
    }
});
