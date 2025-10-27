import * as React from 'react';

import { FormControl, Option, Select } from '@mui/joy';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';

import { FormInputKey } from '~/common/components/forms/FormInputKey';
import { FormLabelStart } from '~/common/components/forms/FormLabelStart';
import { AlreadySet } from '~/common/components/AlreadySet';

import { useActiveTTSProvider, useCustomTTSSettings } from './store-tts';
import { useTTSCapability } from './tts.client';
import { ElevenlabsSettings } from '../elevenlabs/ElevenlabsSettings';


export function TTSSettings() {
  
  // state
  const [activeProviderId, setActiveProviderId] = useActiveTTSProvider();
  const { customApiUrl, customApiKey, customVoiceId, setCustomApiUrl, setCustomApiKey, setCustomVoiceId } = useCustomTTSSettings();
  
  // external state  
  const { providers, activeProvider } = useTTSCapability();

  const handleProviderChange = (_event: any, value: string | null) => {
    if (value && (value === 'elevenlabs' || value === 'custom')) {
      setActiveProviderId(value);
    }
  };

  return <>
    
    {/* TTS Provider Selection */}
    <FormControl orientation='horizontal' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <FormLabelStart 
        title='TTS Provider' 
        description={activeProvider?.description || 'Select a text-to-speech provider'}
      />
      <Select
        value={activeProviderId}
        onChange={handleProviderChange}
        variant='outlined'
        startDecorator={<SettingsVoiceIcon />}
        sx={{ minWidth: 200 }}
      >
        {providers.map(provider => (
          <Option key={provider.providerId} value={provider.providerId}>
            {provider.label} {provider.configured ? '✓' : '⚠️'}
          </Option>
        ))}
      </Select>
    </FormControl>

    {/* Provider-specific settings */}
    {activeProviderId === 'elevenlabs' && <ElevenlabsSettings />}
    
    {activeProviderId === 'custom' && <>
      <FormInputKey
        autoCompleteId='custom-tts-url'
        label='Custom TTS API URL'
        rightLabel={<AlreadySet required />}
        value={customApiUrl}
        onChange={setCustomApiUrl}
        required
        placeholder='https://api.example.com/v1/text-to-speech'
      />
      
      <FormInputKey
        autoCompleteId='custom-tts-key'
        label='API Key'
        rightLabel={<AlreadySet required />}
        value={customApiKey}
        onChange={setCustomApiKey}
        required
        placeholder='Your API key'
      />
      
      <FormInputKey
        autoCompleteId='custom-tts-voice'
        label='Default Voice ID'
        rightLabel={<AlreadySet required={false} />}
        value={customVoiceId}
        onChange={setCustomVoiceId}
        required={false}
        placeholder='voice-id (optional)'
      />
    </>}

  </>;
}