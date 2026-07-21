// Verified Unsplash photo IDs (Unsplash License — free to use, no attribution
// required). Used for full-bleed background photography behind glass panels.
const PHOTO = {
  weddingCake: '1503525642560-ecca5e2e49e9',
  chocolateCake: '1516054575922-f0b8eeadec1a',
  vanillaLayerCake: '1536599524557-5f784dd53282',
  cupcakes: '1611692276815-cd6efa0b2dac',
  birthdayCake: '1464349153735-7db50ed83c84',
  berryCake: '1669926187718-7cf723d02c29',
}

/** Build a resized Unsplash CDN url — the CDN accepts w/h/q overrides on any photo id. */
export function unsplash(id, { w = 1200, h, fit = 'crop', q = 80 } = {}) {
  const params = new URLSearchParams({ auto: 'format', fit, q: String(q), w: String(w) })
  if (h) params.set('h', String(h))
  return `https://images.unsplash.com/photo-${id}?${params.toString()}`
}

export default PHOTO
