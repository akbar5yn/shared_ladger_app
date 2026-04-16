import { spawnSync } from "node:child_process";

interface OllamaResponse {
    response: string;
}

async function checkOllama(): Promise<boolean> {
    try {
        const res = await fetch("http://localhost:11434/api/tags");
        return res.ok;
    } catch {
        return false;
    }
}

async function runReview(): Promise<void> {
    const isReady = await checkOllama();
    if (!isReady) {
        console.log("ℹ️ [Bun] AI Lokal tidak aktif. Melewati pengecekan...");
        process.exit(0);
    }

    // Menggunakan spawnSync untuk mengambil diff
    const diff = spawnSync("git", ["diff", "--cached"], { encoding: "utf-8" }).stdout;

    if (!diff || diff.trim() === "") {
        process.exit(0);
    }

    console.log("🤖 [Bun TS] AI sedang mereview struktur & kerapihan kode...");

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "qwen2.5-coder:3b", // Model andalan Anda
                prompt: `Review kode berikut untuk standar Nuxt 4. 
        Pastikan:
        1. Struktur file sesuai (composables, components, pages).
        2. Kerapihan indentasi dan penamaan.
        3. Tidak ada potensi bug atau variabel tak terpakai.

        Jika bagus, balas "PASSED". 
        Jika bermasalah, beri saran singkat dan akhiri dengan "FAILED".

        KODE:
        ${diff}`,
                stream: false
            }),
        });

        const result = (await response.json()) as OllamaResponse;
        const feedback = result.response;

        if (feedback.includes("FAILED")) {
            console.error("\n❌ COMMIT DITOLAK OLEH AI GUARD:\n");
            console.log(feedback.replace("FAILED", ""));
            process.exit(1);
        } else {
            console.log("✅ AI Approved! Kode rapi.");
            process.exit(0);
        }
    } catch (err: any) {
        console.error("⚠️ Gagal koneksi ke Ollama:", err.message);
        process.exit(0);
    }
}

runReview();