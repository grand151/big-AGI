import type { TTSSpeakResult } from './tts.types';
import { useTTSStore } from './store-tts';

export function isValidCustomTTSConfig(): boolean {
  const { customApiUrl, customApiKey } = useTTSStore.getState();
  return !!(customApiUrl?.trim() && customApiKey?.trim());
}

/**
 * Speaks text using a custom TTS API
 * This is a basic implementation that can be extended for specific API formats
 */
export async function customTTSSpeakText(
  text: string, 
  voiceId: string | undefined, 
  audioStreaming: boolean, 
  audioTurbo: boolean
): Promise<TTSSpeakResult> {
  
  const { customApiUrl, customApiKey, customVoiceId } = useTTSStore.getState();
  
  if (!isValidCustomTTSConfig()) {
    return { success: false };
  }

  try {
    // Build the request - this is a generic format that can be adapted
    const requestBody = {
      text,
      voice_id: voiceId || customVoiceId,
      // Add common TTS parameters that might be supported by various APIs
      streaming: audioStreaming,
      turbo: audioTurbo,
    };

    const response = await fetch(customApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customApiKey}`,
        // Alternative auth header formats that might be needed:
        // 'X-API-Key': customApiKey,
        // 'xi-api-key': customApiKey, // ElevenLabs style
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('Custom TTS API error:', response.status, response.statusText);
      return { success: false };
    }

    if (audioStreaming) {
      // For streaming, we'd need to handle the response stream
      // This is a simplified implementation
      const audioBlob = await response.blob();
      const audioBase64 = await blobToBase64(audioBlob);
      return { success: true, audioBase64 };
    } else {
      // For non-streaming, expect audio data in response
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        // If the API returns JSON with base64 audio
        const result = await response.json();
        return { 
          success: true, 
          audioBase64: result.audio || result.audioBase64 || result.data 
        };
      } else {
        // If the API returns raw audio data
        const audioBlob = await response.blob();
        const audioBase64 = await blobToBase64(audioBlob);
        return { success: true, audioBase64 };
      }
    }

  } catch (error) {
    console.error('Custom TTS error:', error);
    return { success: false };
  }
}

// Helper function to convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64 data
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}