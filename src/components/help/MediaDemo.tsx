/**
 * MediaDemo - Generic wrapper component for GIF/video demo embeds.
 */

interface MediaDemoProps {
  src: string;
  type: 'gif' | 'video';
  alt?: string;
  caption?: string;
}

export function MediaDemo({ src, type, alt = 'Demo', caption }: MediaDemoProps) {
  return (
    <div className="space-y-1">
      {type === 'video' ? (
        <video
          src={src}
          controls
          muted
          loop
          playsInline
          className="w-full rounded border border-gray-600"
        >
          Your browser does not support video playback.
        </video>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full rounded border border-gray-600"
        />
      )}
      {caption && (
        <p className="text-[10px] text-gray-500 text-center">{caption}</p>
      )}
    </div>
  );
}
