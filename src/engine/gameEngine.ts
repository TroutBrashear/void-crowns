import { useGameStore } from '../state/gameStore';

class GameEngine {
  private isRunning: boolean = false;
  private lastTickTime: number = 0;
  private tickInterval: number = 1000; // 1 tick per second (1000ms)

  // --- Core Loop ---
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTickTime = performance.now();
    // Start the continuous loop
    requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.isRunning = false;
  }

  // The gameLoop is a bound function to maintain `this` context
  private gameLoop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTickTime;

    // Check if enough time has passed for a new tick
    if (deltaTime >= this.tickInterval) {
      this.lastTickTime = currentTime;
      this.tick(); // Execute the game logic
    }

    // Request the next frame to continue the loop
    requestAnimationFrame(this.gameLoop);
  };

  // --- Game Logic ---
  private tick() {
    console.log("Game Tick!");
    const { fleets } = useGameStore.getState();
    const updatedFleetEntities: { [id: number]: Fleet } = {};

    // Process fleet movement
    fleets.ids.forEach(id => {
      const fleet = fleets.entities[id];
      if (fleet.movementPath.length > 0) {
        const nextSystemId = fleet.movementPath[0]; // Get the next step
        const remainingPath = fleet.movementPath.slice(1); // Get the rest of the path

        // Create the updated fleet object
        const updatedFleet = {
          ...fleet,
          locationSystemId: nextSystemId, // Move the fleet
          movementPath: remainingPath,    // Update the path
        };
        updatedFleetEntities[id] = updatedFleet;
      }
    });

    // If any fleets were updated, update the store
    if (Object.keys(updatedFleetEntities).length > 0) {
      useGameStore.setState(state => ({
        fleets: {
          ...state.fleets,
          entities: {
            ...state.fleets.entities,
            ...updatedFleetEntities,
          },
        },
      }));
    }
  }

  // --- Actions ---
  issueMoveOrder(fleetId: number, targetSystemId: number) {
    const { fleets, systems } = useGameStore.getState();
    const fleetToMove = fleets.entities[fleetId];
    const startSystem = systems.entities[fleetToMove.locationSystemId];
    const targetSystem = systems.entities[targetSystemId];

    //TODO: This should call pathfinding function.
    const newMovementPath = [targetSystemId];

    const updatedFleet = {
      ...fleetToMove,
      movementPath: newMovementPath,
    };
    
    useGameStore.setState(state => ({
      fleets: {
        ...state.fleets,
        entities: {
          ...state.fleets.entities,
          [fleetId]: updatedFleet,
        },
      },
    }));
  }
}

export const game = new GameEngine();