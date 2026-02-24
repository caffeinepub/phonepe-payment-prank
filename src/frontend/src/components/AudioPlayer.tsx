import { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause } from 'lucide-react';
import { ExternalBlob } from '../backend';

interface AudioPlayerProps {
  audioBlob?: Blob;
  externalBlob?: ExternalBlob;
}

export default function AudioPlayer({ audioBlob, externalBlob }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    let url = '';
    
    if (audioBlob) {
      url = URL.createObjectURL(audioBlob);
    } else if (externalBlob) {
      url = externalBlob.getDirectURL();
    }
    
    setAudioUrl(url);

    return () => {
      if (audioBlob && url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [audioBlob, externalBlob]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={audioUrl} />
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={togglePlayPause}
        className="shrink-0"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="flex-1">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-phonepe-primary to-phonepe-secondary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
