import { elevenLabsSpeakText, isElevenLabsEnabled } from '../elevenlabs/elevenlabs.client';
import { getElevenLabsData } from '../elevenlabs/store-module-elevenlabs';
import { customTTSSpeakText, isValidCustomTTSConfig } from './custom-tts.client';
import { useTTSStore } from './store-tts';
import type { TTSCapability, TTSProvider, TTSSpeakResult, PersonaVoices } from './tts.types';

/**
 * Get available TTS providers and their configuration status
 */
export function getTTSProviders(): TTSProvider[] {
  const { elevenLabsApiKey } = getElevenLabsData();
  
  return [
    {
      providerId: 'elevenlabs',
      label: 'ElevenLabs',
      description: 'High-quality voice synthesis from ElevenLabs',
      configured: isElevenLabsEnabled(elevenLabsApiKey),
    },
    {
      providerId: 'custom',
      label: 'Custom TTS',
      description: 'Your own TTS API endpoint',
      configured: isValidCustomTTSConfig(),
    },
  ];
}

/**
 * Hook to get TTS capability information
 */
export function useTTSCapability(): TTSCapability {
  const [activeProviderId] = useTTSStore(state => [state.activeProviderId]);
  
  const providers = getTTSProviders();
  const activeProvider = providers.find(p => p.providerId === activeProviderId);
  const mayWork = providers.some(p => p.configured);

  return {
    mayWork,
    providers,
    activeProvider,
  };
}

/**
 * Main TTS function that routes to the appropriate provider
 */
export async function speakText(
  text: string,
  voiceId: string | undefined,
  audioStreaming: boolean,
  audioTurbo: boolean
): Promise<TTSSpeakResult> {
  
  const { activeProviderId } = useTTSStore.getState();
  
  switch (activeProviderId) {
    case 'elevenlabs':
      return elevenLabsSpeakText(text, voiceId, audioStreaming, audioTurbo);
    
    case 'custom':
      return customTTSSpeakText(text, voiceId, audioStreaming, audioTurbo);
    
    default:
      console.error('Unknown TTS provider:', activeProviderId);
      return { success: false };
  }
}

/**
 * Get voice ID from persona configuration based on active provider
 */
export function getPersonaVoiceId(personaVoices?: PersonaVoices): string | undefined {
  if (!personaVoices) return undefined;
  
  const { activeProviderId } = useTTSStore.getState();
  
  switch (activeProviderId) {
    case 'elevenlabs':
      return personaVoices.elevenLabs?.voiceId;
    
    case 'custom':
      return personaVoices.custom?.voiceId;
    
    default:
      return undefined;
  }
}