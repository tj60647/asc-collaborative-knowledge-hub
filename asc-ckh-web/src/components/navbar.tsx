import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/auth/login/actions"
import { Library, UserCircle, LogOut } from "lucide-react"

export async function Navbar() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Library className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              ASC Knowledge Hub
            </span>
          </Link>
          <div className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/events" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Events
          </Link>
          <Link href="/directory" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Directory
          </Link>
          <Link href="/directory/organizations" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Organizations
          </Link>
          <Link href="/glossary" className="text-zinc-600 hover:text-zinc-900 transition-colors">
            Glossary
          </Link>
        </div>
        </div>

        {/* Mobile Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <Library className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block">ASC</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav aria-label="Main navigation" className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <form action={signOut}>
                  <Button variant="ghost" size="sm" type="submit" className="gap-2 text-muted-foreground hover:text-foreground">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
