interface ComingSoonProps {
  title?: string
  desc: string
  children: React.ReactNode
}

export default function ComingSoon({title, desc, children}: ComingSoonProps) {
  return (
    <div className='min-w-fit md:w-[22rem] pt-10 px-7 rounded-3xl bg-[#F5F6F9]'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold'>{title}</h2>
        <span className='rounded-md px-1 py-0.5 bg-gray-500 text-xs text-white font-bold ml-1 cursor-not-allowed'>
          Coming soon
        </span>
      </div>
      <p className='mt-3 mb-12 text-sm text-[#61636D]'>{desc}</p>
      {children}
    </div>
  )
}
