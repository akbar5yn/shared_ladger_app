export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('id-ID')

export const formatTime = (date: string | Date) =>
  new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
