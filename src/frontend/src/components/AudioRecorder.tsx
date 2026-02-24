import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Button } from './ui/button';
import { Mic, Square, RotateCcw, Loader2 } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { Alert, AlertDescription } from './ui/alert';

interface AudioRecorderProps {
  onAudioReady: (blob: Blob) => void;
  disabled?: boolean;
}

export default function AudioRecorder({ onAudioReady, disabled }: AudioRecorderProps) {
  const { recordingState, audioBlob, error, startRecording, stopRecording, reset } = useAudioRecorder();

  const handleRecordingComplete = () => {
    if (audioBlob) {
      onAudioReady(audioBlob);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recordingState === 'idle' && (
        <Button
          type="button"
          onClick={startRecording}
          disabled={disabled}
          className="w-full bg-gradient-to-r from-phonepe-primary to-phonepe-secondary"
        >
          <Mic className="mr-2 h-4 w-4" />
          Start Recording
        </Button>
      )}

      {recordingState === 'recording' && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75"></div>
              <div className="relative h-4 w-4 rounded-full bg-red-500"></div>
            </div>
            <span className="font-semibold text-red-700">Recording...</span>
          </div>
          <Button
            type="button"
            onClick={stopRecording}
            variant="outline"
            className="w-full border-red-500 text-red-600 hover:bg-red-50"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        </div>
      )}

      {recordingState === 'stopped' && audioBlob && (
        <div className="space-y-3">
          <div className="p-4 bg-phonepe-light rounded-lg border-2 border-phonepe-primary/20">
            <p className="text-sm font-medium text-phonepe-primary mb-2">Preview your recording:</p>
            <AudioPlayer audioBlob={audioBlob} />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={reset}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Re-record
            </Button>
            <Button
              type="button"
              onClick={handleRecordingComplete}
              disabled={disabled}
              className="flex-1 bg-gradient-to-r from-phonepe-primary to-phonepe-secondary"
            >
              {disabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Use This Recording'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
