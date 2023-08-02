'use server'

import createServerSupabaseClient from '@/lib/serverSupabaseClient'
import { revalidatePath } from 'next/cache'
import { format } from 'date-fns'

export const updateEventData = async (id: string, { title, desc, tags, categories, date, time, allDay }: {
  title: string,
  desc: string,
  tags: string[],
  categories: string,
  date: Date,
  time: Date,
  allDay?: boolean | undefined
}) => {

  const supabase = createServerSupabaseClient()

  let newDate: Date

  if (allDay) {
    newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    newDate.setHours(0, 0, 0)
  } else {
    newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    newDate.setHours(time.getHours(), time.getMinutes())
  }

  await supabase.from('mentioned_tweets').update({
    title: title,
    summary: desc,
    tags: tags,
    catalog: categories,
    utc_time: newDate,
    date: format(newDate, 'PPppp'),
    is_all_day: !!allDay,
  }).eq('id', id)

  revalidatePath('/timeline')
}

export const deleteEventData = async (id: string) => {
  const supabase = createServerSupabaseClient()

  await supabase
    .from('mentioned_tweets')
    .update({ is_deleted: true })
    .eq('id', id)

  revalidatePath('/timeline')
}