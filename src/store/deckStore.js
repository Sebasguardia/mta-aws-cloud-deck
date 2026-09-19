// src/store/deckStore.js
import { create } from "zustand";

/**
 * Store global de Zustand para compartir estado entre slides y simuladores
 * (Todo el estado vive en memoria; no se usa localStorage)
 */
export const useDeckStore = create((set, get) => ({
  // Índice del slide activo (0 = Preloader, 1 = Cover, etc.)
  activeSlideIndex: 0,
  setActiveSlideIndex: (index) => set({ activeSlideIndex: index }),

  // 1. OutageSimulator (Slide 08: Caída de servidor único en Hostinger)
  isServerDown: false,
  outageSeconds: 0,
  triggerServerCrash: () => set({ isServerDown: true }),
  restoreServer: () => set({ isServerDown: false, outageSeconds: 0 }),
  incrementOutageSeconds: () => set((state) => ({ outageSeconds: state.outageSeconds + 1 })),

  // 2. DeploySimulator (Slide 07 y 12: Manual vs CI/CD AWS)
  deployState: {
    step: 0,
    isDeploying: false,
    hasError: false,
    errorMessage: "",
    isSuccess: false,
  },
  setDeployState: (newState) =>
    set((state) => ({
      deployState: { ...state.deployState, ...newState },
    })),
  resetDeployState: () =>
    set({
      deployState: {
        step: 0,
        isDeploying: false,
        hasError: false,
        errorMessage: "",
        isSuccess: false,
      },
    }),

  // 3. CostCalculator (Slide 10: Comparativa de costos y AWS Budgets)
  simulatedUsers: 1500, // número de peticiones/usuarios
  setSimulatedUsers: (users) => set({ simulatedUsers: users }),
  // Presupuesto de alerta configurado en AWS Budgets ($10 USD)
  budgetLimit: 10,

  // 4. IAMGrid (Slide 04 y 11: 1 cuenta root compartida vs 10 usuarios IAM)
  iamMode: "root", // 'root' | 'iam'
  setIamMode: (mode) => set({ iamMode: mode }),
  selectedUserForInspection: null,
  setSelectedUserForInspection: (user) => set({ selectedUserForInspection: user }),

  // 5. BeforeAfterToggle (Slide 09: Perspectivas CAF)
  cafPerspective: "after", // 'before' | 'after'
  setCafPerspective: (perspective) => set({ cafPerspective: perspective }),

  // Navegación programática hacia un slide de Reveal.js
  navigateToSlide: (indexh) => {
    if (typeof window !== "undefined" && window.__revealDeck) {
      window.__revealDeck.slide(indexh);
      set({ activeSlideIndex: indexh });
    }
  },
}));
