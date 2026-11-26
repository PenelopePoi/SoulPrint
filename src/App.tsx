import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { AppStep } from './types';
import type {
  PersonalData,
  MBTIResult,
  EnneagramResult,
  BigFiveResult,
  NeuralResonanceResult,
  DISCResult,
  VoidGazeResult,
  NarrativeArcResult,
  JungianResult,
  ShadowWorkResult,
  ImageUploadData,
} from './types';
import ParticleField from './components/ui/ParticleField';
import ProgressRing from './components/ui/ProgressRing';
import StarMap from './components/ui/StarMap';
import InsightModal from './components/ui/InsightModal';
import LandingPage from './pages/LandingPage';
import StepPersonalData from './components/tests/StepPersonalData';
import StepMindsetMatrix from './components/tests/StepMindsetMatrix';
import StepInnerOS from './components/tests/StepInnerOS';
import StepElementalBalance from './components/tests/StepElementalBalance';
import StepNeuralResonance from './components/tests/StepNeuralResonance';
import StepKineticSignature from './components/tests/StepKineticSignature';
import StepVoidGaze from './components/tests/StepVoidGaze';
import StepNarrativeArc from './components/tests/StepNarrativeArc';
import StepJungianArchetypes from './components/tests/StepJungianArchetypes';
import StepShadowWork from './components/tests/StepShadowWork';
import StepImageUpload from './components/tests/StepImageUpload';
import ReportView from './components/report/ReportView';
import GeneratingView from './components/report/GeneratingView';
import { generateReport, generateInsight } from './services/geminiService';

const STEP_ORDER: AppStep[] = [
  AppStep.LANDING,
  AppStep.PERSONAL_DATA,
  AppStep.MINDSET_MATRIX,
  AppStep.INNER_OS,
  AppStep.ELEMENTAL_BALANCE,
  AppStep.NEURAL_RESONANCE,
  AppStep.KINETIC_SIGNATURE,
  AppStep.VOID_GAZE,
  AppStep.NARRATIVE_ARC,
  AppStep.JUNGIAN_ARCHETYPES,
  AppStep.SHADOW_WORK,
  AppStep.IMAGE_UPLOAD,
  AppStep.GENERATING,
  AppStep.REPORT,
];

function SoulPrintApp() {
  const { session, dispatch, completionPercentage, saveCurrentSession } = useSession();
  const [currentStep, setCurrentStep] = useState<AppStep>(
    session.report ? AppStep.REPORT : AppStep.LANDING
  );
  const [showStarMap, setShowStarMap] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [insightText, setInsightText] = useState('');
  const [insightTestName, setInsightTestName] = useState('');
  const [streamPreview, setStreamPreview] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const navigateTo = useCallback((step: AppStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const advanceStep = useCallback(() => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      navigateTo(STEP_ORDER[idx + 1]);
    }
  }, [currentStep, navigateTo]);

  const showInsightAndAdvance = useCallback(async (testName: string, data: Record<string, unknown>) => {
    setInsightTestName(testName);
    setInsightText('');
    setShowInsight(true);

    try {
      const insight = await generateInsight(testName, data);
      setInsightText(insight);
    } catch {
      setInsightText(`Your recorded results: ${JSON.stringify(data)}. AI interpretation is unavailable. These are exploratory self-report results, not a diagnosis.`);
    }
  }, []);

  const handlePersonalData = useCallback((data: PersonalData) => {
    dispatch({ type: 'SET_PERSONAL_DATA', payload: data });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.PERSONAL_DATA });
    void showInsightAndAdvance('Astral Coordinates', data as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleMBTI = useCallback(async (result: MBTIResult) => {
    dispatch({ type: 'SET_MBTI', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.MINDSET_MATRIX });
    await showInsightAndAdvance('Mindset Matrix (MBTI)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleEnneagram = useCallback(async (result: EnneagramResult) => {
    dispatch({ type: 'SET_ENNEAGRAM', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.INNER_OS });
    await showInsightAndAdvance('Inner Operating System (Enneagram)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleBigFive = useCallback(async (result: BigFiveResult) => {
    dispatch({ type: 'SET_BIG_FIVE', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.ELEMENTAL_BALANCE });
    await showInsightAndAdvance('Elemental Balance (Big Five)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleNeuralResonance = useCallback(async (result: NeuralResonanceResult) => {
    dispatch({ type: 'SET_NEURAL_RESONANCE', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.NEURAL_RESONANCE });
    await showInsightAndAdvance('Neural Resonance (Clinical Scales)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleDISC = useCallback(async (result: DISCResult) => {
    dispatch({ type: 'SET_DISC', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.KINETIC_SIGNATURE });
    await showInsightAndAdvance('Kinetic Signature (DISC)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleVoidGaze = useCallback(async (result: VoidGazeResult) => {
    dispatch({ type: 'SET_VOID_GAZE', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.VOID_GAZE });
    await showInsightAndAdvance('Void Gaze (Projective)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleNarrativeArc = useCallback(async (result: NarrativeArcResult) => {
    dispatch({ type: 'SET_NARRATIVE_ARC', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.NARRATIVE_ARC });
    await showInsightAndAdvance('Narrative Arc (TAT)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleJungian = useCallback(async (result: JungianResult) => {
    dispatch({ type: 'SET_JUNGIAN', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.JUNGIAN_ARCHETYPES });
    await showInsightAndAdvance('Archetype Resonance (Jungian)', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const handleShadowWork = useCallback(async (result: ShadowWorkResult) => {
    dispatch({ type: 'SET_SHADOW_WORK', payload: result });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.SHADOW_WORK });
    await showInsightAndAdvance('Shadow Integration', result as unknown as Record<string, unknown>);
  }, [dispatch, showInsightAndAdvance]);

  const startGeneration = useCallback(async (snapshot: typeof session = session) => {
    setIsStreaming(true);
    setStreamPreview('');
    navigateTo(AppStep.GENERATING);

    try {
      const report = await generateReport(snapshot, (chunk) => {
        setStreamPreview(chunk);
      });
      dispatch({ type: 'SET_REPORT', payload: report });
      dispatch({ type: 'COMPLETE_STEP', payload: AppStep.GENERATING });
      setIsStreaming(false);
      navigateTo(AppStep.REPORT);
    } catch (err) {
      console.error('Report generation failed:', err);
      setIsStreaming(false);
      const fallbackReport = `# 🔮 SoulPrint Report

## Generation Error

The cosmic frequencies encountered interference. This could mean:

- **No API key**: Set \`VITE_GEMINI_API_KEY\` in your \`.env\` file
- **Rate limit**: The astral channels are congested — try again shortly
- **Network error**: Check your connection to the cosmic web

Your session data is saved. Click "Generate New Report" to retry.

---

*Error: ${err instanceof Error ? err.message : 'Unknown error'}*`;
      dispatch({ type: 'SET_REPORT', payload: fallbackReport });
      navigateTo(AppStep.REPORT);
    }
  }, [session, dispatch, navigateTo]);

  const handleImageUpload = useCallback((data: ImageUploadData) => {
    dispatch({ type: 'SET_IMAGES', payload: data });
    dispatch({ type: 'COMPLETE_STEP', payload: AppStep.IMAGE_UPLOAD });
    navigateTo(AppStep.GENERATING);
    void startGeneration({ ...session, images: data });
  }, [dispatch, navigateTo, session, startGeneration]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_SESSION' });
    setStreamPreview('');
    navigateTo(AppStep.LANDING);
  }, [dispatch, navigateTo]);

  const handleSave = useCallback(() => {
    saveCurrentSession();
  }, [saveCurrentSession]);

  const exportAssessment = () => {
    const { images: _images, ...current } = session;
    void _images;
    const blob = new Blob([JSON.stringify(current, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SoulPrint-assessment.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const isNotLanding = currentStep !== AppStep.LANDING;

  return (
    <div className="min-h-screen bg-void starfield relative">
      <ParticleField />

      {/* Top nav bar */}
      {isNotLanding && (
        <motion.header
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-40 glass-strong"
        >
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => navigateTo(AppStep.LANDING)}
              className="font-display text-sm gradient-text hover:opacity-80 transition cursor-pointer"
            >
              SoulPrint
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowStarMap(true)}
                className="text-white/40 hover:text-white/80 transition text-sm font-tech cursor-pointer"
              >
                ✦ Star Map
              </button>
              <ProgressRing percentage={completionPercentage} size={36} strokeWidth={3} />
            </div>
          </div>
        </motion.header>
      )}

      {/* Main content */}
      <main className={`relative z-10 ${isNotLanding ? 'pt-20 pb-12' : ''}`}>
        <div className="max-w-3xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              {currentStep === AppStep.LANDING && (
                <LandingPage
                  onBegin={() => navigateTo(AppStep.PERSONAL_DATA)}
                  onResume={() => {
                    const lastStep = session.completedSteps[session.completedSteps.length - 1];
                    if (lastStep) {
                      const idx = STEP_ORDER.indexOf(lastStep);
                      navigateTo(STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]);
                    } else {
                      navigateTo(AppStep.PERSONAL_DATA);
                    }
                  }}
                  onArchives={() => {}}
                  hasExistingSession={session.completedSteps.length > 0}
                />
              )}

              {currentStep === AppStep.PERSONAL_DATA && (
                <StepPersonalData onComplete={handlePersonalData} />
              )}

              {currentStep === AppStep.MINDSET_MATRIX && (
                <StepMindsetMatrix onComplete={handleMBTI} />
              )}

              {currentStep === AppStep.INNER_OS && (
                <StepInnerOS onComplete={handleEnneagram} />
              )}

              {currentStep === AppStep.ELEMENTAL_BALANCE && (
                <StepElementalBalance onComplete={handleBigFive} />
              )}

              {currentStep === AppStep.NEURAL_RESONANCE && (
                <StepNeuralResonance onComplete={handleNeuralResonance} />
              )}

              {currentStep === AppStep.KINETIC_SIGNATURE && (
                <StepKineticSignature onComplete={handleDISC} />
              )}

              {currentStep === AppStep.VOID_GAZE && (
                <StepVoidGaze onComplete={handleVoidGaze} />
              )}

              {currentStep === AppStep.NARRATIVE_ARC && (
                <StepNarrativeArc onComplete={handleNarrativeArc} />
              )}

              {currentStep === AppStep.JUNGIAN_ARCHETYPES && (
                <StepJungianArchetypes onComplete={handleJungian} />
              )}

              {currentStep === AppStep.SHADOW_WORK && (
                <StepShadowWork onComplete={handleShadowWork} />
              )}

              {currentStep === AppStep.IMAGE_UPLOAD && (
                <StepImageUpload onComplete={handleImageUpload} />
              )}

              {currentStep === AppStep.GENERATING && (
                <GeneratingView
                  progress=""
                  streamPreview={streamPreview.slice(0, 500)}
                />
              )}

              {currentStep === AppStep.REPORT && session.report && (
                <div className="flex flex-wrap gap-3 justify-center my-4"><button className="glass rounded-lg p-3" onClick={exportAssessment}>Download assessment data</button><button className="glass rounded-lg p-3" onClick={() => void startGeneration()}>Regenerate analysis without retesting</button></div>
              )}
              {currentStep === AppStep.REPORT && session.report && (
                <ReportView
                  report={session.report}
                  isStreaming={isStreaming}
                  subjectName={session.personalData?.name || 'Cosmic Traveler'}
                  onSave={handleSave}
                  onReset={handleReset}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Star Map Modal */}
      <StarMap
        isOpen={showStarMap}
        onClose={() => setShowStarMap(false)}
        onNavigate={navigateTo}
        currentStep={currentStep}
      />

      {/* Insight Modal */}
      <InsightModal
        isOpen={showInsight}
        onClose={() => { if (!insightText) return; setShowInsight(false); advanceStep(); }}
        insight={insightText}
        testName={insightTestName}
      />
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <SoulPrintApp />
    </SessionProvider>
  );
}
