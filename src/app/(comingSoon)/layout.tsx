import React from 'react'
import { ReactNodeType } from '@/types/children'

async function ComingSoonLayout({ children }: ReactNodeType) {
  return (
    <div className='container flex flex-col flex-wrap justify-center items-center mt-24'>
      <div>{children}</div>
    </div>
  )
}

export default ComingSoonLayout
