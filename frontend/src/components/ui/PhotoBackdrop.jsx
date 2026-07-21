/**
 * Full-bleed background photo with a dark scrim, meant to sit behind glass
 * panels (`.glass`) so text and cards stay legible over busy cake photography.
 * Renders absolutely — the parent needs `position: relative`.
 */
export default function PhotoBackdrop({ src, alt = '', overlay = true, blur = false, className = '' }) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden={alt ? undefined : true}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${blur ? 'blur-md scale-110' : ''}`}
        loading="eager"
      />
      {overlay && <div className="absolute inset-0 photo-overlay" />}
    </div>
  )
}
