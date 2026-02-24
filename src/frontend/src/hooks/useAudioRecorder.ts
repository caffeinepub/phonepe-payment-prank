import { useState, useRef, useCallback } from 'react';

type RecordingState = 'idle' | 'recording' | 'stopped';

export function useAudioRecorder() {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        setRecordingState('stopped');
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingState('recording');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to access microphone. Please grant permission.');
      setRecordingState('idle');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, [recordingState]);

  const reset = useCallback(() => {
    setRecordingState('idle');
    setAudioBlob(null);
    setError(null);
    chunksRef.current = [];
  }, []);

  return {
    recordingState,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    reset,
  };
}
