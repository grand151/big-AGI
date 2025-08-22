// TTS Provider Types and Interfaces

export interface TTSProvider {
  providerId: string;
  label: string;
  description: string;
  configured: boolean;
}

export interface TTSVoice {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;
}

export interface TTSSpeakResult {
  success: boolean;
  audioBase64?: string; // Available when not streaming
}

export interface TTSCapability {
  mayWork: boolean;
  providers: TTSProvider[];
  activeProvider?: TTSProvider;
}

// Voice configuration for personas
export interface PersonaVoices {
  elevenLabs?: { voiceId: string };
  custom?: { voiceId: string };
}

export type TTSProviderId = 'elevenlabs' | 'custom';