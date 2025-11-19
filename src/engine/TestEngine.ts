// Core Test Engine - Orchestrates 20-stage assessment flow

import type { ResponseData, FinalScores } from '../utils/storage';

export type StageType = 'matrix' | 'stroop' | 'bart' | 'personality' | 'intro';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StageDefinition {
    stage: number;
    type: StageType;
    title: string;
    difficulty: DifficultyLevel;
    description: string;
}

// Define all 20 stages according to PRD
export const STAGE_DEFINITIONS: StageDefinition[] = [
    { stage: 0, type: 'intro', title: 'Welcome', difficulty: 1, description: 'Introduction to NeuralSync Evaluator' },

    // Block 1: IQ - Matrix Reasoning (CHC Theory - Gf/Gv) - Stages 1-5
    { stage: 1, type: 'matrix', title: 'Matrix Reasoning I', difficulty: 2, description: 'Identify the missing pattern' },
    { stage: 2, type: 'matrix', title: 'Matrix Reasoning II', difficulty: 3, description: 'Advanced pattern recognition' },
    { stage: 3, type: 'matrix', title: 'Matrix Reasoning III', difficulty: 4, description: 'Complex logical sequences' },
    { stage: 4, type: 'matrix', title: 'Matrix Reasoning IV', difficulty: 5, description: 'Multi-rule transformations' },
    { stage: 5, type: 'matrix', title: 'Matrix Reasoning V', difficulty: 6, description: 'Expert fluid reasoning' },

    // Block 2: EQ - Emotional Stroop (IAT Principles) - Stages 6-10
    { stage: 6, type: 'stroop', title: 'Emotional Recognition I', difficulty: 2, description: 'Identify emotional word colors' },
    { stage: 7, type: 'stroop', title: 'Emotional Recognition II', difficulty: 3, description: 'Rapid emotional categorization' },
    { stage: 8, type: 'stroop', title: 'Emotional Regulation I', difficulty: 4, description: 'Color-word interference task' },
    { stage: 9, type: 'stroop', title: 'Emotional Regulation II', difficulty: 5, description: 'High-pressure emotional processing' },
    { stage: 10, type: 'stroop', title: 'Emotional Regulation III', difficulty: 6, description: 'Advanced affective control' },

    // Block 3: Behavioral Economics - BART (HEXACO/Risk) - Stages 11-15
    { stage: 11, type: 'bart', title: 'Risk Assessment I', difficulty: 2, description: 'Balloon pumping decision' },
    { stage: 12, type: 'bart', title: 'Risk Assessment II', difficulty: 3, description: 'Risk-reward tradeoff' },
    { stage: 13, type: 'bart', title: 'Risk Assessment III', difficulty: 4, description: 'Complex probability judgment' },
    { stage: 14, type: 'bart', title: 'Risk Assessment IV', difficulty: 5, description: 'High-stakes decision making' },
    { stage: 15, type: 'bart', title: 'Risk Assessment V', difficulty: 6, description: 'Advanced utility calculation' },

    // Block 4: Personality - HEXACO Questions - Stages 16-20
    { stage: 16, type: 'personality', title: 'Personality I', difficulty: 2, description: 'Honesty-Humility assessment' },
    { stage: 17, type: 'personality', title: 'Personality II', difficulty: 3, description: 'Emotionality & Extraversion' },
    { stage: 18, type: 'personality', title: 'Personality III', difficulty: 4, description: 'Agreeableness assessment' },
    { stage: 19, type: 'personality', title: 'Personality IV', difficulty: 5, description: 'Conscientiousness evaluation' },
    { stage: 20, type: 'personality', title: 'Personality V', difficulty: 6, description: 'Openness to Experience' },
];

export class TestEngine {
    private currentStage: number = 0;
    private responses: ResponseData[] = [];
    private startTime: number = 0;

    constructor() {
        this.startTime = performance.now();
    }

    // Get current stage definition
    getCurrentStage(): StageDefinition {
        return STAGE_DEFINITIONS[this.currentStage];
    }

    // Get current stage number
    getCurrentStageNumber(): number {
        return this.currentStage;
    }

    // Move to next stage
    nextStage(): void {
        if (this.currentStage < STAGE_DEFINITIONS.length - 1) {
            this.currentStage++;
        }
    }

    // Record response with millisecond precision
    recordResponse(choice: string | number, accuracy: boolean = false): ResponseData {
        const latency = performance.now() - this.startTime;

        const response: ResponseData = {
            stage: this.currentStage,
            choice,
            latency_ms: Math.round(latency),
            timestamp: new Date().toISOString(),
            accuracy,
        };

        this.responses.push(response);

        // Reset timer for next stage
        this.startTime = performance.now();

        return response;
    }

    // Get all responses
    getAllResponses(): ResponseData[] {
        return this.responses;
    }

    // Calculate adaptive difficulty based on last 5 responses
    getAdaptiveDifficulty(): DifficultyLevel {
        if (this.responses.length < 2) return 3;

        const recentResponses = this.responses.slice(-5);
        const avgLatency = recentResponses.reduce((sum, r) => sum + r.latency_ms, 0) / recentResponses.length;
        const accuracyRate = recentResponses.filter(r => r.accuracy).length / recentResponses.length;

        // Fast responses + high accuracy = increase difficulty
        if (avgLatency < 2000 && accuracyRate > 0.8) {
            return Math.min(10, 7) as DifficultyLevel;
        }
        // Slow responses + low accuracy = decrease difficulty
        else if (avgLatency > 5000 && accuracyRate < 0.4) {
            return Math.max(1, 3) as DifficultyLevel;
        }
        // Moderate performance = medium difficulty
        return 5 as DifficultyLevel;
    }

    // Calculate final scores using IRT approximation
    calculateFinalScores(): FinalScores {
        // Separate responses by test type
        const iqResponses = this.responses.filter(r => r.stage >= 1 && r.stage <= 5);
        const eqResponses = this.responses.filter(r => r.stage >= 6 && r.stage <= 10);
        const bartResponses = this.responses.filter(r => r.stage >= 11 && r.stage <= 15);
        const personalityResponses = this.responses.filter(r => r.stage >= 16 && r.stage <= 20);

        // IQ Calculation (Matrix Reasoning performance)
        const iqAccuracy = iqResponses.filter(r => r.accuracy).length / iqResponses.length;
        const avgIqLatency = iqResponses.reduce((sum, r) => sum + r.latency_ms, 0) / iqResponses.length;
        // IRT-inspired: faster correct answers = higher ability
        const iqScore = Math.round(100 + (iqAccuracy * 30) - (avgIqLatency / 500));
        const iqPercentile = Math.round(this.scoreToPercentile(iqScore, 100, 15));

        // EQ Calculation (Stroop task - regulation under pressure)
        const eqAccuracy = eqResponses.filter(r => r.accuracy).length / eqResponses.length;
        const regulationFailures = eqResponses.filter(r => r.latency_ms > 1500).length;
        const eqScore = Math.round(100 + (eqAccuracy * 25) - (regulationFailures * 3));
        const eqPercentile = Math.round(this.scoreToPercentile(eqScore, 100, 15));

        // Risk Tolerance Calculation (BART - pumps vs cashouts)
        const avgPumps = bartResponses.reduce((sum, r) => sum + Number(r.choice), 0) / bartResponses.length;
        const riskTolerance = Math.round(50 + (avgPumps * 5));
        const riskPercentile = Math.round(this.scoreToPercentile(riskTolerance, 50, 20));

        // HEXACO Calculation (simplified for demonstration)
        const hexaco = this.calculateHEXACO(personalityResponses);

        return {
            iq: Math.max(70, Math.min(145, iqScore)),
            iqPercentile: Math.max(1, Math.min(99, iqPercentile)),
            eq: Math.max(70, Math.min(140, eqScore)),
            eqPercentile: Math.max(1, Math.min(99, eqPercentile)),
            riskTolerance: Math.max(10, Math.min(90, riskTolerance)),
            riskPercentile: Math.max(1, Math.min(99, riskPercentile)),
            hexaco,
        };
    }

    // Convert raw score to percentile using normal distribution approximation
    private scoreToPercentile(score: number, mean: number, sd: number): number {
        const z = (score - mean) / sd;
        // Approximate cumulative distribution function
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const d = 0.3989423 * Math.exp(-z * z / 2);
        const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return (z > 0 ? 1 - probability : probability) * 100;
    }

    // Calculate HEXACO dimensions
    private calculateHEXACO(responses: ResponseData[]) {
        // Simplified HEXACO calculation based on response patterns
        const avgChoice = responses.reduce((sum, r) => sum + Number(r.choice), 0) / responses.length;
        const variability = Math.sqrt(responses.reduce((sum, r) => sum + Math.pow(Number(r.choice) - avgChoice, 2), 0) / responses.length);

        return {
            honesty: Math.round(50 + (avgChoice * 3) + (Math.random() * 10)),
            emotionality: Math.round(50 + (variability * 2) + (Math.random() * 10)),
            extraversion: Math.round(50 + (avgChoice * 2.5) + (Math.random() * 10)),
            agreeableness: Math.round(50 + (avgChoice * 3.5) + (Math.random() * 10)),
            conscientiousness: Math.round(50 + (variability * 3) + (Math.random() * 10)),
            openness: Math.round(50 + (avgChoice * 2) + (Math.random() * 10)),
        };
    }

    // Check if test is complete
    isComplete(): boolean {
        return this.currentStage >= STAGE_DEFINITIONS.length - 1;
    }

    // Get progress percentage
    getProgress(): number {
        return Math.round((this.currentStage / (STAGE_DEFINITIONS.length - 1)) * 100);
    }
}
