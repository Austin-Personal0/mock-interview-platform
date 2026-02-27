import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const RootLayout = async ( { children} : { children : ReactNode }) => {

  const authenticated = await isAuthenticated()

  if( !authenticated ) redirect('/sign-up')

  return (
    <div className='root-layout'>
      <nav>
        <Link href='/' className='flex items-center gap-1 '>
          <Image src='/logo.svg' alt='Logo' width={38} height={32}/>
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout