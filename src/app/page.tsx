import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 ink-fade">
      <div className="text-bronze-light/60 uppercase tracking-[0.5em] text-xs mb-4">
        A Bronze Age Drinking Game
      </div>
      <h1
        className="text-7xl text-bronze-light mb-3 text-center"
        style={{ textShadow: '0 0 30px rgba(184,115,51,0.4)' }}
      >
        Sip or Slip
      </h1>
      <div className="text-2xl text-foreground/80 italic mb-2">
        The Bronze Age Bar
      </div>
      <p className="max-w-xl text-center text-foreground/70 mt-6 mb-10">
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
    </main>
  );
}
