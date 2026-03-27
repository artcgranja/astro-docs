'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#020810',
          color: '#e8ecf0',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '4rem auto',
            textAlign: 'center',
          }}
        >
          <h2>Something went wrong</h2>
          <p style={{ color: '#8896a4' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
