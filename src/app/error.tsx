'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="text-center max-w-md">
        <div className="mb-8">
          <p className="text-8xl font-bold mb-4" style={{ color: '#E8E6E3' }}>
            500
          </p>
          <h1 className="text-4xl font-semibold mb-4" style={{ color: '#1A1A1A' }}>
            Something went wrong
          </h1>
          <p className="text-lg mb-8" style={{ color: '#6B6B6B' }}>
            We encountered an unexpected error. Please try again or return home to continue browsing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="w-full sm:w-auto px-8 py-2 font-semibold"
            style={{ backgroundColor: '#B8926A', color: '#FAFAF8' }}
          >
            Try again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-2 font-semibold"
              style={{ borderColor: '#B8926A', color: '#B8926A' }}
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
