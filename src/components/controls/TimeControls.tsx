import { useGameStore } from '../../state/gameStore';

export function TimeControls() {
  
  const isPaused = useGameStore((state) => state.meta.isPaused);
  const playPause = useGameStore((state) => state.playPause);

  return (
    <button onClick={() => playPause()}>{isPaused ? 'Play' : 'Pause'}</button>
  );
}