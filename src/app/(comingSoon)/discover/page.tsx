import Image from 'next/image'
import ComingSoon from '@/components/coming-soon'

export default function Discover() {
  return (
    <div className='flex'>
      <ComingSoon
        title='Discover'
        desc='Allow public access to information and make data freely available to all'
      >
        <Image
          src='/discover.png'
          width={296}
          height={0}
          className='min-h-[200px] mx-auto'
          alt='discover'
        />
      </ComingSoon>
    </div>
  )
}
