'use client'

import React, { useState, useTransition } from 'react'
import { PostEntity } from '@/types/post'
import { Icons } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import CardEdit from '@/components/card-edit'
import Link from 'next/link'
import { deleteEventData } from '@/app/timeline/actions'
import { toast } from '@/components/ui/use-toast'

interface CardOperationsProps {
  post: PostEntity;
}

function CardOperations({ post }: CardOperationsProps) {

  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false)

  let [isPending, startTransition] = useTransition()
  const handleShowEditDialog = (val: boolean) => {
    setShowEditDialog(val)
  }

  function generateGoogleCalendarURI(post: PostEntity) {
    const time = new Date(post.utcTime)
    const startDate = time.toISOString().replaceAll('-', '').replaceAll(':', '')
    time.setTime(time.getTime() + 60 * 60 * 1000)
    let endDate = time.toISOString().replaceAll('-', '').replaceAll(':', '')
    if (post.allDay) {
      endDate = startDate
    }

    return `https://calendar.google.com/calendar/r/eventedit?dates=${startDate}/${endDate}&text=${post.title}&details=${post.summary}&location=${post.address}`
  }

  return (
    <>
      {post.utcTime && <Link
        href={generateGoogleCalendarURI(post)}
        target='_blank'
        rel='noreferrer'
      >
        <Icons.calendar_add size={18} className='cursor-pointer'/>
      </Link>}


      <Link
        href={post.tweetURL ? `https://twitter.com/${post.tweetURL}` : ''}
        target='_blank'
        rel='noreferrer'
      >
        <Icons.twitter size={18} className='cursor-pointer'/>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Icons.more size={18} className='cursor-pointer'/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-32'>
          <DropdownMenuItem className='cursor-pointer' onSelect={() => setShowEditDialog(true)}>
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem className='cursor-pointer text-destructive focus:text-destructive'
                            onSelect={() => setShowDeleteAlert(true)}>
            <span>Delete</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
      {showEditDialog && <CardEdit post={post} show={showEditDialog} setShow={handleShowEditDialog}/>}
      {showDeleteAlert && <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                startTransition(() => {
                  deleteEventData(post.id)
                    .then(() => {
                      setShowDeleteAlert(false)
                      const { id, dismiss } = toast({
                        description: '✅ Your event has been successfully modified.'
                      })

                      setTimeout(() => {
                        dismiss()
                      }, 3000)
                    })
                    .finally(() => setIsDeleteLoading(false))
                })
              }}
              className='bg-red-600 focus:ring-red-600'>
              {isDeleteLoading ? (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin'/>
              ) : (
                <Icons.trash className='mr-2 h-4 w-4'/>
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>}
    </>
  )
}

export default CardOperations