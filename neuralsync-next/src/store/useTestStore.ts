import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type StageType = 'matrix' | 'stroop' | 'bart' | 'personality' | 'intro' | 'results';

export interface StageDefinition {
    stage: number;
    type: StageType;
    title: string;
    description: string;
}

export interface ResponseData {
    stage: number;
    choice: string | number;
    latency_ms: number;
    timestamp: string;
    accuracy: boolean;
}

export const STAGE_DEFINITIONS: StageDefinition[] = [
    { stage: 0, type: 'intro', title: 'Neural Initialization', description: 'System calibration required.' },
    // Block 1: IQ (Matrix)
    { stage: 1, type: 'matrix', title: 'Pattern Recognition I', description: 'Analyze the sequence.' },
    { stage: 2, type: 'matrix', title: 'Pattern Recognition II', description: 'Identify the anomaly.' },
    { stage: 3, type: 'matrix', title: 'Pattern Recognition III', description: 'Complete the logic.' },
    { stage: 4, type: 'matrix', title: 'Pattern Recognition IV', description: 'Advanced synthesis.' },
    { stage: 5, type: 'matrix', title: 'Pattern Recognition V', description: 'Neural mapping complete.' },
    // Block 2: EQ (Stroop)
    { stage: 6, type: 'stroop', title: 'Synaptic Resonance I', description: 'Filter interference.' },
    { stage: 7, type: 'stroop', title: 'Synaptic Resonance II', description: 'Rapid processing.' },
    { stage: 8, type: 'stroop', title: 'Synaptic Resonance III', description: 'Emotional regulation.' },
    { stage: 9, type: 'stroop', title: 'Synaptic Resonance IV', description: 'Cognitive load test.' },
    { stage: 10, type: 'stroop', title: 'Synaptic Resonance V', description: 'Resonance check complete.' },
    // Block 3: Risk (BART)
    { stage: 11, type: 'bart', title: 'Core Stability I', description: 'Charge the energy core.' },
    { stage: 12, type: 'bart', title: 'Core Stability II', description: 'Manage instability.' },
    { stage: 13, type: 'bart', title: 'Core Stability III', description: 'Risk threshold analysis.' },
    { stage: 14, type: 'bart', title: 'Core Stability IV', description: 'Critical mass test.' },
    { stage: 15, type: 'bart', title: 'Core Stability V', description: 'Stability check complete.' },
    // Block 4: Personality (HEXACO)
    { stage: 16, type: 'personality', title: 'Identity Matrix I', description: 'Self-perception analysis.' },
    { stage: 17, type: 'personality', title: 'Identity Matrix II', description: 'Social dynamic scan.' },
    { stage: 18, type: 'personality', title: 'Identity Matrix III', description: 'Value system mapping.' },
    { stage: 19, type: 'personality', title: 'Identity Matrix IV', description: 'Behavioral prediction.' },
    { stage: 20, type: 'personality', title: 'Identity Matrix V', description: 'Profile synthesis.' },
];

interface TestState {
    currentStage: number;
    responses: ResponseData[];
    isTestComplete: boolean;

    // Actions
    recordResponse: (data: Omit<ResponseData, 'timestamp' | 'stage'>) => void;
    nextStage: () => void;
    resetTest: () => void;
    returnToHome: () => void;
    getProgress: () => number;
    getResults: () => {
        iqScore: number;
        eqScore: number;
        riskScore: number;
        personalityScore: number;
    };
}

export const useTestStore = create<TestState>()(
    persist(
        (set, get) => ({
            currentStage: 0,
            responses: [],
            isTestComplete: false,

            recordResponse: (data) => {
                const { currentStage, responses } = get();
                const newResponse: ResponseData = {
                    ...data,
                    stage: currentStage,
                    timestamp: new Date().toISOString(),
                };
                set({ responses: [...responses, newResponse] });
            },

            nextStage: () => {
                const { currentStage } = get();
                if (currentStage < STAGE_DEFINITIONS.length - 1) {
                    set({ currentStage: currentStage + 1 });
                } else {
                    set({ isTestComplete: true });
                }
            },

            resetTest: () => {
                set({ currentStage: 0, responses: [], isTestComplete: false });
            },

            returnToHome: () => {
                set({ currentStage: 0, isTestComplete: false });
            },

            getProgress: () => {
                const { currentStage } = get();
                return Math.round((currentStage / STAGE_DEFINITIONS.length) * 100);
            },

            getResults: () => {
                const { responses } = get();

                // IQ (Matrix) - Stages 1-5
                const matrixResponses = responses.filter(r => r.stage >= 1 && r.stage <= 5);
                const iqScore = Math.round((matrixResponses.filter(r => r.accuracy).length / 5) * 100) || 0;

                // EQ (Stroop) - Stages 6-10
                const stroopResponses = responses.filter(r => r.stage >= 6 && r.stage <= 10);
                const eqScore = Math.round((stroopResponses.filter(r => r.accuracy).length / 5) * 100) || 0;

                // Risk (BART) - Stages 11-15
                const bartResponses = responses.filter(r => r.stage >= 11 && r.stage <= 15);
                const totalPumps = bartResponses.reduce((sum, r) => sum + (typeof r.choice === 'number' ? r.choice : 0), 0);
                const riskScore = Math.min(100, Math.round((totalPumps / 50) * 100)); // Normalize based on max pumps

                // Personality (HEXACO) - Stages 16-20
                // Simplified scoring for demo purposes (averaging raw values)
                const personalityResponses = responses.filter(r => r.stage >= 16 && r.stage <= 20);
                const personalityScore = Math.round(
                    (personalityResponses.reduce((sum, r) => sum + (typeof r.choice === 'number' ? r.choice : 4), 0) / (personalityResponses.length * 7)) * 100
                ) || 50;

                return {
                    iqScore,
                    eqScore,
                    riskScore,
                    personalityScore
                };
            }
        }),
        {
            name: 'neuralsync-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
