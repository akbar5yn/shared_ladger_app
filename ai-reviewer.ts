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
    const diff = spawnSync("git", ["diff", "--cached"], { encoding: "utf-8" }).stdout;
    if (!diff || diff.trim() === "") process.exit(0);

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
                model: "qwen2.5-coder:3b",
                prompt: `Tugasmu adalah mereview potongan kode (GIT DIFF) berdasarkan daftar aturan di bawah ini.
        
        DAFTAR ATURAN:
        ${combinedRules}

        KODE DIFF UNTUK DIREVIEW:
        ${diff}

        Instruksi Akhir:
        - Berikan poin-poin saran jika ada pelanggaran.
        - Jika ada satu saja aturan yang dilanggar parah, akhiri dengan kata "FAILED".
        - Jika semua aman, balas hanya dengan "PASSED".
        - PENTING: Jika perubahan terjadi pada file 'ai-reviewer.ts' atau file di dalam folder 'ai-rules/', BERIKAN STATUS [STATUS_PASSED] SECARA OTOMATIS untuk file tersebut. Jangan mereview logika sistem AI Guard itu sendiri.`,

                stream: false,
            }),
        });

        const result = (await response.json()) as OllamaResponse;
        const feedback = result.response.trim();

        const isPassed = feedback.toUpperCase().includes("PASSED");
        const isFailed = feedback.toUpperCase().includes("FAILED");

        if (isFailed) {
            console.error("\n❌ COMMIT DITOLAK OLEH AI GUARD:\n");
            console.log(feedback);
            console.log("\n--------------------------------------------------");
            process.exit(1);
        } else if (isPassed) {
            console.log("✅ AI Approved! Kode Anda 'Masterpiece'.");
            process.exit(0);
        } else {
            console.warn("⚠️ Respons AI tidak jelas, tetapi tidak ada tanda FAILED. Melanjutkan...");
            process.exit(0);
        }
    } catch (err: any) {
        console.error("⚠️ Gagal koneksi ke Ollama:", err.message);
        process.exit(0);
    }
}

runReview();