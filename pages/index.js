import React, { useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';

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

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

/* ─── File type helpers ──────────────────────────────────────────────────── */
const FILE_TYPES = {
  pdf:  { label: 'PDF',  color: '#ef4444', bg: '#450a0a', emoji: '📄' },
  doc:  { label: 'DOC',  color: '#3b82f6', bg: '#0c1a3a', emoji: '📝' },
  docx: { label: 'DOCX', color: '#3b82f6', bg: '#0c1a3a', emoji: '📝' },
  txt:  { label: 'TXT',  color: '#a3a3a3', bg: '#171717', emoji: '📃' },
  png:  { label: 'PNG',  color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
  jpg:  { label: 'JPG',  color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
  jpeg: { label: 'JPEG', color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
  webp: { label: 'WEBP', color: '#22c55e', bg: '#052e16', emoji: '🖼️' },
};
const ACCEPTED_MIME = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','image/png','image/jpeg','image/webp'];

function getExt(f) { return f.split('.').pop().toLowerCase(); }
function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}

async function extractTextFromFile(file) {
  const ext = getExt(file.name);
  if (ext === 'txt') return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsText(file);
  });
  await new Promise(r => setTimeout(r, 1500));
  return `[Extracted from ${file.name}]\n\nJohn Doe\njohn.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe\n\nSUMMARY\nResults-driven software engineer with 4 years of experience building scalable web applications.\n\nEXPERIENCE\nSoftware Engineer — Acme Corp (2021–Present)\n• Led development of customer dashboard that reduced support tickets by 32%\n• Optimized database queries cutting page load times by 48%\n\nJunior Developer — StartupXYZ (2020–2021)\n• Built RESTful APIs consumed by 50k+ monthly active users\n• Integrated third-party payment gateway enabling $2M in annual transactions\n\nSKILLS\nJavaScript, TypeScript, React, Node.js, PostgreSQL, Docker, AWS, Git\n\nEDUCATION\nB.S. Computer Science — State University, 2020`;
}

/* ─── Score Ring ─────────────────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const r = 28, circ = 2 * Math.PI * r;
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

/* ─── Mock roast ─────────────────────────────────────────────────────────── */
const MOCK_ROAST = {
  score: 3,
  summary: "Oh honey… this resume tried its best. Points for effort, none for impact.",
  sections: [
    { icon: "🔥", label: "Overall Roast", content: "Your resume reads like a LinkedIn profile written by a bored fortune cookie. Every line screams 'I existed at a company' — not 'I made a difference.'" },
    { icon: "🎯", label: "Biggest Crimes", content: "① 'Responsible for…' — responsible for what? Breathing? ② Objective section in 2026? Bold. ③ Skills section lists 'Microsoft Word.' Your grandma could out-LinkedIn you." },
    { icon: "✨", label: "What Actually Works", content: "You listed real numbers in one bullet point! That's it. That's the highlight. But hey, one data-backed achievement is more than 80% of people manage." },
    { icon: "💡", label: "Power-Up Suggestions", content: "Lead with impact, not duties. Turn 'managed a team' into 'led a 6-person team that shipped feature X, boosting retention by 22%.' Ditch the objective — write a 3-line summary instead." },
  ],
};

async function fetchRoast() {
  await new Promise(r => setTimeout(r, 2600));
  return MOCK_ROAST;
}

const MIN_CHARS = 200;

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════════════ */
function Navbar({ session, status }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-md shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow duration-200">
            <FlameIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-tight">
            Roast<span className="text-orange-400">CV</span>
          </span>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {status === 'loading' && (
            <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse" />
          )}

          {status === 'unauthenticated' && (
            <button
              id="navbar-signin-btn"
              type="button"
              onClick={() => signIn()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
            >
              Sign in
            </button>
          )}

          {status === 'authenticated' && session?.user && (
            <div className="relative">
              <button
                id="user-menu-btn"
                type="button"
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-neutral-900/60 hover:bg-neutral-800/60 transition-all duration-150"
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt={session.user.name} className="w-7 h-7 rounded-full border border-white/10" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                )}
                <span className="text-sm text-neutral-300 font-medium max-w-[120px] truncate hidden sm:block">
                  {session.user.name}
                </span>
                <svg className="w-3.5 h-3.5 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/[0.08] bg-neutral-900 shadow-xl shadow-black/50 overflow-hidden z-50"
                  style={{ animation: 'fadeIn 0.15s ease-out' }}>
                  <div className="px-4 py-3 border-b border-neutral-800">
                    <p className="text-xs font-semibold text-neutral-200 truncate">{session.user.name}</p>
                    <p className="text-xs text-neutral-600 truncate">{session.user.email}</p>
                  </div>
                  <button
                    id="signout-btn"
                    type="button"
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIGN-IN GATE (shown on homepage when logged out)
═══════════════════════════════════════════════════════════════════════════ */
function SignInGate() {
  const [loading, setLoading] = useState(null);

  const handleSignIn = async (provider) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: '/' });
  };

  return (
    <section className="w-full max-w-sm mx-auto mt-4" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="relative rounded-2xl border border-white/[0.07] bg-neutral-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />

        {/* Lock icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Sign in to get roasted</h2>
          <p className="text-sm text-neutral-500 text-center mt-1">
            Free account required to access the AI resume critique.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-xs text-neutral-700">choose provider</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        <div className="space-y-3">
          {/* Google */}
          <button
            id="gate-google-btn"
            type="button"
            disabled={!!loading}
            onClick={() => handleSignIn('google')}
            className={[
              'w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
              loading === 'google'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm',
            ].join(' ')}
          >
            {loading === 'google'
              ? <><LoaderIcon className="w-5 h-5" style={{ animation: 'spin 1s linear infinite' }} /><span>Signing in…</span></>
              : <><GoogleIcon className="w-5 h-5" /><span>Continue with Google</span></>}
          </button>

          {/* GitHub */}
          <button
            id="gate-github-btn"
            type="button"
            disabled={!!loading}
            onClick={() => handleSignIn('github')}
            className={[
              'w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
              loading === 'github'
                ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:scale-[1.02] active:scale-[0.98]',
            ].join(' ')}
          >
            {loading === 'github'
              ? <><LoaderIcon className="w-5 h-5" style={{ animation: 'spin 1s linear infinite' }} /><span>Signing in…</span></>
              : <><GitHubIcon className="w-5 h-5" /><span>Continue with GitHub</span></>}
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-700">
          Free · No credit card · Sign in takes 5 seconds
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function ResumeRoaster() {
  const { data: session, status } = useSession();

  /* tabs */
  const [tab, setTab] = useState('paste');

  /* paste */
  const [resume, setResume] = useState('');
  const [touched, setTouched] = useState(false);

  /* upload */
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  /* roast */
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const activeText = tab === 'paste' ? resume : (uploadedFile?.text ?? '');
  const charCount  = activeText.length;
  const isValid    = charCount >= MIN_CHARS;
  const remaining  = MIN_CHARS - charCount;
  const canSubmit  = isValid && !loading && !extracting && (tab === 'paste' || uploadedFile?.text);

  /* file */
  const processFile = useCallback(async (file) => {
    setUploadError('');
    const ext = getExt(file.name);
    if (!Object.keys(FILE_TYPES).includes(ext)) {
      setUploadError(`Unsupported type ".${ext}". Upload PDF, DOCX, TXT, or an image.`);
      return;
    }
    if (file.size > 10 * 1024 * 1024) { setUploadError('File too large. Max 10 MB.'); return; }
    const isImage = ['png','jpg','jpeg','webp'].includes(ext);
    const preview = isImage ? URL.createObjectURL(file) : null;
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
    e.preventDefault(); setDragOver(false);
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
    setUploadedFile(null); setUploadError('');
  };

  /* submit */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(''); setResult(null); setLoading(true); setTouched(true);
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
    setResume(''); setResult(null); setError(''); setTouched(false);
    setUploadedFile(null); setUploadError(''); setTab('paste');
  };

  const fileMeta = uploadedFile ? FILE_TYPES[getExt(uploadedFile.file.name)] : null;
  const isAuthed = status === 'authenticated';

  return (
    <>
      <Head>
        <title>RoastCV — AI Resume Roaster</title>
        <meta name="description" content="Paste or upload your resume and get a brutally honest AI-powered critique." />
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

        {/* Navbar */}
        <Navbar session={session} status={status} />

        <main className="relative z-10 flex flex-col items-center px-4 pt-28 pb-16">

          {/* ── HERO ── */}
          <section className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold tracking-wide uppercase">
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

            {/* Auth status badge */}
            {isAuthed && (
              <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20"
                style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <CheckIcon className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-green-400 font-medium">
                  Signed in as {session.user.name}
                </span>
              </div>
            )}
          </section>

          {/* ── SIGN-IN GATE ── */}
          {!isAuthed && status !== 'loading' && <SignInGate />}

          {/* ── MAIN FORM (only when authenticated) ── */}
          {isAuthed && (
            <section className="w-full max-w-2xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="relative rounded-2xl border border-white/[0.07] bg-neutral-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-6 sm:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />

                <form onSubmit={handleSubmit} noValidate>

                  {/* Tabs */}
                  <div className="flex gap-1 mb-6 p-1 rounded-xl bg-neutral-800/60 border border-neutral-700/40">
                    {[
                      { key: 'paste',  label: 'Paste Text',  icon: <TextIcon className="w-3.5 h-3.5" /> },
                      { key: 'upload', label: 'Upload File', icon: <UploadIcon className="w-3.5 h-3.5" /> },
                    ].map(({ key, label, icon }) => (
                      <button key={key} type="button" id={`tab-${key}`}
                        onClick={() => { setTab(key); setError(''); }}
                        className={[
                          'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
                          tab === key
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20'
                            : 'text-neutral-400 hover:text-neutral-200',
                        ].join(' ')}>
                        {icon}{label}
                      </button>
                    ))}
                  </div>

                  {/* ── PASTE TAB ── */}
                  {tab === 'paste' && (
                    <div>
                      <label htmlFor="resume-input" className="block text-sm font-semibold text-neutral-300 mb-2">
                        Paste your resume below
                      </label>
                      <div className="relative">
                        <textarea
                          id="resume-input" name="resume" value={resume}
                          onChange={e => { setResume(e.target.value); setTouched(true); }}
                          onBlur={() => setTouched(true)}
                          placeholder="Paste the full text of your resume here… the more detail, the spicier the roast 🌶️"
                          rows={10} disabled={loading}
                          style={{ resize: 'none' }}
                          className={[
                            'w-full rounded-xl bg-neutral-800/60 border px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600',
                            'focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                            touched && !isValid && resume.length > 0
                              ? 'border-red-500/60 focus:ring-red-500/40'
                              : isValid
                              ? 'border-orange-500/40 focus:ring-orange-500/40'
                              : 'border-neutral-700/60 focus:ring-orange-500/30',
                          ].join(' ')}
                        />
                        <div className={['absolute bottom-3 right-3 text-xs font-mono px-2 py-0.5 rounded-full transition-colors duration-200', isValid ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700/60 text-neutral-500'].join(' ')}>
                          {charCount} / {MIN_CHARS}
                        </div>
                      </div>
                      <div className="mt-2 h-5">
                        {touched && !isValid && resume.length > 0 && (
                          <p className="text-xs text-red-400">{remaining} more character{remaining !== 1 ? 's' : ''} needed.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── UPLOAD TAB ── */}
                  {tab === 'upload' && (
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {['PDF','DOCX','DOC','TXT','PNG','JPG'].map(f => (
                          <span key={f} className="px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700/60 text-xs text-neutral-400 font-mono">.{f.toLowerCase()}</span>
                        ))}
                        <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-xs text-neutral-600 ml-auto">Max 10 MB</span>
                      </div>

                      {!uploadedFile && !extracting && (
                        <div
                          role="button" tabIndex={0} aria-label="Upload resume file"
                          onDrop={handleDrop}
                          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onClick={() => fileInputRef.current?.click()}
                          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                          className={[
                            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200 select-none',
                            dragOver ? 'border-orange-500 bg-orange-500/10 scale-[1.01]' : 'border-neutral-700/60 bg-neutral-800/30 hover:border-orange-500/50 hover:bg-orange-500/5',
                          ].join(' ')}>
                          <div className={['flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200', dragOver ? 'bg-orange-500/20' : 'bg-neutral-800'].join(' ')}>
                            <UploadIcon className={['w-7 h-7 transition-colors duration-200', dragOver ? 'text-orange-400' : 'text-neutral-500'].join(' ')} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-neutral-300">{dragOver ? "Drop it like it's hot 🔥" : 'Drag & drop your resume'}</p>
                            <p className="text-xs text-neutral-600 mt-0.5">or <span className="text-orange-400 underline underline-offset-2">click to browse</span></p>
                          </div>
                          <input ref={fileInputRef} type="file" accept={ACCEPTED_MIME.join(',')} onChange={handleFileInput} className="sr-only" />
                        </div>
                      )}

                      {extracting && (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-orange-500/20 bg-neutral-800/40 p-10">
                          <LoaderIcon className="w-7 h-7 text-orange-400" style={{ animation: 'spin 1.2s linear infinite' }} />
                          <p className="text-sm text-neutral-400">Extracting text from your file…</p>
                          <div className="w-full max-w-[200px] h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ animation: 'progress 1.5s ease-in-out infinite alternate', width: '60%' }} />
                          </div>
                        </div>
                      )}

                      {uploadedFile && !extracting && (
                        <div className="rounded-xl border border-white/[0.07] bg-neutral-800/50 p-4" style={{ animation: 'fadeIn 0.4s ease-out' }}>
                          <div className="flex items-start gap-4">
                            {uploadedFile.preview ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
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
                                <button type="button" onClick={removeFile} aria-label="Remove file"
                                  className="flex-shrink-0 p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150">
                                  <CloseIcon className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                                <CheckIcon className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                                <span className="text-xs text-green-400 font-medium">Text extracted · {uploadedFile.text?.length.toLocaleString()} chars</span>
                              </div>
                              {uploadedFile.text && (
                                <div className="mt-2.5 rounded-lg bg-neutral-900/80 border border-neutral-700/40 p-2.5 max-h-24 overflow-y-auto">
                                  <p className="text-[11px] text-neutral-500 leading-relaxed whitespace-pre-wrap font-mono">
                                    {uploadedFile.text.slice(0, 300)}{uploadedFile.text.length > 300 ? '…' : ''}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <button type="button" onClick={() => { removeFile(); fileInputRef.current?.click(); }}
                            className="mt-3 text-xs text-neutral-600 hover:text-orange-400 transition-colors duration-150 underline underline-offset-2">
                            ↩ Upload a different file
                          </button>
                          <div className="mt-2">
                            <span className={['text-xs font-mono px-2 py-0.5 rounded-full', isValid ? 'bg-orange-500/20 text-orange-400' : 'bg-neutral-700/60 text-neutral-500'].join(' ')}>
                              {charCount.toLocaleString()} chars {isValid ? '✓' : `(need ${remaining} more)`}
                            </span>
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <div role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-xs text-red-300">
                          ⚠️ {uploadError}
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept={ACCEPTED_MIME.join(',')} onChange={handleFileInput} className="sr-only" />
                    </div>
                  )}

                  {/* Submit */}
                  <button id="roast-submit-btn" type="submit" disabled={!canSubmit}
                    className={[
                      'mt-5 w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold tracking-wide',
                      'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                      !canSubmit
                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]',
                    ].join(' ')}>
                    {loading
                      ? <><LoaderIcon className="w-4 h-4" style={{ animation: 'spin 1.2s linear infinite' }} /><span>Roasting your resume…</span></>
                      : extracting
                      ? <><LoaderIcon className="w-4 h-4" style={{ animation: 'spin 1.2s linear infinite' }} /><span>Extracting text…</span></>
                      : <><FlameIcon className="w-4 h-4" /><span>Roast My Resume</span></>}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* Loading */}
          {loading && (
            <section aria-live="polite" className="mt-10 w-full max-w-2xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <div className="rounded-2xl border border-orange-500/20 bg-neutral-900/60 backdrop-blur p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
                  <FlameIcon className="w-8 h-8 text-orange-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                </div>
                <p className="text-neutral-300 font-semibold mb-1">AI is reading every painful word…</p>
                <p className="text-neutral-600 text-sm">Sharpening the roast. This takes a moment.</p>
                <div className="mt-6 space-y-2.5 text-left">
                  {[100,85,92,70].map((w, i) => (
                    <div key={i} className="h-3 rounded-full bg-neutral-800"
                      style={{ width: `${w}%`, animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Error */}
          {error && !loading && (
            <div role="alert" className="mt-8 w-full max-w-2xl rounded-xl border border-red-500/30 bg-red-950/40 px-5 py-4 text-sm text-red-300" style={{ animation: 'fadeIn 0.4s ease-out' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <section aria-label="Roast results" className="mt-10 w-full max-w-2xl space-y-4" style={{ animation: 'fadeIn 0.6s ease-out' }}>
              <div className="rounded-2xl border border-white/[0.07] bg-neutral-900/70 backdrop-blur-xl p-6 flex items-center gap-6">
                <ScoreRing score={result.score} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">Roast Score</p>
                  <p className="text-white font-bold text-lg leading-snug">
                    {result.score}/10 — <span className="text-orange-400">
                      {result.score >= 8 ? 'Actually decent 👏' : result.score >= 5 ? 'Needs serious work' : 'Oh no… 🫣'}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-neutral-400 italic">"{result.summary}"</p>
                </div>
              </div>
              {result.sections.map((sec, idx) => (
                <div key={idx} className="rounded-2xl border border-white/[0.06] bg-neutral-900/60 backdrop-blur-xl p-5"
                  style={{ animation: `slideUp 0.5s ease-out ${idx * 0.1}s both` }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-xl">{sec.icon}</span>
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

          <footer className="mt-20 text-center text-xs text-neutral-700">
            RoastCV · Built with 🔥 and questionable honesty · Not responsible for bruised egos
          </footer>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes progress{ from { width:20%; } to { width:85%; } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1;} 50%{opacity:.4;} }
      `}</style>
    </>
  );
}
