import { readSession, readArchive, withoutImages, writeStored } from '../services/sessionStorage';
import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  SoulPrintSession,
  PersonalData,
  MBTIResult,
  EnneagramResult,
  BigFiveResult,
  NeuralResonanceResult,
  DISCResult,
  VoidGazeResult,
  NarrativeArcResult,
  JungianResult,
  ShadowWorkResult,
  ImageUploadData,
} from '../types';
import { AppStep } from '../types';

type SessionAction =
  | { type: 'SET_PERSONAL_DATA'; payload: PersonalData }
  | { type: 'SET_MBTI'; payload: MBTIResult }
  | { type: 'SET_ENNEAGRAM'; payload: EnneagramResult }
  | { type: 'SET_BIG_FIVE'; payload: BigFiveResult }
  | { type: 'SET_NEURAL_RESONANCE'; payload: NeuralResonanceResult }
  | { type: 'SET_DISC'; payload: DISCResult }
  | { type: 'SET_VOID_GAZE'; payload: VoidGazeResult }
  | { type: 'SET_NARRATIVE_ARC'; payload: NarrativeArcResult }
  | { type: 'SET_JUNGIAN'; payload: JungianResult }
  | { type: 'SET_SHADOW_WORK'; payload: ShadowWorkResult }
  | { type: 'SET_IMAGES'; payload: ImageUploadData }
  | { type: 'SET_REPORT'; payload: string }
  | { type: 'COMPLETE_STEP'; payload: AppStep }
  | { type: 'LOAD_SESSION'; payload: SoulPrintSession }
  | { type: 'RESET_SESSION' };

function createNewSession(): SoulPrintSession {
  return {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedSteps: [],
  };
}

function sessionReducer(state: SoulPrintSession, action: SessionAction): SoulPrintSession {
  const updated = { ...state, updatedAt: new Date().toISOString() };

  switch (action.type) {
    case 'SET_PERSONAL_DATA':
      return { ...updated, personalData: action.payload };
    case 'SET_MBTI':
      return { ...updated, mbti: action.payload };
    case 'SET_ENNEAGRAM':
      return { ...updated, enneagram: action.payload };
    case 'SET_BIG_FIVE':
      return { ...updated, bigFive: action.payload };
    case 'SET_NEURAL_RESONANCE':
      return { ...updated, neuralResonance: action.payload };
    case 'SET_DISC':
      return { ...updated, disc: action.payload };
    case 'SET_VOID_GAZE':
      return { ...updated, voidGaze: action.payload };
    case 'SET_NARRATIVE_ARC':
      return { ...updated, narrativeArc: action.payload };
    case 'SET_JUNGIAN':
      return { ...updated, jungian: action.payload };
    case 'SET_SHADOW_WORK':
      return { ...updated, shadowWork: action.payload };
    case 'SET_IMAGES':
      return { ...updated, images: action.payload };
    case 'SET_REPORT':
      return { ...updated, report: action.payload };
    case 'COMPLETE_STEP':
      return {
        ...updated,
        completedSteps: [...new Set([...state.completedSteps, action.payload])],
      };
    case 'LOAD_SESSION':
      return action.payload;
    case 'RESET_SESSION':
      return createNewSession();
    default:
      return state;
  }
}

interface SessionContextType {
  session: SoulPrintSession;
  dispatch: React.Dispatch<SessionAction>;
  savedSessions: SoulPrintSession[];
  saveCurrentSession: () => void;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
  completionPercentage: number;
}

const SessionContext = createContext<SessionContextType | null>(null);

const STORAGE_KEY = 'soulprint_session';
const ARCHIVE_KEY = 'soulprint_archive';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(sessionReducer, null, () => {
    try { return readSession(localStorage, STORAGE_KEY) || createNewSession(); }
    catch { return createNewSession(); }
  });

  const [savedSessions, setSavedSessions] = useReducer(
    (_: SoulPrintSession[], action: { type: string; payload?: SoulPrintSession[] }) => {
      if (action.type === 'SET') return action.payload ?? [];
      return [];
    },
    [],
    () => {
      try { return readArchive(localStorage, ARCHIVE_KEY); } catch { return []; }
    }
  );

  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { setStorageError(!writeStored(localStorage, STORAGE_KEY, withoutImages(session))); }
    catch { setStorageError(true); }
  }, [session]);

  useEffect(() => {
    try { if (!writeStored(localStorage, ARCHIVE_KEY, savedSessions)) setStorageError(true); }
    catch { setStorageError(true); }
  }, [savedSessions]);

  const saveCurrentSession = () => {
    const archive = savedSessions.filter(s => s.id !== session.id);
    archive.push(withoutImages(session));
    setSavedSessions({ type: 'SET', payload: archive });
    try { setStorageError(!writeStored(localStorage, ARCHIVE_KEY, archive)); }
    catch { setStorageError(true); }
  };

  const loadSession = (id: string) => {
    const found = savedSessions.find(s => s.id === id);
    if (found) dispatch({ type: 'LOAD_SESSION', payload: found });
  };

  const deleteSession = (id: string) => {
    const filtered = savedSessions.filter(s => s.id !== id);
    setSavedSessions({ type: 'SET', payload: filtered });
    try { setStorageError(!writeStored(localStorage, ARCHIVE_KEY, filtered)); }
    catch { setStorageError(true); }
  };

  const clearAllData = () => {
    if (!window.confirm('Delete current and archived Soul Print assessments from this device? Exported copies will remain.')) return;
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(ARCHIVE_KEY); setStorageError(false); }
    catch { setStorageError(true); }
    setSavedSessions({ type: 'SET', payload: [] });
    dispatch({ type: 'RESET_SESSION' });
  };

  const completionPercentage = Math.round(
    (session.completedSteps.length / 11) * 100
  );

  return (
    <SessionContext.Provider
      value={{
        session,
        dispatch,
        savedSessions,
        saveCurrentSession,
        loadSession,
        deleteSession,
        completionPercentage,
      }}
    >
      <aside className="px-4 py-2 text-sm text-center bg-slate-950 text-slate-200" aria-label="Assessment privacy">
        Assessments stay in this browser. Optional images are not saved with assessments or sent for analysis.
        <button type="button" className="ml-3 underline" onClick={clearAllData}>Delete assessment data</button>
        {storageError && <p role="alert">Browser storage is unavailable or full. Changes remain in memory for this visit; download your report before leaving.</p>}
      </aside>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
