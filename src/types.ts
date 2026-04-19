export const AppStep = {
  LANDING: 'landing',
  PERSONAL_DATA: 'personal_data',
  MINDSET_MATRIX: 'mindset_matrix',
  INNER_OS: 'inner_os',
  ELEMENTAL_BALANCE: 'elemental_balance',
  NEURAL_RESONANCE: 'neural_resonance',
  KINETIC_SIGNATURE: 'kinetic_signature',
  VOID_GAZE: 'void_gaze',
  NARRATIVE_ARC: 'narrative_arc',
  JUNGIAN_ARCHETYPES: 'jungian_archetypes',
  SHADOW_WORK: 'shadow_work',
  IMAGE_UPLOAD: 'image_upload',
  GENERATING: 'generating',
  REPORT: 'report',
} as const;

export type AppStep = (typeof AppStep)[keyof typeof AppStep];

export interface PersonalData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  pronouns: string;
}

export interface MBTIResult {
  type: string;
  scores: {
    EI: number; // -100 (I) to 100 (E)
    SN: number; // -100 (N) to 100 (S)
    TF: number; // -100 (F) to 100 (T)
    JP: number; // -100 (P) to 100 (J)
  };
  assertive: boolean;
}

export interface EnneagramResult {
  type: number;
  wing: number;
  scores: Record<number, number>; // 1-9 => score
  tritype: [number, number, number];
}

export interface BigFiveResult {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface NeuralResonanceResult {
  scales: {
    hypochondriasis: number;
    depression: number;
    hysteria: number;
    psychopathicDeviate: number;
    paranoia: number;
    psychasthenia: number;
    schizophrenia: number;
    hypomania: number;
  };
}

export interface DISCResult {
  dominance: number;
  influence: number;
  steadiness: number;
  conscientiousness: number;
  primaryStyle: 'D' | 'I' | 'S' | 'C';
}

export interface VoidGazeResult {
  responses: Array<{
    imageId: string;
    response: string;
    emotionalTone: string;
  }>;
}

export interface NarrativeArcResult {
  stories: Array<{
    imageId: string;
    story: string;
    themes: string[];
  }>;
}

export interface JungianResult {
  primaryArchetype: string;
  secondaryArchetype: string;
  scores: Record<string, number>;
}

export interface ShadowWorkResult {
  repressedTraits: string[];
  triggerPatterns: string[];
  integrationLevel: number;
  responses: Record<string, string>;
}

export interface ImageUploadData {
  palmImage?: string;
  faceImage?: string;
}

export interface SoulPrintSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  personalData?: PersonalData;
  mbti?: MBTIResult;
  enneagram?: EnneagramResult;
  bigFive?: BigFiveResult;
  neuralResonance?: NeuralResonanceResult;
  disc?: DISCResult;
  voidGaze?: VoidGazeResult;
  narrativeArc?: NarrativeArcResult;
  jungian?: JungianResult;
  shadowWork?: ShadowWorkResult;
  images?: ImageUploadData;
  report?: string;
  completedSteps: AppStep[];
}

export interface StepConfig {
  id: AppStep;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
}

export const STEP_CONFIGS: StepConfig[] = [
  {
    id: AppStep.PERSONAL_DATA,
    title: 'Astral Coordinates',
    subtitle: 'Birth Data',
    icon: '✦',
    color: '#7c3aed',
    description: 'Your cosmic entry point — time, place, and celestial alignment at birth.',
  },
  {
    id: AppStep.MINDSET_MATRIX,
    title: 'Mindset Matrix',
    subtitle: 'MBTI Analysis',
    icon: '◈',
    color: '#3b82f6',
    description: 'Map your cognitive architecture across 4 dimensions of perception and judgment.',
  },
  {
    id: AppStep.INNER_OS,
    title: 'Inner Operating System',
    subtitle: 'Enneagram',
    icon: '◉',
    color: '#ec4899',
    description: 'Decode your core motivational engine and its 9-fold expression pattern.',
  },
  {
    id: AppStep.ELEMENTAL_BALANCE,
    title: 'Elemental Balance',
    subtitle: 'Big Five',
    icon: '◇',
    color: '#10b981',
    description: 'Measure the 5 fundamental forces that shape your personality expression.',
  },
  {
    id: AppStep.NEURAL_RESONANCE,
    title: 'Neural Resonance',
    subtitle: 'Clinical Scales',
    icon: '⬡',
    color: '#f59e0b',
    description: 'Scan your neural frequency patterns across 8 clinical dimensions.',
  },
  {
    id: AppStep.KINETIC_SIGNATURE,
    title: 'Kinetic Signature',
    subtitle: 'DISC Profile',
    icon: '◎',
    color: '#06b6d4',
    description: 'Capture your behavioral momentum — how you move through the world.',
  },
  {
    id: AppStep.VOID_GAZE,
    title: 'Void Gaze',
    subtitle: 'Projective Analysis',
    icon: '◐',
    color: '#8b5cf6',
    description: 'Peer into abstract forms and reveal what your unconscious projects.',
  },
  {
    id: AppStep.NARRATIVE_ARC,
    title: 'Narrative Arc',
    subtitle: 'Story Telling',
    icon: '◌',
    color: '#f43f5e',
    description: 'Weave stories from ambiguous scenes — your narrative reveals your psyche.',
  },
  {
    id: AppStep.JUNGIAN_ARCHETYPES,
    title: 'Archetype Resonance',
    subtitle: 'Jungian Analysis',
    icon: '⬢',
    color: '#a855f7',
    description: 'Identify which universal archetypes animate your personality.',
  },
  {
    id: AppStep.SHADOW_WORK,
    title: 'Shadow Integration',
    subtitle: 'Shadow Work',
    icon: '◑',
    color: '#6366f1',
    description: 'Confront the hidden aspects of self that operate beneath awareness.',
  },
  {
    id: AppStep.IMAGE_UPLOAD,
    title: 'Biometric Imprint',
    subtitle: 'Optional Scan',
    icon: '⊕',
    color: '#14b8a6',
    description: 'Upload palm or face images for optional physiognomic resonance analysis.',
  },
];
