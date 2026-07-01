import React, { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import Head from 'next/head';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const FlameIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C9.1 6.5 7 9 7 12a5 5 0 0 0 10 0c0-1.4-.5-2.8-1.3-4.1C14.8 9.6 14 11 12 11c-1.2 0-2-1-2-2 0-2.4 2-4.5 2-7Z" />
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

export default function SignIn({ providers }) {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSignIn = async (providerId) => {
    setLoadingProvider(providerId);
    await signIn(providerId, { callbackUrl: '/' });
  };

  const providerConfig = {
    google: {
      label: 'Continue with Google',
      icon: <GoogleIcon className="w-5 h-5" />,
      style: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm',
      loadingStyle: 'bg-gray-100 text-gray-500 border border-gray-200',
    },
    github: {
      label: 'Continue with GitHub',
      icon: <GitHubIcon className="w-5 h-5" />,
      style: 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700',
      loadingStyle: 'bg-neutral-700 text-neutral-400 border border-neutral-700',
    },
  };

  return (
    <>
      <Head>
        <title>Sign In — RoastCV</title>
        <meta name="description" content="Sign in to RoastCV to get your AI resume roast." />
      </Head>

      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">

        {/* Glow blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-orange-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-orange-900/10 blur-[100px]" />
        </div>

        <div className="relative w-full max-w-sm">

          {/* Card */}
          <div className="relative rounded-2xl border border-white/[0.07] bg-neutral-900/80 backdrop-blur-xl shadow-2xl shadow-black/60 p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30 mb-4">
                <FlameIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Roast<span className="text-orange-400">CV</span>
              </h1>
              <p className="mt-2 text-sm text-neutral-500 text-center">
                Sign in to get your brutally honest<br />AI resume critique
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-xs text-neutral-600 font-medium">Choose a provider</span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>

            {/* Provider buttons */}
            <div className="space-y-3">
              {providers && Object.values(providers).map((provider) => {
                const cfg = providerConfig[provider.id];
                if (!cfg) return null;
                const isLoading = loadingProvider === provider.id;

                return (
                  <button
                    key={provider.name}
                    id={`signin-${provider.id}`}
                    type="button"
                    disabled={!!loadingProvider}
                    onClick={() => handleSignIn(provider.id)}
                    className={[
                      'w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl',
                      'text-sm font-semibold transition-all duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                      'disabled:cursor-not-allowed',
                      isLoading ? cfg.loadingStyle : cfg.style,
                      !isLoading && !loadingProvider ? 'hover:scale-[1.02] active:scale-[0.98]' : '',
                    ].join(' ')}
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                        </svg>
                        <span>Signing in…</span>
                      </>
                    ) : (
                      <>
                        {cfg.icon}
                        <span>{cfg.label}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-neutral-700 leading-relaxed">
              By signing in you agree to our{' '}
              <span className="text-neutral-500 underline underline-offset-2 cursor-pointer hover:text-orange-400 transition-colors">Terms</span>{' '}
              and{' '}
              <span className="text-neutral-500 underline underline-offset-2 cursor-pointer hover:text-orange-400 transition-colors">Privacy Policy</span>.
            </p>
          </div>

          {/* Back link */}
          <div className="mt-4 text-center">
            <a href="/" className="text-xs text-neutral-700 hover:text-neutral-400 transition-colors duration-150">
              ← Back to home
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers: providers ?? {} } };
}
