import React from 'react'
import createServerSupabaseClient from '@/lib/serverSupabaseClient'
import { SupabaseClient } from '@supabase/supabase-js'
import CardList from '@/components/card-list'
import { subDays } from 'date-fns'
import dayjs from 'dayjs'
import { redirect } from 'next/navigation'
// @ts-ignore
import { PostgrestError } from '@supabase/postgrest-js/dist/module/types'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const revalidate = 60

interface TimeLinePageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

async function findAllTweets(supabase: SupabaseClient, filterDate: Date) {
  //The data is only retrieved starting from 3 days ago by default.
  //'filterDate' is disabled
  const { data, error } = await supabase
    .from('mentioned_tweets')
    .select()
    .is('is_deleted', false)
    // .gte('utc_time', filterDate.toISOString())
    .order('utc_time', { ascending: true })

  if (error) {
    throw error
  }
  return data
}

async function TimelinePage({ searchParams }: TimeLinePageProps) {
  const { sort, name, date } = searchParams
  const filterDate =
    typeof date === 'string' && dayjs(date, 'YYYYMMDD').isValid()
      ? dayjs(date).toDate()
      : subDays(new Date(), 3)

  try {
    const supabase = createServerSupabaseClient()
    const data = await findAllTweets(supabase, filterDate)

    const currentTime = dayjs()
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .toDate()

    const upcomingCount = data.filter(dd => dd.utc_time && new Date(dd.utc_time) >= currentTime).length
    const pastCount = data.filter(dd => dd.utc_time && new Date(dd.utc_time) < currentTime).length
    const backlogCount=data.filter(dd => !dd.utc_time).length

    return (
      <>
        <TabsList className='grid grid-cols-3 min-w-fit w-1/3'>
          <TabsTrigger value='upcoming'>Upcoming({upcomingCount})</TabsTrigger>
          <TabsTrigger value='past'>Past({pastCount})</TabsTrigger>
          <TabsTrigger value='backlog'>Backlog({backlogCount})</TabsTrigger>
        </TabsList>
        <CardList data={data}/>
      </>
    )
  } catch (e) {
    redirect('/')
  }

  // return (
  //   <div>
  //     Oops, something went wrong. Try again later.
  //   </div>
  // )
}

export default TimelinePage
