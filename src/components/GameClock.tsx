import { useEffect } from 'react';
import { useGameStore } from '../state/gameStore';

export function GameClock() {

  const tick = useGameStore((state) => state.tick);
  const isPaused = useGameStore((state) => state.meta.isPaused);

  useEffect(() => {
    if(!isPaused){
      const gameLoopInterval = setInterval(() => {
          tick();
      }, 1000);

      return () => clearInterval(gameLoopInterval);
    }
  }, [isPaused, tick]); 

  return null;
}