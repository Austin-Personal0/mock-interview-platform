import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {

  const authenticated = await isAuthenticated()

  if( authenticated ) redirect('/')
    
  return (
    <div className='auth-layout'>{children}</div>
  )
}

export default AuthLayout