import type { SoulPrintSession } from '../types';

function localReflectionReport(session: SoulPrintSession): string {
  const sections = ['# Soul Print — Personal Reflection', 'This report is generated locally from your responses, without external AI processing. These original assessments are not clinical tests or diagnoses. Spiritual interpretations are optional and separate from psychological evidence.'];
  if(session.mbti) sections.push('## MindSet Matrix 16', 'Your response-based preference label: **'+session.mbti.type+'**. Consider when this description fits and when it does not. A type is a reflection aid, not a fixed identity.');
  if(session.enneagram) sections.push('## Inner Operating System / IOS-9', 'Your response-based motivation label: **'+session.enneagram.type+'**. What recent decision supports this interpretation? What challenges it?');
  if(session.bigFive) sections.push('## Trait reflection', Object.entries(session.bigFive).map(([name,value])=>'- '+name+': '+value+' (app scoring; not a clinical norm)').join('\n'));
  sections.push('## Philosophy and values', 'Which three values matter most to you? Describe one choice you can make this week that honors one of them.', '## Communication', 'When a difficult situation happens, separate the observable behavior, your feeling, your interpretation, and the request you want to make.', '## Optional symbolic lens', 'No astronomical birth chart was calculated. Astrology and spiritual systems are symbolic reflection, not verified psychological measurements. No traits are inferred from face or palm images.', '## Your next step', 'Choose one small action, write a date, and review what happened without judging your whole identity by one result. Open the reflection workbook from the home page for printable exercises.');
  return sections.join('\n\n');
}

export async function generateReport(session: SoulPrintSession, onChunk?: (text: string) => void): Promise<string> {
  const report = localReflectionReport(session);
  onChunk?.(report);
  return report;
}
export async function generateInsight(testName: string, _testData: Record<string, unknown>): Promise<string> {
  return `Your ${testName} responses are a starting point for reflection, not a diagnosis or fixed identity. Which part fits your lived experience, and what would you question?`;
}
