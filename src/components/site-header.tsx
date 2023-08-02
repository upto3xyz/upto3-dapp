'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MainNav } from '@/components/main-nav'
import { siteConfig } from '@/config/site'
import { useAppSelector } from '@/redux/hooks'
import { Icons } from '@/components/icons'
import { MobileNav } from '@/components/mobile-nav'
import BindTwitter from '@/components/bind-twitter'
import WalletButton from '@/components/wallet-button'

export function SiteHeader() {
  const pathname = usePathname()
  const authState = useAppSelector((state) => state.authReducer.authState)
  const userInfoState = useAppSelector((state) => state.userInfoReducer)
  const [showHeader, setShowHeader] = useState(false)
  const authStateRef = useRef(authState)
  const userInfoStateRef = useRef(userInfoState)

  useEffect(() => {
    authStateRef.current = authState
  }, [authState])

  useEffect(() => {
    userInfoStateRef.current = userInfoState
  }, [userInfoState])

  useEffect(() => {
    if (authState && !userInfoState.twitterHandle && pathname == '/timeline') {
      const timeout = setTimeout(() => {
        setShowHeader(() => {
          return (authStateRef.current && !userInfoStateRef.current?.twitterHandle && pathname == '/timeline')
        })
        clearTimeout(timeout);
      }, 5000)
    } else {
      setShowHeader(false)
    }
  }, [authState, pathname, userInfoState])

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      {showHeader && <BindTwitter />}
      <div className='flex h-16 items-center justify-between px-6'>
        <MainNav items={siteConfig.mainNav}/>
        <MobileNav items={siteConfig.mainNav}/>
        <div className='flex flex-1 items-center justify-end space-x-4'>
          <nav className='hidden lg:flex items-center space-x-1'>
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
          {authState &&
            <WalletButton twitterName={userInfoState.twitterName} twitterHandle={userInfoState.twitterHandle}
                          twitterPhoto={userInfoState.photoURL}/>}
        </div>
      </div>
    </header>
  )
}
