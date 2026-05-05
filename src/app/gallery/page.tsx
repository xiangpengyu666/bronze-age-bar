import Link from 'next/link';
import Collection from '@/components/Collection';

export default function GalleryPage() {
  return (
    <main className="min-h-screen ink-fade">
      <div className="px-6 sm:px-12 pt-6 sm:pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg uppercase tracking-[0.25em] font-semibold transition-all hover:opacity-80"
          style={{
            color: '#f3c969',
            textShadow: '0 0 18px rgba(243,201,105,0.5)',
          }}
        >
          ← Back to Start
        </Link>
      </div>
      <Collection />
    </main>
  );
}
