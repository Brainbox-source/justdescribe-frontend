export function BackgroundGlow() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="glow-navy absolute -top-[28vmax] -left-[22vmax] size-[70vmax] animate-glow-a blur-3xl will-change-transform motion-reduce:animate-none" />
      <div className="glow-red absolute -top-[28vmax] -right-[18vmax] size-[70vmax] animate-glow-b blur-3xl will-change-transform motion-reduce:animate-none" />
      <div className="glow-navy absolute -bottom-[35vmax] -left-[25vmax] size-[60vmax] animate-glow-c opacity-70 blur-3xl will-change-transform motion-reduce:animate-none" />
      <div className="glow-red absolute -right-[25vmax] -bottom-[35vmax] size-[60vmax] animate-glow-d opacity-70 blur-3xl will-change-transform motion-reduce:animate-none" />
    </div>
  )
}
