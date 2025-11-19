import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTestStore } from '../../store/useTestStore';
import { generateMatrixProblem, MatrixCell, MatrixPattern } from '../../engine/MatrixReasoning';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '../../lib/utils';

// Helper to render shapes
const CellRenderer = ({ cell, className }: { cell: MatrixCell | null; className?: string }) => {
    if (!cell) return <div className={cn("w-full h-full rounded-lg bg-white/5 animate-pulse", className)} />;

    const ShapeIcon = () => {
        switch (cell.shape) {
            case 'circle': return <circle cx="50" cy="50" r="40" />;
            case 'square': return <rect x="10" y="10" width="80" height="80" rx="10" />;
            case 'triangle': return <polygon points="50,10 90,90 10,90" />;
            case 'diamond': return <polygon points="50,10 90,50 50,90 10,50" />;
            case 'star': return <polygon points="50,10 61,35 88,35 68,57 79,82 50,67 21,82 32,57 12,35 39,35" />;
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: cell.rotation }}
            className={cn("w-full h-full flex items-center justify-center p-2", className)}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <g fill={cell.color} className="filter drop-shadow-lg">
                    <ShapeIcon />
                </g>
            </svg>
        </motion.div>
    );
};

export const MatrixStage = () => {
    const { recordResponse, nextStage, currentStage } = useTestStore();
    const [problem, setProblem] = useState<MatrixPattern | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    useEffect(() => {
        // Difficulty based on stage number (1-5) -> (2-6)
        const difficulty = (currentStage % 5) + 1;
        const newProblem = generateMatrixProblem(difficulty as any);
        setProblem(newProblem);
        setSelectedOption(null);
    }, [currentStage]);

    const handleChoice = (option: MatrixCell, index: number) => {
        if (!problem) return;
        setSelectedOption(index);

        const isCorrect = JSON.stringify(option) === JSON.stringify(problem.correctAnswer);

        // Small delay for visual feedback
        setTimeout(() => {
            recordResponse({
                choice: index,
                latency_ms: 0, // TODO: Add real timing
                accuracy: isCorrect
            });
            nextStage();
        }, 500);
    };

    if (!problem) return null;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Pattern Recognition</h2>
                    <p className="text-neural-muted">Identify the missing component in the neural sequence.</p>
                </div>
                <div className="text-neon-teal font-mono text-sm">
                    SEQUENCE: {currentStage}/20
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* The Matrix Grid */}
                <GlassCard className="aspect-square p-4 grid grid-cols-3 grid-rows-3 gap-4 bg-black/20">
                    {problem.grid.map((row, rIndex) => (
                        row.map((cell, cIndex) => (
                            <div
                                key={`${rIndex}-${cIndex}`}
                                className="relative aspect-square rounded-xl bg-white/5 border border-white/5 overflow-hidden"
                            >
                                <CellRenderer cell={cell} />
                                {cell === null && (
                                    <div className="absolute inset-0 flex items-center justify-center text-neon-teal/50 font-mono text-4xl">
                                        ?
                                    </div>
                                )}
                            </div>
                        ))
                    ))}
                </GlassCard>

                {/* The Options */}
                <div className="flex flex-col justify-center gap-6">
                    <h3 className="text-lg font-semibold text-white/80">Select the missing component:</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {problem.options.map((option, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05, borderColor: 'rgba(34, 211, 238, 0.8)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleChoice(option, index)}
                                className={cn(
                                    "aspect-square rounded-xl border-2 border-white/10 bg-white/5 p-2 transition-colors relative overflow-hidden",
                                    selectedOption === index ? "border-neon-teal bg-neon-teal/10 shadow-neon-teal" : "hover:bg-white/10"
                                )}
                            >
                                <CellRenderer cell={option} />
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
