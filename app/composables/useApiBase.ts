// Cache apiBase runtime. `import.meta.env.NUXT_PUBLIC_API_BASE` bersifat
// build-time dan bisa kosong di build Capacitor (device), sehingga socket
// jatuh ke fallback `localhost:4000`. Solusinya: saat boot (plugin, ada Nuxt
// context) kita ambil `runtimeConfig.public.apiBase` dan simpan ke variabel
// module-level ini. Dibaca dari mana saja (termasuk socket handler pasca-await)
// tanpa butuh Nuxt context lagi.

let cachedApiBase: string | null = null

export function setApiBase(base: string) {
    cachedApiBase = base
}

// Normalisasi: pastikan ada scheme, buang trailing slash.
function normalize(base: string): string {
    let v = base.trim()
    if (!v) return ''
    if (!/^https?:\/\//.test(v)) {
        v = `https://${v}`
    }
    return v.replace(/\/+$/, '')
}

// Ambil host (tanpa /api, tanpa trailing slash) untuk Socket.IO.
export function getSocketHost(): string {
    const raw = cachedApiBase || (import.meta.env.NUXT_PUBLIC_API_BASE as string) || ''
    const normalized = normalize(raw)
    if (!normalized) return 'http://localhost:4000'
    // strip path /api (bukan prefix) di akhir
    return normalized.replace(/\/api\/?$/, '')
}

// Ambil base URL untuk REST (ofetch).
export function getApiBase(): string {
    const raw = cachedApiBase || (import.meta.env.NUXT_PUBLIC_API_BASE as string) || ''
    return normalize(raw)
}
