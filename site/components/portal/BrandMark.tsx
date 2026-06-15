// Logo: un nodo central coral con satélites enlazados — un fragmento del graph
// view = un vault. Usa tokens para adaptarse al tema. Favicon aparte en app/icon.svg.
export default function BrandMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <g stroke="var(--hex-blue)" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
        <path d="M16 16 7 8.5" />
        <path d="M16 16 26 9" />
        <path d="M16 16 24.5 24" />
        <path d="M16 16 8.5 24.5" />
      </g>
      <circle cx="7" cy="8.5" r="2.4" fill="var(--hex-blue)" />
      <circle cx="26" cy="9" r="2.0" fill="var(--hex-blue)" />
      <circle cx="24.5" cy="24" r="2.2" fill="var(--hex-blue)" />
      <circle cx="8.5" cy="24.5" r="1.8" fill="var(--hex-blue)" />
      <circle cx="16" cy="16" r="4.6" fill="var(--hex-coral)" />
      <circle cx="16" cy="16" r="4.6" stroke="var(--hex-brown)" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}
