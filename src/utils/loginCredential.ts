export const LOGIN_PASSWORD_SESSION_KEY = 'ued-login-password';

export function saveLoginPassword(password: string) {
  sessionStorage.setItem(LOGIN_PASSWORD_SESSION_KEY, password);
}

export function clearLoginPassword() {
  sessionStorage.removeItem(LOGIN_PASSWORD_SESSION_KEY);
}

export function verifyLoginPassword(input: string) {
  const stored = sessionStorage.getItem(LOGIN_PASSWORD_SESSION_KEY);
  if (!stored) return false;
  return stored === input;
}
