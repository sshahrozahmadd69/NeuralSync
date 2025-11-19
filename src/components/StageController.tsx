import { useTestStore, STAGE_DEFINITIONS } from '../store/useTestStore';
import { MatrixStage } from './stages/MatrixStage';
import { StroopStage } from './stages/StroopStage';
import { BartStage } from './stages/BartStage';
import { PersonalityStage } from './stages/PersonalityStage';
import { AnimatePresence, motion } from 'framer-motion';
import { NeonButton } from './ui/NeonButton';

export const StageController = () => {
    const { currentStage, isTestComplete, nextStage } = useTestStore();

    if (isTestComplete) {
        return (
            <div className="text-center">
                <h1 className="text-4xl font-bold text-neon-teal mb-4">ASSESSMENT COMPLETE</h1>
                <p className="text-neural-muted">Calculating neural profile...</p>
                {/* Placeholder for Results */}
            </div>
        );
    }

    const stageDef = STAGE_DEFINITIONS[currentStage];

    if (!stageDef) {
        return (
            <div className="text-center max-w-2xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold text-neon-red mb-4">SYSTEM ERROR</h1>
                <p className="text-neural-muted">
                    Unknown stage detected. Please use the menu (top right) to reset the test or return home.
                </p>
                <div className="text-sm font-mono text-neural-muted/50">
                    Current Stage: {currentStage} | Expected: 0-{STAGE_DEFINITIONS.length - 1}
                </div>
            </div>
        );
    }

    // Intro Stage
    if (stageDef.type === 'intro') {
        return (
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-5xl font-display font-bold text-white mb-6 tracking-tight">
                    NEURAL<span className="text-neon-teal">SYNC</span>
                </h1>
                <p className="text-xl text-neural-muted mb-12 leading-relaxed">
                    Advanced psychometric evaluation system initialized.
                    Please ensure you are in a quiet environment.
                </p>
                <NeonButton onClick={nextStage} size="lg" className="mx-auto w-64">
                    BEGIN EVALUATION
                </NeonButton>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                {stageDef.type === 'matrix' && <MatrixStage />}
                {stageDef.type === 'stroop' && <StroopStage />}
                {stageDef.type === 'bart' && <BartStage />}
                {stageDef.type === 'personality' && <PersonalityStage />}
            </motion.div>
        </AnimatePresence>
    );
};
