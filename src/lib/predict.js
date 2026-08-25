export function flattenVocabulary(vocabulary) {
  const out = []
  for (const cat of vocabulary.categories) {
    for (const text of cat.phrases) {
      out.push({ text, categoryId: cat.id })
    }
  }
  return out
}

// Suggests matching phrases as the user types: recent messages first (they're
// what this specific patient actually says), then the vocabulary bank.
// Prefix matches rank above "contains" matches within each source.
export function predictPhrases(query, allPhrases, recentMessages, limit = 8) {
  const q = query.trim()
  if (!q) return []

  const seen = new Set()
  const results = []

  const tryAdd = (text, categoryId, fromRecent) => {
    if (results.length >= limit || seen.has(text)) return
    results.push({ text, categoryId, fromRecent })
    seen.add(text)
  }

  for (const m of recentMessages) {
    if (m.text.startsWith(q)) tryAdd(m.text, m.categoryId, true)
  }
  for (const p of allPhrases) {
    if (p.text.startsWith(q)) tryAdd(p.text, p.categoryId, false)
  }
  for (const m of recentMessages) {
    if (m.text.includes(q)) tryAdd(m.text, m.categoryId, true)
  }
  for (const p of allPhrases) {
    if (p.text.includes(q)) tryAdd(p.text, p.categoryId, false)
  }

  return results
}
