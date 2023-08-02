import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CardOperations from '@/components/card-operations'
import { PostEntity } from '@/types/post'
import { Skeleton } from '@/components/ui/skeleton'
import { categories } from '@/contants/category'

const CardItem = ({ post }: { post: PostEntity }) => {

  return (
    <Card className='w-full mt-2'>
      <CardHeader className='flex-row justify-between items-center space-y-0 py-4'>
        <CardTitle className='text-sm'>{post.title}</CardTitle>
        <div className='flex space-x-2.5'>
          <CardOperations post={post}/>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm whitespace-pre-line'>{post.summary}</p>
      </CardContent>
      <CardFooter>
        {post.tags?.map((tag) => (
          <span key={tag} className='bg-green-100 text-green-600 rounded-md px-2 py-1 text-xs mr-2 mb-2'>
            {categories.find((cate) => cate.value === tag)?.label || tag.charAt(0).toUpperCase() + tag.slice(1)}
          </span>
        ))}
      </CardFooter>
    </Card>
  )
}

CardItem.skeleton = () => (
  <Card className='w-full mt-2'>
    <CardHeader className='flex-row justify-between items-center space-y-0 py-4'>
      <Skeleton className='w-36 h-4'/>
      <div className='flex space-x-2.5'>
        <Skeleton className='w-16 h-4'/>
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className='w-3/4 h-4'/>
    </CardContent>
    <CardFooter>
      <Skeleton className='w-48 h-4'/>
    </CardFooter>
  </Card>
)

export default CardItem