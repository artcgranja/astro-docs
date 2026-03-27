'use client';

export default function DocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '4rem auto',
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: '#e8ecf0', marginBottom: '1rem' }}>
        This page could not be rendered
      </h2>
      <p style={{ color: '#8896a4', marginBottom: '1.5rem' }}>
        The content may contain formatting errors. If this problem persists,
        please report it.
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
        }}
      >
        Try again
      </button>
    </div>
  );
}
