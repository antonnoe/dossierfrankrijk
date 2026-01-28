'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Inloggen...')

  useEffect(() => {
    const supabase = createClient()

    // Luister naar auth state change - dit vangt de sessie op
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session)
      
      if (event === 'SIGNED_IN' && session) {
        setStatus('Ingelogd! Doorsturen...')
        // Kleine delay om cookies te laten schrijven
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 500)
      }
    })

    // Cleanup
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}
