import type { SoulPrintSession } from '../types';
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export function isSession(value: unknown): value is SoulPrintSession {
  if (!value || typeof value !== 'object') return false;
  const s = value as Partial<SoulPrintSession>;
  return typeof s.id === 'string' && typeof s.createdAt === 'string' && typeof s.updatedAt === 'string' && Array.isArray(s.completedSteps) && s.completedSteps.every(x => typeof x === 'string');
}
export function readSession(store: Store, key: string): SoulPrintSession | null {
  try { const value: unknown = JSON.parse(store.getItem(key) || 'null'); return isSession(value) ? withoutImages(value) : null; } catch { return null; }
}
export function readArchive(store: Store, key: string): SoulPrintSession[] {
  try { const value: unknown = JSON.parse(store.getItem(key) || '[]'); return Array.isArray(value) ? value.filter(isSession).map(withoutImages) : []; } catch { return []; }
}
export function withoutImages(session: SoulPrintSession): SoulPrintSession {
  const result = { ...session }; delete result.images; return result;
}
export function writeStored(store: Store, key: string, value: unknown): boolean {
  try { store.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
