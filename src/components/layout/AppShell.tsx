import { ReactNode, useState } from 'react';
import { AnimatedBackground } from '../ui/AnimatedBackground';
import { AdSlotA } from '../ads/AdSlotA';
import { useTestStore } from '../../store/useTestStore';
import { NeonButton } from '../ui/NeonButton';
import { Menu, Home, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
    children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const { resetTest, getProgress, currentStage } = useTestStore();

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the test? All progress will be lost.')) {
            resetTest();
            setShowMenu(false);
        }
    };

    const handleHome = () => {
        if (currentStage > 0 && confirm('Return to home? Your progress will be saved.')) {
            resetTest();
            setShowMenu(false);
        } else if (currentStage === 0) {
            setShowMenu(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-neural-bg text-white overflow-x-hidden font-sans selection:bg-neon-teal/30">
            <AnimatedBackground />

            <div className="relative z-10 flex flex-col min-h-screen">
                <AdSlotA />

                <header className="w-full p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-teal to-neon-blue shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                        <h1 className="text-xl font-display font-bold tracking-wide">
                            NEURAL<span className="text-neon-teal">SYNC</span> <span className="text-xs text-neural-muted font-mono ml-2">REDUX v4.0</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-mono text-neural-muted hidden md:flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            SYSTEM ONLINE
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </header>

                {/* Navigation Menu */}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-20 right-6 z-50 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-[250px]"
                        >
                            <div className="space-y-3">
                                <div className="text-xs font-mono text-neural-muted pb-2 border-b border-white/10">
                                    PROGRESS: {getProgress()}%
                                </div>
                                <NeonButton
                                    onClick={handleHome}
                                    variant="secondary"
                                    className="w-full justify-start"
                                    size="sm"
                                >
                                    <Home className="w-4 h-4 mr-2" /> Return to Home
                                </NeonButton>
                                <NeonButton
                                    onClick={handleReset}
                                    variant="danger"
                                    className="w-full justify-start"
                                    size="sm"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" /> Reset Test
                                </NeonButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
