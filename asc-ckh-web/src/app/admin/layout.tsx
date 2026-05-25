import Link from 'next/link';
import { Home } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-4 px-4 py-5">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            ASC Admin Portal
          </Link>
          <div className="mt-8 flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              Back to Website
            </Link>
            <div className="my-2 border-t border-border/50"></div>
            
            <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
              Queues
            </div>
            <Link
              href="/admin/moderation"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Moderation
            </Link>
            <Link
              href="/admin/members"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Membership
            </Link>
            <Link
              href="/admin/curation"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Data Quality
            </Link>

            <div className="my-2 border-t border-border/50"></div>
            
            <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
              Systems
            </div>
            <Link
              href="/admin/treasury"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Treasury Reports
            </Link>
            <Link
              href="/admin/calendar"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Calendar & Events
            </Link>
          </div>
        </nav>
      </aside>
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <div className="p-4 sm:px-6 sm:py-4">
          {children}
        </div>
      </main>

      {/* Agent Assistant FAB */}
      <button
        aria-label="Open Support Agent"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 shadow-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all hover:scale-105"
        title="Support Agent"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </button>
    </div>
  );
}
