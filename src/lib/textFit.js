export function fitFontSize(text) {
  const len = text.length
  if (len <= 2) return '1.6rem'
  if (len <= 4) return '1.3rem'
  if (len <= 6) return '1.05rem'
  return '0.85rem'
}
