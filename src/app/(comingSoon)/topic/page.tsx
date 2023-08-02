import Image from 'next/image'
import ComingSoon from '@/components/coming-soon'

export default function Discover() {
  return (
    <div className='flex'>
      <ComingSoon
        title='Topic'
        desc='Free combination of content, organization of different hotspots, categories'
      >
        <Image
          src='/topic.png'
          width={296}
          height={0}
          className='min-h-[200px] mx-auto'
          alt='topic'
        />
      </ComingSoon>
    </div>
  )
}
