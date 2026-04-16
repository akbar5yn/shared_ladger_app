// utils/useIconMapper.ts

export const ICON_LIBRARY: Record<string, { label: string; icon: string; color: string; keywords: string[] }> = {
    food: {
        label: 'Makan/Minum',
        icon: 'i-heroicons-cake', // Pakai utensils biar beda ama jajan
        color: 'amber-makan', // Kita kasih ID unik buat warna
        keywords: ['makan', 'bakso', 'mie', 'nasi', 'warung', 'resto', 'ayam', 'warmindo', 'kenyang'],
    },
    cafe: {
        label: 'Jajan',
        icon: 'i-heroicons-cake',
        color: 'amber-jajan',
        keywords: ['kopi', 'coffee', 'starbucks', 'mixue', 'boba', 'teh', 'cafe', 'fore', 'kopken'],
    },
    grocery: {
        label: 'Belanja',
        icon: 'i-heroicons-shopping-bag',
        color: 'teal-belanja',
        keywords: ['indomaret', 'alfamart', 'supermarket', 'mall', 'pasar', 'shopee', 'tokopedia', 'alfamidi'],
    },
    transport: {
        label: 'Transportasi',
        icon: 'i-heroicons-truck',
        color: 'slate-transport',
        keywords: ['bensin', 'pertamina', 'shell', 'parkir', 'tol', 'spbu', 'grab', 'gojek', 'maxim'],
    },
    bill: {
        label: 'Cicilan/Tagihan',
        icon: 'i-heroicons-credit-card',
        color: 'red-bill',
        keywords: ['listrik', 'token', 'pdam', 'air', 'wifi', 'pulsa', 'kuota', 'bpjs', 'pajak', 'angsuran'],
    },
    salary: {
        label: 'Gaji/Income',
        icon: 'i-heroicons-banknotes',
        color: 'emerald-income',
        keywords: ['gaji', 'payroll', 'upah', 'bonus', 'insentif', 'cuan'],
    },
    transfer: {
        label: 'Transfer',
        icon: 'i-heroicons-paper-airplane',
        color: 'blue-transfer',
        keywords: ['tf', 'transfer', 'bi-fast', 'kirim', 'dana', 'ovo', 'gopay'],
    },
    investment: {
        label: 'Investasi',
        icon: 'i-heroicons-chart-bar-square',
        color: 'indigo-invest',
        keywords: ['saham', 'reksadana', 'crypto', 'ajaib', 'bibit', 'emas'],
    },
}

export const getSmartVisuals = (text: string) => {
    const lowerText = text.toLowerCase()
    for (const key in ICON_LIBRARY) {
        const category = ICON_LIBRARY[key]
        if (category)
            if (category.keywords.some((k) => lowerText.includes(k))) {
                return category
            }
    }
    return null
}
