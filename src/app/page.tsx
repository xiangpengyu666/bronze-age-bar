import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-end px-8 md:px-16 ink-fade overflow-hidden">
      <img
        src="/decor/frieze-right.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed left-0 top-0 h-screen w-auto opacity-80 hidden md:block -translate-x-[5%]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, black 70%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 0%, black 70%, transparent 100%)',
        }}
      />
      <div className="flex flex-col items-end text-right max-w-xl scale-150 origin-right">
        <div className="text-bronze-light/60 uppercase tracking-[0.5em] text-xs mb-4">
          A Bronze Age Drinking Game
        </div>
        <h1
          className="text-7xl text-bronze-light mb-3"
          style={{ textShadow: '0 0 30px rgba(184,115,51,0.4)' }}
        >
          Sip or Slip
        </h1>
        <div className="text-2xl text-foreground/80 italic mb-2">
          The Bronze Age Bar
        </div>
        <p className="text-foreground/70 mt-6 mb-10">
          Choose your occasion. Choose your vessels. The court is watching.
          Pick the wrong bronze — and the consequences will write themselves
          into history.
        </p>
        <div className="flex gap-4">
          <Link
            href="/game"
            className="px-8 py-4 bronze-border rounded-md bg-bronze/30 hover:bronze-glow text-bronze-light text-lg"
          >
            Begin Ritual
          </Link>
          <Link
            href="/gallery"
            className="px-8 py-4 bronze-border rounded-md bg-[#0d0d1a]/80 hover:bronze-glow text-bronze-light text-lg"
          >
            Vessel Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
