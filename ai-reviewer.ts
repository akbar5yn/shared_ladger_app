/// <reference types="@types/node" />
/// <reference types="@types/bun" />

import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";

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

    // 1. Ambil Diff
    const diff = spawnSync("git", ["diff", "--cached", "--name-only"], { encoding: "utf-8" }).stdout;
    const fullDiff = spawnSync("git", ["diff", "--cached"], { encoding: "utf-8" }).stdout;
    if (!fullDiff || fullDiff.trim() === "") process.exit(0);

    const changedFiles = diff.split("\n").filter(f => f.trim() !== "");
    const isOnlyAISystemChanged = changedFiles.every(file =>
        file.includes("ai-reviewer.ts") || file.includes("ai-rules/")
    );

    if (isOnlyAISystemChanged) {
        console.log("✅ [Amnesti AI] Hanya file sistem AI yang berubah. Skip review.");
        process.exit(0);
    }

    // 2. Load Semua Aturan dari Folder ai-rules
    const rulesDir = path.join(process.cwd(), "ai-rules");
    let combinedRules = "";

    try {
        const ruleFiles = readdirSync(rulesDir).filter((file) => file.endsWith(".md"));

        if (ruleFiles.length === 0) {
            console.warn("⚠️ Tidak ada file .md di folder ai-rules. Menggunakan standar general.");
        }

        for (const fileName of ruleFiles) {
            const filePath = path.join(rulesDir, fileName);
            const content = await Bun.file(filePath).text();
            combinedRules += `\n--- ATURAN DARI ${fileName} ---\n${content}\n`;
        }
    } catch (error) {
        console.error("❌ Gagal membaca folder ai-rules. Pastikan folder tersebut ada.");
        process.exit(1);
    }

    console.log(`🤖 [Bun TS] AI sedang mereview berdasarkan ${combinedRules.split('--- ATURAN').length - 1} modul aturan...`);

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "qwen2.5-coder:7b",
                prompt: `Tugasmu adalah mereview potongan kode (GIT DIFF) berdasarkan daftar aturan di bawah ini.
        
        ATURAN ARSITEKTUR:
        ${combinedRules}

        KODE DIFF UNTUK DIREVIEW:
        ${fullDiff}

        Instruksi Akhir:
        - Kamu WAJIB memberikan alasan singkat kenapa kode ini melanggar aturan sebelum menuliskan status.
        - Berikan poin-poin saran jika ada pelanggaran.
        - Jika ada satu saja aturan yang dilanggar parah, akhiri dengan kata kunci: [[RESULT_FAILED]].
        - Jika semua aman, balas hanya dengan kata kunci: [[RESULT_PASSED]].
        - PENTING: Jika perubahan terjadi pada file 'ai-reviewer.ts' atau file di dalam folder 'ai-rules/', BERIKAN STATUS [STATUS_PASSED] SECARA OTOMATIS untuk file tersebut. Jangan mereview logika sistem AI Guard itu sendiri.
        - Jangan berasumsi ada kode yang tidak tertulis. Review hanya apa yang ada di dalam diff.`,

                options: {
                    temperature: 0.1, // Sedikit lebih kreatif tapi tetap konsisten
                    num_ctx: 8192 // Perlebar konteks biar dia baca semua aturannya
                },
                stream: false,
            }),
        });

        const result = await response.json() as OllamaResponse;

        if (!result || !result.response) {
            throw new Error("Respon dari Ollama kosong atau tidak valid");
        }

        const feedback = result.response.trim();

        if (feedback.includes("[[RESULT_FAILED]]")) {
            console.error("\n❌ COMMIT DITOLAK OLEH AI GUARD:\n");
            console.log(feedback.replace("[[RESULT_FAILED]]", "").trim());
            console.log("\n--------------------------------------------------");
            process.exit(1);
        } else if (feedback.includes("[[RESULT_PASSED]]")) {
            console.log("✅ AI Approved! Kode Anda 'Masterpiece'.");
            process.exit(0);
        } else {
            console.log("🤖 AI Feedback:\n", feedback);
            if (feedback.toUpperCase().includes("FAILED")) process.exit(1);
            process.exit(0);
        }
    } catch (err: any) {
        console.error("⚠️ Gagal koneksi ke Ollama:", err.message);
        process.exit(0);
    }
}

runReview();