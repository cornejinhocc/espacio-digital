export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 lg:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold">JIMMY CORNEJO</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/35">
            Business, operations, systems and practical digital improvement.
          </p>
        </div>
        <div className="flex gap-6 text-xs uppercase tracking-[.12em] text-white/35">
          <a href="/privacy" className="hover:text-white">Privacy</a>
          <a href="/contact" className="hover:text-white">Contact</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}