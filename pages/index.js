import React, { useState, useCallback, useRef } from 'react';
import Head from 'next/head';

/* ─── Icons ──────────────────────────────────────────────────────────────── */

const FlameIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C9.1 6.5 7 9 7 12a5 5 0 0 0 10 0c0-1.4-.5-2.8-1.3-4.1C14.8 9.6 14 11 12 11c-1.2 0-2-1-2-2 0-2.4 2-4.5 2-7Z" />
    <path opacity=".5" d="M12 15a2 2 0 0 0 2-2c0-1-.6-1.9-2-2.6-1.4.7-2 1.6-2 2.6a2 2 0 0 0 2 2Z" />
  </svg>
);

const SparkleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2Z" />
    <path opacity=".4" d="M5 3l.8 2.8L8.5 6.5 5.8 7.3 5 10l-.8-2.7L1.5 6.5l2.7-.8L5 3ZM19 14l.8 2.8 2.7.7-2.7.8L19 21l-.8-2.7-2.7-.8 2.7-.7L19 14Z" />
  </svg>
);

const LoaderIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TextIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
    <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
  </svg>
);

/* ─── File type helpers ──────────────────────────────────────────────────── */

const FILE_TYPES = {
  pdf:   { label: 'PDF',   color: '#ef4444', bg: '#450a0a', emoji: '📄' },
  doc:   { label: 'DOC',   color: '#3b82f6', bg: '#0c1a3a', emoji: '📝' },
  docx:  { label: 'DOCX',  color: '#3b82f6', bg: '#0c1a3a', emoji: '📝' },
  txt:   { label: 'TXT',   color: '#a3a3a3', bg: '#171717', emoji: '📃' },
  png:   { label: 'PNG',   color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
  jpg:   { label: 'JPG',   color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
  jpeg:  { label: 'JPEG',  color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
  webp:  { label: 'WEBP',  color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
};

const ACCEPTED_EXTENSIONS = Object.keys(FILE_TYPES);
const ACCEPTED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png', 'image/jpeg', 'image/webp',
];

function getExt(filename) {
  return filename.split('.').pop().toLowerCase();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* Simulate text extraction (replace with real PDF/OCR parsing on backend) */
async function extractTextFromFile(file) {
  const ext = getExt(file.name);
  if (ext === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  // For PDF / DOCX / images → simulate server-side extraction delay
  await new Promise((r) => setTimeout(r, 1500));
  return `[Extracted from ${file.name}]\n\nJohn Doe\njohn.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe\n\nSUMMARY\nResults-driven software engineer with 4 years of experience building scalable web applications. Passionate about clean code and user-centric design.\n\nEXPERIENCE\nSoftware Engineer — Acme Corp (2021–Present)\n• Led development of customer dashboard that reduced support tickets by 32%\n• Optimized database queries cutting page load times by 48%\n• Mentored 2 junior engineers through onboarding and code review\n\nJunior Developer — StartupXYZ (2020–2021)\n• Built RESTful APIs consumed by 50k+ monthly active users\n• Integrated third-party payment gateway, enabling $2M in annual transactions\n\nSKILLS\nJavaScript, TypeScript, React, Node.js, PostgreSQL, Docker, AWS, Git\n\nEDUCATION\nB.S. Computer Science — State University, 2020`;
}

/* ─── Score ring ─────────────────────────────────────────────────────────── */

const ScoreRing = ({ score }) => {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 10) * circ;
  const color = score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} stroke="#262626" strokeWidth="6" fill="none" />
        <circle cx="36" cy="36" r={r} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease-out' }} />
      </svg>
      <span className="absolute text-lg font-bold" style={{ color }}>{score}</span>
    </div>
  );
};

/* ─── Mock roast API ─────────────────────────────────────────────────────── */

const MOCK_ROAST = {
  score: 3,
  summary: "Oh honey… this resume tried its best. Points for effort, none for impact.",
  sections: [
    { icon: "🔥", label: "Overall Roast", content: "Your resume reads like a LinkedIn profile written by a bored fortune cookie. Every line screams 'I existed at a company' — not 'I made a difference.' The formatting is somehow both cramped AND sparse. Impressive, really." },
    { icon: "🎯", label: "Biggest Crimes", content: "① 'Responsible for…' — responsible for what? Breathing? ② Objective section in 2026? Bold. ③ Three different font sizes that have nothing to do with hierarchy. ④ Skills section lists 'Microsoft Word.' Your grandma could out-LinkedIn you." },
    { icon: "✨", label: "What Actually Works", content: "You listed real numbers in one bullet point! That's it. That's the highlight. But hey, one data-backed achievement is more than 80% of people manage." },
    { icon: "💡", label: "Power-Up Suggestions", content: "Lead with impact, not duties. Turn 'managed a team' into 'led a 6-person team that shipped feature X, boosting retention by 22%.' Ditch the objective — write a 3-line summary instead. And please, consistent spacing." },
  ],
};

async function fetchRoast(resumeText) {
  await new Promise((r) => setTimeout(r, 2600));
  return MOCK_ROAST;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const MIN_CHARS = 200;

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export default function ResumeRoaster() {
  /* tabs: 'paste' | 'upload' */
  const [tab, setTab] = useState('paste');

  /* paste state */
  const [resume, setResume] = useState('');
  const [touched, setTouched] = useState(false);

  /* upload state */
  const [uploadedFile, setUploadedFile] = useState(null);   // { file, preview, text }
  const [extracting, setExtracting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  /* roast state */
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  /* ── derived ── */
  const activeText = tab === 'paste' ? resume : (uploadedFile?.text ?? '');
  const charCount  = activeText.length;
  const isValid    = charCount >= MIN_CHARS;
  const remaining  = MIN_CHARS - charCount;
  const canSubmit  = isValid && !loading && !extracting && (tab === 'paste' || uploadedFile?.text);

  /* ── file helpers ── */
  const processFile = useCallback(async (file) => {
    setUploadError('');
    const ext = getExt(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setUploadError(`Unsupported file type ".${ext}". Please upload PDF, DOCX, TXT, or an image.`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large. Maximum size is 10 MB.');
      return;
    }

    const isImage = ['png', 'jpg', 'jpeg', 'webp'].includes(ext);
    let preview = null;
    if (isImage) {
      preview = URL.createObjectURL(file);
    }

    setUploadedFile({ file, preview, text: null });
    setExtracting(true);
    try {
      const text = await extractTextFromFile(file);
      setUploadedFile({ file, preview, text });
    } catch {
      setUploadError('Failed to read file. Try a different format or paste the text instead.');
      setUploadedFile(null);
    } finally {
      setExtracting(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  const removeFile = () => {
    if (uploadedFile?.preview) URL.revokeObjectURL(uploadedFile.preview);
    setUploadedFile(null);
    setUploadError('');
  };

  /* ── submit ── */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setResult(null);
    setLoading(true);
    setTouched(true);
    try {
      const data = await fetchRoast(activeText);
      setResult(data);
    } catch {
      setError('Something went wrong. The roast servers are on fire — literally.');
    } finally {
      setLoading(false);
    }
  }, [activeText, canSubmit]);

  const handleReset = () => {
    setResume('');
    setResult(null);
    setError('');
    setTouched(false);
    setUploadedFile(null);
    setUploadError('');
    setTab('paste');
  };

  /* ── file meta ── */
  const fileMeta = uploadedFile ? FILE_TYPES[getExt(uploadedFile.file.name)] : null;

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <Head>
        <title>RoastCV — AI Resume Roaster</title>
        <meta name="description" content="Paste or upload your resume and get a brutally honest AI-powered critique. No sugarcoating." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>" />
      </Head>

      <div className="min-h-screen bg-neutral-950 selection:bg-orange-500/30">

        {/* Glow blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-orange-600/10 blur-[120px]" />
          <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-orange-400/5 blur-[100px]" />
          <div className="absolute bottom-0 -left-32 w-[500px] h-[400px] rounded-full bg-orange-900/10 blur-[100px]" />
        </div>

        <main className="relative z-10 flex flex-col items-center px-4 py-16 sm:py-24">

          {/* ── HERO ── */}
          <section className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold tracking-wide uppercase">
              <SparkleIcon className="w-3 h-3" />
              AI-Powered · Brutally Honest
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
                <FlameIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                Roast<span className="text-orange-400">CV</span>
              </h1>
            </div>
            <p className="max-w-lg text-neutral-400 text-base sm:text-lg leading-relaxed">
              Paste your resume or <span className="text-orange-400 font-semibold">upload a file</span> — get a brutally honest AI critique that skips the fluff.
            </p>
          </section>

          {/* ── FORM CARD ── */}
          <section className="w-full max-w-2xl">
            <div className="relative rounded-2xl border border-white/[0.07] bg-neutral-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-6 sm:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />

              <form onSubmit={handleSubmit} noValidate>

                {/* ── TABS ── */}
                <div className="flex gap-1 mb-6 p-1 rounded-xl bg-neutral-800/60 border border-neutral-700/40">
                  {[
                    { key: 'paste',  label: 'Paste Text',    icon: <TextIcon className="w-3.5 h-3.5" /> },
                    { key: 'upload', label: 'Upload File',   icon: <UploadIcon className="w-3.5 h-3.5" /> },
                  ].map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      id={`tab-${key}`}
                      onClick={() => { setTab(key); setError(''); }}
                      className={[
                        'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
                        tab === key
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                          : 'text-neutral-400 hover:text-neutral-200',
                      ].join(' ')}
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>

                {/* ══ PASTE TAB ══ */}
                {tab === 'paste' && (
                  <div>
                    <label htmlFor="resume-input" className="block text-sm font-semibold text-neutral-300 mb-2">
                      Paste your resume below
                    </label>
                    <div className="relative">
                      <textarea
                        id="resume-input"
                        name="resume"
                        value={resume}
                        onChange={(e) => { setResume(e.target.value); setTouched(true); }}
                        onBlur={() => setTouched(true)}
                        placeholder="Paste the full text of your resume here… the more detail, the spicier the roast 🌶️"
                        rows={10}
                        disabled={loading}
                        aria-describedby="char-hint"
                        aria-invalid={touched && !isValid}
                        style={{ resize: 'none' }}
                        className={[
                          'w-full rounded-xl bg-neutral-800/60 border px-4 py-3',
                          'text-sm text-neutral-200 placeholder:text-neutral-600',
                          'focus:outline-none focus:ring-2 transition-all duration-200',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'scrollbar-thin',
                          touched && !isValid && resume.length > 0
                            ? 'border-red-500/60 focus:ring-red-500/40 focus:border-red-500'
                            : isValid
                            ? 'border-orange-500/40 focus:ring-orange-500/40 focus:border-orange-500/60'
                            : 'border-neutral-700/60 focus:ring-orange-500/30 focus:border-orange-500/40',
                        ].join(' ')}
                      />
                      <div
                        id="char-hint"
                        className={[
                          'absolute bottom-3 right-3 text-xs font-mono px-2 py-0.5 rounded-full transition-colors duration-200',
                          isValid ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700/60 text-neutral-500',
                        ].join(' ')}
                      >
                        {charCount} / {MIN_CHARS}
                      </div>
                    </div>
                    <div className="mt-2 h-5">
                      {touched && !isValid && resume.length > 0 && (
                        <p className="text-xs text-red-400" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                          {remaining} more character{remaining !== 1 ? 's' : ''} needed to get roasted.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ══ UPLOAD TAB ══ */}
                {tab === 'upload' && (
                  <div>
                    {/* Accepted formats badge row */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {['PDF', 'DOCX', 'DOC', 'TXT', 'PNG', 'JPG'].map((fmt) => (
                        <span key={fmt} className="px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700/60 text-xs text-neutral-400 font-mono">
                          .{fmt.toLowerCase()}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-xs text-neutral-600 ml-auto">Max 10 MB</span>
                    </div>

                    {/* Drop zone — hidden when file is loaded */}
                    {!uploadedFile && !extracting && (
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label="Upload resume file"
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onClick={() => fileInputRef.current?.click()}
                        onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                        className={[
                          'relative flex flex-col items-center justify-center gap-3',
                          'rounded-xl border-2 border-dashed p-10 cursor-pointer',
                          'transition-all duration-200 select-none',
                          dragOver
                            ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
                            : 'border-neutral-700/60 bg-neutral-800/30 hover:border-orange-500/50 hover:bg-orange-500/5',
                        ].join(' ')}
                      >
                        {/* animated upload icon */}
                        <div className={[
                          'flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200',
                          dragOver ? 'bg-orange-500/20' : 'bg-neutral-800',
                        ].join(' ')}>
                          <UploadIcon className={['w-7 h-7 transition-colors duration-200', dragOver ? 'text-orange-400' : 'text-neutral-500'].join(' ')} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-neutral-300">
                            {dragOver ? 'Drop it like it\'s hot 🔥' : 'Drag & drop your resume'}
                          </p>
                          <p className="text-xs text-neutral-600 mt-0.5">or <span className="text-orange-400 underline underline-offset-2">click to browse</span></p>
                        </div>
                        <input
                          ref={fileInputRef}
                          id="file-upload"
                          type="file"
                          accept={ACCEPTED_MIME.join(',')}
                          onChange={handleFileInput}
                          className="sr-only"
                        />
                      </div>
                    )}

                    {/* Extracting state */}
                    {extracting && (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-orange-500/20 bg-neutral-800/40 p-10"
                        style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <LoaderIcon className="w-7 h-7 text-orange-400" style={{ animation: 'spin 1.2s linear infinite' }} />
                        <p className="text-sm text-neutral-400">Extracting text from your file…</p>
                        <div className="w-full max-w-[200px] h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                            style={{ animation: 'progress 1.5s ease-in-out infinite alternate', width: '60%' }} />
                        </div>
                      </div>
                    )}

                    {/* File preview card */}
                    {uploadedFile && !extracting && (
                      <div style={{ animation: 'fadeIn 0.4s ease-out' }}
                        className="rounded-xl border border-white/[0.07] bg-neutral-800/50 p-4">

                        <div className="flex items-start gap-4">
                          {/* thumbnail or type badge */}
                          {uploadedFile.preview ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={uploadedFile.preview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg flex-shrink-0 flex flex-col items-center justify-center border"
                              style={{ background: fileMeta?.bg, borderColor: fileMeta?.color + '30' }}>
                              <span className="text-2xl leading-none">{fileMeta?.emoji}</span>
                              <span className="text-[10px] font-bold mt-1" style={{ color: fileMeta?.color }}>{fileMeta?.label}</span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-neutral-200 truncate">{uploadedFile.file.name}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">{formatBytes(uploadedFile.file.size)}</p>
                              </div>
                              <button
                                type="button"
                                onClick={removeFile}
                                aria-label="Remove file"
                                className="flex-shrink-0 p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                              >
                                <CloseIcon className="w-4 h-4" />
                              </button>
                            </div>

                            {/* extraction success banner */}
                            <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                              <CheckIcon className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                              <span className="text-xs text-green-400 font-medium">
                                Text extracted · {uploadedFile.text?.length.toLocaleString()} characters
                              </span>
                            </div>

                            {/* extracted text preview */}
                            {uploadedFile.text && (
                              <div className="mt-2.5 rounded-lg bg-neutral-900/80 border border-neutral-700/40 p-2.5 max-h-24 overflow-y-auto scrollbar-thin">
                                <p className="text-[11px] text-neutral-500 leading-relaxed whitespace-pre-wrap font-mono">
                                  {uploadedFile.text.slice(0, 300)}{uploadedFile.text.length > 300 ? '…' : ''}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* change file link */}
                        <button
                          type="button"
                          onClick={() => { removeFile(); fileInputRef.current?.click(); }}
                          className="mt-3 text-xs text-neutral-600 hover:text-orange-400 transition-colors duration-150 underline underline-offset-2"
                        >
                          ↩ Upload a different file
                        </button>

                        {/* char count for uploaded file */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className={[
                            'text-xs font-mono px-2 py-0.5 rounded-full',
                            isValid ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700/60 text-neutral-500',
                          ].join(' ')}>
                            {charCount.toLocaleString()} chars {isValid ? '✓' : `(need ${remaining} more)`}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* upload error */}
                    {uploadError && (
                      <div role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-xs text-red-300"
                        style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        ⚠️ {uploadError}
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      id="file-upload-hidden"
                      type="file"
                      accept={ACCEPTED_MIME.join(',')}
                      onChange={handleFileInput}
                      className="sr-only"
                    />
                  </div>
                )}

                {/* ── SUBMIT BUTTON ── */}
                <button
                  id="roast-submit-btn"
                  type="submit"
                  disabled={!canSubmit}
                  className={[
                    'mt-5 w-full flex items-center justify-center gap-2.5',
                    'rounded-xl px-6 py-3.5 text-sm font-bold tracking-wide',
                    'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                    !canSubmit
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]',
                  ].join(' ')}
                >
                  {loading ? (
                    <><LoaderIcon className="w-4 h-4" style={{ animation: 'spin 1.2s linear infinite' }} /><span>Roasting your resume…</span></>
                  ) : extracting ? (
                    <><LoaderIcon className="w-4 h-4" style={{ animation: 'spin 1.2s linear infinite' }} /><span>Extracting text…</span></>
                  ) : (
                    <><FlameIcon className="w-4 h-4" /><span>Roast My Resume</span></>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* ── LOADING STATE ── */}
          {loading && (
            <section aria-live="polite" aria-label="Loading roast"
              className="mt-10 w-full max-w-2xl"
              style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="rounded-2xl border border-orange-500/20 bg-neutral-900/60 backdrop-blur p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
                  <FlameIcon className="w-8 h-8 text-orange-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                </div>
                <p className="text-neutral-300 font-semibold mb-1">AI is reading every painful word…</p>
                <p className="text-neutral-600 text-sm">Sharpening the roast. This takes a moment.</p>
                <div className="mt-6 space-y-2.5 text-left">
                  {[100, 85, 92, 70].map((w, i) => (
                    <div key={i} className="h-3 rounded-full bg-neutral-800"
                      style={{ width: `${w}%`, animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── ERROR ── */}
          {error && !loading && (
            <div role="alert" className="mt-8 w-full max-w-2xl rounded-xl border border-red-500/30 bg-red-950/40 px-5 py-4 text-sm text-red-300"
              style={{ animation: 'fadeIn 0.4s ease-out' }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── RESULTS ── */}
          {result && !loading && (
            <section aria-label="Roast results" className="mt-10 w-full max-w-2xl space-y-4"
              style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <div className="rounded-2xl border border-white/[0.07] bg-neutral-900/70 backdrop-blur-xl p-6 flex items-center gap-6">
                <ScoreRing score={result.score} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">Roast Score</p>
                  <p className="text-white font-bold text-lg leading-snug">
                    {result.score}/10 —{' '}
                    <span className="text-orange-400">
                      {result.score >= 8 ? 'Actually decent 👏' : result.score >= 5 ? 'Needs serious work' : 'Oh no… 🫣'}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-neutral-400 italic">"{result.summary}"</p>
                </div>
              </div>

              {result.sections.map((sec, idx) => (
                <div key={idx}
                  className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 backdrop-blur-xl p-5"
                  style={{ animation: `slideUp 0.5s ease-out ${idx * 0.1}s both` }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-xl" aria-hidden="true">{sec.icon}</span>
                    <h2 className="font-bold text-neutral-100 text-sm">{sec.label}</h2>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{sec.content}</p>
                </div>
              ))}

              <div className="pt-2 flex justify-center">
                <button id="roast-again-btn" type="button" onClick={handleReset}
                  className="text-sm text-neutral-500 hover:text-orange-400 transition-colors duration-150 underline underline-offset-4">
                  Roast a different resume →
                </button>
              </div>
            </section>
          )}

          {/* ── FOOTER ── */}
          <footer className="mt-20 text-center text-xs text-neutral-700">
            RoastCV · Built with 🔥 and questionable honesty · Not responsible for bruised egos
          </footer>
        </main>
      </div>

      {/* ── inline keyframes (complement Tailwind v4 theme) ── */}
      <style>{`
        @keyframes fadeIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes progress { from { width:20%; } to { width:85%; } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:.4;} }
      `}</style>
    </>
  );
}
