import { Button } from '@/components/ui/button'
import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/client'

const RootLayout = async ( { children} : { children : ReactNode }) => {

  const authenticated = await isAuthenticated()

  const logoutOut = async () => {
    try {
      await signOut(auth).then( () => {
        
      })
    } catch (error) {
      
    }
  }

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