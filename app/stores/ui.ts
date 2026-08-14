// stores/theme.ts
import type { IDataTransaction } from '~/types/ITransaction';

interface IImportData {
    history?: IDataTransaction[];
    actualBalance?: number;
}

export const useUIStore = defineStore('ui', {
    state: () => ({
        isDark: false,
        isLogoutModalOpen: false,
        isPageLoading: true,
        isImportModalOpen: false,
        importData: null as IImportData | null,
        isConfirmModalOpen: false,
        confirmModalConfig: {
            title: 'Apakah anda yakin?',
            description: 'Tindakan ini tidak dapat dibatalkan.',
            confirmText: 'Ya, Lanjutkan',
            cancelText: 'Batal',
            icon: 'i-heroicons-exclamation-triangle',
            variant: 'warning' as 'danger' | 'warning',
            onConfirm: () => { }
        }
    }),
    actions: {
        toggleTheme() {
            this.isDark = !this.isDark
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        },
        initTheme() {
            const saved = localStorage.getItem('theme')
            this.isDark = saved === 'dark'
        },
        openLogoutModal(isOpen: boolean) {
            this.isLogoutModalOpen = isOpen
        },
        openConfirmModal(config: Partial<typeof this.confirmModalConfig>) {
            this.confirmModalConfig = {
                title: config.title ?? 'Apakah anda yakin?',
                description: config.description ?? 'Tindakan ini tidak dapat dibatalkan.',
                confirmText: config.confirmText ?? 'Ya, Lanjutkan',
                cancelText: config.cancelText ?? 'Batal',
                icon: config.icon ?? 'i-heroicons-exclamation-triangle',
                variant: config.variant ?? 'warning',
                onConfirm: config.onConfirm ?? (() => { })
            }
            this.isConfirmModalOpen = true
        },
        setPageLoading(status: boolean) {
            this.isPageLoading = status;
        },
        openImportModal(data: IImportData) {
            this.importData = data;
            this.isImportModalOpen = true;
        },
        closeImportModal() {
            this.isImportModalOpen = false;
            this.importData = null;
        }
    }
})