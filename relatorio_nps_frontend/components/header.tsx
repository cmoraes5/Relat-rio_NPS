import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="font-bold text-xl">
            Sistema NPS
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/feedback" className="text-sm font-medium transition-colors hover:text-primary">
              Novo Feedback
            </Link>
            <Link href="/relatorios" className="text-sm font-medium transition-colors hover:text-primary">
              Relatórios
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
