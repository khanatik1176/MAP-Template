export function formatDateToShort(dateValue?: string | null) {
  if (!dateValue) return '-'
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return '-'
  const day = d.getDate()
  const month = d.toLocaleString('en-US', { month: 'short' })
  const year = d.getFullYear()
  return `${day} ${month}, ${year}`
}

export function formatDateTime(dateValue?: string | null) {
  if (!dateValue) return '-'
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return '-'
  const day = d.getDate()
  const month = d.toLocaleString('en-US', { month: 'short' }) // e.g. "Oct"
  const year = d.getFullYear()
  let hours = d.getHours()
  const minutes = d.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  const minuteStr = String(minutes).padStart(2, '0')
  const hourStr = String(hours)
  return `${day} ${month}, ${year} ${hourStr}.${minuteStr}${ampm}`
}

export function formatDateTimeWithSeconds(dateValue?: string | null) {
  if (!dateValue) return '-'

  // Normalize fractional seconds to milliseconds so Date can parse reliably.
  // Handles inputs like "2025-11-03T03:26:30.702756Z"
  const m = String(dateValue).match(/(.*T\d{2}:\d{2}:\d{2})(\.(\d+))?(Z|[+\-].+)?$/)
  if (!m) return '-'

  const base = m[1] // "2025-11-03T03:26:30"
  let frac = m[3] ?? '' // "702756" or undefined
  const tz = m[4] ?? 'Z' // timezone part or default Z

  if (frac.length > 3) frac = frac.slice(0, 3)
  else if (frac.length < 3) frac = frac.padEnd(3, '0')

  const iso = frac ? `${base}.${frac}${tz}` : `${base}${tz}`

  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'

  const day = d.getDate()
  const month = d.toLocaleString('en-US', { month: 'short' })
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12

  const hourStr = String(hour12).padStart(2, '0')
  const minuteStr = String(minutes).padStart(2, '0')
  const secondStr = String(seconds).padStart(2, '0')

  return `${day} ${month}, ${year} ${hourStr}:${minuteStr}:${secondStr} ${ampm}`
}


export const formatDateForExcel = (v: any): string => {
    if (!v) return '';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

export const getInitials = (userData?: { name?: string; username?: string }) => {
    const source = (userData?.name ?? userData?.username ?? '').toString().trim();
    if (!source) return 'NA';
    return source.slice(0, 2).toUpperCase();
  };


