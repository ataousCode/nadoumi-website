export default function useExportCSV() {
  const toCSV = (items = []) => {
    const headers = ['id', 'name', 'email', 'phone', 'program', 'status', 'submittedAt']
    const rows = items.map((it) => [
      it.id,
      it.display?.name || '',
      it.display?.email || '',
      it.display?.phone || '',
      it.display?.program || '',
      it.status || '',
      it.submittedAt || '',
    ])
    const lines = [headers.join(','), ...rows.map((r) => r.map((v) => String(v).replaceAll(',', ';')).join(','))]
    return lines.join('\n')
  }

  const download = (csv, filename = 'applications.csv') => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return { toCSV, download }
}