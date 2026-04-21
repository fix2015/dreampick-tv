import { useMemo } from 'react';

export default function BackgroundEffects({ theme }) {
  const blobs = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 150 + Math.random() * 200,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: theme.bg }}
      />
      {blobs.map(blob => (
        <div
          key={blob.id}
          className="absolute rounded-full opacity-30 animate-blob"
          style={{
            width: blob.size,
            height: blob.size,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            backgroundColor: theme.blob,
            animationDelay: `${blob.delay}s`,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
}
