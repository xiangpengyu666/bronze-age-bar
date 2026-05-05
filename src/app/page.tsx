import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center lg:justify-end px-6 sm:px-8 md:px-12 xl:px-16 ink-fade overflow-hidden">
      <img
        src="/decor/frieze-right.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed left-0 top-1/2 -translate-y-1/2 lg:top-0 lg:-translate-y-0 h-[55vh] lg:h-screen w-auto opacity-80 hidden lg:block lg:-translate-x-[13%] 3xl:-translate-x-[10%]"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, black 0%, black 70%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, black 0%, black 70%, transparent 100%)',
        }}
      />
      <div className="flex flex-col items-center lg:items-end text-center lg:text-right max-w-xl scale-[0.88] md:scale-[0.97] lg:scale-[0.88] xl:scale-[0.97] 3xl:scale-[1.32] origin-center lg:origin-right lg:-translate-x-[2%] 3xl:-translate-x-[5%]">
        <div className="text-bronze-light/60 uppercase tracking-[0.5em] text-[10px] sm:text-xs mb-4">
          A Bronze Age Drinking Game
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl text-bronze-light mb-3">
          Sip or Slip
        </h1>
        <div className="text-xl sm:text-2xl text-foreground/80 italic mb-2">
          The Bronze Age Bar
        </div>
        <p className="text-foreground/70 mt-6 mb-10 text-sm sm:text-base">
          Choose your occasion. Choose your vessels. The court is watching.
          Pick the wrong bronze — and the consequences will write themselves
          into history.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/game"
            className="px-5 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base text-center font-semibold uppercase tracking-[0.2em] transition-all hover:brightness-110"
            style={{
              background: 'rgba(243,201,105,0.15)',
              border: '1px solid #f3c969',
              color: '#f3c969',
              boxShadow: '0 0 28px rgba(243,201,105,0.3)',
            }}
          >
            Begin Ritual
          </Link>
          <Link
            href="/gallery"
            className="px-5 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base text-center font-semibold uppercase tracking-[0.2em] transition-all hover:brightness-110"
            style={{
              background: 'rgba(184,115,51,0.12)',
              border: '1px solid rgba(212,165,116,0.7)',
              color: '#d4a574',
              boxShadow: '0 0 18px rgba(184,115,51,0.18)',
            }}
          >
            Vessel Collection
          </Link>
        </div>
      </div>
    </main>
  );
}
