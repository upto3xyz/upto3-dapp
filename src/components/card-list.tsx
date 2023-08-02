'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { TabsContent } from '@/components/ui/tabs'
import DatePicker from '@/components/date-picker'
import CardItem from '@/components/card-item'
import { Icons } from '@/components/icons'
import { format } from 'date-fns'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import { Separator } from '@/components/ui/separator'

type CardListProps = {
  data: any[]
}

function formatDate(date: Date, allDay: boolean) {
  const time = new Date(date)
  const formatTime = format(time, 'HH:mm')

  const formatDateHtml = (
    <span
      className='text-sm font-semibold leading-none text-zinc-800 dark:text-gray-400'>{format(time, 'yyyy-MM-dd')}</span>
  )

  return allDay ? (
    <>
      {formatDateHtml}
      <span className='font-semibold text-sm text-zinc-800 rounded-md px-1 py-0.5 bg-blue-100'>All Day</span>
    </>
  ) : (
    <>
      {formatDateHtml}
      <span className='font-semibold text-sm text-zinc-800 rounded-md px-1 py-0.5 bg-amber-100'>{formatTime}</span>
    </>)
}

function NoContent() {
  return (
    <div
      className='min-h-80 flex w-full flex-col items-center justify-center rounded-md p-7 lg:p-20 border-subtle border border-dashed'>
      <div className='bg-gray-200 flex h-[72px] w-[72px] items-center justify-center rounded-full'>
        <Icons.calendar size={24} className='text-default inline-block h-10 w-10 stroke-[1.3px]'/>
      </div>
      <div className='flex max-w-[420px] flex-col items-center'>
        <h2 className='font-semibold text-emphasis mt-6 text-center text-xl'>No upcoming events</h2>
        <div className='text-default mt-3 mb-8 text-start text-sm font-normal leading-6'>
          You have no upcoming events. Just follow the steps below and your event will be displayed here.<br/>
          <br/>
          1. Follow <span className='font-semibold'>@upto3xyz</span><br/>
          2. Leave a message <span className='font-semibold'>@upto3xyz save</span> on the tweet of the event
        </div>
      </div>
    </div>
  )
}

function NoPastContent() {
  return (
    <div
      className='min-h-80 flex w-full flex-col items-center justify-center rounded-md p-7 lg:p-20 border-subtle border border-dashed'>
      <div className='bg-gray-200 flex h-[72px] w-[72px] items-center justify-center rounded-full'>
        <Icons.calendar size={24} className='text-default inline-block h-10 w-10 stroke-[1.3px]'/>
      </div>
      <div className='flex max-w-[420px] flex-col items-center'>
        <h2 className='font-semibold text-emphasis mt-6 text-center text-xl'>No past events</h2>
        <div className='text-default mt-3 mb-8 text-start text-sm font-normal leading-6'>
          You have no past events.
        </div>
      </div>
    </div>
  )
}

function NoContentForBacklog() {
  return (
    <div
      className='min-h-80 flex w-full flex-col items-center justify-center rounded-md p-7 lg:p-20 border-subtle border border-dashed'>
      <div className='bg-gray-200 flex h-[72px] w-[72px] items-center justify-center rounded-full'>
        <Icons.calendar size={24} className='text-default inline-block h-10 w-10 stroke-[1.3px]'/>
      </div>
      <div className='flex max-w-[420px] flex-col items-center'>
        <h2 className='font-semibold text-emphasis mt-6 text-center text-xl'>No backlogged events</h2>
        <div className='text-default mt-3 mb-8 text-start text-sm font-normal leading-6'>
          You have no backlogged events yet. When your content is not recognized with a specific date, it will be
          displayed here.
        </div>
      </div>
    </div>
  )
}


function CardList({ data }: CardListProps) {

  const currentTime = useMemo(() =>
      dayjs()
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .toDate(),
    [])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [posts, setPosts] = useState<{ [p: string]: any }[]>(data)

  const [events, setEvents] = useState<{
    [p: string]: any
  }[]>(data.filter(dd => dd.utc_time && new Date(dd.utc_time) >= currentTime))
  const [pastEvents, setPastEvents] = useState<{
    [p: string]: any
  }[]>(data.filter(dd => dd.utc_time && new Date(dd.utc_time) < currentTime).reverse())
  const [nonEvents, setNonEvents] = useState<{ [p: string]: any }[]>(data.filter(dd => !dd.utc_time))

  const [isPending, startTransition] = React.useTransition()


  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  function handleDateChange(date: Date | undefined) {
    // setSelectedDate(date)
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          date: date
            ? `${dayjs(date).format('YYYYMMDD')}`
            : null,
        })}`
      )
    })

  }


  useEffect(() => {
    setPosts(data)
  }, [data])

  useEffect(() => {
    setEvents(posts.filter(post => post.utc_time && new Date(post.utc_time) >= currentTime))
    setPastEvents(posts.filter(post => post.utc_time && new Date(post.utc_time) < currentTime).reverse())
    setNonEvents(posts.filter(post => !post.utc_time))
  }, [currentTime, posts])


  return (
    <>
      <TabsContent value='upcoming' className='w-full mt-12 md:w-[46rem]'>
        <div className='flex flex-col items-center'>
          <div className='w-full justify-between mb-4 items-center hidden'>
            <DatePicker onChange={handleDateChange}/>
            <span className='mr-2 font-normal text-black invisible'>June 1, 2023</span>
          </div>
          {events.length > 0 ? (
            <ol className='relative border-l border-gray-200 dark:border-gray-700 w-full'>
              {events.map((tweets, index) => {

                return (
                  <li className='mb-10 ml-4' key={index}>
                    <div
                      className='absolute w-3 h-3 bg-gray-800 rounded-full mt-1.5 -left-1.5 border-[3px] border-gray-300 dark:border-gray-900 dark:bg-gray-700'></div>
                    <div className='flex items-center gap-1'>
                      {formatDate(tweets.utc_time, tweets.is_all_day)}
                    </div>

                    <CardItem post={{
                      id: tweets.id,
                      title: tweets.title,
                      summary: tweets.summary,
                      utcTime: tweets.utc_time,
                      tags: tweets.tags,
                      category:tweets.catalog,
                      allDay: tweets.is_all_day,
                      tweetId: tweets.replied_tweet_id,
                      tweetURL: `${tweets.in_reply_to_user_name}/status/${tweets.replied_tweet_id}`,
                      address: tweets.address
                    }}/>
                  </li>
                )
              })}
            </ol>
          ) : (
            <NoContent/>
          )
          }
        </div>
      </TabsContent>
      <TabsContent value='past' className='w-full mt-12 md:w-[46rem]'>
        <div className='flex flex-col items-center'>
          {pastEvents.length > 0 ? (
            <ol className='relative border-l border-gray-200 dark:border-gray-700 w-full'>
              {pastEvents.map((tweets, index) => {

                return (
                  <li className='mb-10 ml-4' key={index}>
                    <div
                      className='absolute w-3 h-3 bg-gray-800 rounded-full mt-1.5 -left-1.5 border-[3px] border-gray-300 dark:border-gray-900 dark:bg-gray-700'></div>
                    <div className='flex items-center gap-1'>
                      {formatDate(tweets.utc_time, tweets.is_all_day)}
                    </div>

                    <CardItem post={{
                      id: tweets.id,
                      title: tweets.title,
                      summary: tweets.summary,
                      utcTime: tweets.utc_time,
                      tags: tweets.tags,
                      category:tweets.catalog,
                      allDay: tweets.is_all_day,
                      tweetId: tweets.replied_tweet_id,
                      tweetURL: `${tweets.in_reply_to_user_name}/status/${tweets.replied_tweet_id}`,
                      address: tweets.address
                    }}/>
                  </li>
                )
              })}
            </ol>
          ) : (
            <NoPastContent/>
          )
          }
        </div>
      </TabsContent>
      <TabsContent value='backlog' className='w-full mt-12 md:w-[46rem]'>
        {nonEvents.length > 0 ? (
          nonEvents.map((tweets, index) => (
            <CardItem
              key={tweets.id}
              post={{
                id: tweets.id,
                title: tweets.title,
                summary: tweets.summary,
                utcTime: tweets.utc_time,
                tags: tweets.tags,
                category:tweets.catalog,
                allDay: tweets.is_all_day,
                tweetId: tweets.replied_tweet_id,
                tweetURL: `${tweets.in_reply_to_user_name}/status/${tweets.replied_tweet_id}`,
                address: tweets.address
              }}
            />
          ))
        ) : (
          <NoContentForBacklog/>
        )}
      </TabsContent>
    </>
  )
}

export default CardList