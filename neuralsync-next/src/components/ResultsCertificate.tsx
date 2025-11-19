'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useTestStore } from '../store/useTestStore';
import { NeonButton } from './ui/NeonButton';
import { Share2, Download, Cpu, Activity, Zap, Brain, Home, RotateCcw } from 'lucide-react';

export const ResultsCertificate = () => {
    const { getResults, resetTest, returnToHome } = useTestStore();
    const [results, setResults] = useState<ReturnType<typeof getResults> | null>(null);

    useEffect(() => {
        setResults(getResults());
    }, []);

    // Mouse tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleGenerateID = async () => {
        const element = document.getElementById('neural-certificate');
        if (!element) return;

        try {
            const canvas = await import('html2canvas').then(m => m.default(element, {
                backgroundColor: null,
                scale: 2, // Higher quality
                logging: false,
                useCORS: true
            }));

            const link = document.createElement('a');
            link.download = `NEURAL-ID-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Failed to generate ID:", err);
        }
    };

    const handleRetakeTest = () => {
        resetTest();
        window.location.reload();
    };

    const handleReturnHome = () => {
        returnToHome();
        window.location.reload();
    };

    if (!results) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8 perspective-1000">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-display font-bold text-white">NEURAL PROFILE GENERATED</h1>
                <p className="text-neural-muted">Analysis complete. Subject verified.</p>
            </div>

            <motion.div
                id="neural-certificate"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full max-w-md aspect-[3/4] bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-neon-teal/20 overflow-hidden group"
            >
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                {/* Content Layer */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10" style={{ transform: "translateZ(20px)" }}>
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-mono text-neural-muted">SUBJECT ID</div>
                            <div className="text-xl font-mono text-neon-teal">NS-{Math.floor(Math.random() * 10000)}</div>
                        </div>
                        <Cpu className="w-8 h-8 text-white/20" />
                    </div>

                    {/* Scores */}
                    <div className="space-y-6">
                        <ScoreRow label="COGNITIVE PROCESSING (IQ)" value={results.iqScore} icon={<Brain className="w-4 h-4" />} color="text-neon-blue" />
                        <ScoreRow label="EMOTIONAL RESONANCE (EQ)" value={results.eqScore} icon={<Activity className="w-4 h-4" />} color="text-neon-purple" />
                        <ScoreRow label="RISK TOLERANCE" value={results.riskScore} icon={<Zap className="w-4 h-4" />} color="text-neon-red" />
                        <ScoreRow label="PERSONALITY INDEX" value={results.personalityScore} icon={<Share2 className="w-4 h-4" />} color="text-neon-green" />
                    </div>

                    {/* Footer */}
                    <div className="space-y-4">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="flex justify-between items-center text-xs font-mono text-neural-muted">
                            <span>VERIFIED BY NEURALSYNC</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-teal/5 to-neon-purple/10" />
            </motion.div>

            <div className="flex flex-wrap gap-4 justify-center">
                <NeonButton onClick={handleReturnHome} variant="secondary">
                    <Home className="w-4 h-4 mr-2" /> RETURN TO HOME
                </NeonButton>
                <NeonButton onClick={handleRetakeTest} variant="secondary">
                    <RotateCcw className="w-4 h-4 mr-2" /> RETAKE TEST
                </NeonButton>
                <NeonButton onClick={() => window.print()} variant="secondary">
                    <Download className="w-4 h-4 mr-2" /> PRINT REPORT
                </NeonButton>
                <NeonButton onClick={handleGenerateID} glow>
                    <Share2 className="w-4 h-4 mr-2" /> GENERATE NEURAL ID
                </NeonButton>
            </div>
        </div>
    );
};

const ScoreRow = ({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold text-white/60 tracking-wider">
            <span className="flex items-center gap-2">{icon} {label}</span>
            <span className={color}>{value}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full ${color.replace('text-', 'bg-')}`}
            />
        </div>
    </div>
);
