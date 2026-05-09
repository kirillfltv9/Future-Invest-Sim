// Persistent nickname so the app can greet the user the same way every time.
// The user is asked once on first launch; "Skip" remembers their choice and
// won't ask again. They can always set/change it later from the setup page.

const NICKNAME_KEY = "future_nickname";
const PROMPTED_KEY = "future_nickname_prompted";

export const NICKNAME_MAX_LEN = 20;

export function loadNickname(): string {
  try {
    const v = localStorage.getItem(NICKNAME_KEY);
    return typeof v === "string" ? v : "";
  } catch {
    return "";
  }
}

export function saveNickname(name: string): void {
  try {
    const cleaned = name.trim().slice(0, NICKNAME_MAX_LEN);
    if (cleaned) localStorage.setItem(NICKNAME_KEY, cleaned);
    else localStorage.removeItem(NICKNAME_KEY);
    localStorage.setItem(PROMPTED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function markNicknamePrompted(): void {
  try {
    localStorage.setItem(PROMPTED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasBeenPromptedForNickname(): boolean {
  try {
    return localStorage.getItem(PROMPTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearNickname(): void {
  try {
    localStorage.removeItem(NICKNAME_KEY);
    localStorage.removeItem(PROMPTED_KEY);
  } catch {
    /* ignore */
  }
}
