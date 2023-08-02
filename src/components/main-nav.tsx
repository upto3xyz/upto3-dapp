import Link from 'next/link'
import { NavItem } from '@/types/nav'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Separator } from '@/components/ui/separator'

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className='hidden lg:flex gap-6 md:gap-10'>
      <div className='flex items-center space-x-2'>
        <Icons.logo className='w-20' />
      </div>
      {items?.length ? (
        <nav className='flex gap-6'>
          {items?.map(
            (item, index) =>
              item.href && (
                <div key={index} className='flex gap-6'>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center text-sm font-medium text-muted-foreground',
                      item.disabled && 'cursor-not-allowed opacity-80', index > 0 && 'text-[#999]'
                    )}
                  >
                    {item.title}
                  </Link>
                  {index === 0 && <Separator orientation='vertical' />}
                </div>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
