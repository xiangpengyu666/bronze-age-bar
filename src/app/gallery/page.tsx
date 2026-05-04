import Link from 'next/link';
import Collection from '@/components/Collection';

export default function GalleryPage() {
  return (
    <main className="min-h-screen ink-fade">
      <div className="px-8 pt-6">
        <Link
          href="/"
          className="text-bronze-light/70 hover:text-bronze-light text-sm"
        >
          ← Back to Start
        </Link>
      </div>
      <Collection />
    </main>
  );
}
