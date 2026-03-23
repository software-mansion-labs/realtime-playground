'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import SettingsModal from './settings'

const links = [
  { href: '/playground', label: 'Playground' },
  { href: '/test', label: 'Test Runner' },
]

export function Navbar() {
  return (
    <nav className="flex h-16 items-center justify-between">
      <div className="mb-4 shrink-0 text-2xl font-bold">Supabase Realtime Interactive</div>
      <div className="flex items-center gap-4">
        <SettingsModal />
        <NavLinks />
      </div>
    </nav>
  )
}

function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="mb-4 flex gap-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            buttonVariants({
              variant: 'link',
              className: href === pathname ? 'text-primary' : 'text-foreground',
            }),
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
