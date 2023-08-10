import React, { Suspense } from 'react'
import { ReactNodeType } from '@/types/children'
import Loading from './loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function SettingLayout({ children }: ReactNodeType) {
  return (<div className='container flex flex-col flex-wrap justify-center items-center mt-12'>
    <h1 className='text-2xl font-bold mb-12'>Settings</h1>
    <Card className='min-w-fit md:w-[46rem]'>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Loading/>}>{children}</Suspense>
      </CardContent>
    </Card>
  </div>)
}

export default SettingLayout
