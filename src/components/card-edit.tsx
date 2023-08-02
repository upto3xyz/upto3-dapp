'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PostEntity } from '@/types/post'
import { Separator } from '@/components/ui/separator'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { addYears, format } from 'date-fns'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import { Skeleton } from '@/components/ui/skeleton'
import { TimePicker } from '@/components/ui/date-time-picker/time-picker'
// @ts-ignore
import { getLocalTimeZone, parseAbsolute, ZonedDateTime } from '@internationalized/date'
import { Checkbox } from '@/components/ui/checkbox'
import { updateEventData } from '@/app/timeline/actions'
import { Icons } from '@/components/icons'
import { categories } from '@/contants/category'
import { useToast } from '@/components/ui/use-toast'
import { TagsInput } from 'react-tag-input-component'

//define the schema for the post data
const formSchema = z.object({
  title: z.string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(40),
  desc: z.string().min(10).max(300),
  tags: z.array(z.string().min(2).max(15)).min(0),
  categories: z.string().min(1, { message: 'Please select a category' }),
  date: z.date({
    required_error: 'A date of event is required.',
  }),
  time: z.date({
    required_error: 'A time of event is required.',
  }),
  allDay: z.boolean().default(false).optional(),
})

function CardEdit({ post, show, setShow }: { post: PostEntity, show: boolean, setShow: (val: boolean) => void }) {

  const [categoryOpen, setCategoryOpen] = useState(false)
  const [isPending, setPending] = useState(false)

  const { toast } = useToast()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      desc: post.summary,
      tags: post.tags,
      categories: post.category,
      date: new Date(post.utcTime),
      time: new Date(post.utcTime),
      allDay: post.allDay,
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true)
    await updateEventData(post.id, values)
      .then(() => {
        setShow(false)
        const { id, dismiss } = toast({
          description: '✅ Your event has been successfully modified.'
        })

        setTimeout(() => {
          dismiss()
        }, 3000)
      })
      .finally(() => setPending(false))
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className='min-w-full  md:min-w-[680px] lg:min-w-[960px] max-h-full overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Edit your event information
          </DialogDescription>
          <Separator/>
        </DialogHeader>
        <div className='flex flex-col md:flex-row '>
          <div className='md:basis-7/12 grid gap-4 py-4 md:pr-4 '>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField name='title' control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder='organiztion' {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField name='desc' control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='dscription' {...field} className='min-h-[160px]'/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField name='tags' control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagsInput value={field.value}
                                 onChange={field.onChange}
                                 name='tags'
                                 classNames={{ input: 'text-sm', tag: 'text-sm' }}
                                 placeHolder='enter tag'/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
                <FormField name='categories' control={form.control} render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Category</FormLabel>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? categories.find((cate) => cate.value === field.value)?.label : 'Select a category'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[200px] p-0'>
                        <Command>
                          <CommandInput placeholder='Search category...'/>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((cate) => (
                              <CommandItem
                                value={cate.value}
                                key={cate.value}
                                onSelect={(value) => {
                                  form.setValue('categories', value)
                                  setCategoryOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    cate.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {cate.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}/>
                <FormField name='date' control={form.control} render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (format(field.value, 'PP')) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50'/>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > addYears(new Date(), 1) || date < new Date('2008-01-01')
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage/>
                  </FormItem>
                )}/>

                <div className='space-y-2'>
                  <FormField name='allDay' control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <div className='flex flex-row items-start space-x-3 space-y-0'>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                        </FormControl>
                        <FormLabel className='font-normal'>
                          All day
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}/>

                  <FormField name='time' control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TimePicker label='Select a time'
                                    hourCycle={24}
                                    isDisabled={form.getValues('allDay')?.valueOf()}
                                    value={!!field.value ? parseAbsolute(field.value.toISOString(), getLocalTimeZone()) : null}
                                    onChange={(date) => {
                                      if (date instanceof ZonedDateTime) {
                                        field.onChange((date as ZonedDateTime).toDate())
                                      }
                                    }}/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}/>
                </div>
                <DialogFooter>
                  <Button type='submit' disabled={isPending}>
                    {isPending && <Icons.spinner className='mr-2 h-4 w-4 animate-spin'/>}
                    <span>Save changes</span>
                  </Button>
                </DialogFooter>

              </form>
            </Form>
          </div>
          <Separator orientation='vertical' className='hidden md:inline'/>
          <div className='md:basis-5/12 md:pl-4 py-4 w-full overflow-hidden'>
            <span className='text-sm font-medium'>Tweet</span>

            <TwitterTweetEmbed placeholder={(<>
              <div className='border border-gray-200 rounded-md flex items-center space-x-4 mt-4'>
                <Skeleton className='h-12 w-12 rounded-full'/>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-[200px]'/>
                  <Skeleton className='h-4 w-[150px]'/>
                </div>
              </div>
            </>)} tweetId={post.tweetId}
            />
          </div>
        </div>

        {/*<DialogFooter>*/}
        {/*  <Button type="submit">Save changes</Button>*/}
        {/*</DialogFooter>*/}
      </DialogContent>
    </Dialog>
  )
}

export default CardEdit