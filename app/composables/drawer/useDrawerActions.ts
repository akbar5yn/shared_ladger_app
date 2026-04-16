import { Ocr } from "@jcesarmobile/capacitor-ocr";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { useTransactionStore } from "~/stores/useTransactionStore";
import type { TTransactionCategory, TTransactionMetadata } from "~/types/INotification";

export const useDrawerActions = () => {
    const transactionStore = useTransactionStore();
    const isOcrModalOpen = ref(false);
    const isSaving = ref(false);
    const isEditModalOpen = ref(false);
    const selectedItemForEdit = ref<any>(null);
    const manualNote = ref("");
    const ocrTempData = ref({ amount: 0, note: "", timestamp: Date.now(), personName: "", metadata: "UNCLEAR" as TTransactionMetadata, isIncome: false });

    const uploadReceipt = async () => {
        try {
            const result = await FilePicker.pickFiles({ types: ["image/png", "image/jpeg"] });
            if (!result.files.length) return;

            const { results } = await Ocr.process({ image: result.files[0]?.path! });
            const fullText = results.map((r) => r.text).join("\n");

            // Extract Amount
            const amountMatch = fullText.match(/(?:Jumlah Transfer|Rp)\s*[:.]?\s*([\d.,]+)/i);
            let cleanAmount = 0;
            if (amountMatch && amountMatch[1]) {
                const rawAmount = String(amountMatch[1]).split(",")[0];
                if (rawAmount) cleanAmount = parseInt(rawAmount.replace(/[.\s]/g, "")) || 0;
            }

            // Extract Name
            const nameMatch = fullText.match(/Tujuan\s+([A-Z\s]+?)\s+(?:Dari|Metode)/i);
            const personName = nameMatch?.[1]?.trim() ?? "Transfer Dana";

            // Extract Timestamp
            let transactionTimestamp = Date.now();
            const dateMatch = fullText.match(
                /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),\s+(\d{2}:\d{2})/
            );

            if (dateMatch) {
                const [_, day, monthStr, year, time] = dateMatch;
                const months: Record<string, string> = {
                    Jan: "01",
                    Feb: "02",
                    Mar: "03",
                    Apr: "04",
                    Mei: "05",
                    Jun: "06",
                    Jul: "07",
                    Agu: "08",
                    Sep: "09",
                    Okt: "10",
                    Nov: "11",
                    Des: "12",
                };

                if (monthStr) {
                    const month = months[monthStr.substring(0, 3)] || "01";
                    const isoDate = `${year}-${month}-${day?.padStart(2, "0")}T${time}:00`;
                    const parsedDate = new Date(isoDate);
                    if (!isNaN(parsedDate.getTime())) transactionTimestamp = parsedDate.getTime();
                }
            }

            // Determine Metadata
            const isIncome = fullText.toLowerCase().includes("masuk");
            let metadata: TTransactionMetadata = "UNCLEAR";
            if (
                fullText.toLowerCase().includes("bi fast") ||
                fullText.toLowerCase().includes("transfer")
            ) {
                metadata = "TRANSFER_MANUAL";
            } else if (isIncome) {
                metadata = "INCOME_AUTO";
            } else if (fullText.toLowerCase().includes("qris")) {
                metadata = "QRIS_AUTO";
            }

            // Prepare Temp Data & Show Modal
            ocrTempData.value = {
                amount: cleanAmount,
                note: `Transfer ke ${personName}`,
                timestamp: transactionTimestamp,
                personName,
                metadata,
                isIncome,
            };
            isOcrModalOpen.value = true;
        } catch (e) {
            console.error("Error Scan:", e);
        }
    };

    const confirmAndSave = async () => {
        isSaving.value = true;
        const { amount, note, timestamp, personName, metadata, isIncome } = ocrTempData.value;
        const metadataIconMap: Record<TTransactionMetadata, string> = {
            INCOME_AUTO: "i-heroicons-arrow-down-circle",
            QRIS_AUTO: "i-heroicons-qr-code",
            TRANSFER_MANUAL: "i-heroicons-paper-airplane",
            UNCLEAR: "i-heroicons-question-mark-circle",
        };

        await transactionStore.addTransaction({
            title: isIncome ? `Terima dari ${personName}` : `Transfer`,
            text: note,
            amount: Number(amount),
            metadata: metadata,
            pkg: "OCR",
            timestamp: timestamp,
            icon: metadataIconMap[metadata],
        });

        isSaving.value = false;
        isOcrModalOpen.value = false;
    };

    const openEditModal = (item: any) => {
        selectedItemForEdit.value = item;
        manualNote.value = item.text;
        isEditModalOpen.value = true;
    };

    const handleFinalConfirm = (opt: any) => {
        if (!selectedItemForEdit.value) return;
        selectedItemForEdit.value.text = manualNote.value;
        transactionStore.confirmTransaction(
            selectedItemForEdit.value.id,
            opt.value as TTransactionCategory,
            opt.type
        );
        isEditModalOpen.value = false;
    };

    return { uploadReceipt, confirmAndSave, openEditModal, handleFinalConfirm, manualNote, isEditModalOpen, isOcrModalOpen, isSaving, ocrTempData, selectedItemForEdit }
}