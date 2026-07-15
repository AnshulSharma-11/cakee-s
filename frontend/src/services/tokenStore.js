// Module-level, memory-only token holder.
// Not persisted to localStorage/sessionStorage by design (per session brief):
// a page refresh clears auth state and the user must log in again.
let currentToken = null

export function getToken() {
  return currentToken
}

export function setToken(token) {
  currentToken = token
}

export function clearToken() {
  currentToken = null
}
