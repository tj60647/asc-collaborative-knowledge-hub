import Link from "next/link"
import { ArrowRight, BookOpen, Network, ShieldCheck, TrendingUp, UserPlus } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white text-zinc-900 font-sans antialiased">
      {/* Crisp minimalist border dividers */}
      <div className="w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold tracking-widest text-zinc-950 uppercase border border-zinc-950 px-2 py-0.5">
              ASC
            </span>
            <span className="text-xs font-medium tracking-wide text-zinc-500 hidden sm:inline">
              American Society for Cybernetics
            </span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/admin"
              className="text-xs tracking-wide text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              Roster
            </Link>
            <Link
              href="/admin"
              className="text-xs tracking-wide text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              Treasury
            </Link>
            <Link
              href="/admin"
              className="text-xs font-semibold tracking-wide bg-zinc-950 text-white hover:bg-zinc-800 px-4 py-2 rounded-none transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </header>
      </div>

      {/* Hero / Information Architecture */}
      <main className="w-full max-w-6xl mx-auto px-6 flex-1 flex flex-col justify-center py-20">
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">
            Ecosystem MVP &middot; Phase 2
          </p>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-950 mb-6 leading-tight">
            Collaborative Knowledge Hub
          </h1>
          <p className="text-lg text-zinc-600 font-light max-w-2xl leading-relaxed mb-8">
            An open, peer-governed digital ecosystem for systems theory, historical archives, and relational cybernetic inquiry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/admin"
              className="group inline-flex h-10 items-center justify-center gap-2 bg-zinc-950 px-6 font-medium text-xs text-white hover:bg-zinc-800 transition-colors"
            >
              Enter Dashboard
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/admin/members/new"
              className="inline-flex h-10 items-center justify-center gap-2 border border-zinc-200 bg-white hover:bg-zinc-50 px-6 font-medium text-xs text-zinc-800 transition-colors"
            >
              <UserPlus className="size-3.5" />
              Manual Provisioning
            </Link>
          </div>
        </div>

        {/* Modular Grid with Clean Border Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-zinc-150">
          {/* Card 1 */}
          <div className="border-r border-b border-zinc-150 p-8 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors group">
            <div>
              <div className="text-zinc-400 group-hover:text-zinc-950 transition-colors mb-6">
                <BookOpen className="size-5 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-2">Archival Glossary</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Curated definitions of core systemic concepts with version logs and peer-governed workflows.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border-r border-b border-zinc-150 p-8 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors group">
            <div>
              <div className="text-zinc-400 group-hover:text-zinc-950 transition-colors mb-6">
                <Network className="size-5 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-2">Relational Graph</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Interconnected map of researchers, academic chapters, publications, and conceptual links.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border-r border-b border-zinc-150 p-8 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors group">
            <div>
              <div className="text-zinc-400 group-hover:text-zinc-950 transition-colors mb-6">
                <ShieldCheck className="size-5 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-2">Sovereign Privacy</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Hardcoded database restrictions and explicit GDPR/CCPA opt-in rules for secure membership.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="border-r border-b border-zinc-150 p-8 flex flex-col justify-between hover:bg-zinc-50/50 transition-colors group">
            <div>
              <div className="text-zinc-400 group-hover:text-zinc-950 transition-colors mb-6">
                <TrendingUp className="size-5 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-950 mb-2">Transparent Treasury</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Real-time balance reporting and transaction auditing for the society's volunteer leadership.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <div>
          &copy; {new Date().getFullYear()} American Society for Cybernetics.
        </div>
        <div className="flex items-center space-x-6">
          <span className="cursor-default hover:text-zinc-600 transition-colors">GDPR Compliant</span>
          <span className="cursor-default hover:text-zinc-600 transition-colors">Open-Source Core</span>
        </div>
      </footer>
    </div>
  )
}
