import * as React from 'react';
import { Box, Button, Input, Typography } from '@mui/joy';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useYouTubeTranscript } from '~/modules/youtube/useYouTubeTranscript';
import { InlineError } from '~/common/components/InlineError';

export function FromYouTube(props: {
  isTransforming: boolean;
  onCreate: (text: string, provenance: { type: string; url: string; title: string; thumbnailUrl: string }) => void;
}) {
  const [videoURL, setVideoURL] = React.useState('');
  const [videoID, setVideoID] = React.useState<string | null>(null);
  const [usedFallback, setUsedFallback] = React.useState(false);

  const { transcript, isFetching, isError, error } = useYouTubeTranscript(videoID, (data) => {
    setUsedFallback(!data.transcript); // Check if fallback was used
    props.onCreate(data.transcript, {
      type: 'youtube',
      url: videoURL,
      title: data.title,
      thumbnailUrl: data.thumbnailUrl,
    });
  });

  const handleVideoURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoID(null);
    setVideoURL(e.target.value);
  };

  const handleCreateFromTranscript = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const videoId = new URL(videoURL).searchParams.get('v');
    if (videoId) {
      setVideoID(videoId);
    } else {
      setVideoURL('Invalid URL');
    }
  };

  return (
    <Box>
      <Typography level="title-md" startDecorator={<YouTubeIcon sx={{ color: '#f00' }} />} sx={{ mb: 3 }}>
        YouTube -&gt; Persona
      </Typography>

      <form onSubmit={handleCreateFromTranscript}>
        <Input
          required
          type="url"
          fullWidth
          disabled={isFetching || props.isTransforming}
          variant="outlined"
          placeholder="YouTube Video URL"
          value={videoURL}
          onChange={handleVideoURLChange}
          sx={{ mb: 1.5 }}
        />
        <Button
          type="submit"
          variant="solid"
          disabled={isFetching || props.isTransforming || !videoURL}
          loading={isFetching}
          sx={{ minWidth: 140 }}
        >
          Create
        </Button>
      </form>

      {isError && <InlineError error={error} sx={{ mt: 3 }} />}

      {transcript && (
        <Typography level="body-xs" sx={{ mt: 3 }}>
          {usedFallback
            ? 'Using auto-generated captions as fallback.'
            : 'Using standard captions provided by the video.'}
        </Typography>
      )}
    </Box>
  );
}
