export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">
        <a href="/" className="text-sm font-semibold tracking-[-.02em]">JIMMY CORNEJO</a>
        <div className="hidden items-center gap-8 text-xs uppercase tracking-[.12em] text-white/50 md:flex">
          <a href="/work" className="hover:text-white">Work</a>
          <a href="/approach" className="hover:text-white">Approach</a>
          <a href="/playbook" className="hover:text-white">Playbook</a>
          <a href="/about" className="hover:text-white">About</a>
        </div>
        <a href="/contact" className="text-xs uppercase tracking-[.1em] text-white/60 hover:text-white">
          Start a conversation <span className="text-[var(--accent)]">↗</span>
        </a>
      </nav>
    </header>
  );
}