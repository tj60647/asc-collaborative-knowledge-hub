import Link from "next/link"
import { ArrowRight, BookOpen, Network, ShieldCheck, TrendingUp, UserPlus } from "lucide-react"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Glowing radial feedback loop spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Header / Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900 backdrop-blur-md bg-zinc-950/50 z-10">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full rounded-md bg-zinc-950 flex items-center justify-center font-bold tracking-wider text-xs">
              ASC
            </div>
          </div>
          <span className="font-semibold tracking-tight text-sm text-zinc-300">American Society for Cybernetics</span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Admin Portal
          </Link>
          <Link
            href="/admin"
            className="text-xs font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-3.5 py-1.5 rounded-lg transition-all"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center items-center py-20 z-10">
        <div className="text-center max-w-3xl flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400 font-medium mb-8 backdrop-blur-sm animate-fade-in">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
            Active Ecosystem Development
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-400 mb-6 max-w-2xl leading-[1.1]">
            The Collaborative Knowledge Hub
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed">
            Co-creating the digital architecture for systems theory, historical archives, and relational cybernetic inquiry.
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm mb-16">
            <Link
              href="/admin"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 font-medium text-sm text-black hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
            >
              Enter Dashboard
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/admin/members/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:border-zinc-700 px-6 font-medium text-sm text-zinc-300 hover:text-white transition-all backdrop-blur-sm"
            >
              <UserPlus className="size-4" />
              Provision Account
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-8">
          {/* Card 1: Glossary */}
          <div className="group relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-sm hover:border-zinc-800 transition-all hover:bg-zinc-950/60">
            <div className="absolute top-0 right-0 h-[80px] w-[80px] bg-indigo-500/5 rounded-bl-full group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <BookOpen className="size-5" />
            </div>
            <h3 className="font-semibold text-zinc-200 mb-2">Archival Glossary</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Curated definitions of core systemic concepts with version logs and peer-governed workflows.
            </p>
          </div>

          {/* Card 2: Knowledge Graph */}
          <div className="group relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-sm hover:border-zinc-800 transition-all hover:bg-zinc-950/60">
            <div className="absolute top-0 right-0 h-[80px] w-[80px] bg-cyan-500/5 rounded-bl-full group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
              <Network className="size-5" />
            </div>
            <h3 className="font-semibold text-zinc-200 mb-2">Relational Graph</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Interconnected map of researchers, academic chapters, publications, and conceptual links.
            </p>
          </div>

          {/* Card 3: Privacy Boundaries */}
          <div className="group relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-sm hover:border-zinc-800 transition-all hover:bg-zinc-950/60">
            <div className="absolute top-0 right-0 h-[80px] w-[80px] bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-semibold text-zinc-200 mb-2">Sovereign Privacy</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Hardcoded database restrictions and explicit GDPR/CCPA opt-in rules for secure membership.
            </p>
          </div>

          {/* Card 4: Operations Ledger */}
          <div className="group relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-sm hover:border-zinc-800 transition-all hover:bg-zinc-950/60">
            <div className="absolute top-0 right-0 h-[80px] w-[80px] bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
              <TrendingUp className="size-5" />
            </div>
            <h3 className="font-semibold text-zinc-200 mb-2">Transparent Treasury</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Real-time balance reporting and transaction auditing for the society's volunteer leadership.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-zinc-900 z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} American Society for Cybernetics. All rights reserved.
        </div>
        <div className="flex items-center space-x-6">
          <span className="hover:text-zinc-300 cursor-default transition-colors">GDPR Compliant</span>
          <span className="hover:text-zinc-300 cursor-default transition-colors">Open-Source Core</span>
        </div>
      </footer>
    </div>
  )
}
