import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SoulPrintSession } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

function getGenAI() {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY not set');
  return new GoogleGenerativeAI(API_KEY);
}

function buildPrompt(session: SoulPrintSession): string {
  const { personalData, mbti, enneagram, bigFive, neuralResonance, disc, voidGaze, narrativeArc, jungian, shadowWork } = session;

  const sections: string[] = [];

  sections.push(`# SoulPrint Cosmic Personality Synthesis Request

You are an elite personality analyst combining expertise in:
- Jungian analytical psychology
- Clinical personality assessment (MMPI, Big Five)
- Behavioral typing (MBTI, DISC, Enneagram)
- Archetypal psychology
- Projective assessment interpretation
- Astrological symbolism (Western tropical)

Generate an extremely detailed, insightful, and beautifully written personality synthesis report.
Use cosmic/mystical metaphors but ground everything in legitimate psychological insight.
The report should feel like a profound revelation — not generic horoscope fluff.
Be specific, surprising, and deeply personal based on the data provided.

Write in Markdown format with rich formatting.`);

  if (personalData) {
    sections.push(`## Subject Data
- **Name**: ${personalData.name}
- **Birth Date**: ${personalData.birthDate}
- **Birth Time**: ${personalData.birthTime || 'Unknown'}
- **Birth Place**: ${personalData.birthPlace || 'Unknown'}
- **Gender**: ${personalData.gender || 'Not specified'}
- **Pronouns**: ${personalData.pronouns || 'They/them'}

Calculate their Sun sign, Moon sign (estimate if birth time unknown), and Rising sign from this data. Integrate astrological insights throughout.`);
  }

  if (mbti) {
    sections.push(`## Mindset Matrix (MBTI)
- **Type**: ${mbti.type}${mbti.assertive ? '-A' : '-T'}
- **E/I Axis**: ${mbti.scores.EI} (negative = Introverted, positive = Extraverted)
- **S/N Axis**: ${mbti.scores.SN} (negative = iNtuitive, positive = Sensing)
- **T/F Axis**: ${mbti.scores.TF} (negative = Feeling, positive = Thinking)
- **J/P Axis**: ${mbti.scores.JP} (negative = Perceiving, positive = Judging)

Analyze the strength of each preference. Note any borderline axes that suggest cognitive flexibility.`);
  }

  if (enneagram) {
    sections.push(`## Inner Operating System (Enneagram)
- **Core Type**: ${enneagram.type}w${enneagram.wing}
- **Tritype**: ${enneagram.tritype.join('-')}
- **Type Scores**: ${JSON.stringify(enneagram.scores)}

Discuss their core fear, core desire, and growth/stress lines.`);
  }

  if (bigFive) {
    sections.push(`## Elemental Balance (Big Five) — scores 0-100
- **Openness**: ${bigFive.openness}
- **Conscientiousness**: ${bigFive.conscientiousness}
- **Extraversion**: ${bigFive.extraversion}
- **Agreeableness**: ${bigFive.agreeableness}
- **Neuroticism**: ${bigFive.neuroticism}

Compare to population norms. Identify the most distinctive trait pattern.`);
  }

  if (neuralResonance) {
    sections.push(`## Neural Resonance (Clinical Scales) — scores 0-100
${Object.entries(neuralResonance.scales).map(([k, v]) => `- **${k}**: ${v}`).join('\n')}

Note: These are self-report approximations, NOT clinical diagnoses. Interpret elevated scales as personality tendencies, not pathology.`);
  }

  if (disc) {
    sections.push(`## Kinetic Signature (DISC) — scores 0-100
- **Dominance**: ${disc.dominance}
- **Influence**: ${disc.influence}
- **Steadiness**: ${disc.steadiness}
- **Conscientiousness**: ${disc.conscientiousness}
- **Primary Style**: ${disc.primaryStyle}

Describe their leadership style, conflict approach, and team dynamics.`);
  }

  if (voidGaze) {
    sections.push(`## Void Gaze (Projective Responses)
${voidGaze.responses.map((r, i) => `### Image ${i + 1}
- **Response**: "${r.response}"
- **Emotional Tone**: ${r.emotionalTone}`).join('\n\n')}

Analyze projection patterns, recurring themes, and unconscious preoccupations.`);
  }

  if (narrativeArc) {
    sections.push(`## Narrative Arc (Story Responses)
${narrativeArc.stories.map((s, i) => `### Scene ${i + 1}
- **Story**: "${s.story}"
- **Themes**: ${s.themes.join(', ')}`).join('\n\n')}

Analyze narrative patterns — what roles does the subject assign? What conflicts emerge? What resolutions are preferred?`);
  }

  if (jungian) {
    sections.push(`## Archetype Resonance (Jungian)
- **Primary Archetype**: ${jungian.primaryArchetype}
- **Secondary Archetype**: ${jungian.secondaryArchetype}
- **All Scores**: ${JSON.stringify(jungian.scores)}

Discuss how these archetypes manifest in daily life and relationships.`);
  }

  if (shadowWork) {
    sections.push(`## Shadow Integration
- **Repressed Traits**: ${shadowWork.repressedTraits.join(', ')}
- **Trigger Patterns**: ${shadowWork.triggerPatterns.join(', ')}
- **Integration Level**: ${shadowWork.integrationLevel}/100
- **Responses**: ${JSON.stringify(shadowWork.responses)}

This is the most sensitive section. Handle with care but don't shy away from truth.`);
  }

  sections.push(`## Report Structure

Generate the following sections with these exact headers:

# 🔮 SoulPrint: The Cosmic Blueprint of [Name]

## ✦ Celestial Overture
A poetic 2-3 paragraph opening that captures the essence of this person.

## ◈ The Cognitive Architecture
Deep dive into how they think, process, and decide. Integrate MBTI + Big Five.

## ◉ The Motivational Core
Enneagram-driven analysis of what truly drives them beneath the surface.

## ◇ The Emotional Landscape
Neuroticism, clinical scales, and emotional processing patterns.

## ◎ The Social Signature
How they interact with others — DISC, extraversion, agreeableness.

## ◐ The Unconscious Depths
Projective analysis, shadow work, and Jungian archetypes woven together.

## ◌ The Narrative Identity
What their stories reveal about their self-concept and life narrative.

## ⬢ The Archetypal Constellation
A unified map of their archetypal patterns — which mythic figures they embody.

## ⊕ The Integration Path
Practical growth recommendations synthesizing all data — specific, actionable, compassionate.

## ✧ The SoulPrint Signature
A closing "cosmic signature" — a unique poetic distillation of everything above in 4-6 lines.
Like a personality fingerprint rendered in language.

---

IMPORTANT GUIDELINES:
- Be SPECIFIC to this person's data. No generic advice.
- Use vivid cosmic/mystical metaphors alongside legitimate psychological insight.
- Cross-reference data points (e.g., "Your ENFP extraversion combined with Enneagram 4 creates a paradox of...")
- Include at least 3 surprising insights that emerge from data correlations.
- Each section should be 200-400 words.
- Total report: 2500-4000 words.
- Mark any skipped/unavailable tests as [LOCKED — Data Not Provided] and work around them.`);

  return sections.join('\n\n---\n\n');
}

export async function generateReport(
  session: SoulPrintSession,
  onChunk?: (text: string) => void
): Promise<string> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

  const prompt = buildPrompt(session);

  const imageParts: Array<{ inlineData: { data: string; mimeType: string } }> = [];
  if (session.images?.palmImage) {
    const base64 = session.images.palmImage.split(',')[1];
    if (base64) {
      imageParts.push({ inlineData: { data: base64, mimeType: 'image/jpeg' } });
    }
  }
  if (session.images?.faceImage) {
    const base64 = session.images.faceImage.split(',')[1];
    if (base64) {
      imageParts.push({ inlineData: { data: base64, mimeType: 'image/jpeg' } });
    }
  }

  const content = imageParts.length > 0
    ? [prompt, ...imageParts]
    : [prompt];

  const result = await model.generateContentStream(content);

  let fullText = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    fullText += text;
    onChunk?.(fullText);
  }

  return fullText;
}

export async function generateInsight(
  testName: string,
  testData: Record<string, unknown>
): Promise<string> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

  const prompt = `You are a mystical personality analyst. The subject just completed the "${testName}" assessment.

Results: ${JSON.stringify(testData)}

Generate a brief (3-4 sentences), poetic but psychologically insightful observation about what this data reveals. Use cosmic metaphors. Be specific to the data, not generic. Start with "✦" and end with a thought-provoking question.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
