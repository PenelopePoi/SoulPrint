import { motion, useInView } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef, useState, useCallback } from 'react';
import CosmicButton from '../ui/CosmicButton';

interface ReportViewProps {
  report: string;
  isStreaming: boolean;
  subjectName: string;
  onSave: () => void;
  onReset: () => void;
}

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

// Animated section wrapper using IntersectionObserver
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Parse headings from markdown for TOC
function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split('\n');
  const toc: TocEntry[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,3})\s+(.+)/);
    if (m) {
      const text = m[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      toc.push({ id, text, level: m[1].length });
    }
  }
  return toc;
}

export default function ReportView({
  report,
  isStreaming,
  subjectName,
  onSave,
  onReset,
}: ReportViewProps) {
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const reportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Rebuild TOC whenever report changes
  useEffect(() => {
    setToc(extractToc(report));
  }, [report]);

  // Highlight active TOC entry via scroll position
  useEffect(() => {
    const container = reportRef.current;
    if (!container) return;

    const handleScroll = () => {
      const headings = container.querySelectorAll('h1, h2, h3');
      let current = '';
      headings.forEach((h) => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 140) current = h.id;
      });
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Custom heading renderer that adds id attributes
  const headingRenderer = (level: number) =>
    function HeadingComp({ children }: { children?: React.ReactNode }) {
      const text = typeof children === 'string' ? children : '';
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
      return <Tag id={id}>{children}</Tag>;
    };

  return (
    <div className="relative min-h-screen" ref={reportRef}>
      {/* ── Cosmic header ── */}
      <motion.div
        className="relative py-16 px-6 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)',
          }}
        />

        <motion.p
          className="text-xs font-tech tracking-[0.4em] uppercase mb-4"
          style={{ color: 'rgba(124,58,237,0.7)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ✦ &nbsp; Psyche Archive &nbsp; ✦
        </motion.p>

        <motion.h1
          className="text-4xl md:text-6xl font-display gradient-text mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          {subjectName}
        </motion.h1>

        <motion.p
          className="text-sm font-body"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          SoulPrint Blueprint &nbsp;·&nbsp; Generated{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </motion.p>

        <motion.div
          className="mt-6 h-px w-full max-w-xl mx-auto"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(236,72,153,0.4), transparent)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
      </motion.div>

      {/* ── Layout: TOC sidebar + report body ── */}
      <div className="max-w-6xl mx-auto px-4 pb-24 flex gap-8">
        {/* Table of Contents — floating sidebar */}
        <motion.aside
          className="hidden lg:block sticky top-24 self-start w-56 shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="glass rounded-2xl p-4 space-y-1">
            <p
              className="text-xs font-tech tracking-widest uppercase mb-3"
              style={{ color: 'rgba(124,58,237,0.7)' }}
            >
              Contents
            </p>
            {toc.map((entry) => {
              const isActive = activeId === entry.id;
              return (
                <motion.button
                  key={entry.id}
                  onClick={() => scrollToId(entry.id)}
                  className="block w-full text-left rounded-lg px-2 py-1.5 text-xs transition-all duration-200"
                  style={{
                    paddingLeft: entry.level === 1 ? 8 : entry.level === 2 ? 16 : 24,
                    color: isActive ? '#ec4899' : 'rgba(255,255,255,0.4)',
                    background: isActive ? 'rgba(236,72,153,0.08)' : 'transparent',
                    borderLeft: isActive ? '2px solid #ec4899' : '2px solid transparent',
                    fontFamily: 'Orbitron, sans-serif',
                  }}
                  animate={{ color: isActive ? '#ec4899' : 'rgba(255,255,255,0.4)' }}
                >
                  {entry.text}
                </motion.button>
              );
            })}

            {isStreaming && (
              <motion.div
                className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#10b981' }}
                />
                <span
                  className="text-xs font-mono"
                  style={{ color: '#10b981' }}
                >
                  Receiving…
                </span>
              </motion.div>
            )}
          </div>
        </motion.aside>

        {/* Report content */}
        <div className="flex-1 min-w-0" ref={contentRef}>
          <RevealSection>
            <div className="glass rounded-2xl p-6 md:p-10">
              <div className="soul-report">
                <ReactMarkdown
                  components={{
                    h1: headingRenderer(1),
                    h2: headingRenderer(2),
                    h3: headingRenderer(3),
                  }}
                >
                  {report}
                </ReactMarkdown>

                {/* Streaming cursor */}
                {isStreaming && (
                  <motion.span
                    className="inline-block w-0.5 h-5 ml-0.5 align-middle"
                    style={{ background: '#7c3aed' }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </RevealSection>
        </div>
      </div>

      {/* ── Action bar ── */}
      <motion.div
        className="fixed bottom-0 inset-x-0 z-50 py-4 px-6"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,26,0.95) 60%, transparent)',
          backdropFilter: 'blur(12px)',
        }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <CosmicButton onClick={onSave} variant="primary" size="md" disabled={isStreaming}>
            ✦ Save to Archives
          </CosmicButton>
          <CosmicButton onClick={() => {
            const url = URL.createObjectURL(new Blob([report], { type: 'text/markdown;charset=utf-8' }));
            const link = document.createElement('a'); link.href = url; link.download = 'SoulPrint-reflection.md'; link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }} variant="secondary" size="md" disabled={isStreaming}>Download report</CosmicButton>
          <CosmicButton
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `${subjectName} — SoulPrint`, text: report.slice(0, 300) });
              }
            }}
            variant="secondary"
            size="md"
          >
            ◌ Share
          </CosmicButton>
          <CosmicButton onClick={onReset} variant="ghost" size="md">
            ◈ Generate New Report
          </CosmicButton>
        </div>
      </motion.div>
    </div>
  );
}
