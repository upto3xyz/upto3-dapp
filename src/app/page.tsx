'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/redux/hooks'
import { Icons } from '@/components/icons'
import { _linkWithPopup } from '@/lib/firebase/firebase.utils'

import Image from 'next/image'

export default function Home() {
  const { address } = useAccount()
  const router = useRouter()
  const { openConnectModal } = useConnectModal()
  const authState = useAppSelector((state) => state.authReducer.authState)

  const isProductEnv = process.env.NEXT_PUBLIC_ENV === 'production'

  useEffect(() => {
    if (authState) {
      router.push('/timeline')
    }
  }, [authState, router])

  // useEffect(() => {
  //   if (userInfoState.twitterHandle) {
  //     router.push('/timeline')
  //   }
  // }, [router, userInfoState])

  return (
    <>
      <div className='home container flex flex-col items-center py-8'>
        <div className='w-full gap-4 pb-8 md:pt-24'>
          <div className='text-center'>
            <h1 className='text-5xl font-extrabold leading-tight tracking-tighter md:text-6xl text-center'>
              UPTO3{' '}
              {!isProductEnv && <span className='text-red-500'>TEST</span>}
            </h1>
            <p className='text-base my-9'>
              Seamlessly manage your web3 timeline using @upto3xyz
            </p>
            {Boolean(authState) ? (
              <Button
                className='justify-center min-w-fit w-full md:w-96'
                disabled
              >
                <Icons.wallet className='w-5 h-5 mr-2' />
                {`${address?.slice(0, 4)}...${address?.slice(-4)}`}
              </Button>
            ) : (
              <Button
                disabled={Boolean(authState)}
                className='justify-center min-w-fit w-full md:w-96'
                onClick={openConnectModal}
              >
                <Icons.wallet className='w-5 h-5 mr-2' />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
        <div className='mt-52'>
          <Image
              src='/home_bottom.png'
              width={0}
              height={0}
              sizes='100vw'
              className='w-full h-auto'
              alt='upto3_holder'
            />
        </div>
        <div className='w-full flex flex-col gap-6 leading-relaxed my-24 md:my-72 md:w-2/3 '>
          <h3 className='text-2xl font-semibold tracking-tight mb-4 w-fit self-center md:text-4xl '>
            How does it work?
          </h3>
          <div className='rounded-lg bg-gradient-to-r from-gray-100 to-white p-6'>
            <h3 className='font-semibold text-zinc-900 text-2xl'>1. Follow</h3>
            <p className='text-zinc-500 mt-4'>
              Follow{' '}
              <a
                href='https://twitter.com/intent/user?screen_name=upto3xyz'
                target='_blank'
                className='text-zinc-800 font-semibold'
              >
                @upto3xyz{' '}
                <Icons.link className='inline-block w-4 h-4 text-zinc-800' />
              </a>{' '}
              on Twitter
            </p>
          </div>

          <div className='rounded-lg bg-gradient-to-r from-gray-100 to-white p-6'>
            <h3 className='font-semibold text-zinc-900 text-2xl'>2. Reply</h3>
            <p className='text-zinc-500 mt-4'>
              Reply to the tweet that piques your interest with{' '}
              <span className='text-zinc-800 font-semibold border border-zinc-200 border-solid rounded-md px-2 py-1'>
                @upto3xyz save
              </span>
            </p>
          </div>

          <div className='rounded-lg bg-gradient-to-r from-gray-100 to-white p-6'>
            <h3 className='font-semibold text-zinc-900 text-2xl'>3. With AI</h3>
            <p className='text-zinc-500 mt-4'>
              Visit{' '}
              <a
                href='https://app.upto3.xyz'
                className='font-semibold text-zinc-800'
              >
                upto3.xyz{' '}
                <Icons.link className='inline-block w-4 h-4 text-zinc-800' />
              </a>{' '}
              to view the tweets processed by Upto3, utilizing powerful ChatGPT
              technology for organized data.
            </p>
          </div>
        </div>
      </div>

      <div className='content-center items-center flex flex-none flex-row flex-nowrap h-min justify-center max-w-full overflow-visible relative w-full py-7'>
        <div className='flex-none h-auto relative whitespace-pre w-auto flex flex-col justify-start shrink-0'>
          <p className='font-normal text-sm text-zinc-400'>© UpTo3 Inc. 2023</p>
        </div>
        <div className='items-start flex flex-none flex-row flex-nowrap gap-[15px] h-min justify-start overflow-hidden relative w-min p-0'>
          {/* empty*/}
        </div>
      </div>
    </>
  )
}
