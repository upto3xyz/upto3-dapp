'use client'

import * as React from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavItem } from '@/types/nav'

interface MobileNavProps {
  items?: NavItem[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden'
        >
          <Icons.menu className='h-6 w-6'/>
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='pr-0'>
        <MobileLink
          href='/'
          className='flex items-center'
          onOpenChange={setOpen}
        >
          <Icons.logo className='mr-2 h-4 w-auto'/>
          {/*<span className='font-bold'>{siteConfig.name}</span>*/}
        </MobileLink>
        <div className='flex flex-col space-y-3 mt-8'>
          {items?.map(
            (item) =>
              item.href && (
                <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}
                            className={cn(item.disabled && 'cursor-not-allowed opacity-80')}>
                  {item.title}
                  {item.disabled && <span className='rounded-md px-1 py-0.5 bg-black text-xs text-white ml-1'>Coming soon</span>}
                </MobileLink>
              )
          )}
        </div>

        <nav className='flex items-center gap-4 justify-center fixed bottom-0 pb-4'>
          <a
            target='_blank'
            aria-label='upto3 twitter'
            data-state='closed'
            href={siteConfig.links.twitter}
          >
            <Icons.twitter strokeWidth={1} className='h-5 w-5 mr-2 transition hover:text-zinc-400'/>
          </a>
          <a
            target='_blank'
            aria-label='upto3 discord'
            data-state='closed'
            href={siteConfig.links.discord}
          >
            <Icons.discord
              className='h-[1.4rem] w-[1.4rem] mr-2 transition hover:fill-[#a1a1aa]'
            />
          </a>
          <a
            target='_blank'
            aria-label='upto3 home'
            data-state='closed'
            href={siteConfig.links.home}
          >
            <Icons.home strokeWidth={1} className='h-5 w-5 transition hover:text-zinc-400'
            />
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}