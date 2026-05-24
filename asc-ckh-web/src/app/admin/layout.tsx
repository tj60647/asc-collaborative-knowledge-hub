import Link from 'next/link';

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
              href="/admin/treasury"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              Treasury Reports
            </Link>
            <Link
              href="/admin/members"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              Member Management
            </Link>
            <Link
              href="/admin/migration"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              Legacy Migration
            </Link>
          </div>
        </nav>
      </aside>
      <main className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="w-full flex-1">
            <h1 className="text-xl font-semibold">Overview</h1>
          </div>
        </header>
        <div className="p-4 sm:px-6 sm:py-0">
          {children}
        </div>
      </main>
    </div>
  );
}
