import { useEffect } from 'react';
import { useGameStore } from '../state/gameStore';

export function GameClock() {

  const tick = useGameStore((state) => state.tick);

  useEffect(() => {

    const gameLoopInterval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(gameLoopInterval);
  }, [tick]); 

  return null;
}