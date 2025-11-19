import { ReactNode } from 'react';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { AdSlotA } from '../ads/AdSlotA';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { Home, RotateCcw } from 'lucide-react';

interface AppShellProps {
    children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
    const { resetTest, getProgress, currentStage, isTestComplete } = useTestStore();

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the test? All progress will be lost.')) {
            resetTest();
        }
    };

    const handleHome = () => {
        if (currentStage > 0 && confirm('Return to home? Your progress will be saved.')) {
            resetTest();
        }
    };

    const progress = getProgress();

    return (
        <div className="min-h-screen w-full text-white overflow-x-hidden font-sans selection:bg-neon-teal/30">
            <AnimatedBackground />

            <div className="relative z-10 flex flex-col min-h-screen">
                <AdSlotA />

                <header className="w-full p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="NeuralSync Logo" className="w-14 h-14" />
                        <h1 className="text-xl font-display font-bold tracking-wide">
                            NEURAL<span className="text-neon-teal">SYNC</span> <span className="text-xs text-neural-muted font-mono ml-2">REDUX v4.0</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-mono text-neural-muted">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="hidden md:inline">SYSTEM ONLINE</span>
                        </div>
                    </div>
                </header>

                {/* Progress Bar */}
                {currentStage > 0 && !isTestComplete && (
                    <div className="w-full bg-black/40 backdrop-blur-sm border-b border-white/5">
                        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                            <div className="flex-1 mr-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-mono text-neural-muted">PROGRESS</span>
                                    <span className="text-xs font-mono text-neon-teal">{progress}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-teal to-neon-blue transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <NeonButton
                                    onClick={handleHome}
                                    variant="secondary"
                                    size="sm"
                                    className="hidden sm:flex"
                                >
                                    <Home className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Home</span>
                                </NeonButton>
                                <NeonButton
                                    onClick={handleReset}
                                    variant="danger"
                                    size="sm"
                                >
                                    <RotateCcw className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Reset</span>
                                </NeonButton>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 flex flex-col p-4 md:p-8">
                    {children}
                </main>

                <footer className="p-6 text-center text-xs text-neural-muted font-mono border-t border-white/5">
                    NEURAL SYNC © 2025 // ADVANCED PSYCHOMETRICS DIVISION
                </footer>
            </div>
        </div>
    );
};
