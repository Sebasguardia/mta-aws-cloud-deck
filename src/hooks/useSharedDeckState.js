// src/hooks/useSharedDeckState.js
import { useDeckStore } from "../store/deckStore";

/**
 * Wrapper de conveniencia para acceder rápidamente al estado de los simuladores del deck
 * sin necesidad de escribir selectores individuales en cada componente.
 */
export function useSharedDeckState() {
  const isServerDown = useDeckStore((state) => state.isServerDown);
  const outageSeconds = useDeckStore((state) => state.outageSeconds);
  const triggerServerCrash = useDeckStore((state) => state.triggerServerCrash);
  const restoreServer = useDeckStore((state) => state.restoreServer);
  const incrementOutageSeconds = useDeckStore((state) => state.incrementOutageSeconds);

  const deployState = useDeckStore((state) => state.deployState);
  const setDeployState = useDeckStore((state) => state.setDeployState);
  const resetDeployState = useDeckStore((state) => state.resetDeployState);

  const simulatedUsers = useDeckStore((state) => state.simulatedUsers);
  const setSimulatedUsers = useDeckStore((state) => state.setSimulatedUsers);
  const budgetLimit = useDeckStore((state) => state.budgetLimit);

  const iamMode = useDeckStore((state) => state.iamMode);
  const setIamMode = useDeckStore((state) => state.setIamMode);
  const selectedUserForInspection = useDeckStore((state) => state.selectedUserForInspection);
  const setSelectedUserForInspection = useDeckStore((state) => state.setSelectedUserForInspection);

  const cafPerspective = useDeckStore((state) => state.cafPerspective);
  const setCafPerspective = useDeckStore((state) => state.setCafPerspective);

  const navigateToSlide = useDeckStore((state) => state.navigateToSlide);

  return {
    // Outage
    isServerDown,
    outageSeconds,
    triggerServerCrash,
    restoreServer,
    incrementOutageSeconds,

    // Deploy
    deployState,
    setDeployState,
    resetDeployState,

    // Cost Calculator
    simulatedUsers,
    setSimulatedUsers,
    budgetLimit,

    // IAM
    iamMode,
    setIamMode,
    selectedUserForInspection,
    setSelectedUserForInspection,

    // CAF
    cafPerspective,
    setCafPerspective,

    // Navigation
    navigateToSlide,
  };
}
