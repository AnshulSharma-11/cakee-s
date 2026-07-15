export function extractErrorMessage(err) {
  const data = err?.response?.data
  if (data?.fieldErrors) {
    const first = Object.values(data.fieldErrors)[0]
    if (first) return first
  }
  return data?.message || err?.message || 'Something went wrong. Please try again.'
}
