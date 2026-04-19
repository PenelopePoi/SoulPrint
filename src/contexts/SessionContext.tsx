import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
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
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return createNewSession();
      }
    }
    return createNewSession();
  });

  const [savedSessions, setSavedSessions] = useReducer(
    (_: SoulPrintSession[], action: { type: string; payload?: SoulPrintSession[] }) => {
      if (action.type === 'SET') return action.payload ?? [];
      return [];
    },
    [],
    () => {
      const saved = localStorage.getItem(ARCHIVE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
      return [];
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const saveCurrentSession = () => {
    const archive = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]');
    const existingIdx = archive.findIndex((s: SoulPrintSession) => s.id === session.id);
    if (existingIdx >= 0) {
      archive[existingIdx] = session;
    } else {
      archive.push(session);
    }
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(archive));
    setSavedSessions({ type: 'SET', payload: archive });
  };

  const loadSession = (id: string) => {
    const archive = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]');
    const found = archive.find((s: SoulPrintSession) => s.id === id);
    if (found) {
      dispatch({ type: 'LOAD_SESSION', payload: found });
    }
  };

  const deleteSession = (id: string) => {
    const archive = JSON.parse(localStorage.getItem(ARCHIVE_KEY) || '[]');
    const filtered = archive.filter((s: SoulPrintSession) => s.id !== id);
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(filtered));
    setSavedSessions({ type: 'SET', payload: filtered });
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
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
