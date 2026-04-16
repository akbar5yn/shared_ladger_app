# Aturan Struktur Nuxt 4 (Service-Layer Pattern)

1. **Folder app/services/**:
   - Wajib berisi logika komunikasi API menggunakan `apiFetch`.
   - Nama file wajib berakhiran `.service.ts` (contoh: `auth.service.ts`).
   - Dilarang memanggil `useStore` atau `useRouter` di sini. Fokus hanya pada data fetching.

2. **Folder app/composables/**:
   - Wajib menggunakan pattern "useX" (contoh: `useAuth.ts`).
   - Tempat menggabungkan (orchestration) antara logic Service, Store, dan UI Logic (Router/Notification).
   - Gunakan `ref` untuk state lokal seperti `isLoading`.

3. **Folder server/api/**:
   - Digunakan sebagai "Jembatan API" (Proxy/Backend-for-Frontend).
   - Struktur folder harus mencerminkan endpoint (contoh: `server/api/auth/login.ts`).
