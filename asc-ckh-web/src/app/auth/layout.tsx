// Minimal layout for auth pages (login, register, reset-password)
// Intentionally strips the global Navbar and footer so the user has
// one job: authenticate.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal header — logo only */}
      <header className="w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <span className="text-xs font-bold tracking-widest uppercase border border-zinc-950 px-2 py-0.5">
              ASC
            </span>
            <span className="text-xs font-semibold text-zinc-600 hidden md:inline">
              Knowledge Hub
            </span>
          </a>
        </div>
      </header>

      {/* Auth content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="py-4 text-center text-xs text-zinc-400 border-t border-zinc-100">
        © {new Date().getFullYear()} American Society for Cybernetics
      </footer>
    </div>
  )
}
