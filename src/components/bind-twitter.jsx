import { useRouter } from 'next/navigation'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'

export default function BindTwitter () {
  const router = useRouter()
  const handleClick = () => {
    router.push('/setting')
  }

  return (<div className='h-16 flex justify-center items-center bg-black text-white text-center text-sm font-bold'>
    <Icons.twitter size={18} className='cursor-pointer mr-2'/> Please bind your twitter account first
    <Button variant='outline' onClick={handleClick} className='ml-2 px-2 py-1 h-auto font-bold' style={{color: '#F4F101', borderWidth: '2px', borderColor: '#F4F101'}}>Connect</Button>
  </div>)
}