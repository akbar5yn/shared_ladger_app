import { Toast } from '@capacitor/toast'

export async function appLog(msg: string) {
    console.log(msg)
    try {
        await Toast.show({
            text: msg,
            duration: 'short',
            position: 'bottom'
        })
    } catch { }
}
