import { useGameStore } from '../../state/gameStore';

import { Button } from '../pure/Button';

export function TimeControls() {
  
  const isPaused = useGameStore((state) => state.meta.isPaused);
  const playPause = useGameStore((state) => state.playPause);

  return (
    <Button onClick={() => playPause()}>{isPaused ? 'Play' : 'Pause'}</Button>
  );
}
