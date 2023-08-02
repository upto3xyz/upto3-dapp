import React, { Suspense } from 'react'
import { ReactNodeType } from '@/types/children'
import { Tabs } from '@/components/ui/tabs'
import Loading from './loading'
import { redirect } from 'next/navigation'

async function TimelineLayout({ children }: ReactNodeType) {
  try {
    return (
      <div className='container flex flex-col flex-wrap justify-center items-center mt-12'>
        <h1 className='font-heading text-2xl font-bold mb-4'>My Timeline</h1>
        <p className='mb-4 text-xs text-gray-500'>
          Tweets to which you have replied &apos;@upto3xyz save&apos; will be
          reorganized on a timeline for easier planning and management
        </p>
        <Tabs
          defaultValue='upcoming'
          className='flex flex-col mb-4 min-w-full items-center'
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Tabs>
      </div>
    )
  } catch (e) {
    redirect('/')
  }
}

export default TimelineLayout
