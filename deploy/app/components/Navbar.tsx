"use client";
import Link from "next/link";

export function Navbar({ onQuote }: { onQuote?: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-sm border-2 border-primary" />
          <span className="font-semibold tracking-wide">Ace Construction</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link className="hover:text-primary" href="/">Home</Link>
          <Link className="hover:text-primary" href="/about">About</Link>
          <Link className="hover:text-primary" href="/blog">Blog</Link>
          <Link className="hover:text-primary" href="/contact">Contact</Link>
        </nav>
        <button className="btn-primary" onClick={onQuote}>Get a quote</button>
      </div>
    </header>
  );
}
