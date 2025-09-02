import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { TTSProviderId } from './tts.types';


interface TTSStore {
  // Active TTS provider
  activeProviderId: TTSProviderId;
  setActiveProviderId: (providerId: TTSProviderId) => void;

  // Custom TTS provider settings
  customApiUrl: string;
  setCustomApiUrl: (url: string) => void;
  
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  
  customVoiceId: string;
  setCustomVoiceId: (voiceId: string) => void;
}

export const useTTSStore = create<TTSStore>()(
  persist(
    (set) => ({
      // Default to elevenlabs for backward compatibility
      activeProviderId: 'elevenlabs',
      setActiveProviderId: (activeProviderId: TTSProviderId) => set({ activeProviderId }),

      customApiUrl: '',
      setCustomApiUrl: (customApiUrl: string) => set({ customApiUrl }),
      
      customApiKey: '',
      setCustomApiKey: (customApiKey: string) => set({ customApiKey }),
      
      customVoiceId: '',
      setCustomVoiceId: (customVoiceId: string) => set({ customVoiceId }),
    }),
    {
      name: 'app-module-tts',
    }
  )
);

// Convenience hooks
export const useActiveTTSProvider = (): [TTSProviderId, (providerId: TTSProviderId) => void] => {
  const activeProviderId = useTTSStore(state => state.activeProviderId);
  return [activeProviderId, useTTSStore.getState().setActiveProviderId];
};

export const useCustomTTSSettings = () => {
  const { customApiUrl, customApiKey, customVoiceId, setCustomApiUrl, setCustomApiKey, setCustomVoiceId } = useTTSStore();
  return {
    customApiUrl,
    customApiKey, 
    customVoiceId,
    setCustomApiUrl,
    setCustomApiKey,
    setCustomVoiceId,
  };
};