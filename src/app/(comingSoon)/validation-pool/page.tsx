import Image from 'next/image'
import ComingSoon from '@/components/coming-soon'

export default function Discover() {
  return (
    <div className='flex'>
      <ComingSoon
        title='Validation pool'
        desc='Participate in event validation for unbiased data and rewards'
      >
        <Image
          src='/validation.png'
          width={296}
          height={0}
          className='min-h-[200px] mx-auto'
          alt='validation'
        />
      </ComingSoon>
    </div>
  )
}
