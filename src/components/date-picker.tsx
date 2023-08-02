'use client'

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ActiveModifiers } from 'react-day-picker'
import { useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'

interface DatePickerProps {
  onChange: (date: Date | undefined) => void;
}

function DatePicker({onChange}: DatePickerProps) {

  const searchParams = useSearchParams()
  const date = searchParams?.get('date')


  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date ? dayjs(date).toDate() : undefined)
  const [openDialog, setOpenDialog] = useState(false)

  const handleDateChange = (day: Date | undefined, selectedDay: Date, activeModifiers: ActiveModifiers, e: React.MouseEvent) => {
    e.preventDefault()

    setSelectedDate(selectedDay)
    setOpenDialog(false)
    onChange(day)
  }

  return (
    <Popover open={openDialog} onOpenChange={setOpenDialog}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[180px] justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}>
          <CalendarIcon className='mr-2 h-4 w-4'/>
          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={selectedDate} onSelect={handleDateChange} initialFocus/>
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker