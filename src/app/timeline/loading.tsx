import React from 'react'
import { TabsContent } from '@/components/ui/tabs'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardItem from '@/components/card-item'
import { Skeleton } from '@/components/ui/skeleton'

function Loading() {
  return (
    <Tabs defaultValue='upcoming' className='flex flex-col mb-4 min-w-full items-center'>
      <TabsList className='grid grid-cols-3 min-w-fit w-1/3'>
        <TabsTrigger value='upcoming'>Upcoming(0)</TabsTrigger>
        <TabsTrigger value='past'>Past(0)</TabsTrigger>
        <TabsTrigger value='backlog'>Backlog(0)</TabsTrigger>
      </TabsList>
      <TabsContent value='upcoming' className='w-full mt-12 md:w-[46rem]'>
        <div className='flex flex-col items-center'>
          <div className='flex w-full justify-between mb-4 items-center'>
            <Skeleton className='mr-2 w-10 h-6' />
          </div>
          <ol className='relative border-l border-gray-200 dark:border-gray-700 w-full'>
            <li className='mb-10 ml-4'>
              <div className='absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700'></div>
              <Skeleton className='w-20 h-4' />
              <CardItem.skeleton />
            </li>
            <li className='mb-10 ml-4'>
              <div className='absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700'></div>
              <Skeleton className='w-20 h-4' />
              <CardItem.skeleton />
            </li>
          </ol>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default Loading
