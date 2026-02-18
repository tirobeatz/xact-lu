import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="text-center max-w-md">
        <div className="mb-8">
          <p className="text-8xl font-bold mb-4" style={{ color: '#E8E6E3' }}>
            404
          </p>
          <h1 className="text-4xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
            Page not found
          </h1>
          <p className="text-lg mb-8" style={{ color: '#6B6B6B' }}>
            The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              className="w-full sm:w-auto px-8 py-2 font-semibold"
              style={{ backgroundColor: '#B8926A', color: '#FAFAF8' }}
            >
              Go Home
            </Button>
          </Link>
          <Link href="/properties">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-2 font-semibold"
              style={{ borderColor: '#B8926A', color: '#B8926A' }}
            >
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
