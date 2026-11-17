export function LogoLoader() {
  return (
    <svg
      className="h-6 w-auto"
      viewBox="0 0 57 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        className="origin-left animate-loader-bar [transform-box:fill-box]"
        x="0"
        y="27"
        width="44"
        height="11"
        rx="5.5"
        fill="#B79A7F"
      />
      <rect
        className="animate-cursor-blink"
        x="46"
        y="0"
        width="11"
        height="64"
        rx="5.5"
        fill="#E43B31"
      />
    </svg>
  )
}
