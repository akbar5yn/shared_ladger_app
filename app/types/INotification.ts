export type TNotification = 'success' | 'error' | 'info'
export type TTransactionMetadata = 'INCOME_AUTO' | 'QRIS_AUTO' | 'TRANSFER_MANUAL' | 'UNCLEAR'
export type TTransactionCategory =
    | 'Makan/Minum'
    | 'Belanja'
    | 'Gaji/Income'
    | 'Tabungan'
    | 'Cicilan/Tagihan'
    | 'Kirim Orang Tua'
    | 'Jajan'
    | 'Lainnya';

export interface MyBankEvent extends Event {
    data: {
        title: string;
        text: string;
        pkg: string;
    };
}

export interface IRecentTransaction {
    id: number | string
    title: string
    text: string
    category?: TTransactionCategory
    icon: string
    date: string
    time: string
    amount: number
    type: 'income' | 'expense'
    metadata?: TTransactionMetadata
}