import { Icons } from '@/components/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import { Separator } from '@/components/ui/separator'

export default function loading() {
  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex text-base font-normal text-zinc-800'>
          <Icons.wallet className='mr-4' size={20}/>
          Address
        </div>
        <Skeleton className='w-24 h-6' />
      </div>
      <div className='flex justify-between items-center mt-4'>
        <div className='flex text-base font-normal text-zinc-800'>
          <Icons.twitter className='mr-4' size={20} />
          Twitter account
        </div>
        <Button disabled className='justify-center px-4 py-2 h-auto'>
          Connect
        </Button>
      </div>
      <Separator className='my-4'></Separator>
      <div className='flex justify-between items-center'>
        <div className='flex'>
          <Icons.calendar_plus className='mr-4' size={20}/> Google calendar
        </div>
        <Switch disabled />
      </div>
    </>
  )
}
