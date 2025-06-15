
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  participantId: string | null;
  sessionId: string | null;
  setParticipant: (participantId: string, sessionId: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      participantId: null,
      sessionId: null,
      setParticipant: (participantId, sessionId) => set({ participantId, sessionId }),
      clearSession: () => set({ participantId: null, sessionId: null }),
    }),
    {
      name: 'retro-session-storage', // name of the item in the storage (must be unique)
    }
  )
);
